const login = (data) => {
  return {
    type: "LOGIN",
    payload: data,
  };
};
const logout = () => {
  return {
    type: "LOGOUT",
  };
};
const connectToSocket = (data) => {
  return {
    type: "CONNECT_TO_SOCKET",
    payload: data,
  };
};
const updateProfile = (data) => {
  return {
    type: "UPDATE_PROFILE",
    payload: data,
  };
};
export { login, logout, connectToSocket, updateProfile };
