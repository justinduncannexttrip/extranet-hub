<template>
  <v-container id="nextranet-media-manager">
    <v-row no-gutters class="px-8">
      <v-col cols="12">
        <v-card-title>Enter a hotel name or hotel Unique ID in the form below to search hotels</v-card-title>
      </v-col>
    </v-row>
    <v-form v-model="valid" @submit="handleSubmit">
      <v-row>
        <v-col cols="2">
          <v-switch :false-value="0" color="primary" :true-value="1" v-model="excludeInactive" label="Exclude Inactive Hotels" />
        </v-col>
        <v-col cols="6">
          <v-combobox
            v-model="hotelSelected"
            @click:clear="handleReset"
            @update:modelValue="handleSearch"
            :items="hotelItems"
            :loading="!hotelItems.length && loading"
            :validate-on-blur="true"
            id="search-hotel"
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
          >
          </v-combobox>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="formHotelUniqueId"
            label="Unique ID"
            variant="underlined"
            :loading="!hotelItems.length && loading"
          />
        </v-col>
        <v-col cols="2" align-self="center">
          <v-btn :loading="!hotelItems.length && loading" type="submit" color="primary">Submit</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row no-gutters v-if="hotelSelected?.hotelDomain">
      <v-col cols="12" class="mb-4">
        <v-card-text class="pa-0">Property Link:</v-card-text>
        <a target="_blank" :href="propertyUrl">{{hotelSelected.hotelName}}</a>
      </v-col>
    </v-row>
    <v-sheet v-if="hotelSelected?.hotelDomain">
      <v-tabs
        v-model="tabs"
        background-color="primary"
        color="secondary"
        grow
        @update:model-value="handleDeselect"
      >
        <v-tab :value="ImageTypes.HOTEL">
          HOTEL IMAGES
        </v-tab>
        <v-tab :value="ImageTypes.ROOM" @click="fetchRooms">
          ROOM IMAGES
        </v-tab>
        <v-tab :value="ImageTypes.HERO_IMAGE">
          HOTEL HEROS
        </v-tab>
        <v-tab :value="ImageTypes.PARTNER">
          PARTNER LOGO
        </v-tab>
      </v-tabs>

      <v-window v-model="tabs">


        <!-- HOTEL IMAGES -->
        <v-window-item :value="ImageTypes.HOTEL">
          <v-container fluid class="multi-select-wrap py-2">
            <div v-if="!loading && hotelImages?.length">
              <v-chip
                v-if="!multiSelect"
                @click="multiSelect = true"
                class="mr-2"
                color="green-lighten-1"
                outlined
              >
                Select
              </v-chip>
              <v-chip
                v-if="multiSelect"
                @click="handleSelect"
                class="mr-2"
                color="success"
                outlined
              >
                <v-icon v-if="selectedIds?.length !== hotelImages?.length" left>mdi-checkbox-blank-outline</v-icon>
                <v-icon v-else left>mdi-checkbox-marked</v-icon>
                Select All
              </v-chip>
              <v-chip
                v-if="multiSelect"
                @click="multiSelect = false; selectedIds = []"
                class="mr-2"
                color="orange"
                outlined
              >
                <v-icon left>mdi-close-circle</v-icon>
                Cancel
              </v-chip>
              <v-chip
                v-if="selectedIds?.length && multiSelect"
                @click="handleDelete"
                class="mr-2"
                color="red"
                outlined
              >
                <v-icon left>mdi-trash-can</v-icon>
                {{selectedIds?.length}} Selected
              </v-chip>
            </div>
            <div v-if="!loading">
              <Draggable
                v-if="hotelImages?.length"
                v-model="hotelImages"
                @end="handleSortHotel"
                item-key="hotelImageId"
                class="v-row v-row--no-gutters pt-2"
              >
                <template v-slot:item="{item}">
                  <v-col cols="1" class="pa-1 image"  v-if="hotelImages?.length && (item.type === 'IMAGE' || item.type === 'VIDEO')">
                    <div v-if="multiSelect" class="filtered overlay-wrap position-absolute">
                      <div class="overlay-content">
                        <v-checkbox :value="item.hotelImageId" v-model="selectedIds" off-icon="mdi-checkbox-blank" color="success" dark hide-details></v-checkbox>
                      </div>
                    </div>
                    <v-img
                      @click="handleEdit(item)"
                      draggable="true"
                      v-if="isImage(item.url)"
                      :aspect-ratio="4/3"
                      :src="item.url || backupImage"
                      :alt="item?.description"
                      @error="handleError(item)"
                    >
                      <v-tooltip top arrow>
                        <template v-slot:activator="{ on }">
                          <div v-if="shouldFlagImage(item)" class="size-flag-wrapper">
                            <div v-on="on" class="size-flag">
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
                      src='https://cdn.onlinewebfonts.com/svg/img_60204.png'
                      :alt="item.description"
                      contain
                      :aspect-ratio="4/3"
                      @click="handleEdit(item)"
                      :image-id="item.hotelImageId"
                      class="draggable video"
                    />
                  </v-col>
                </template>
              </Draggable>
            </div>
            <div v-if="loading">
              <v-row no-gutters>
                <v-col v-for="i in 12" cols="1">
                  <div :key="i" class="pa-1 v-responsive v-img v-img--booting">
                    <Skeletor :key="i" height="90" width="100%" class="bg-" />
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
                  <v-switch :false-value="0" color="primary" :true-value="1" v-model="showInactiveRooms" label="Show Inactive Rooms"></v-switch>
                </v-col>
              </v-row>
            </div>
            <div v-if="rooms?.length && !loading">
              <v-expansion-panels
                v-model="panels"
                multiple
                variant="popout"
              >
                <v-expansion-panel
                  v-for="(room, k) in rooms"
                  v-show="showRoom(room.status)"
                  :value="k"
                  @click="fetchRoomImages(room.roomUniqueId, k)"
                >
                  <v-expansion-panel-title>
                    {{room.roomName}}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-container>
                      <v-row v-if="!room.roomImages?.length && room.loading" no-gutters>
                        <v-col cols="2" v-for="i in 3" class="pa-1">
                          <Skeletor :key="i" height="200" width="100%" />
                        </v-col>
                      </v-row>

                      <Draggable
                        v-model="room.roomImages"
                        :items="room.roomImages"
                        @end="(event) => handleSortRoom(event, k)"
                        class="v-row v-row--no-gutters"
                        item-key="hotelRoomImageId"
                        :group="room.roomUniqueId"
                        touchStartThreshold="20"
                      >
                        <template v-slot:item="{item, index}">
                          <v-col cols="2" class="pa-1">
                            <v-img
                              v-if="isImage(item.url)"
                              :aspect-ratio="4/3"
                              :src="item.url"
                              :alt="item.description"
                              @click="handleEdit(item)"
                              :image-id="item.hotelRoomImageId"
                              class="image draggable"
                            >
                              <v-tooltip top arrow>
                                <template v-slot:activator="{ on }">
                                  <div v-if="shouldFlagImage(item, room)" class="size-flag-wrapper">
                                    <div v-on="on" class="size-flag">
                                      <v-icon>mdi-alert</v-icon>
                                    </div>
                                  </div>
                                </template>
                                <span>This image is under the recommended size for an ADR Room Image</span>
                              </v-tooltip>
                            </v-img>
                            <v-img
                              v-else-if="isImage(item.url)"
                              src='https://cdn.onlinewebfonts.com/svg/img_60204.png'
                              :alt="item.description"
                              contain
                              :aspect-ratio="4/3"
                              @click="handleEdit(item)"
                              :image-id="item.hotelRoomImageId"
                              class="sorting video"
                            />
                          </v-col>
                        </template>
                        <template #header>
                          <v-col cols="2" class="pa-1">
                            <v-btn
                              block
                              prepend-icon="mdi-cloud-upload"
                              color="secondary lighten-2"
                              @click="handleUpload(room.roomUniqueId, k)"
                              class="v-layout--full-height"
                              size="x-large"
                              variant="tonal"
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
                              @click="handleDelete(null, k)"
                              class="v-layout--full-height"
                              variant="tonal"
                              size="x-large"
                            >
                              Delete All
                            </v-btn>
                          </v-col>
                        </template>
                      </Draggable>
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
                    <Skeletor height="20" width="20" class="switch" />
                    <skeletor height="13" width="40" class="switch-pill" pill />
                  </div>
                </v-col>
              </v-row>
              <v-row v-for="i in 10" no-gutters class="px-4">
                <v-col cols="12">
                  <div  class="mb-1">
                    <Skeletor :key="i" height="48" width="100%" />
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

            <v-row no-gutters v-if="!loading" class="mt-2">
              <v-col cols="2" v-for="(image, k) in heroImage" :key="k" class="image">
                <v-img
                  v-show="isImage(image.url)"
                  :aspect-ratio="4/3"
                  :src="image.url"
                  :alt="image.description"
                  @click="handleEdit(image)"
                >
                  <v-tooltip top arrow>
                    <template v-slot:activator="{ on }">
                      <div v-if="shouldFlagImage(image)" class="size-flag-wrapper">
                        <div v-on="on" class="size-flag">
                          <v-icon>mdi-alert</v-icon>
                        </div>
                      </div>
                    </template>
                    <span>This image is under the recommended size for an ADR Room Image</span>
                  </v-tooltip>
                </v-img>
                <v-img
                  v-show="!isImage(image.url)"
                  src='https://cdn.onlinewebfonts.com/svg/img_60204.png'
                  :alt="image.description"
                  contain
                  :aspect-ratio="4/3"
                  @click="handleEdit(image)"
                  :image-id="image.hotelImageId"
                  class="sorting video"
                />
              </v-col>

              <v-col v-if="!loading" cols="2" class="pa-1">
                <v-btn
                  block
                  prepend-icon="mdi-cloud-upload"
                  color="secondary lighten-2"
                  @click="handleUpload(null, null, ImageTypes.HERO_IMAGE)"
                  class="v-layout--full-height"
                  size="x-large"
                  variant="tonal"
                >
                  Upload
                </v-btn>
              </v-col>
            </v-row>

            <!------------- HERO VIDEO SECTION --------------->
            <v-toolbar class="mt-10">
              <v-toolbar-title>HERO VIDEO</v-toolbar-title>
            </v-toolbar>

            <v-row no-gutters v-if="!loading">
              <v-col cols="2" v-for="(image, k) in heroVideo" :key="k" class="image">
                <v-img
                  v-show="isImage(image.url)"
                  :aspect-ratio="4/3"
                  :src="image.url"
                  :alt="image.description"
                  @click="handleEdit(image)"
                >
                  <v-tooltip top arrow>
                    <template v-slot:activator="{ on }">
                      <div v-if="shouldFlagImage(image)" class="size-flag-wrapper">
                        <div v-on="on" class="size-flag">
                          <v-icon>mdi-alert</v-icon>
                        </div>
                      </div>
                    </template>
                    <span>This image is under the recommended size for an ADR Room Image</span>
                  </v-tooltip>
                </v-img>
                <v-img
                  v-show="!isImage(image.url)"
                  src='https://cdn.onlinewebfonts.com/svg/img_60204.png'
                  :alt="image.description"
                  contain
                  :aspect-ratio="4/3"
                  @click="handleEdit(image)"
                  class="sorting video"
                />
              </v-col>
              <v-col cols="2" class="pa-1">
                <v-btn
                  block
                  prepend-icon="mdi-cloud-upload"
                  color="secondary lighten-2"
                  @click="handleUpload(null, null, ImageTypes.HERO_VIDEO)"
                  class="v-layout--full-height"
                  size="x-large"
                  variant="tonal"
                >
                  Upload
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-else-if="loading" no-gutters>
              <v-col v-for="i in 2" cols="2">
                <div :key="i" class="pa-1 v-responsive v-img v-img--booting">
                  <Skeletor :key="i" height="250" width="100%" />
                </div>
              </v-col>
            </v-row>
          </v-container>

        </v-window-item>


        <v-window-item :value="ImageTypes.PARTNER">
          <v-container>
            <v-row v-if="!loading" no-gutters>
              <v-col
                cols="2"
                v-if="partnerLogo?.length"
                v-for="(image, k) in partnerLogo"
                :key="k"
                class="pa-1"
              >
                <v-img
                  v-show="isImage(image.url)"
                  :aspect-ratio="4/3"
                  :src="image.url"
                  :alt="image.description"
                  @click="handleEdit(image)"
                  class="sorting"
                >
                  <v-tooltip top arrow>
                    <template v-slot:activator="{ on }">
                      <div v-if="shouldFlagImage(image, k)" class="size-flag-wrapper">
                        <div v-on="on" class="size-flag">
                          <v-icon>mdi-alert</v-icon>
                        </div>
                      </div>
                    </template>
                    <span>This image is under the recommended size for an ADR Room Image</span>
                  </v-tooltip>
                </v-img>
                <v-img
                  v-show="!isImage(image.url)"
                  src='https://cdn.onlinewebfonts.com/svg/img_60204.png'
                  :alt="image.description"
                  contain
                  :aspect-ratio="4/3"
                  @click="handleEdit(image)"
                  class="sorting video"
                />
              </v-col>
              <v-col cols="2" class="pa-1">
                <v-btn
                  block
                  prepend-icon="mdi-cloud-upload"
                  color="secondary lighten-2"
                  @click="handleUpload"
                  class="v-layout--full-height"
                  size="x-large"
                  variant="tonal"
                >
                  Upload
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="loading" no-gutters>
              <v-col v-if="loading" v-for="i in 2" cols="2">
                <div :key="i" class="pa-1 v-responsive v-img v-img--booting">
                  <Skeletor :key="i" height="250" width="100%" />
                </div>
              </v-col>
            </v-row>
          </v-container>

        </v-window-item>
      </v-window>

      <file-upload />

      <!-- DELETE DIALOG -->
      <v-dialog v-model="deleteDialog" :max-width="400">
        <v-card>
          <v-toolbar color="primary">
            <v-toolbar-title>
              Delete Image(s)?
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pt-5 pb-5">
            This will delete {{selectedIds?.length}} Image(s)
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
      <v-dialog :scrollable="true" v-if="currentItem" v-model="editDialog" :max-width="500">
        <v-form validate-on="input" v-model="editValid" @submit.prevent="updateItem">
          <v-card>
            <v-toolbar color="primary">
              <v-toolbar-title color="primary">
                {{isImage(currentItem.url) ? 'Image' : 'Video'}} ID: {{currentItem.hotelRoomImageId || currentItem.hotelImageId}}
              </v-toolbar-title>
              <v-spacer />
              <v-btn icon @click="editDialog  = false">
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
                  :style="'background: black url(' + currentItem.url + ') center center no-repeat;'"
                >
                  <source :src="currentItem.url" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
                <iframe
                  v-show="videoType(currentItem.url) === 'youtube'"
                  :src="'https://www.youtube.com/embed/' + getYoutubeId(currentItem.url)"
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
                  Uploaded By: {{currentItem.userFirstName && currentItem.userLastName ? currentItem.userFirstName + ' ' + currentItem.userLastName  : 'Unknown'}}
                </div>

                <div v-if="currentItem?.width && currentItem.height" class="py-0 pl-0">
                  Size: {{currentItem?.width}}px X {{currentItem.height}}px
                </div>

                <div v-if="currentItem?.rank" class="py-0 pl-0">
                  Rank: {{currentItem?.rank}}
                </div>

                <v-switch false-value="NO" color="primary" true-value="YES" v-model="currentItem.display" label="Display" />
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :loading="loading"
                color="grey-lighten-2"
                variant="tonal"
                @click="editDialog = false; currentItem = null"
              >
                Cancel
              </v-btn>
              <v-btn
                @click="handleDelete"
                :loading="loading"
                variant="tonal"
                color="red-lighten-2"
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

    <v-snackbar class="snack-message" :timeout="3000" v-model="snackbar" :color="color">
      {{content}}

      <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>
