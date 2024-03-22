import { defineStore } from "pinia";
import { UsersApi } from "@core/api/Users.Api";
import {$extranetApi} from "@/utils/api.js";

export const useUsersStore = defineStore('config', {
  state: () => ({
    uId: '0',
    userAbilities: [{ action: 'read', subject: 'User' }],
    userLoggedIn: false,
  }),

  // Actions
  actions: {
    async getUserById(userId) {
      return await $extranetApi('/users/' + userId, { method: 'GET' });
    }
  }
})
