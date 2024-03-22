import { defineStore } from 'pinia'
import { isObject } from 'lodash'
import { useDisplayComponent } from './dataDisplay'

const colorMap = {
  success: 'green',
  info: 'primary',
  warning: 'yellow',
  error: 'red',
}

export const useResponseParser = defineStore('responseParser', {
  state: () => ({
    data: null,
  }),
  /**
   * @param {Object} response
   * @param {Object} options
   * @example
   *   const options = {
   *   		successMessage: 'This is a success message',	[optional] {string}
   *   		errorMessage: 'This is a fail message',		    [optional] {string}
   *   		severity: 'success', 							            [optional] {string - "success" | "warning" | "error" | "info" | any color value}
   *   		timeout: 3000,                    		        [optional] {number}
   *   }
   */
  actions: {
    parseResponse(response, {successMessage, errorMessage, timeout = 3000 }) {
      try {
        const valid = false
        const store = useDisplayComponent()
        let content
        let severity
        if (response?.data?.success) {
          content = successMessage || 'Success'
        } else if (!response?.data?.success && response?.data?.data) {
          if (errorMessage?.length) {
            content = errorMessage
            severity = severity || 'error'
          } else {
            // Handle DB error formats with object like errors
            if (
              isObject(response?.data?.data) &&
              Object.keys(response?.data?.data)?.length
            ) {
              content = Object.keys(response?.data?.data)?.map((key) => {
                if (response?.data?.data?.[key]?.length) {
                  return response?.data?.data[key]?.map((errorData) => {
                    return `The property ${errorData?.key} ${errorData?.message} ${errorData?.keyword}`
                  })
                } else {
                  return response?.data?.data[key]?.message
                }
              })
            } else if (response?.data.data?.length) {
              content = response?.data?.data?.[0]?.message
            }

            severity = 'error'
          }
        } else if (response?.data?.data?.error) {
          content = response?.data?.data?.error
          severity = 'error'
        } else {
          content = 'An Unknown error occurred'
          severity = 'error'
        }
        store.setData({
          timeout,
          content,
          color:
            severity && severity in colorMap ? colorMap[severity] : severity || 'success',
          displayComponent: 'snackbar',
        })

        store.displayData()
        return valid
      } catch (err) {
        const store = useDisplayComponent()
        console.error(err)
        store.setData({
          content: err.message || 'An unknown Error occurred',
          color: colorMap['error'],
          displayComponent: 'snackbar',
          timeout: 5000,
        })

        store.displayData()
      }
    },
    parseCatch(err) {
      const store = useDisplayComponent()
      const content = err.message || 'An unknown error occurred'
      store.setData({
        content,
        color: colorMap['error'],
        displayComponent: 'snackbar',
        timeout: 5000,
      })

      store.displayData()
      console.error(content)
    },
  },
})
