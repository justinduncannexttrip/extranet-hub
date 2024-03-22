<script setup lang="ts">
  import { ImageTypes } from "./consts/mediaManager";
  import { MediaManagerApi } from "./api/MediaManager";
  import { onMounted } from 'vue'
  import { useMediaManagerStore } from '@core/stores/mediaManager';
  import { useDisplayComponent } from '@core/stores/composables/dataDisplay';
  import { useResponseParser } from '@core/stores/composables/responseParser';
  import { useFileUploadStore } from '@core/stores/fileUpload';
  import { useRoute, useRouter } from "vue-router";

  const route = useRoute();
  const router = useRouter();

  const { parseResponse, parseCatch } = useResponseParser();
  const {  setUploadDialog, resetFileUploadStore } = useFileUploadStore();
  const { setData, displayData } = useDisplayComponent();


  interface IRooms {
    roomName: string
    roomUniqueId: number
    rank: number
    roomImage: string
  }

  interface IRules {
    int: [(v: any) => boolean | string]
    required: [(v: any) => boolean | string]
  }

  interface Props {
    currentItem?: {
      hotelRoomImageId: number
      hotelImageId: number
      url: string
      newUrl: string
      newDescription: string
      backupImage: string
      userFirstName: string
      rank: number
    }
    rooms?: IRooms[]
    panels?: any[]
    tabs?: ImageTypes
    valid?: boolean
    editValid?: boolean
    rules?: IRules
    hotelSelected?: {
      hotelName: string
      hotelDomain: string
    } | null
    formHotelUniqueId?: string
    search?: null | string
    hotelString?: string
    multiSelect?: boolean
    editDialog?: boolean
    newUrl?: string
    newDescription?: string
    minImgWidth?: number
    minImgHeight?: number
    selectedIds?: any[]
    deleteDialog?: boolean
    mediaManagerApi?: typeof MediaManagerApi
    excludeInactive?: 1 | 0
    showInactiveRooms?: number
    backupImage?: string
    roomIndex?: null | number
    snackbar?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    currentItem: {},
    rooms: [],
    panels: [],
    tabs: ImageTypes.HOTEL,
    valid: false,
    editValid: false,
    rules: {
      int: [(v: any) => !!v || 'Hotel ID is required'],
      required: [(v) => !!v || 'This Field is Required'],
    },
    hotelSelected: {},
    formHotelUniqueId: '',
    search: null,
    hotelString: '',
    multiSelect: false,
    editDialog: false,
    newUrl: '',
    newDescription: '',
    minImgWidth: 800,
    minImgHeight: 480,
    selectedIds: [],
    deleteDialog: false,
    mediaManagerApi: new MediaManagerApi(),
    excludeInactive: 0,
    showInactiveRooms: 0,
    backupImage: '/hotelImageNotFound_725_435.jpg',
    roomIndex: null,
    snackbar: false,
  })

  const handleError = (image: any) => {
    image.originalUrl = image.url
    image.url = backupImage
  }

  const shouldFlagImage = (img: { width: number, height: number }, room: any = false) => {
    // Only flag ADR rooms
    if (room?.isUpgradedRoom === 'NO' && room?.isUpgradedRoomPackage === 'NO') {
      return false
    }
    let w = img.width
    let h = img.height

    if (h && w) {
      if (w > h && w < minImgWidth) {
        return true
      } else if (h > w && h < minImgHeight) {
        return true
      }
    }
    return false
  };

  const filterHotelItems = (hotelName: string, hotelUniqueId: string|number, obj: any) => {
    const { hotelExtranetStatus } = obj.value
    if (hotelExtranetStatus !== 'active' && excludeInactive === '1') {
      return -1
    }
  }

  const fetchHotelById = async () => {
    if (!hotelUniqueId || Number.isNaN(hotelUniqueId)) {
      setData({
        displayComponent: 'snackbar',
        color: 'red-lighten-2',
        content:
          'Hotel Unique ID is not set or not a number and you are trying to fetch hotels by ID',
      })
      showSnackbar = true
    }
    await fetchHotelItems({
      hotelUniqueId:
        formHotelUniqueId ||
        hotelSelected?.hotelUniqueId ||
        hotelUniqueId,
    }).then(() => {
      if (hotelItems?.length === 1) {
        setSelectedHotel(hotelItems[0])
        hotelSelected = hotelItems[0]
        fetchHotelImages()
      }
    })
  }

  const handleSubmit = (event: any) => {
    event?.preventDefault()
    event?.stopPropagation()
    if (formHotelUniqueId) {
      setHotelUniqueId(formHotelUniqueId)
      fetchHotelById()
    } else if (selectedHotel?.hotelName && !hotelSelected) {
      fetchHotelItems({ ...hotelSelected })
    }
  }

  const handleEdit = (image: any) => {
    currentItem = image
    currentItem.newUrl =
      currentItem.originalUrl || currentItem.url
    currentItem.newDescription = currentItem.description
    editDialog = true
  }

  const handleUpload = (roomUniqueId = null, idx = null, heroType = null) => {
    setImageType(heroType || tabs)
    if (roomUniqueId) {
      setRoomUniqueId(roomUniqueId)
      setRoomIndex(idx)
    }

    setUploadDialog(true)
  }

  const handleCancelDelete = () => {
    if (!multiSelect) {
      selectedIds = []
    }
    deleteDialog = false
  }

  const handleConfirmDelete = () => {
    deleteSelected(selectedIds)
      .then((response: any) => {
        parseResponse(response)
      })
      .catch((err: any) => parseCatch(err))
      .finally(() => {
        deleteDialog = false
        editDialog = false
        selectedIds = []
        handleFetchImages()
      })
  };

  const handleDelete = (event: any, image = null, roomIndex = null) => {
    if (multiSelect && selectedIds.length) {
      return (deleteDialog = true)
    }
    if (selectedIds && !multiSelect) {
      selectedIds = []
    }
    switch (tabs) {
      case ImageTypes.HOTEL:
      case ImageTypes.PARTNER:
      case ImageTypes.HERO_IMAGE:
        if (image) {
          selectedIds.concat(image.hotelImageId)
        } else if (
          hotelImages?.length &&
          !multiSelect &&
          !editDialog
        ) {
          hotelImages?.forEach((image: any) => {
            const id = image.hotelRoomImageId || image.hotelImageId
            selectedIds.concat(id)
          })
          // handles the edit dialog delete button
        } else if (currentItem?.hotelImageId) {
          selectedIds.concat(currentItem.hotelImageId)
        }
        break
      case ImageTypes.ROOM:
        // Single Room Image delete
        if (currentItem?.hotelRoomImageId && !selectedIds) {
          selectedIds.concat(currentItem?.hotelRoomImageId)

          // Delete All
        } else if (roomIndex) {
          rooms[roomIndex]?.roomImages?.forEach((image: any) => {
            selectedIds.concat(image.hotelRoomImageId)
            return (deleteDialog = true)
          })
        }
        break
    }

    if (selectedIds?.length) {
      return (deleteDialog = true)
    }
    return console.error("couldn't find any images to delete")
  };

  const handleReset = () => {
    resetMediaManagerStore()
    resetFileUploadStore()
    Object.assign($data, $options.data?.apply(this))
  }

  const handleSearch = async (params: any) => {
    console.log('HIT HANDLE SEARCH >>>>>>>>>>>>>>>>>>', params);
    if (!params || (typeof params !== 'object' && !params.length)) {
      return
    }
    setLoading(true)
    if (params.hotelUniqueId && params.hotelName) {
      setSelectedHotel(params)
      hotelSelected = params
      return await fetchHotelImages().then(async () => {
        if (tabs === ImageTypes.ROOM.toLowerCase()) {
          await fetchRooms()
        }
      })
    } else if (params.length > 3) {
      return await fetchHotelItems({ hotelName: params });
    }
  }

  const updateItem = () => {
    setLoading(true)
    let data = {
      description: currentItem?.newDescription || '',
      url: currentItem?.newUrl || '',
      display: currentItem?.display || 'YES',
      type: currentItem?.type || 'IMAGE',
    };
    const id = currentItem?.hotelRoomImageId || currentItem?.hotelImageId;
    const endpoint = `/hotels/${imageType === ImageTypes.ROOM ? 'rooms/' : ''}media/${id}`;

    mediaManagerApi
      .update(endpoint, data)
      .then((response: any) => {
        if (response.status === 200) {
          setData({
            timeout: 3000,
            content: 'Update Successful',
            color: 'green-accent-2',
            displayComponent: 'snackbar',
          })

          snackbar = true
          editDialog = false
          deleteDialog = false
        }
      })
      .catch((err: any) => {
        setData({
          timeout: 3000,
          content:
            err.message || 'An Unknown error occurred, please try again!',
          color: 'red-lighten-2',
          displayComponent: 'snackbar',
        })

        snackbar = true
        setLoading(false)
      })
      .finally(() => setLoading(false))
  };
  const handleDeselect = () => {
    selectedIds = []
    deleteDialog = false
  };

  const handleSelect = (id = null) => {
    if (!multiSelect) {
      return
    }
    // single image select
    if (typeof id === 'string' || typeof id === 'number') {
      const index = selectedIds.indexOf(id)
      if (index !== -1) {
        return selectedIds.splice(index, 1)
      } else {
        return selectedIds.push(id)
      }
    }
    const items =
      tabs === ImageTypes.HOTEL
        ? hotelImages
        : rooms?.map((room) => {
          return room.roomImages || []
        })
    if (items?.length === selectedIds?.length) {
      return handleDeselect()
    }
    items?.forEach((item) => {
      const id = item.hotelRoomImageId || item.hotelImageId
      if (!selectedIds.includes(id as never)) {
        selectedIds.concat(id)
        selectedIds.slice()
      }
    })
  };

  const showRoom = (status: string) => {
    if (showInactiveRooms) {
      return true
    } else {
      if (status !== 'active') {
        return false
      }
    }
    return true
  };

  const keyupDelay = (() => {
    return (callback: () => void, ms: number | undefined) => {
      setTimeout(callback, ms)
    }
  })()

  const isDev = import.meta.env.DEV
  const mediaManagerStore = useMediaManagerStore();

  const {
    setSelectedHotel,
    setHotelUniqueId,
    setRoomUniqueId,
    setRoomIndex,
    setImageType,
    fetchRooms,
    fetchRoomImages,
    fetchHotelImages,
    setHotelImages,
    setRooms,
    setHotelItems,
    fetchHotelItems,
    resetMediaManagerStore,
    handleSortHotel,
    handleSortRoom,
    setLoading,
    deleteSelected,
    hotelImages,
    hotelItems,
    hotelUniqueId,
    roomUniqueId,
    selectedHotel,
    rooms,
    loadingHotelItems,
    heroImage,
    partnerLogo,
    heroVideo,
    loading,
  } = mediaManagerStore;

  $('#search-hotel').on('keyup', (e: any) => {
    keyupDelay(() => {
      fetchHotelItems({ hotelName: e.target.value })
    }, 1000)
  })

  onMounted(function() {
    if (route.query?.hotelUniqueId) {
      setHotelUniqueId(route.query?.hotelUniqueId)
      fetchHotelItems().then((response: any[]) => {

        if (response?.length === 1) {
          setSelectedHotel(response[0])
          fetchHotelImages()
        }
      })
    }
  });
