let initialState = -1;
const activeChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CHAT_AS_ACTIVE":
      return action.payload;
    default:
      return state;
  }
};
export default activeChatReducer;
