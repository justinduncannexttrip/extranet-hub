<template>
  <v-dialog v-model="showDialog" :persistent="persistent">
    <v-card>
      <v-toolbar :color="color">
        <v-toolbar-title>title</v-toolbar-title>
        <v-spacer v-if="!persistent"></v-spacer>
        <v-icon v-if="!persistent">mdi-close-circle</v-icon>
      </v-toolbar>

      <v-card-text>
        {{ content }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn v-if="showCancel" color="grey-lighten-2" variant="tonal">
          {{ cancelText || 'Cancel' }}
        </v-btn>
        <v-btn v-if="showConfirm" color="green-lighten-2" variant="tonal">
          {{ confirmText || 'Confirm' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="snackbar"
    variant="tonal"
    :timeout="timeout"
    :color="color"
    attach="body"
  >
    {{ content }}
  </v-snackbar>
</template>

<script>
  import { defineComponent } from 'vue'
  import { mapActions, mapState } from 'pinia'
  import { useDisplayComponent } from '@core//stores/composables/dataDisplay'
  export default defineComponent({
    name: 'DataDisplay',
    data() {
      return {
        snackbar: false,
        dialog: false,
      }
    },
    computed: {
      ...mapState(useDisplayComponent, {
        content: (store) => store.content,
        color: (store) => store.color,
        showSnackbar: (store) => store.showSnackbar,
        showDialog: (store) => store.showDialog,
        title: (store) => store.title,
        showCancel: (store) => store.showCancel,
        cancelText: (store) => store.cancelText,
        showConfirm: (store) => store.showConfirm,
        confirmText: (store) => store.confirmText,
        persistent: (store) => store.persistent,
        timeout: (store) => store.timeout,
      }),
    },
    watch: {
      showSnackbar() {
        this.snackbar = true
      },
      showDialog() {
        this.dialog = true
      },
    },
    mounted() {
      // nothing
    },
    methods: {
      ...mapActions(useDisplayComponent, {
        closeDisplay: 'closeDisplay',
      }),
    },
  })
</script>

<style scoped></style>
