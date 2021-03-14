let initialState = "default"; //default,chat,call
const chatModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "START_CALL":
      return "call";
    case "END_CALL":
      return "chat";
    default:
      return state;
  }
};
export default chatModeReducer;
