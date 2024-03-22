import { ofetch } from 'ofetch'

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
});

export const $extranetApi = ofetch.create({
  baseURL: import.meta.env.VITE_EXTRANET_API_BASE_URL + '/' + import.meta.env.VITE_EXTRANET_API_VERSION,
  async onRequest({ options }) {
    const accessToken = import.meta.env.VITE_EXTRANET_API_TOKEN;
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
});
