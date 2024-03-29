import { io } from "socket.io-client";

export const initSocket = async () => {
  console.log("connecting");
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  return io("http://localhost:5000", options);
  // return io(process.env.REACT_APP_BACKEND_URL, options);
  // return io(process.env.REACT_APP_BACKEND_URL);
};
