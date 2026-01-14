import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = (userId) => {
  if (socket) {
    return socket;
  }

  socket = io(API_URL, {
    withCredentials: true,
    transports: ["websocket"],
  });

  // Join user-specific room
  if (userId) {
    socket.emit('join', `user_${userId}`);
    console.log('Joined room:', `user_${userId}`);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

