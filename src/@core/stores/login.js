import {defineStore} from 'pinia'
import {router} from "@/plugins/1.router";
import {$extranetApi} from "@/utils/api.js";

export const useLoginStore = defineStore('login', {
  state: () => ({
    loading: false,
    userLoggedIn: false,
    userAbilityRules: [{actions: 'read', subject: 'all'}],
    userData: {
      userId: 0,
      userFirstName: '',
      userLastName: '',
      status: false,
      userTypeId: '',
      userEmail: '',
      imageLocation: '',
      timeout: 0,
    },
    error: '',
    returnUrl: '',
  }),
  actions: {
    async logout() {
      this.userLoggedIn = false;
      this.userData = {
        userId: 0,
        userFirstName: '',
        userLastName: '',
        status: false,
        userTypeId: '',
        userEmail: '',
        imageLocation: '',
        timeout: 0,
      };
      await router.push({name: 'Login'})
    },
    async authorize(username, password) {
      this.error = '';
      this.loading = true;
      return await $extranetApi('/login', {
        method: 'POST',
        body: {
          username,
          password,
        }
      });
    },
    async checkLoggedInUser() {
      const userObj = localStorage.getItem('userData') || '';
      try {
        if (userObj) {
          let userData = JSON.parse(userObj);
          if (userData.userId && userData.timeout) {
            // send api call to check last logged in time and compare with current time and user timeout;
            await $extranetApi('/users/' + userData.userId, {method: 'GET'})
              .then((data) => {
                if (data.success && data?.data?.lastLoginDateTime) {
                  const lastLoginDate = new Date(data?.data?.lastLoginDateTime);
                  const now = new Date(); // Current time
                  // Add the timeout to the dateFromISOString
                  const expiryDate = new Date(lastLoginDate.getTime() + userData.timeout * 60000);
                  // @TODO - figure out why the api is inserting the wrong dateTime into the database
                  if (now < expiryDate) {
                    this.userData = {
                      userId: userData.userId,
                      userFirstName: userData.userFirstName,
                      userLastName: userData.userLastName,
                      status: true,
                      userTypeId: userData.userTypeId,
                      userEmail: userData.userEmail,
                      imageLocation: userData.imageLocation,
                      timeout: userData.timeout,
                    }
                    this.setUserAbilities()
                  }
                }
              })
              .catch((e) => {
                console.log('Error checking user login status', e);
              });
          }
        }
      } catch (e) {
        this.userLoggedIn = false;
        this.resetUserData();
        this.error = e.message || e || 'An error occurred while trying to login';
      }
    },
    resetUserData() {
      this.userData = {
        userId: 0,
        userFirstName: '',
        userLastName: '',
        status: false,
        userTypeId: '',
        userEmail: '',
        imageLocation: '',
        timeout: 0,
      }
    }
  },
})
