const fetchChats = (data) => {
  return {
    type: "FETCH_CHATS",
    payload: data,
  };
};

const sendMessage = (data) => {
  return {
    type: "SEND_MESSAGE",
    payload: data,
  };
};
const addNewChat = (data) => {
  return {
    type: "ADD_NEW_CHAT",
    payload: data,
  };
};
const newMessageReceived = (data) => {
  return {
    type: "NEW_MESSAGE_RECEIVED",
    payload: data,
  };
};
const setChatAsActive = (data) => {
  return {
    type: "SET_CHAT_AS_ACTIVE",
    payload: data,
  };
};
const messagesRead = (data) => {
  return {
    type: "MESSAGES_READ",
    payload: data,
  };
};
const messagesReadClient = (data) => {
  return {
    type: "MESSAGES_READ_CLIENT",
    payload: data,
  };
};

export {
  fetchChats,
  newMessageReceived,
  setChatAsActive,
  sendMessage,
  addNewChat,
  messagesRead,
  messagesReadClient,
};
