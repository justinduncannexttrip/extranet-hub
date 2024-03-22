const emailRouteComponent = () => import('@/pages/apps/email/index.vue')

// 👉 Redirects
export const redirects = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      const loggedIn = !!(useCookie('userData')?.value);
      console.log('HIT REDIRECT INDEX loggedIn   ===========>  ', loggedIn)
      if (loggedIn) {
        return { name: 'home', query: to.query }
      }
      return { name: 'login', query: to.query }
    },
  },
  {
    path: '/pages/user-profile',
    name: 'pages-user-profile',
    redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
  },
]
export const routes = [
  // Email filter
  {
    path: '/apps/email/filter/:filter',
    name: 'apps-email-filter',
    component: emailRouteComponent,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
    },
  },

  // Email label
  {
    path: '/apps/email/label/:label',
    name: 'apps-email-label',
    component: emailRouteComponent,
    meta: {
      // contentClass: 'email-application',
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
    },
  },
  {
    path: '/dashboards/academy',
    name: 'dashboards-academy',
    component: () => import('@/pages/apps/academy/dashboard.vue'),
    meta: {
      navActiveLink: 'dashboards-academy',
      action: 'read',
      subject: 'userPage',
    },
  },
  {
    path: '/media-manager',
    name: 'media-manager',
    component: () => import('@/components/MediaManager/MediaManagerv2.vue'),
    meta: {
      navActiveLink: 'media-manager',
      action: 'read',
      subject: 'managerPage',
    },
  },
]