</script>
<template>
  <v-container id="nextranet-media-manager">
    <v-row :no-gutters="true" class="px-8">
      <v-col cols="12">
        <v-card-title
          >Enter a hotel name or hotel Unique ID in the form below to search
          hotels</v-card-title
        >
      </v-col>
    </v-row>
    <v-form v-bind:modelValue="valid" @submit="handleSubmit">
      <v-row>
        <v-col cols="2">
          <v-switch
            :false-value="0"
            color="primary"
            :true-value="1"
            :model-value="excludeInactive"
            label="Exclude Inactive Hotels"
            @update:model-value="excludeInactive === 0 ? 1 : 0"
          />
        </v-col>
        <v-col cols="6">
          <v-combobox
            id="search-hotel"
            v-bind:on-update:model-value="hotelSelected"
            :items="hotelItems"
            :loading="!hotelItems.length && loading"
            :validate-on-blur="true"
            hide-no-data
            hide-selected
            return-object
            item-title="hotelName"
            item-text="hotelName"
            item-value="hotelUniqueId"
            label="Hotel Name"
            clearable
            class="hotel-autocomplete"
            variant="underlined"
            :custom-filter="filterHotelItems"
            @click:clear="handleReset"
            @update:modelValue="handleSearch"
          >
          </v-combobox>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-bind:modelValue="formHotelUniqueId"
            @update:modelValue="formHotelUniqueId"
            label="Unique ID"
            variant="underlined"
            :loading="!hotelItems.length && loading"
          />
        </v-col>
        <v-col cols="2" align-self="center">
          <v-btn
            :loading="!hotelItems.length && loading"
            type="submit"
            color="primary"
            >Submit</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
    <v-row v-if="hotelSelected?.hotelDomain" :no-gutters="true">
      <v-col cols="12" class="mb-4">
        <v-card-text class="pa-0">Property Link:</v-card-text>
        <a target="_blank" :href="propertyUrl">{{ hotelSelected.hotelName }}</a>
      </v-col>
    </v-row>
    <v-sheet v-if="hotelSelected?.hotelDomain">
      <v-tabs
        v-bind:modelValue="tabs"
        background-color="primary"
        color="secondary"
        :grow="true"
        @update:modelValue="handleDeselect"
      >
        <v-tab :value="ImageTypes.HOTEL"> HOTEL IMAGES </v-tab>
        <v-tab :value="ImageTypes.ROOM" @click="fetchRooms">
          ROOM IMAGES
        </v-tab>
        <v-tab :value="ImageTypes.HERO_IMAGE"> HOTEL HEROS </v-tab>
        <v-tab :value="ImageTypes.PARTNER"> PARTNER LOGO </v-tab>
      </v-tabs>

      <v-window v-bind:on-update:model-value="tabs">
        <!-- HOTEL IMAGES -->
        <v-window-item :value="ImageTypes.HOTEL">
          <v-container :fluid="true" class="multi-select-wrap py-2">
            <div v-if="!loading && hotelImages?.length">
              <v-chip
                v-if="!multiSelect"
                class="mr-2"
                color="green-lighten-1"
                outlined
                @click="multiSelect = true"
              >
                Select
              </v-chip>
              <v-chip
                v-if="multiSelect"
                class="mr-2"
                color="success"
                outlined
                @click="handleSelect"
              >
                <v-icon v-if="selectedIds?.length !== hotelImages?.length" left
                  >mdi-checkbox-blank-outline</v-icon
                >
                <v-icon v-else left>mdi-checkbox-marked</v-icon>
                Select All
              </v-chip>
              <v-chip
                v-if="multiSelect"
                class="mr-2"
                color="orange"
                outlined
                @click="() => {
                  multiSelect = false;
                  selectedIds = [];
                }"
              >
                <v-icon left>mdi-close-circle</v-icon>
                Cancel
              </v-chip>
              <v-chip
                v-if="selectedIds?.length && multiSelect"
                class="mr-2"
                color="red"
                outlined
                @click="handleDelete"
              >
                <v-icon left>mdi-trash-can</v-icon>
                {{ selectedIds?.length }} Selected
              </v-chip>
            </div>
            <div v-if="!loading && hotelImages?.length">
              <draggable
                v-model="hotelImages"
                item-key="hotelImageId"
                class="v-row v-row--no-gutters pt-2"
                :v-bind="{
                  touchStartThreshold: 20,
                  handle: '.image',
                  dragoverBubble: true,
                }"
                @end="handleSortHotel"
              >
                <template #item="{ element }">
                  <v-col
                    v-if="
                      hotelImages?.length &&
                      (element.type === 'IMAGE' || element.type === 'VIDEO')
                    "
                    cols="1"
                    class="pa-1 image"
                  >
                    <div
                      v-if="multiSelect"
                      class="filtered overlay-wrap position-absolute"
                    >
                      <div class="overlay-content">
                        <v-checkbox
                          v-bind:modelValue="selectedIds"
                          :value="element.hotelImageId"
                          off-icon="mdi-checkbox-blank"
                          color="success"
                          dark
                          hide-details
                        ></v-checkbox>
                      </div>
                    </div>
                    <v-img
                      v-if="isImage(element.url)"
                      draggable="true"
                      :aspect-ratio="4 / 3"
                      :src="element.url || backupImage"
                      :alt="element?.description"
                      class="draggable"
                      @click="handleEdit(element)"
                      @error="handleError(element)"
                    >
                      <v-tooltip top arrow>
                        <template #activator="{ on }">
                          <div
                            v-if="shouldFlagImage(element)"
                            class="size-flag-wrapper"
                          >
                            <div class="size-flag" v-on="on">
                              <v-icon>mdi-alert</v-icon>
                            </div>
                          </div>
                        </template>
                        <span>This image is under the recommended size for a Hotel Image</span>
                      </v-tooltip>
                    </v-img>
                    <v-img
                      v-else
                      draggable="true"
                      src="https://cdn.onlinewebfonts.com/svg/img_60204.png"
                      :alt="element.description"
                      contain
                      :aspect-ratio="4 / 3"
                      :image-id="element.hotelImageId"
                      class="draggable video"
                      @click="handleEdit(element)"
                    />
                  </v-col>
                </template>
                <template #footer>
                  <v-col v-if="!loading" cols="1" class="pa-1">
                    <v-btn
                      :block="true"
                      prepend-icon="mdi-cloud-upload"
                      color="secondary lighten-2"
                      class="v-layout--full-height"
                      variant="tonal"
                      @click="handleUpload"
                    >
                      Upload
                    </v-btn>
                  </v-col>
                  <v-col
                    v-if="hotelImages?.length && !multiSelect"
                    cols="1"
                    class="pa-1"
                  >
                    <v-btn
                      :block="true"
                      prepend-icon="mdi-trash-can-outline"
                      color="red"
                      class="v-layout--full-height"
                      variant="tonal"
                      @click="handleDelete"
                    >
                      Delete All
                    </v-btn>
                  </v-col>
                </template>
              </draggable>
            </div>
            <div v-if="loading">
              <v-row :no-gutters="true">
                <v-col v-for="i in 12" :key="`image-${i}`" cols="1">
                  <div :key="i" class="pa-1 v-responsive v-img v-img--booting">
                    <v-skeleton-loader
                      class="mx-auto border"
                      max-width="300"
                      type="image"
                    ></v-skeleton-loader>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-window-item>

        <!-- ROOM IMAGES -->
        <v-window-item :value="ImageTypes.ROOM">
          <v-container fluid>
            <div v-if="rooms?.length && !loading">
              <v-row>
                <v-col cols="12" class="px-8">
                  <v-switch
                    v-bind:on-update:model-value="showInactiveRooms"
                    :false-value="0"
                    color="primary"
                    :true-value="1"
                    label="Show Inactive Rooms"
                  ></v-switch>
                </v-col>
              </v-row>
            </div>
            <div v-if="rooms?.length && !loading">
              <v-expansion-panels
                v-bind:on-update:model-value="panels"
                :multiple="true"
                variant="popout"
              >
                <v-expansion-panel
                  v-for="(room, k) in rooms"
                  v-show="showRoom(room.status)"
                  :key="room.roomUniqueId"
                  :value="k"
                  @click="fetchRoomImages(room.roomUniqueId, k)"
                >
                  <v-expansion-panel-title>
                    {{ room.roomName }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-container>
                      <v-row
                        v-if="!room.roomImages?.length && room.loading"
                        :no-gutters="true"
                      >
                        <v-col
                          v-for="i in 3"
                          :key="`image-${i}`"
                          cols="2"
                          class="pa-1"
                        >
                          <v-skeleton-loader
                            class="mx-auto border"
                            max-width="200"
                            type="image"
                          ></v-skeleton-loader>
                        </v-col>
                      </v-row>

                      <draggable
                        v-model="room.roomImages"
                        :items="room.roomImages"
                        class="v-row v-row--no-gutters"
                        item-key="hotelRoomImageId"
                        :options="{
                          group: room.roomUniqueId,
                          touchStartThreshold: 20,
                          draggable: '.image',
                        }"
                        @end="() => handleSortRoom(k)"
                      >
                        <template #item="{ element }">
                          <v-col cols="2" class="pa-1">
                            <v-img
                              v-if="isImage(element.url)"
                              :aspect-ratio="4 / 3"
                              :src="element.url"
                              :alt="element.description"
                              :image-id="element.hotelRoomImageId"
                              class="image draggable"
                              @click="handleEdit(element)"
                            >
                              <v-tooltip top arrow>
                                <template #activator="{ on }">
                                  <div
                                    v-if="shouldFlagImage(element, room)"
                                    class="size-flag-wrapper"
                                  >
                                    <div class="size-flag" v-on="on">
                                      <v-icon>mdi-alert</v-icon>
                                    </div>
                                  </div>
                                </template>
                                <span
                                  >This image is under the recommended size for
                                  an ADR Room Image</span
                                >
                              </v-tooltip>
                            </v-img>
                            <v-img
                              v-else
                              src="https://cdn.onlinewebfonts.com/svg/img_60204.png"
                              :alt="element.description"
                              contain
                              :aspect-ratio="4 / 3"
                              :image-id="element.hotelRoomImageId"
                              class="sorting video"
                              @click="handleEdit(element)"
                            />
                          </v-col>
                        </template>
                        <template #footer>
                          <v-col cols="2" class="pa-1">
                            <v-btn
                              block
                              prepend-icon="mdi-cloud-upload"
                              color="secondary lighten-2"
                              class="v-layout--full-height"
                              size="x-large"
                              variant="tonal"
                              @click="handleUpload(room.roomUniqueId, k)"
                            >
                              Upload
                            </v-btn>
                          </v-col>
                          <v-col cols="2" class="pa-1">
                            <v-btn
                              v-if="room?.roomImages?.length && !loading"
                              block
                              prepend-icon="mdi-trash-can-outline"
                              color="red"
                              class="v-layout--full-height"
                              variant="tonal"
                              size="x-large"
                              @click="handleDelete(null, k)"
                            >
                              Delete All
                            </v-btn>
                          </v-col>
                        </template>
                      </draggable>
                    </v-container>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
            <div v-if="!rooms.length && !loading">
              <v-alert
                type="info"
                title="No Rooms Found"
                text="This hotel has no rooms associated with it, click to add rooms to this hotel."
                variant="tonal"
              />
            </div>
            <div v-if="loading">
              <v-row>
                <v-col cols="12">
                  <div class="py-1" style="height: 56px; width: 100%">
                    <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
                  </div>
                </v-col>
              </v-row>
              <v-row v-for="i in 10" :key="`row-${i}`" no-gutters class="px-4">
                <v-col cols="12">
                  <div class="mb-1">
                    <v-skeleton-loader
                      class="mx-auto border"
                      height="48"
                      type="image"
                    ></v-skeleton-loader>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-window-item>

        <!-- HOTEL HERO'S -->
        <v-window-item :value="ImageTypes.HERO_IMAGE">
          <v-container fluid>
            <!------------- HERO IMAGE SECTION --------------->
            <v-toolbar>
              <v-toolbar-title>HERO IMAGE</v-toolbar-title>
            </v-toolbar>

            <v-row v-if="!loading" no-gutters class="mt-2">
              <v-col
                v-for="(image, k) in heroImage"
                :key="k"
                cols="2"
                class="image"
              >
                <v-img
                  v-show="isImage(image.url)"
                  :aspect-ratio="4 / 3"
                  :src="image.url"
                  :alt="image.description"
                  @click="handleEdit(image)"
                >
                  <v-tooltip top arrow>
                    <template #activator="{ on }">
                      <div
                        v-if="shouldFlagImage(image)"
                        class="size-flag-wrapper"
                      >
                        <div class="size-flag" v-on="on">
                          <v-icon>mdi-alert</v-icon>
                        </div>
                      </div>
                    </template>
                    <span
                      >This image is under the recommended size for an ADR Room
                      Image</span
                    >
                  </v-tooltip>
                </v-img>
                <v-img
                  v-show="!isImage(image.url)"
                  src="https://cdn.onlinewebfonts.com/svg/img_60204.png"
                  :alt="image.description"
                  contain
                  :aspect-ratio="4 / 3"
                  :image-id="image.hotelImageId"
                  class="sorting video"
                  @click="handleEdit(image)"
                />
              </v-col>

              <v-col v-if="!loading" cols="2" class="pa-1">
                <v-btn
                  block
                  prepend-icon="mdi-cloud-upload"
                  color="secondary lighten-2"
                  class="v-layout--full-height"
                  size="x-large"
                  variant="tonal"
                  @click="handleUpload(null, null, ImageTypes.HERO_IMAGE)"
                >
                  Upload
                </v-btn>
              </v-col>
            </v-row>

            <!------------- HERO VIDEO SECTION --------------->
            <v-toolbar class="mt-10">
              <v-toolbar-title>HERO VIDEO</v-toolbar-title>
            </v-toolbar>

            <v-row v-if="!loading" no-gutters>
              <v-col
                v-for="(image, k) in heroVideo"
                :key="k"
                cols="2"
                class="image"
              >
                <v-img
                  v-show="isImage(image.url)"
                  :aspect-ratio="4 / 3"
                  :src="image.url"
                  :alt="image.description"
                  @click="handleEdit(image)"
                >
                  <v-tooltip top arrow>
                    <template #activator="{ on }">
                      <div
                        v-if="shouldFlagImage(image)"
                        class="size-flag-wrapper"
                      >
                        <div class="size-flag" v-on="on">
                          <v-icon>mdi-alert</v-icon>
                        </div>
                      </div>
                    </template>
                    <span
                      >This image is under the recommended size for an ADR Room
                      Image</span
                    >
                  </v-tooltip>
                </v-img>
                <v-img
                  v-show="!isImage(image.url)"
                  src="https://cdn.onlinewebfonts.com/svg/img_60204.png"
                  :alt="image.description"
                  contain
                  :aspect-ratio="4 / 3"
                  class="sorting video"
                  @click="handleEdit(image)"
                />
              </v-col>
              <v-col cols="2" class="pa-1">
                <v-btn
                  block
                  prepend-icon="mdi-cloud-upload"
                  color="secondary lighten-2"
                  class="v-layout--full-height"
                  size="x-large"
                  variant="tonal"
                  @click="handleUpload(null, null, ImageTypes.HERO_VIDEO)"
                >
                  Upload
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-else-if="loading" no-gutters>
              <v-col v-for="i in 2" :key="`row-${i}`" cols="2">
                <div :key="i" class="pa-1 v-responsive v-img v-img--booting">
                  <v-skeleton-loader
                    class="mx-auto border"
                    height="250"
                    type="image"
                  ></v-skeleton-loader>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>

        <v-window-item :value="ImageTypes.PARTNER">
          <v-container>
            <v-row v-if="!loading" :no-gutters="true">
              <v-col
                v-for="(image, k) in partnerLogo"
                :key="k"
                cols="2"
                class="pa-1"
              >
                <v-img
                  v-show="isImage(image.url)"
                  :aspect-ratio="4 / 3"
                  :src="image.url"
                  :alt="image.description"
                  class="sorting"
                  @click="handleEdit(image)"
                >
                  <v-tooltip top arrow>
                    <template #activator="{ on }">
                      <div
                        v-if="shouldFlagImage(image, k)"
                        class="size-flag-wrapper"
                      >
                        <div class="size-flag" v-on="on">
                          <v-icon>mdi-alert</v-icon>
                        </div>
                      </div>
                    </template>
                    <span
                      >This image is under the recommended size for an ADR Room
                      Image</span
                    >
                  </v-tooltip>
                </v-img>
                <v-img
                  v-show="!isImage(image.url)"
                  src="https://cdn.onlinewebfonts.com/svg/img_60204.png"
                  :alt="image.description"
                  contain
                  :aspect-ratio="4 / 3"
                  class="sorting video"
                  @click="handleEdit(image)"
                />
              </v-col>
              <v-col cols="2" class="pa-1">
                <v-btn
                  :block="true"
                  prepend-icon="mdi-cloud-upload"
                  color="secondary lighten-2"
                  class="v-layout--full-height"
                  size="x-large"
                  variant="tonal"
                  @click="handleUpload"
                >
                  Upload
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="loading" no-gutters>
              <v-col v-for="i in 2" :key="i" cols="2">
                <div :key="i" class="pa-1 v-responsive v-img v-img--booting">
                  <v-skeleton-loader :key="i" height="250" width="100%" type="image" />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
      </v-window>

      <file-upload />

      <!-- DELETE DIALOG -->
      <v-dialog v-bind:on-update:model-value="deleteDialog" :max-width="400">
        <v-card>
          <v-toolbar color="primary">
            <v-toolbar-title> Delete Image(s)? </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pt-5 pb-5">
            This will delete {{ selectedIds?.length }} Image(s)
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
              variant="tonal"
              color="grey-lighten-2"
              @click="handleCancelDelete"
            >
              Cancel
            </v-btn>
            <v-btn
              variant="tonal"
              color="red-lighten-2"
              @click="handleConfirmDelete"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- EDIT DIALOG -->
      <v-dialog
        v-if="currentItem"
        v-bind:on-update:model-value="editDialog"
        :scrollable="true"
        :max-width="500"
      >
        <v-form
          v-bind:on-update:model-value="editValid"
          validate-on="input"
          @submit.prevent="updateItem"
        >
          <v-card>
            <v-toolbar color="primary">
              <v-toolbar-title color="primary">
                {{ isImage(currentItem.url) ? 'Image' : 'Video' }} ID:
                {{ currentItem.hotelRoomImageId || currentItem.hotelImageId }}
              </v-toolbar-title>
              <v-spacer />
              <v-btn icon @click="editDialog = false">
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="pa-0" style="max-height: 80vh">
              <v-img
                v-if="isImage(currentItem.url)"
                :src="currentItem.url || currentItem.backupImage"
                :alt="currentItem.description"
                @error="handleError(currentItem)"
              />
              <div v-show="isVideo(currentItem.url)" class="video-container">
                <video
                  v-show="videoType(currentItem.url) === 'video'"
                  playsinline
                  autoplay
                  controls="controls"
                  loop
                  muted
                  preload="auto"
                  width="100%"
                  height="auto"
                  :style="
                    'background: black url(' +
                    currentItem.url +
                    ') center center no-repeat;'
                  "
                >
                  <source :src="currentItem.url" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <iframe
                  v-show="videoType(currentItem.url) === 'youtube'"
                  :src="
                    'https://www.youtube.com/embed/' +
                    getYoutubeId(currentItem.url)
                  "
                  allowfullscreen
                  width="400"
                  height="300"
                />
              </div>
              <v-container class="pb-2">
                <v-text-field
                  v-model="currentItem.newUrl"
                  :label="isImage(currentItem.url) ? 'Image URL' : 'Video URL'"
                  :rules="rules.required"
                />

                <v-textarea
                  v-model="currentItem.newDescription"
                  outlined
                  height="120"
                  label="Description"
                  class="pt-4"
                />

                <div class="pb-0 pl-0">
                  Uploaded By:
                  {{
                    currentItem.userFirstName && currentItem.userLastName
                      ? currentItem.userFirstName +
                        ' ' +
                        currentItem.userLastName
                      : 'Unknown'
                  }}
                </div>

                <div
                  v-if="currentItem?.width && currentItem.height"
                  class="py-0 pl-0"
                >
                  Size: {{ currentItem?.width }}px X {{ currentItem.height }}px
                </div>

                <div v-if="currentItem?.rank" class="py-0 pl-0">
                  Rank: {{ currentItem?.rank }}
                </div>

                <v-switch
                  v-model="currentItem.display"
                  false-value="NO"
                  color="primary"
                  true-value="YES"
                  label="Display"
                />
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :loading="loading"
                color="grey-lighten-2"
                variant="tonal"
                @click="() => {
                  editDialog = false
                  currentItem = null
                }"
              >
                Cancel
              </v-btn>
              <v-btn
                :loading="loading"
                variant="tonal"
                color="red-lighten-2"
                @click="handleDelete"
              >
                Delete
              </v-btn>
              <v-btn
                variant="tonal"
                color="green-lighten-2"
                type="submit"
                :loading="loading"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-sheet>

    <v-snackbar
      v-bind:on-update:model-value="snackbar"
      class="snack-message"
      :timeout="3000"
      :color="color"
    >
      {{ content }}

      <template #actions>
        <v-btn color="red" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script lang="ts">
  import { mediaType } from '@core/mixins/mediaType'
  import $ from 'jquery'
  import { mapActions, mapState } from 'pinia'
  import FileUpload from './FileUpload.vue'
  import { useMediaManagerStore } from '@core/stores/mediaManager.store'
  import { useFileUploadStore } from '@core/stores/fileUpload.store'
  import _ from 'lodash'
  import { defineComponent } from 'vue'
  import { useResponseParser } from '@core/stores/composables/responseParser.composition'
  import { useDisplayComponent } from '@core/stores/composables/dataDisplay.composition'
  import draggable from 'vuedraggable'
  import { defineProps } from 'vue'



  export default defineComponent({
    name: 'ExtranetMediaManager',
    components: { FileUpload, draggable },
    mixins: [mediaType],
    computed: {
      propertyUrl(): string {
        const domain = isDev
          ? 'nexttripdev.com'
          : 'from.funnel.packagebookings.nexttrip.com'
        return `//${domain}/${selectedHotel?.hotelDomain}`
      },
      ImageTypes() {
        return ImageTypes
      },
      ...mapState(useDisplayComponent, {
        content: (store) => store.content,
        color: (store) => store.color,
        timeout: (store) => store.timeout,
        showSnackbar: (store) => store.showSnackbar,
      }),
      ...mapState(useFileUploadStore, {
        uploadPercentage: (store) => store.uploadPercentage,
      }),
    },
    watch: {
      excludeInactive() {
        const currentQueryParams = _.cloneDeep(route.query)
        if (excludeInactive) {
          router.push({
            name: 'media-manager',
            query: {
              ...currentQueryParams,
              ...{ excludeInactive: excludeInactive },
            },
          })
        } else {
          delete currentQueryParams.excludeInactive
          router.push({
            name: 'media-manager',
            query: { ...currentQueryParams },
          })
        }
      },
      showInactiveRooms() {
        const currentQueryParams = _.cloneDeep(route.query)
        if (showInactiveRooms) {
          router.push({
            name: 'media-manager',
            query: {
              ...currentQueryParams,
              ...{ showInactiveRooms: showInactiveRooms },
            },
          })
        } else {
          delete currentQueryParams.showInactiveRooms
          router.push({
            name: 'media-manager',
            query: { ...currentQueryParams },
          })
        }
      },
      hotelUniqueId() {
        const currentQueryParams = _.cloneDeep(route.query)
        if (hotelUniqueId) {
          router.push({
            name: 'media-manager',
            query: {
              ...currentQueryParams,
              ...{ hotelUniqueId: hotelUniqueId },
            },
          })
          this.formHotelUniqueId = hotelUniqueId
        } else {
          delete currentQueryParams.hotelUniqueId
          this.formHotelUniqueId = ''
          this.router.push({
            name: 'media-manager',
            query: { ...currentQueryParams },
          })
        }
      },
      tabs() {
        const currentQueryParams = _.cloneDeep(route.query)
        router.push({
          name: 'media-manager',
          query: {
            ...currentQueryParams,
            ...{ tab: tabs?.toLowerCase() },
          },
        })
      },
    },
  })
