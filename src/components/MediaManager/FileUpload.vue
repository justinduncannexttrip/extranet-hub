<template>
  <div id="file-upload">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card class="mx-auto">
        <v-toolbar color="primary">
          <v-toolbar-title
            >Upload
            {{ imageType.charAt(0).toUpperCase() + imageType.slice(1) }}
            {{
              imageType !== ImageTypes.HERO_IMAGE ? 'Files' : "URL's"
            }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text height="100" class="pa-3">
          <div id="file-drag-drop">
            <form ref="fileform" class="upload-form">
              <div class="drag-drop-wrapper text-center">
                <div class="mt-12">
                  <v-icon>mdi-cloud-upload-outline</v-icon>
                </div>
                <div class="drop-files mt-3">
                  Drag and Drop Files or Click Here
                </div>
              </div>
              <input
                id="multipleUpload"
                type="file"
                multiple
                @input="handleDropOrUpload"
              />
            </form>
            <v-col cols="12" class="mt-2 text-center">
              <p>Image size limit is 30MB. Images over limit may not upload.</p>
              <v-btn color="primary" @click="setUploadUrlDialog(true)">
                ADD URL(S)
              </v-btn>
            </v-col>
          </div>
          <v-divider v-if="files.length" class="mt-5" />
          <v-container v-if="files.length">
            <v-row no-gutters>
              <v-col cols="12">
                <v-card-title>Preview</v-card-title>
                <v-row no-gutters>
                  <v-col
                    v-for="(file, key) in files"
                    :key="key"
                    cols="12"
                    sm="6"
                    md="4"
                    class="pa-2"
                  >
                    <v-card class="file-listing">
                      <img
                        :ref="'preview' + parseInt(key)"
                        class="preview"
                        alt="image preview"
                        src=""
                      />
                      <v-card-subtitle>{{ file.name }}</v-card-subtitle>
                      <v-textarea
                        v-model="file.description"
                        outlined
                        label="Description"
                      >
                      </v-textarea>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions v-if="files.length" class="px-10">
          <v-spacer></v-spacer>

          <v-btn
            color="red-lighten-2"
            variant="tonal"
            class="mr-4"
            @click="removeFiles"
            >Clear Files</v-btn
          >

          <v-btn color="teal-lighten-3" variant="tonal" @click="submitFiles"
            >Upload</v-btn
          >
        </v-card-actions>
      </v-card>

      <!-- Uploading Dialog -->
      <v-dialog v-model="uploading" width="420" persistent no-click-animation>
        <v-card>
          <v-card-text>
            <v-card-title v-if="files?.length"
              >Uploading
              {{ uploadStatusNumber + ' of ' + files?.length }} File{{
                files?.length > 1 ? 's' : ''
              }}</v-card-title
            >
            <v-card-title v-else>Finishing Up...</v-card-title>
            <v-progress-linear
              v-if="uploadPercentage > 0"
              v-model="uploadPercentage"
              max="100"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-dialog>

    <!-- UPLOAD URL DIALOG -->
    <v-dialog v-model="uploadUrlDialog" :max-width="500" scrollable>
      <v-card class="mx-auto">
        <v-card-title class="headline green lighten-2" primary-title
          >Upload URL</v-card-title
        >
        <v-card-text class="pt-5" height="800">
          <div v-for="(url, i) in urls" :key="`section-${i}`">
            <v-spacer v-if="i !== 0" :key="`spacer-${i}`"></v-spacer>
            <v-form :key="`form-${i}`" ref="urlForm" v-model="valid">
              <v-text-field
                v-model="url.newImageUrl"
                label="URL"
                required
                :rules="requiredRules"
                variant="underlined"
              >
              </v-text-field>
              <v-textarea
                v-model="url.newImageDescription"
                label="Description"
                variant="underlined"
              >
              </v-textarea>
              <v-btn
                v-if="urls.length > 1 && i !== 0"
                color="primary"
                class="red lighten-2 add-url"
                @click="removeUrl"
              >
                Remove
              </v-btn>
              <v-btn
                v-if="
                  imageType !== ImageTypes.HERO_IMAGE &&
                  imageType !== ImageTypes.HERO_VIDEO
                "
                class="green lighten-2 remove-url"
                @click="addUrl"
              >
                Add More
              </v-btn>
            </v-form>
          </div>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red-darken-2" @click="closeUploadUrlDialog">
              Cancel
            </v-btn>
            <v-btn color="green-darken-2" @click="uploadUrls"> Upload </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import { defineComponent } from 'vue'
  import { MediaManagerApi } from './api/MediaManager'
  import { mapActions, mapState } from 'pinia'
  import { useMediaManagerStore } from '@core/stores/mediaManager'
  import { useFileUploadStore } from '@core/stores/fileUpload'
  import { ImageTypes } from './consts/mediaManager'
  import { useResponseParser } from '@core/stores/composables/responseParser'

  export default defineComponent({
    name: 'FileUpload',
    data: function () {
      return {
        dragAndDropCapable: false,
        requiredRules: [(v) => !!v || 'this is required'],
        valid: true,
        uploadStatusNumber: 1,
        mediaManagerApi: new MediaManagerApi(),
      }
    },
    computed: {
      ImageTypes() {
        return ImageTypes
      },
      totalFiles() {
        return this.files?.length
      },
      ...mapState(useFileUploadStore, {
        uploadPercentage: (store) => store.uploadPercentage,
        dialog: (store) => store.uploadDialog,
        uploading: (store) => store.uploading,
        uploadUrlDialog: (store) => store.uploadUrlDialog,
        files: (store) => store.files,
        urls: (store) => store.urls,
        requests: (store) => store.requests,
      }),
      ...mapState(useMediaManagerStore, {
        hotelUniqueId: (store) => store.hotelUniqueId,
        roomUniqueId: (store) => store.roomUniqueId,
        imageType: (store) => store.imageType,
      }),
    },
    mounted() {
      this.dragAndDropCapable = this.determineDragAndDropCapable()

      if (
        this.dragAndDropCapable &&
        this.imageType !== ImageTypes.HERO_VIDEO &&
        this.$refs?.fileform
      ) {
        ;[
          'drag',
          'dragstart',
          'dragend',
          'dragover',
          'dragenter',
          'dragleave',
          'drop',
        ].forEach((evt) => {
          this.$refs.fileform?.addEventListener(
            evt,
            (e) => {
              e.preventDefault()
              e.stopPropagation()
            },
            false,
          )
        })

        /*
        Add an event listener for drop to the form
      */
        this.$refs.fileform.addEventListener('drop', (e) => {
          this.handleDropOrUpload(e)
        })
      }
    },
    methods: {
      handleDropOrUpload: function (e) {
        let target = e.dataTransfer ? e.dataTransfer : e.target
        for (let i = 0; i < target.files.length; i++) {
          this.files.concat(target.files[i])
        }
        this.getImagePreviews()
      },
      closeDialog: function () {
        this.setUploadDialog(false)
      },
      determineDragAndDropCapable: function () {
        const div = document.createElement('div')
        return (
          ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
          'FormData' in window &&
          'FileReader' in window
        )
      },
      getImagePreviews: function () {
        for (let i = 0; i < this.files.length; i++) {
          if (/\.(jpe?g|png|gif)$/i.test(this.files[i].name)) {
            let reader = new FileReader()
            reader.addEventListener(
              'load',
              function () {
                this.$refs['preview' + i][0].src = reader.result
              }.bind(this),
              false,
            )
            reader.readAsDataURL(this.files[i])
          } else {
            this.$nextTick(function () {
              this.$refs['preview' + i][0].src =
                'https://cdn.onlinewebfonts.com/svg/img_60204.png'
            })
          }
        }
      },
      removeFiles: function () {
        this.setFiles([])
        if (document.getElementById('multipleUpload')?.length) {
          document.getElementById('multipleUpload').value = ''
        }
      },
      submitFiles: async function () {
        await this.uploadFiles()
          .then((response) => {
            this.parseResponse(response, {})
          })
          .catch((err) => {
            this.parseCatch(err)
          })
          .finally(() => {
            const mediaManagerStore = useMediaManagerStore()
            this.setUploading(false)
            this.setUploadDialog(false)
            this.resetFileUploadStore()
            mediaManagerStore.imageType === ImageTypes.ROOM
              ? mediaManagerStore.fetchRoomImages(
                  mediaManagerStore.roomUniqueId,
                  mediaManagerStore.roomIndex,
                )
              : mediaManagerStore.fetchHotelImages()
          })
      },
      closeUploadUrlDialog: function () {
        this.setUploadUrlDialog(false)
        this.setUrls({
          newImageUrl: '',
          newImageDescription: '',
        })
      },
      ...mapActions(useResponseParser, {
        parseResponse: 'parseResponse',
        parseCatch: 'parseCatch',
      }),
      ...mapActions(useFileUploadStore, {
        setUploadPercentage: 'setUploadPercentage',
        setUploadDialog: 'setUploadDialog',
        setUploading: 'setUploading',
        setUploadUrlDialog: 'setUploadUrlDialog',
        setFiles: 'setFiles',
        uploadFiles: 'uploadFiles',
        uploadUrls: 'uploadUrls',
        addUrl: 'addUrl',
        removeUrl: 'removeUrl',
        setUrls: 'setUrls',
        resetFileUploadStore: 'resetFileUploadStore',
      }),
    },
  })
</script>

<style>
  .v-dialog .upload-form {
    display: block;
    height: 400px;
    width: 80%;
    margin: auto;
    margin-top: 40px;
    text-align: center;
    border-radius: 4px;
    border: 4px dashed #acacac;
    position: relative;
  }

  .v-dialog .upload-form .mdi-cloud-upload-outline {
    font-size: 70px;
    color: #acacac;
  }

  .v-dialog form .drop-files {
    font-size: 20px;
    color: #acacac;
  }

  div.file-listing {
    width: 400px;
    margin: auto;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  div.file-listing img {
    height: 100px;
  }

  div.remove-container {
    text-align: center;
  }

  div.remove-container a {
    color: red;
    cursor: pointer;
  }

  .v-dialog .upload-form input {
    position: absolute;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    outline: none;
    opacity: 0;
    top: 0;
    left: 0;
    cursor: pointer;
  }
</style>
