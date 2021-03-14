let initialState = {
  token: "",
  _id: "",
  name: "",
  email: "",
  passwordHash: "",
  registrationDate: "",
  lastLoginTime: "",
  lastSeen: 0,
  online: false,
  socketId: "",
  pfpLink: "",
};
const UserInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        ...action.payload,
      };
    case "CONNECT_TO_SOCKET":
      return {
        ...state,
        socketId: action.payload,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        ...action.payload,
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};
export default UserInfoReducer;