</script>

<style scoped>
  .position-relative {
    position: relative;
  }

  .position-absolute {
    position: absolute !important;
  }

  .video {
    border: 1px solid black;
  }

  video {
    /* override other styles to make responsive */
    width: 100% !important;
    height: auto !important;
  }

  .snack-message {
    z-index: 99999999999;
  }

  .video-container .mdi-fullscreen {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }

  .embed-container {
    --video--width: 1296;
    --video--height: 540;

    position: relative;
    padding-bottom: calc(
      var(--video--height) / var(--video--width) * 100%
    ); /* 41.66666667% */
    overflow: hidden;
    max-width: 100%;
    background: black;
    pointer-events: none;
  }

  .embed-container iframe,
  .embed-container object,
  .embed-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .video-container {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 30px;
    height: 0;
    overflow: hidden;
  }

  .video-container iframe,
  .video-container object,
  .video-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .size-flag-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .size-flag {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
  }

  .size-flag .v-icon {
    font-size: 26px;
    color: #fff000;
  }

  .overlay-wrap {
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .overlay-content {
    width: 100%;
    height: 100%;
  }

  .overlay-wrap .v-input--selection-controls {
    margin-top: 0;
    padding-bottom: 0;
  }

  :deep(.v-progress-linear__background),
  :deep(.v-progress-linear__indeterminate.short) {
    background-color: #6200ea !important;
    color: #fff !important;
  }

  .image {
    border: 2px outset transparent;
    transition: 0.3s all linear;
    cursor: pointer;
  }

  .image:hover {
    border: 2px outset rgba(255, 255, 255, 0.3);
  }

  :deep(.v-input__details) {
    display: none;
  }

  .v-col-2 .v-layout--full-height {
    min-height: 180px;
  }

  .v-col-1 .v-layout--full-height {
    min-height: 97px;
  }
</style>
