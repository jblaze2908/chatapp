let initialState = {
  showAccountDialog: false,
  showLogoutDialog: false,
};
const dialogFlagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_ACCOUNT_DIALOG":
      return { ...state, showAccountDialog: true };
    case "HIDE_ACCOUNT_DIALOG":
      return { ...state, showAccountDialog: false };
    case "SHOW_LOGOUT_DIALOG":
      return { ...state, showLogoutDialog: true };
    case "HIDE_LOGOUT_DIALOG":
      return { ...state, showLogoutDialog: false };
    default:
      return state;
  }
};
export default dialogFlagsReducer;
