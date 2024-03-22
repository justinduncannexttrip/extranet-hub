const  setUserAbilities = async (userTypeId) => {
  let userAbilityRules = [];
  console.log('userTypeId', userTypeId);
  switch (userTypeId) {
    // superuser
    case 1:
      userAbilityRules = [{actions: 'manage', subject: 'all'}];
      break;
    // manager
    case 2:
      userAbilityRules = [{
        actions: ['create', 'read', 'update', 'delete'],
        subject: ['managerPage', 'userPage']
      }];
      break;
    // supervisor
    case 3:
      userAbilityRules = [{actions: ['read'], subject: ['adminPage', 'managerPage', 'userPage']}];
      break;
    // user
    default:
      userAbilityRules = [{actions: ['read'], subject: ['userPage']}];
  }
  return userAbilityRules;
};

export default setUserAbilities;
