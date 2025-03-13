import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { RootState } from "../store";

const SOCKET_URL = "wss://stream.binance.com:9443";

const websocketMiddleware: Middleware = (store) => {
  let socket: Socket | null = null;
  const subscribeToAssets = () => {
    if (socket) {
      const state = store.getState() as RootState;
      const symbols = Object.keys(state.assets.assets).map(
        (s) => `${s.toLowerCase()}@trade`,
      );
      if (symbols.length > 0) {
        socket.emit("subscribe", { streams: symbols });
      }
    }
  };
  return (next) => (action) => {
    const result = next(action);
    if (!socket) {
      socket = io(SOCKET_URL, { transports: ["websocket"] });
      socket.on("connect", subscribeToAssets);
      socket.on("message", (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.stream && parsedData.data) {
          // const symbol = parsedData.stream.split("@")[0].toUpperCase();
          // store.dispatch(
          //   updatePrice({ symbol, price: parseFloat(parsedData.data.p) }),
          // );
        }
      });
    }
    return result;
  };
};

export default websocketMiddleware;
