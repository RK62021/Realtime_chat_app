import { API_URL } from "./index.js";

export const Api_ENDPOINTS = {
  Auth: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    GOOGLE_AUTH: `${API_URL}/auth/google`,
    FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
  },
  User: {
    USERNAME_SETUP: `${API_URL}/auth/set-username`,
    GET_USER: `${API_URL}/user/me`,
    UPDATE_AVATAR: `${API_URL}/user/update-avatar`,
  },
  Chat: {
    GET_MESSAGES: `${API_URL}/chat/messages`,
    SEND_MESSAGE: `${API_URL}/chat/messages/send`,
    DELETE_MESSAGE: `${API_URL}/chat/messages/delete`,
    EDIT_MESSAGE: `${API_URL}/chat/messages/edit`,
  },
};
