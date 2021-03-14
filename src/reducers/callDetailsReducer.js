let initialState = {
  _id: "", //,
  callType: -1, //0 - Audio, 1 - Video, 2 - Screenshare
  callStatus: -2, // -1 - Prefetched Data, 0 - Ringing, 1 - in Call, 2- Ended
  incomingCall: null,
  callWith: {
    _id: "",
    name: "",
    pfpLink: "",
  },
  myStream: "",
  remoteStream: "",
}; //chat,call
const callDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "START_CALL":
      return action.payload;
    case "GET_STREAMS":
      return {
        ...state,
        callStatus: 1,
        remoteStream: action.payload.remoteStream,
        myStream: action.payload.myStream,
      };
    case "PREFETCH_CALL_DATA":
      return action.payload;
    case "END_CALL":
      return initialState;
    default:
      return state;
  }
};
export default callDetailsReducer;
