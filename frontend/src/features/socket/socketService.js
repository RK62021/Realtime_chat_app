import { setIsConnected } from "./socketSlice";
import { createSocket } from "../../utils/socket-io";

let socketInstance = null;
export const initializeSocket = (token, dispatch) => {
  if (!socketInstance) {
    socketInstance = createSocket(token);
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      dispatch(setIsConnected(true));
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      dispatch(setIsConnected(false));
    });
  }
  return socketInstance;
};

export const emitEvent = (event, data) => {
  if (socketInstance) {
    socketInstance.emit(event, data);
  }
};

export const onEvent = (event, callback) => {
  if (socketInstance) {
    socketInstance.on(event, callback);
  }
};
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
  }
  socketInstance = null;
};
