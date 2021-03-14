let initialState = [];
let stateChats, index;

const ChatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CHATS":
      return [...action.payload];
    case "SEND_MESSAGE":
      stateChats = [...state];
      index = stateChats.findIndex(
        (chat) =>
          chat.participant1._id === action.payload.savedMessage.to ||
          chat.participant2._id === action.payload.savedMessage.to
      );
      if (index > -1) {
        let chats = [...stateChats[index].messages];
        chats.push(action.payload.savedMessage);
        stateChats[index] = {
          ...stateChats[index],
          messages: chats,
        };
        return [...stateChats];
      } else {
        let receiverDetails = action.payload.receiverDetails;
        stateChats.push({
          participant1: {
            _id: "",
          },
          participant2: {
            _id: receiverDetails._id,
            name: receiverDetails.name,
            pfpLink: receiverDetails.pfpLink,
          },
          messages: [action.payload.savedMessage],
        });
        return [...stateChats];
      }
    case "NEW_MESSAGE_RECEIVED":
      stateChats = [...state];
      index = stateChats.findIndex(
        (chat) =>
          chat.participant1._id === action.payload.senderDetails._id ||
          chat.participant2._id === action.payload.senderDetails._id
      );
      if (index > -1) {
        let chats = [...stateChats[index].messages];
        chats.push(action.payload.message);
        stateChats[index] = {
          ...stateChats[index],
          messages: chats,
        };
        return [...stateChats];
      } else {
        let senderDetails = action.payload.senderDetails;
        stateChats.push({
          participant1: {
            _id: senderDetails._id,
            name: senderDetails.senderName,
            pfpLink: senderDetails.senderPfp,
          },
          participant2: {
            _id: "",
          },
          messages: [action.payload.message],
        });
        return [...stateChats];
      }
    case "ADD_NEW_CHAT":
      stateChats = [...state];
      index = stateChats.findIndex(
        (chat) =>
          chat.participant1._id === action.payload._id ||
          chat.participant2._id === action.payload._id
      );
      if (index !== -1) return state;
      else {
        stateChats.push({
          _id: Date.now(),
          participant1: {
            _id: "",
          },
          participant2: {
            _id: action.payload._id,
            name: action.payload.name,
            pfpLink: action.payload.pfpLink,
          },
          messages: [],
        });
        return [...stateChats];
      }
    case "MESSAGES_READ":
      stateChats = [...state];
      index = stateChats.findIndex(
        (chat) =>
          chat.participant1._id === action.payload.by ||
          chat.participant2._id === action.payload.by
      );
      let threadChats = [...stateChats[index].messages];

      let chatsModified = threadChats.map((chat) => {
        if (!chat.readAt && chat.to === action.payload.by) {
          return { ...chat, readAt: action.payload.time };
        } else return { ...chat };
      });
      stateChats[index].messages = chatsModified;
      return [...stateChats];
    case "MESSAGES_READ_CLIENT":
      stateChats = [...state];
      index = stateChats.findIndex(
        (chat) =>
          chat.participant1._id === action.payload.by ||
          chat.participant2._id === action.payload.by
      );
      let threadChats2 = [...stateChats[index].messages];
      let chatsModified2 = threadChats2.map((chat) => {
        if (!chat.readAt && chat.to === action.payload.userId) {
          return { ...chat, readAt: action.payload.time };
        } else return { ...chat };
      });
      stateChats[index].messages = chatsModified2;
      return [...stateChats];
    default:
      return state;
  }
};

let initialChatLoadState = false;
const ChatLoadedReducer = (state = initialChatLoadState, action) => {
  switch (action.type) {
    case "FETCH_CHATS":
      return true;
    default:
      return state;
  }
};

export { ChatsReducer, ChatLoadedReducer };
