<script setup>
import { VForm } from 'vuetify/components/VForm'
import { themeConfig } from '@themeConfig'
import tree1 from '@images/misc/tree1.png'
import tree3 from '@images/misc/tree3.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { useLoginStore } from "@core/stores/login.js";
import miscMaskDark from '@images/misc/misc-mask-dark.png'
import miscMaskLight from '@images/misc/misc-mask-light.png'
import setUserAbilities from "@/plugins/casl/userAbilities";


const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
const logo = useGenerateImageVariant(themeConfig.app.logoCompactDark, themeConfig.app.contrastLogo);

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAbility()
const error = ref();

const errors = ref({
  email: undefined,
  password: undefined,
})

const refVForm = ref()

const credentials = ref({
  username: 'justin.duncan',
  password: '123456',
})
const loggingIn = ref(false);
const loginStore = useLoginStore()

const rememberMe = ref(false)

const login = async () => {
  try {
    const response = await loginStore.authorize(credentials.value.username, credentials.value.password)
    if (response?.success && response?.data?.user) {
      let userData = response?.data?.user;
      userData = {
        userId: userData.userId,
        userFirstName: userData.userFirstName,
        userLastName: userData.userLastName,
        status: true,
        userTypeId: userData.userTypeId,
        userEmail: userData.userEmail,
        imageLocation: userData.imageLocation,
        timeout: userData.timeout,
      }
      const userAbilityRules = await setUserAbilities(userData.userTypeId);
      console.log('HIT API SET USER ABILITY RULES', userAbilityRules);
      useCookie('userAbilityRules').value = userAbilityRules
      ability.update(userAbilityRules)
      useCookie('userData').value = userData
    } else if (!response.success && response?.data?.error) {
      console.log('Error logging in', response.data.message);
      this.error = response.data?.error;
    } else {
      console.log('Error logging in', 'An error occurred while trying to login');
      this.error = 'An error occurred while trying to login';
    }
    // await nextTick(() => {
    //   router.replace(route.query.to ? String(route.query.to) : '/')
    // })
  } catch (err) {
    loggingIn.value = false;
    console.error(err)
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login()
  })
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-sm-4 pa-md-7 pa-0"
      max-width="448"
    >
      <VCardText>
        <div class="auth-logo d-flex align-center gap-x-3 justify-center mb-6">
          <VNodeRenderer :nodes="logo" />

          <h1 class="auth-title">
            {{ themeConfig.app.title }}
          </h1>
        </div>
        <p :class="loginStore.error ? 'mb-1' : ''" class="mt-0 text-center">
          Please sign-in to your account
        </p>
      </VCardText>


      <VCardText>
        <VForm
          ref="refVForm"
          @submit.prevent="onSubmit"
          id="login-form"
        >
          <VRow v-if="loginStore.error">
            <!-- error alert -->
            <VCol cols="12 pt-0 pb-1 mb-1">
              <VAlert
                variant="tonal"
                color="error"
                density="compact"
              >
                {{ loginStore.error }}
              </VAlert>
            </VCol>
          </VRow>

          <VRow>
            <!-- username -->
            <VCol cols="12">
              <VTextField
                v-model="credentials.username"
                autofocus
                label="Username"
                type="text"
                placeholder="next.trip"
                :rules="[requiredValidator]"
                :error-messages="errors.email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="credentials.password"
                label="Password"
                placeholder="············"
                :rules="[requiredValidator]"
                :type="isPasswordVisible ? 'text' : 'password'"
                :error-messages="errors.password"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

                <div class="d-flex align-center flex-wrap justify-space-between my-5 gap-2">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <RouterLink
                    class="text-primary"
                    :to="{ name: 'forgot-password' }"
                  >
                    Forgot Password?
                  </RouterLink>
                </div>

              <VBtn
                block
                type="submit"
                :loading="loggingIn.value"
              >
                Login
              </VBtn>
            </VCol>

          </VRow>
        </VForm>
      </VCardText>
    </VCard>
    <div class="d-flex gap-x-2 auth-footer-start-tree">
      <img
        class="d-none d-md-block"
        :src="tree3"
        :height="120"
        :width="67"
        alt="">
      <img
        class="d-none d-md-block align-self-end"
        :src="tree3"
        :height="70"
        :width="40"
        alt="">
    </div>

    <img
      :src="tree1"
      class="auth-footer-end-tree d-none d-md-block"
      :width="97"
      :height="210"
      alt="">

    <!-- bg img -->
    <img
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
      height="172"
      alt="">
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
