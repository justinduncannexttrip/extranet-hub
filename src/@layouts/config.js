import { breakpointsVuetify } from '@vueuse/core'
import { AppContentLayoutNav, ContentWidth, FooterType, HorizontalNavType, NavbarType } from '@layouts/enums'
import logoFullDark from '@images/logo_full_dark.png'
import logoFullLight from '@images/logo_full_light.png'
import logoCompactDark from '@images/logo_compact_dark.png'
import logoCompactLight from '@images/logo_compact_light.png'
import contrastLogo from '@images/compact_logo_dark_contrast.png'

export const layoutConfig = {
  app: {
    title: 'my-layout',
    logoFullDark: h('img', { src: logoFullDark, alt: 'Nexttrip.com Nextranet' }),
    logoFullLight: h('img', { src: logoFullLight, alt: 'Nexttrip.com Nextranet' }),
    logoCompactDark: h('img', { src: logoCompactDark, alt: 'Nexttrip.com Nextranet' }),
    logoCompactLight: h('img', { src: logoCompactLight, alt: 'Nexttrip.com Nextranet' }),
    contrastLogo: h('img', { src: contrastLogo, alt: 'Nexttrip.com Nextranet' }),
    contentWidth: ContentWidth.Boxed,
    contentLayoutNav: AppContentLayoutNav.Vertical,
    overlayNavFromBreakpoint: breakpointsVuetify.md,

    // isRTL: false,
    i18n: {
      enable: true,
    },
    iconRenderer: h('div'),
  },
  navbar: {
    type: NavbarType.Sticky,
    navbarBlur: true,
  },
  footer: {
    type: FooterType.Static,
  },
  verticalNav: {
    isVerticalNavCollapsed: false,
    defaultNavItemIconProps: { icon: 'ri-circle-line' },
  },
  horizontalNav: {
    type: HorizontalNavType.Sticky,
    transition: 'none',
    popoverOffset: 0,
  },
  icons: {
    chevronDown: { icon: 'ri-arrow-down-line' },
    chevronRight: { icon: 'ri-arrow-right-line' },
    close: { icon: 'ri-close-line' },
    verticalNavPinned: { icon: 'ri-record-circle-line' },
    verticalNavUnPinned: { icon: 'ri-circle-line' },
    sectionTitlePlaceholder: { icon: 'ri-subtract-line' },
  },
}
