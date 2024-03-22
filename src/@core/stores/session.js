import { defineStore } from 'pinia'
import { SessionApi } from '@core/api/Session.Api'
import { SessionsEnums } from '@core/consts/sessions.enums'
import { isNaN } from 'lodash'
import { useLoginStore } from '@core/stores/login'

interface SessionState {
    expireTime: string;
    domain: string;
    uId: string;
    logoutTimerRefresh: any;
    initiated: boolean;
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    expireTime: '0',
    domain: '',
    uId: '0',
    logoutTimerRefresh: null,
    initiated: false,
  } as SessionState),
  actions: {
   async refreshSession() {
      if (!this.initiated) {
        return false
      }
      const sessionApi = new SessionApi();
      await sessionApi.refreshSession(sessionApi.baseUrl + '/ajaxRedirect.php', {
        action: SessionsEnums.SESSION_AJAX_ACTION,
        handle: SessionsEnums.SESSION_HANDLER,
      })
          .then((data: any) => {
            if (data.sessionRefresh == true) {
              this.uId = data.uId
              this.domain = data.domain
              this.logout(data.timeout)
            }
          });

    },
    logout(mins: number) {
      const logoutTime = new Date()
      logoutTime.setTime(logoutTime.getTime() + (mins * 60 * 1000))
      Object.assign(this.expireTime, logoutTime.toUTCString());
      this.setCookie(SessionsEnums.SESSION_COOKIE_NAME, this.uId)
      this.setCookie(SessionsEnums.SESSION_COOKIE_TIME_NAME, this.expireTime)
      if (this.logoutTimerRefresh != null) {
        clearTimeout(this.logoutTimerRefresh)
      }
      if (this.logoutTimerRefresh != null) {
        clearTimeout(this.logoutTimerRefresh)
      }
      this.logoutTimerRefresh = setTimeout(this.refreshTimer, 1000)
    },
    refreshTimer() {
      let logoutTimeCookie;
      let logoutTime = 0;
      if (this.logoutTimerRefresh != null) {
        clearTimeout(this.logoutTimerRefresh)
      }
      if (this.logoutTimerRefresh != null) {
        clearTimeout(this.logoutTimerRefresh)
      }

      logoutTimeCookie = this.getCookie(SessionsEnums.SESSION_COOKIE_TIME_NAME)

      if (logoutTimeCookie == null) {
        const loginStore= useLoginStore();
        this.logoutTimerRefresh = setTimeout(loginStore.logout, 1000)
      } else {
        logoutTime = Date.parse(logoutTimeCookie)
      }

      // calculates time difference
      const now = Number(new Date());
      let delta = (logoutTime - now) / 1000
      const minutes = Math.floor(delta / 60)
      delta -= minutes * 60
      const seconds = Math.floor(delta % 60)
      const timerLogOut: any = document.getElementById('timerLogOut');
      console.log('HIT DISPLAY TIMER timerLogOut', timerLogOut, SessionsEnums.SESSION_COOKIE_NAME, this.getCookie(SessionsEnums.SESSION_COOKIE_TIME_NAME));
      // displays the time left.
      if (timerLogOut && minutes <= 4 && seconds <= 59) {
        timerLogOut.style.color = '#ff0000'
      }
      if (timerLogOut && seconds >= 10) {
        timerLogOut.value = minutes + ':' + seconds + ' Until Log Out'
      } else if (timerLogOut && !isNaN(minutes) && typeof document.getElementById('timerLogOut') != undefined) {
        timerLogOut.value = minutes + ':0' + seconds + ' Until Log Out'
      }

      // acts if logout is required.
      if (delta == 0) {
        const loginStore= useLoginStore();
        this.logoutTimerRefresh = setTimeout(loginStore.logout, 1000)
      } else {
        this.logoutTimerRefresh = setTimeout(this.refreshTimer, 1000)
      }
    },
    setCookie(cookieName: string, cookieValue: string) {
      document.cookie = cookieName + '=' + encodeURIComponent(cookieValue)
          + '; expires=' + this.expireTime
          + ';domain=.' + this.domain + ';path=/'
    },
    getCookie(name: string) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length)
        }
        if (c.indexOf(nameEQ) == 0) {
          const value = c.substring(nameEQ.length, c.length)
          return decodeURIComponent(value)
        }
      }
      return null
    }
  },
  getters: {
    sessionStatus(state) {
      return state.initiated
    },
    expireTime(state) {
      return state.expireTime
    },
  },
})
