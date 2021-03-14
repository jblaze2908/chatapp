import { combineReducers } from "redux";
import UserInfoReducer from "./userInfoReducer";
import { ChatsReducer, ChatLoadedReducer } from "./chatsReducer";
import ActiveChatReducer from "./activeChatReducer";
import ChatModeReducer from "./chatModeReducer";
import CallDetailsReducer from "./callDetailsReducer";
import DialogFlagsReducer from "./dialogFlagsReducer";
const allReducers = combineReducers({
  userInfo: UserInfoReducer,
  chatsLoaded: ChatLoadedReducer,
  chats: ChatsReducer,
  activeChatIndex: ActiveChatReducer,
  chatMode: ChatModeReducer,
  callDetails: CallDetailsReducer,
  dialogFlags: DialogFlagsReducer,
});
const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") state = state = { undefined };
  return allReducers(state, action);
};
export default rootReducer;
