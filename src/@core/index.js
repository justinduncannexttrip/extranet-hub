export const defineThemeConfig = (userConfig) => {
  return {
    themeConfig: userConfig,
    layoutConfig: {
      app: {
        title: userConfig.app.title,
        logoFullDark: userConfig.app.logoFullDark,
        logoFullLight:userConfig.app.logoFullLight,
        logoCompactDark: userConfig.app.logoCompactDark,
        logoCompactLight: userConfig.app.logoCompactLight,
        contrastLogo: userConfig.app.contrastLogo,
        contentWidth: userConfig.app.contentWidth,
        contentLayoutNav: userConfig.app.contentLayoutNav,
        overlayNavFromBreakpoint: userConfig.app.overlayNavFromBreakpoint,
        i18n: {
          enable: userConfig.app.i18n.enable,
        },
        iconRenderer: userConfig.app.iconRenderer,
      },
      navbar: {
        type: userConfig.navbar.type,
        navbarBlur: userConfig.navbar.navbarBlur,
      },
      footer: { type: userConfig.footer.type },
      verticalNav: {
        isVerticalNavCollapsed: userConfig.verticalNav.isVerticalNavCollapsed,
        defaultNavItemIconProps: userConfig.verticalNav.defaultNavItemIconProps,
      },
      horizontalNav: {
        type: userConfig.horizontalNav.type,
        transition: userConfig.horizontalNav.transition,
        popoverOffset: userConfig.horizontalNav.popoverOffset,
      },
      icons: {
        chevronDown: userConfig.icons.chevronDown,
        chevronRight: userConfig.icons.chevronRight,
        close: userConfig.icons.close,
        verticalNavPinned: userConfig.icons.verticalNavPinned,
        verticalNavUnPinned: userConfig.icons.verticalNavUnPinned,
        sectionTitlePlaceholder: userConfig.icons.sectionTitlePlaceholder,
      },
    },
  }
}
