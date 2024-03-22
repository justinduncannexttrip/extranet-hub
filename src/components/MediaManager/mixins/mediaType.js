/**
 * This mixin provides the properties and functionality needed to get the video type
 */
export const mediaType = {
  mounted() {},
  data() {
    return {}
  },
  methods: {
    videoType: function (url) {
      if (!url) {
        return false
      }
      let str = ''
      switch (true) {
        case /^(\/\/|http:\/\/|https:\/\/)(vimeo\.com|player\.vimeo\.com)\/([\w/]+)([?].*)?/.test(
          url,
        ):
          str = 'vimeo'
          break
        case /^(\/\/|http:\/\/|https:\/\/)(youtu\.be|www\.youtube\.com)\/([\w/]+)([?].*)?/.test(
          url,
        ):
          str = 'youtube'
          break
        case /\.(mov|mpg|mpeg|avi|mp4)$/.test(url):
          str = 'video'
          break
      }
      return str
    },
    imageType: function (url) {
      if (!url) {
        return false
      }
      let str = ''
      switch (true) {
        case /\.(jpeg|jpg)$/.test(url.toLowerCase()):
          str = 'image/jpeg'
          break
        case /\.(png)$/.test(url.toLowerCase()):
          str = 'image/png'
          break
      }
      return str
    },
    getYoutubeSrc: function (url) {
      if (typeof url === 'undefined') {
        return false
      }
      return (
        url +
        '?mute=1&autoplay=1&controls=0&disablekb=1&loop=1&playlist=' +
        this.getYoutubeId(url) +
        '&modestbranding=1'
      )
    },
    getYoutubeId: function (url) {
      if (!url) {
        return false
      }
      return url?.split('/embed/')?.[1]
        ? url?.split('/embed/')?.[1]
        : url?.split('/watch?v=')?.[1]
    },
    isImage: function (url) {
      if (!url) {
        return false
      }
      return /\.(jpeg|jpg|png)$/.test(url?.toLowerCase())
    },
    isVideo: function (url) {
      if (!url) {
        return false
      }
      let isVideo = false
      const str = url.toLowerCase()
      switch (true) {
        case /^(\/\/|http:\/\/|https:\/\/)(vimeo\.com|player\.vimeo\.com)\/([\w/]+)([?].*)?/.test(
          str,
        ):
        case /^(\/\/|http:\/\/|https:\/\/)(youtu\.be|www\.youtube\.com)\/([\w/]+)([?].*)?/.test(
          str,
        ):
        case /\.(mov|mpg|mpeg|avi|mp4)$/.test(str):
          isVideo = true
          break
      }
      return isVideo
    },
  },
}
