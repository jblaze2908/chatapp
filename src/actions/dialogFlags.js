const showAccountDialog = () => {
  return {
    type: "SHOW_ACCOUNT_DIALOG",
  };
};
const hideAccountDialog = () => {
  return {
    type: "HIDE_ACCOUNT_DIALOG",
  };
};
const showLogoutDialog = () => {
  return {
    type: "SHOW_LOGOUT_DIALOG",
  };
};
const hideLogoutDialog = () => {
  return {
    type: "HIDE_LOGOUT_DIALOG",
  };
};
export {
  showAccountDialog,
  hideAccountDialog,
  showLogoutDialog,
  hideLogoutDialog,
};
