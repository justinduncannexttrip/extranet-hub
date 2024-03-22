import { defineStore } from 'pinia'
import { ImageTypes, FileSizes } from '@/components/MediaManager/consts/mediaManager'
import { MediaManagerApi } from '@/components//MediaManager/api/MediaManager'
import { useMediaManagerStore } from './mediaManager'
import { useDisplayComponent } from '@core/stores/composables/dataDisplay'
import { useResponseParser } from '@core/stores/composables/responseParser'

const mediaManagerApi = new MediaManagerApi()

export const useFileUploadStore = defineStore('fileUpload', {
  state: () => ({
    uploadStatusNumber: 5,
    uploadPercentage: 0,
    uploadDialog: false,
    uploading: false,
    files: [],
    uploadUrlDialog: false,
    urls: [
      {
        newImageUrl: '',
        newImageDescription: '',
      },
    ],
    requests: [],
  }),
  actions: {
    resetFileUploadStore() {
      this.$reset()
    },
    setUploadPercentage(value) {
      this.uploadPercentage = value
    },
    setUploadDialog(value) {
      this.uploadDialog = value
    },
    setUploadUrlDialog(value) {
      this.uploadUrlDialog = value
    },
    setUploading(value) {
      this.uploading = value
    },
    addUrl(value) {
      this.urls.push(value)
    },
    removeUrl() {
      this.urls.pop()
    },
    setUrls(value) {
      this.urls = value
    },
    setFiles(value) {
      this.files = []
    },
    async uploadUrls() {
      const mediaManagerStore = useMediaManagerStore()
      this.setUploading(true)
      for (let i = 0; i < this.urls?.length; i++) {
        const endpoint = `/hotels/${
          mediaManagerStore.imageType === ImageTypes.ROOM && 'rooms/'
        }media/create`
        const data = {
          url: this.urls[i].newImageUrl,
          description: this.urls[i].newImageDescription,
          hotelUniqueId: mediaManagerStore.hotelUniqueId,
          type: mediaManagerStore?.imageType,
        }
        if (mediaManagerStore.imageType === ImageTypes.ROOM) {
          data.roomUniqueId = mediaManagerStore.roomUniqueId
        }

        await mediaManagerApi
          .create(endpoint, data)
          .then((response) => response)
      }
    },
    async uploadFiles() {
      const mediaManagerStore = useMediaManagerStore()
      const displayComponent = useDisplayComponent()
      const responseParser = useResponseParser()
      try {
        const imageType = mediaManagerStore.imageType
        this.setUploading(true)
        const totalFiles = this.files.length
        const endpoint = `/hotels/${
          imageType === ImageTypes.ROOM ? 'rooms/' : ''
        }media`
        const options = {
          headers: {
            'content-type': 'multipart/form-data',
          },
          async: false,
          onUploadProgress: (progressEvent) => {
            this.uploadPercentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            )
          },
        }
        const id =
          imageType === ImageTypes.ROOM
            ? mediaManagerStore.roomUniqueId
            : mediaManagerStore.hotelUniqueId
        let size = 0

        for (let i = 0; i < this.files.length; i++) {
          size += this.files[i].size
        }

        if (size > FileSizes.MAX && totalFiles === 1) {
          this.setUploading(false)
          displayComponent.setData({
            title: 'Image Size Error',
            content:
              'The file you are uploading is larger than the allotted upload limit!',
            showCancel: true,
            cancelText: 'Close',
            color: 'red-lighten-2',
          })
          return displayComponent.displayData()
        } else {
          this.uploadStatusNumber = 1
          for (let i = 0; i < this.files.length; i++) {
            const file = this.files[i]
            const formData = new FormData()
            const size = file.size

            if (size > FileSizes.MAX) {
              alert(
                'One or more files exceeds the limit of 30Mb, these images will be skipped during the upload process.',
              )
            } else {
              formData.append('images', file)
              if (imageType === ImageTypes.ROOM) {
                formData.append(
                  'hotelUniqueId',
                  mediaManagerStore.hotelUniqueId,
                )
                formData.append('roomUniqueId', id)
              } else {
                formData.append('hotelUniqueId', id)
                formData.append('type', this.imageDbType)
              }

              const response = await mediaManagerApi.create(
                endpoint,
                formData,
                options,
              )
              if (response?.data?.success) {
                this.uploadStatusNumber++
              }
              const item = response?.data?.data?.[0]
              if (item?.length && file?.description) {
                const data = {
                  description: file?.description,
                }
                const imageId =
                  imageType === ImageTypes.ROOM
                    ? item?.hotelRoomImageId
                    : item?.hotelImageId
                const updateEndpoint = `${endpoint}/${imageId}`

                await mediaManagerApi.update(updateEndpoint, data)
              }
              if (response?.data?.success && i + 1 === this.files.length) {
                return response
              }

              if (!response?.data?.success) {
                this.files = this.files.slice(i)
                this.setUploading(false)
                responseParser.parseResponse(response, {})
                break
              }
            }
          }
        }
      } catch (err) {
        console.error(err)
        responseParser.parseCatch(err)
        this.setUploading(false)
        return err
      }
    },
  },
  getters: {
    imageDbType() {
      const mediaManagerStore = useMediaManagerStore()
      const imageType = mediaManagerStore.imageType
      switch (imageType) {
        case ImageTypes.HOTEL:
          return 'IMAGE'
        case ImageTypes.HERO_IMAGE:
          return 'PANORAMIC'
        case ImageTypes.HERO_VIDEO:
          return 'PANVIDEO'
        case ImageTypes.PARTNER:
          return 'PARTNER'
        default:
          return null
      }
    },
  },
})
