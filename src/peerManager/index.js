import Peer from "peerjs";
let peer;
const peerManger = {
  connect: (_id) => {
    return new Promise(async (resolve, reject) => {
      if (!peer) {
        peer = new Peer(_id, {
          host: "peerserver.jaivardhansingh.tech",
          port: 443,
          path: "/peerjs",
          secure: true,
          config: {
            iceServers: [
              { url: "stun:stun01.sipphone.com" },
              { url: "stun:stun.ekiga.net" },
              { url: "stun:stunserver.org" },
              { url: "stun:stun.softjoys.com" },
              { url: "stun:stun.voiparound.com" },
              { url: "stun:stun.voipbuster.com" },
              { url: "stun:stun.voipstunt.com" },
              { url: "stun:stun.voxgratia.org" },
              { url: "stun:stun.xten.com" },
              {
                url: "turn:192.158.29.39:3478?transport=udp",
                credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
                username: "28224511:1379330808",
              },
              {
                url: "turn:192.158.29.39:3478?transport=tcp",
                credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
                username: "28224511:1379330808",
              },
            ],
          },
          debug: 1,
        });
        peer.on("open", function (id) {
          resolve(peer);
        });
        // peer.on("disconnected", () => {
        //   peer.reconnect();
        // });
      } else resolve(peer);
    });
  },
  getInstanceAsync: () => {
    return peer;
  },
  getInstance: async () => {
    return new Promise(async (resolve, reject) => {
      if (peer) {
        resolve(peer);
        return;
      }
      let checkCon = setInterval(() => {
        if (peer) {
          clearInterval(checkCon);
          resolve(peer);
        }
      }, 1000);
    });
  },
  destroy: () => {
    if (peer) {
      peer.disconnect();
      peer.destroy();
    }
    peer = null;
  },
};
export default peerManger;
