import * as fs from 'fs'
import { merge } from 'lodash'
import * as process from 'process'
import {$extranetApi} from "@/utils/api.js";

export class MediaManagerApi {
  /**
   * update an image in the hotel's media gallery
   *
   * @param {Object} data The data to send with the request that gets the hotel media gallery
   * @param endpoint
   * @memberOf MediaManagerApi
   */
  update = async (endpoint, data) => {
    const options = {
      method: 'PUT',
      data: JSON.stringify(data),
    }
    return await $extranetApi(endpoint, options)
  }

  /**
   * Get the hotels media gallery
   *
   * @param endpoint
   * @param {Object} data The data to send with the request that gets the hotel media gallery
   * @memberOf MediaManagerApi
   */
  sort = async (endpoint, data) => {
    const url = this.baseUrl + endpoint
    const options = {
      method: 'PUT',
      data: JSON.stringify(data),
    }
    return await $extranetApi(url, options)
  }

  create = async (endpoint, data, options = null) => {
    const url = this.baseUrl + endpoint
    const newOptions = merge(options, {
      method: 'POST',
      data: options?.headers ? data : JSON.stringify(data),
    })
    return await $extranetApi(url, newOptions)
  }

  /**
   * delete multiple selected images in the hotel's media gallery
   *
   * @param {string} endpoint
   * @param {Object} data     The data to send with the request that gets the hotel media gallery
   * @param headers
   * @memberof Core.MediaManager
   */
  delete = async (endpoint, data, headers = null) => {
    const url = this.baseUrl + endpoint + data
    const options = {
      method: 'DELETE',
      headers,
    }

    return await $extranetApi(url, options)
  }

  /**
   * search with a hotel name or hotel unique ID
   * @param endpoint
   * @param data
   * @return {Promise<Response>}
   */
  search = async (endpoint, data) => {
    const options = {
      method: 'POST',
      data: JSON.stringify(data),
    }
    return await $extranetApi(endpoint, options)
  }

  get = async (endpoint, id) => {
    const url = this.baseUrl + endpoint + id
    return await $extranetApi(url, {})
  }
}
