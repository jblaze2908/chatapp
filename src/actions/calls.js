const startCall = (data) => {
  return {
    type: "START_CALL",
    payload: data,
  };
};
const getStreams = (data) => {
  return {
    type: "GET_STREAMS",
    payload: data,
  };
};
const prefetchCallData = (data) => {
  return {
    type: "PREFETCH_CALL_DATA",
    payload: data,
  };
};
const endCall = () => {
  return {
    type: "END_CALL",
  };
};
export { startCall, getStreams, prefetchCallData, endCall };
