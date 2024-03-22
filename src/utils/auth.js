export const isUserLoggedIn = () => {
  return !!(useCookie('userData').value && useCookie('userAbilityRules').value);
}
