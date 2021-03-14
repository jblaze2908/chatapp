import { io } from "socket.io-client";
import { socketUrl } from "../config/index";
import { store } from "../store";
let socket;
const socketManager = {
  connect: (token) => {
    return new Promise(async (resolve, reject) => {
      if (!socket) {
        let opts = {};
        opts.query = {
          authorization: token,
        };
        opts["sync disconnect on unload"] = false;
        socket = io(socketUrl, opts);
        socket.on("connect", () => {
          resolve(socket);
        });
      } else resolve(socket);
    });
  },
  getInstanceAsync: () => {
    return socket;
  },
  getInstance: async () => {
    return new Promise(async (resolve, reject) => {
      if (socket && socket.connected) {
        resolve(socket);
        return;
      }
      let checkCon = setInterval(() => {
        if (socket && socket.connected) {
          clearInterval(checkCon);
          resolve(socket);
        }
      }, 1000);
    });
  },
  destroy: () => {
    if (socket) socket.disconnect();
    socket = null;
  },
  reconnect: async (token) => {
    return new Promise(async (resolve, reject) => {
      socket = null;
      let socket2 = await socketManager.connect(token);
      store.dispatch({ type: "CONNECT_TO_SOCKET", payload: socket2.id });
      resolve(socket2);
    });
  },
};
export default socketManager;