<script>
import { mediaType } from './mixins/mediaType';
import $ from 'jquery';
import { useTheme } from 'vuetify';
import { mapActions, mapState } from 'pinia';
import { ImageTypes } from './consts/mediaManager';
import FileUpload from './FileUpload.vue';
import { useMediaManagerStore } from '@core/stores/mediaManager';
import { useFileUploadStore } from '@core/stores/fileUpload';
import _ from 'lodash';
import { defineComponent } from 'vue';
import { useResponseParser } from '@core/stores/composables/responseParser';
import { useDisplayComponent } from '@core/stores/composables/dataDisplay';
import Draggable from "vue3-draggable";
import DataDisplay from '@core/components/DataDisplay.vue';
import 'vue-skeletor/dist/vue-skeletor.css';
import { Skeletor } from 'vue-skeletor';
import { $extranetApi } from "@/utils/api.js";

const isDev = import.meta.env.DEV;

export default defineComponent({
  name: 'ExtranetMediaManager',
  components: { FileUpload, Draggable, DataDisplay, Skeletor },
  setup() {
    const theme = useTheme();

    return {
      theme,
    }
  },
  mounted() {
    const keyupDelay = (function() {
      let timer = 0;
      return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();


    $('#search-hotel').keyup((e) => {
      keyupDelay(() => {
        this.fetchHotelItems({ hotelName: e.target.value })
      }, 1000);
    });
    if (this.$route.query?.hotelUniqueId) {
      this.setHotelUniqueId(this.$route.query?.hotelUniqueId);
      this.formHotelUniqueId = this.hotelUniqueId;
      this.fetchHotelItems().then((response) => {
        if (response?.length === 1) {
          this.setSelectedHotel(response[0]);
          this.hotelSelected = response[0];
          this.handleFetchImages();
        }
      });
    }
    if (!!this.$route.query?.excludeInactive) {
      this.excludeInactive =  this.$route.query?.excludeInactive;
    }

    if (!!this.$route.query?.showInactiveRooms) {
      this.showInactiveRooms = this.$route.query?.showInactiveRooms;
    }
  },
  mixins: [
    mediaType,
  ],
  data: function () {
    /**
     * The extranet page for managing hotel media
     * @displayName: ExtranetMediaManager
     */
    return {
      panels: [],
      tabs: ImageTypes.HOTEL,
      valid: false,
      editValid: false,
      rules: {
        int: [v => !!v || 'Hotel ID is required'],
        required: [v => !!v || 'This Field is Required'],
      },
      hotelSelected: '',
      formHotelUniqueId: '',
      search: null,
      hotelString: '',
      multiSelect: false,
      editDialog: false,
      currentItem: null,
      newUrl: '',
      newDescription: '',
      minImgWidth: 800,
      minImgHeight: 480,
      selectedIds: [],
      deleteDialog: false,
      excludeInactive: 0,
      showInactiveRooms: 0,
      backupImage: '/hotelImageNotFound_725_435.jpg',
      envData: {
        BASE_URL: import.meta.env.BASE_URL,
      },
      snackbar: false,
    };
  },
  methods: {
    handleFetchImages: async function () {
      if (!this.hotelUniqueId) {
        return console.error('Hotel Unique ID is not defined');
      }
      await this.fetchHotelImages();
    },
    handleError: function (image) {
      image.originalUrl = image.url;
      image.url = this.backupImage;
    },
    shouldFlagImage: function (img, room = false) {
      // Only flag ADR rooms
      if (room?.isUpgradedRoom === 'NO' && room?.isUpgradedRoomPackage === 'NO') {
        return false;
      }
      let w = img.width;
      let h = img.height;

      if (h && w) {
        if (w > h && w < this.minImgWidth) {
          return true;
        } else if (h > w && h < this.minImgHeight) {
          return true;
        }
      }
      return false;
    },
    filterHotelItems(hotelName, hotelUniqueId, obj) {
      const { hotelExtranetStatus } = obj.value;
      if (hotelExtranetStatus !== 'active' && this.excludeInactive === '1') {
        return -1;
      }
    },
    fetchHotelById: async function () {
      if (!this.hotelUniqueId || Number.isNaN(this.hotelUniqueId)) {
        this.setData({
          displayComponent: 'snackbar',
          color: 'red-lighten-2',
          content: 'Hotel Unique ID is not set or not a number and you are trying to fetch hotels by ID',
        })
        this.showSnackbar = true;
      }
      await this.fetchHotelItems({ hotelUniqueId: this.formHotelUniqueId || this.hotelSelected?.hotelUniqueId || this.hotelUniqueId })
        .then(() => {
          if (this.hotelItems?.length === 1) {
            this.setSelectedHotel(this.hotelItems[0]);
            this.hotelSelected = this.hotelItems[0];
            this.fetchHotelImages();
          }
        })
    },
    handleSubmit: function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.formHotelUniqueId) {
        this.setHotelUniqueId(this.formHotelUniqueId);
        this.fetchHotelById();
      } else if (this.selectedHotel?.hotelName && !this.hotelSelected) {
        this.fetchHotelItems({ ...this.hotelSelected });
      }
    },
    handleEdit: async function (image) {
      this.currentItem = image;
      this.currentItem.newUrl = this.currentItem.originalUrl || this.currentItem.url;
      this.currentItem.newDescription = this.currentItem.description;
      this.editDialog = true;
    },
    handleUpload: function (roomUniqueId = null, idx = null, heroType = null) {
      this.setImageType(heroType || this.tabs);
      if (roomUniqueId) {
        this.setRoomUniqueId(roomUniqueId);
        this.setRoomIndex(idx);
      }

      this.setUploadDialog(true);
    },
    handleCancelDelete: function () {

      if (!this.multiSelect) {
        this.selectedIds = [];
      }
      this.deleteDialog = false;
    },
    handleConfirmDelete: function () {
      this.deleteSelected(this.selectedIds).then((response) => {
        this.parseResponse(response);
      })
        .catch((err) => this.parseCatch(err))
        .finally(() => {
          this.deleteDialog = false;
          this.editDialog = false;
          this.selectedIds = [];
          this.handleFetchImages();
        })
    },
    handleDelete: async function (event, image = null, roomIndex = null) {
      if (this.multiSelect && this.selectedIds.length) {
        return this.deleteDialog = true;
      }
      if (this.selectedIds && !this.multiSelect) {
        this.selectedIds = [];
      }
      switch (this.tabs) {
        case ImageTypes.HOTEL:
        case ImageTypes.PARTNER:
        case ImageTypes.HERO_IMAGE:
          if (image) {
            this.selectedIds.push(image.hotelImageId);
          } else if (this.hotelImages?.length && !this.multiSelect && !this.editDialog) {
            this.hotelImages?.forEach((image) => {
              const id = image.hotelRoomImageId || image.hotelImageId;
              this.selectedIds.push(id);
            })
            // handles the edit dialog delete button
          } else if (this.currentItem?.hotelImageId) {
            this.selectedIds.push(this.currentItem.hotelImageId);
          }
          break;
        case ImageTypes.ROOM:
          // Single Room Image delete
          if (this.currentItem?.hotelRoomImageId && !this.selectedIds) {
            this.selectedIds.push(this.currentItem?.hotelRoomImageId);

            // Delete All
          } else if (roomIndex) {
            this.rooms[roomIndex]?.roomImages?.forEach((image) => {
              this.selectedIds.push(image.hotelRoomImageId);
              return this.deleteDialog = true;
            })
          }
          break;
      }

      if (this.selectedIds?.length) {
        return this.deleteDialog = true;
      }
      return console.error('couldn\'t find any images to delete');
    },
    handleReset: function () {
      this.resetMediaManagerStore();
      this.resetFileUploadStore();
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    handleSearch: async function (params) {
      if (!params || typeof params !== 'object') {
        return;
      }
      this.setLoading(true);
      if (params.hotelUniqueId && params.hotelName) {
        this.setSelectedHotel(params);
        this.hotelSelected = params

        return await this.fetchHotelImages().then(async () => {
          if (this.tabs === ImageTypes.ROOM.toLowerCase()) {
            await this.fetchRooms();
          }
        });
      }
    },
    updateItem: function () {
      this.setLoading(true);
      let data = {
        description: this.currentItem?.newDescription || '',
        url: this.currentItem?.newUrl || '',
        display: this.currentItem?.display || 'YES',
        type: this.currentItem?.type || 'IMAGE',
      };
      const id = this.currentItem?.hotelRoomImageId || this.currentItem?.hotelImageId;
      const endpoint = `hotels/${this.imageType === ImageTypes.ROOM ? 'rooms/' : ''}media/${id}`;
      $extranetApi(endpoint, {
        methode: 'PATCH',
        body: data
      })
        .then((response) => {
          if(response.status === 200) {
            this.setData({
              timeout: 3000,
              content: 'Update Successful',
              color: 'green-accent-2',
              displayComponent: 'snackbar',
            });

            this.snackbar = true;
            this.editDialog = false;
            this.deleteDialog = false;
          }
        }).catch((err) => {
        this.setData({
          timeout: 3000,
          content: err.message || 'An Unknown error occurred, please try again!',
          color: 'red-lighten-2',
          displayComponent: 'snackbar',
        });

        this.snackbar = true;
        this.setLoading(false);
      }).finally(() => this.setLoading(false));
    },
    handleDeselect: function () {
      this.selectedIds = [];
      this.deleteDialog = false;
    },
    handleSelect: async function (id = null) {
      if (!this.multiSelect) {
        return;
      }
      // single image select
      if (typeof id === 'string' || typeof id === 'number') {
        const index = this.selectedIds.indexOf(id);
        if (index !== -1) {
          return this.selectedIds.splice(index, 1);
        } else {
          return this.selectedIds.push(id)
        }
      }
      const items = this.tabs === ImageTypes.HOTEL ? this.hotelImages : this.rooms?.map((room) => {
        return room.roomImages || []
      });
      if (items?.length === this.selectedIds?.length) {
        return this.handleDeselect();
      }
      items?.forEach((item) => {
        const id = item.hotelRoomImageId || item.hotelImageId;
        if (!this.selectedIds.includes(id)) {
          this.selectedIds.push(id);
          this.selectedIds.slice();
        }
      });
    },
    showRoom: function(status) {
      if (!!this.showInactiveRooms) {
        return true;
      } else {
        if (status !== 'active') {
          return false;
        }
      }
      return true;
    },
    ...mapActions(useDisplayComponent, {
      displayData: 'displayData',
      setData: 'setData',
    }),
    ...mapActions(useResponseParser, {
      parseResponse: 'parseResponse',
      parseCatch: 'parseCatch',
    }),
    ...mapActions(useFileUploadStore, {
      setUploadDialog: 'setUploadDialog',
      resetFileUploadStore: 'resetFileUploadStore',
    }),
    ...mapActions(useMediaManagerStore, {
      setSelectedHotel: 'setSelectedHotel',
      setHotelUniqueId: 'setHotelUniqueId',
      setRoomUniqueId: 'setRoomUniqueId',
      setRoomIndex: 'setRoomIndex',
      setImageType: 'setImageType',
      fetchRooms: 'fetchRooms',
      fetchRoomImages: 'fetchRoomImages',
      fetchHotelImages: 'fetchHotelImages',
      setHotelImages: 'setHotelImages',
      setRooms: 'setRooms',
      setHotelItems: 'setHotelItems',
      fetchHotelItems: 'fetchHotelItems',
      resetMediaManagerStore: 'resetMediaManagerStore',
      handleSortHotel: 'handleSortHotel',
      handleSortRoom: 'handleSortRoom',
      setLoading: 'setLoading',
      deleteSelected: 'deleteSelected',
    }),
  },
  watch: {
    excludeInactive() {
      const currentQueryParams = _.cloneDeep(this.$route.query);
      if (!!this.excludeInactive) {
        this.$router.push({ name: 'media-manager', query: { ...currentQueryParams, ...{ excludeInactive: this.excludeInactive }}})
      } else {
        delete currentQueryParams.excludeInactive
        this.$router.push({ name: 'media-manager', query: { ...currentQueryParams } });
      }
    },
    showInactiveRooms() {
      const currentQueryParams = _.cloneDeep(this.$route.query);
      if (!!this.showInactiveRooms) {
        this.$router.push({ name: 'media-manager', query: { ...currentQueryParams, ...{ showInactiveRooms: this.showInactiveRooms }}})
      } else {
        delete currentQueryParams.showInactiveRooms;
        this.$router.push({ name: 'media-manager', query: { ...currentQueryParams } });
      }
    },
    hotelUniqueId() {
      const currentQueryParams = _.cloneDeep(this.$route.query);
      if (this.hotelUniqueId) {
        this.$router.push({ name: 'media-manager', query: { ...currentQueryParams, ...{ hotelUniqueId: this.hotelUniqueId }}})
        this.formHotelUniqueId = this.hotelUniqueId;
      } else {
        delete currentQueryParams.hotelUniqueId;
        this.formHotelUniqueId = '';
        this.$router.push({ name: 'media-manager', query: { ...currentQueryParams } });
      }
    },
    tabs() {
      const currentQueryParams = _.cloneDeep(this.$route.query);
      this.$router.push({ name: 'media-manager', query: { ...currentQueryParams, ...{ tab: this.tabs?.toLowerCase() } }});
    }
  },
  computed: {
    propertyUrl() {
      const domain = isDev ? 'nexttripdev.com' : 'from.funnel.packagebookings.nexttrip.com';
      return `//${domain}/${this.selectedHotel?.hotelDomain}`;
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
    ...mapState(useMediaManagerStore, {
      selectedHotel: (store) => store.selectedHotel,
      hotelUniqueId: (store) => store.hotelUniqueId,
      roomUniqueId: (store) => store.roomUniqueId,
      roomIndex: (store) => store.roomIndex,
      hotelImages: (store) => store.hotelImages,
      rooms: (store) => store.rooms,
      hotelItems: (store) => store.hotelItems,
      loadingHotelItems: (store) => store.loadingHotelItems,
      heroImage: (store) => store.heroImage,
      partnerLogo: (store) => store.partnerLogo,
      heroVideo: (store) => store.heroVideo,
      loading: (store) => store.loading,
    }),
    ...mapState(useFileUploadStore, {
      uploadPercentage: (store) => store.uploadPercentage
    }),
  },
})
</script>

<style scoped>

:deep(.vue-skeletor) {
  /*noinspection CssUnresolvedCustomProperty*/
  background-color:  rgba(var(--v-theme-on-background), var(--v-activated-opacity));
}

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
  width: 100%    !important;
  height: auto   !important;
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
  padding-bottom: calc(var(--video--height) / var(--video--width) * 100%); /* 41.66666667% */
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

.video-container { position: relative; padding-bottom: 56.25%; padding-top: 30px; height: 0; overflow: hidden; }

.video-container iframe, .video-container object, .video-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

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

:deep(.v-progress-linear__background), :deep(.v-progress-linear__indeterminate.short) {
  background-color: #6200ea!important;
  color: #fff!important;
}

.image {
  border: 2px outset transparent;
  transition: .3s all linear;
  cursor: pointer;
}

.image:hover {
  border: 2px outset rgba(255, 255, 255, 0.3);
}
:deep(.vue-skeletor.switch) {
  width: 20px;
  height: 18px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 18px;
  border-radius: 50%;
}

:deep(.vue-skeletor.switch-pill) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 20px;
  border-radius: 10px !important;
  opacity: 0.8;
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
