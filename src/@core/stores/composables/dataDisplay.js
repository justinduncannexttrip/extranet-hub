import { defineStore } from 'pinia'

export const useDisplayComponent = defineStore('displayComponent', {
  state: () => ({
    content: null,
    color: 'primary',
    timeout: 3000,
    showSnackbar: false,
    showDialog: false,
    title: '',
    showCancel: false,
    cancelText: '',
    showConfirm: false,
    confirmText: '',
    persistent: false,
    displayComponent: 'dialog',
  }),
  /**
   * @param {Object} response
   * @param {Object} options
   * @example
   *   const data = {
   *   		message: 'This is a message',			[required] {any}
   *   		severity: 'success', 							[optional] {string - "success" | "warning" | "error" | "info" | any color value}
   *   		timeout: 3000,                    [optional] {number} - snackbar only
   *   		displayComponent: 'snackbar'			[optional] {"snackbar" | "dialog"}
   *   }
   */
  actions: {
    setDisplayComponent() {
      this.showDialog = this.displayComponent === 'dialog'
      this.showSnackbar = this.displayComponent === 'snackbar'
    },
    closeDisplay() {
      // this.showDialog = !(this.displayComponent === 'dialog');
      // this.showSnackbar = !(this.displayComponent === 'snackbar');
    },
    displayData() {
      this.setDisplayComponent()
    },
    setData(data) {
      return Object.assign(this, data)
    },
  },
})
