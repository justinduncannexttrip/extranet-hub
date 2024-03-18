import { ofetch } from 'ofetch'

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/' + import.meta.env.VITE_API_VERSION,
  async onRequest({ options }) {
    const accessToken = import.meta.env.VITE_API_KEY
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
})
