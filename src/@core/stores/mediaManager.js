import { defineStore } from 'pinia'
import _ from 'lodash'
import { ImageTypes } from '@/components/MediaManager/consts/mediaManager'
import {$extranetApi} from "@/utils/api.js";
import { MediaManagerApi } from '@/components/MediaManager/api/MediaManager.js'
export const useMediaManagerStore = defineStore('mediaManager', {
  state: () => ({
    selectedHotel: null,
    hotelUniqueId: 0,
    roomUniqueId: null,
    roomIndex: null,
    imageType: ImageTypes.HOTEL,
    hotelImages: [],
    hotelItems: [],
    rooms: [],
    loadingHotelItems: false,
    heroImage: [],
    heroVideo: [],
    partnerLogo: [],
    loading: false,
    mediaManagerApi: new MediaManagerApi(),
  }),
  actions: {
    setHotelImages(value) {
      if (value?.length) {
        this.hotelImages = value
        this.setRooms(null)
        this.setRoomUniqueId(null)
      }
    },
    setRooms(value) {
      this.rooms = value
    },
    setHotelItems(value) {
      this.hotelItems = value
    },
    setSelectedHotel(value) {
      this.selectedHotel = value
    },
    setHotelUniqueId(value) {
      console.log('HIT SET HOTEL UNIQUE ID => ', value);
      this.hotelUniqueId = Number(value)
    },
    setRoomUniqueId(value) {
      console.log('HIT SET ROOM UNIQUE ID => ', value)
      this.roomUniqueId = value
    },
    setRoomIndex(value) {
      console.log('HIT SET ROOM INDEX => ', value)
      this.roomIndex = value
    },
    setImageType(value) {
      this.imageType = value
    },
    setLoading(value) {
      this.loading = value
    },
    resetMediaManagerStore() {
      this.$reset()
    },
    async handleSortHotel() {
      this.loading = true
      const endpoint = `/hotels/media/`
      const records = []
      this.hotelImages.forEach((image, rank) => {
        records.push({
          hotelImageId: image.hotelImageId,
          rank: rank + 1,
        })
      })
      const data = {
        records,
      }

      return this.mediaManagerApi
        ?.sort(endpoint, data)
        .finally(() => (this.loading = false))
    },
    async handleSortRoom(roomIndex) {
      this.loading = true
      const endpoint = `/hotels/rooms/media/`
      const records = []
      this.rooms?.[roomIndex]?.roomImages?.forEach((image, rank) => {
        records.push({
          hotelRoomImageId: image.hotelRoomImageId,
          rank: rank + 1,
        })
      })
      const data = {
        records,
      }
      return this.mediaManagerApi
        ?.sort(endpoint, data)
        .finally(() => (this.loading = false))
    },
    async deleteSelected(selectedIds) {
      console.log('HIT DELETE -> SELECTED IDS: ', selectedIds)
      const endpoint = `/hotels/${this.tabs === ImageTypes.ROOM ? 'rooms/' : ''}media/`
      return selectedIds?.map(async (id) => {
        return mediaManagerApi?.delete(endpoint, id)
          .then((response) => response?.data)
      })
    },
    async fetchHotelItems(params = null) {
      if ((!params?.hotelName && !params?.hotelUniqueId && !this.hotelUniqueId) || this.loadingHotelItems) {
        return
      }
      this.loadingHotelItems = true
      const select = [
        'hotelName',
        'hotelUniqueId',
        'hotelExtranetStatus',
        'hotelDomain',
        'hotelId',
        'hotelVendorId',
      ]
      const data = params?.hotelName
        ? { hotelName: `%${params?.hotelName}%`, select }
        : { hotelUniqueId: params?.hotelUniqueId || this.hotelUniqueId, select }

      console.log('ABOUT TO SEND DATA TO THE API => ', data)
      return await $extranetApi('/hotels/search/', {
        method: 'POST',
        body: data,
      })
        .then((data) => {
          if (data?.success && data?.data?.length) {
            this.hotelItems = data?.data || []
            this.loadingHotelItems = false
            console.log('SUCCESS HOTEL ITEMS', this.hotelItems)
            return this.hotelItems
          } else if (!data?.success) {
            this.loadingHotelItems = false
            console.error(data?.message)
            return data?.message
          } else if (!data?.data?.length) {
            this.loadingHotelItems = false
            console.error('NO DATA RETURNED')
            return 'No data returned'
          }
        })
        .catch((err) => {
          this.loadingHotelItems = false
          console.error(err)
          return err
        })
    },
    async fetchRoomImages(roomUniqueId, index) {
      try {
        if (this.rooms[index]?.roomImages || this.rooms[index]?.loading) {
          return
        }
        this.rooms[index].loading = true
        const endpoint = '/hotels/rooms/media/search/'
        if (this.rooms[index] && roomUniqueId) {
          const data = {
            roomUniqueId,
          }
          return await $extranetApi(endpoint, {
            method: 'POST',
            body: data,
          })
            .then((response) => {
              const roomImages = response?.data || []
              this.rooms[index].roomImages = roomImages?.length
                ? _.orderBy(roomImages, ['rank'], ['asc'])
                : roomImages
            })
            .catch((err) => err)
            .finally(() => (this.rooms[index].loading = false))
        } else {
          console.log('HIT FETCH HOTEL ROOM IMAGES ELSE: ')
          this.rooms.forEach((room, index) => {
            const roomUniqueId = room.roomUniqueId
            const data = {
              roomUniqueId,
            }

            this.mediaManagerApi.search(endpoint, data).then((response) => {
              this.rooms[index].roomImages = response?.data || []
            })
          })
        }
      } catch (e) {
        console.error(e.message)
      }
    },
    async fetchRooms() {
      this.loading = true
      console.log('HIT FETCH ROOMS', this.loading)
      if (
        !this.selectedHotel ||
        this.rooms[0]?.hotelUniqueId === this.hotelUniqueId
      ) {
        return (this.loading = false)
      }
      if (typeof this.selectedHotel !== 'object') {
        await $extranetApi('/hotels/' + this.hotelUniqueId, {
          method: 'GET',
        })
          .then(async (response) => {
            console.log('HIT FETCH ROOMS RESPONSE', response);
            if (response.success && response.data.hotelUniqueId) {
              const data = {
                hotelId: this.selectedHotel.hotelId,
                hotelVendorId: this.selectedHotel.hotelVendorId,
                pageSize: 200,
                page: 0,
                select: [
                  'hotelUniqueId',
                  'roomUniqueId',
                  'roomName',
                  'status',
                  'hotelId',
                  'hotelVendorId',
                ],
              }
              const endpoint = '/hotels/rooms/search/'
              return await $extranetApi(endpoint, {
                method: 'GET',
                body: data,
              })
                .then((response) => {
                  console.log('HIT FETCH ROOMS RESPONSE', response)
                  this.setRooms(response?.data || [])
                  return response
                })
                .finally(() => (this.loading = false))
            }
          })
          .catch((err) => {
            console.error(err)
        })
      }
    },
    async fetchHotelImages() {
      console.log('>>>>>>>>>>>>>>>>>> FETCH HOTEL IMAGES');
      if (this.selectedHotel?.hotelUniqueId) {
        this.loading = true
        this.hotelUniqueId = this.selectedHotel.hotelUniqueId
        const data = {
          hotelUniqueId: this.hotelUniqueId,
          pageSize: 200,
          page: 0,
        }
        const endpoint = '/hotels/media/search/'
        const response = await $extranetApi(endpoint, {
          method: 'POST',
          body: data
        })
        let hotelImages = []
        console.log('>>>>>>>>>>>>>>>>>>>>> FETCH HOTEL IMAGES RESPONSE', response)
        if (response.data?.length) {
          hotelImages = _.orderBy(response?.data, ['rank'], ['asc'])
          this.heroImage = []
          this.heroVideo = []
          this.partnerLogo = []
          hotelImages.forEach((image, index) => {
            switch (image.type) {
              case 'PANORAMIC':
                this.heroImage.concat(image)
                hotelImages.splice(index, 1)
                break
              case 'PANVIDEO':
                this.heroVideo.concat(image)
                hotelImages.splice(index, 1)
                break
              case 'PARTNER':
                this.partnerLogo.concat(image)
                hotelImages.splice(index, 1)
                break
            }
          })
          console.log('>>>>>>>>>>>>>>>>>>>>> SETTING HOTEL IMAGES', hotelImages);
          this.hotelImages = hotelImages;
        }
        this.loading = false

        return response
      }
    },
  },
  getters: {
    isLoading() {
      return this.loading
    },
  },
})
