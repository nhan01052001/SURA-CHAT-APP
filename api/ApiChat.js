import ApiManager, { apiGet } from "./ApiManager";

export const chatApi = {
  createChat: (data) => {
    const url = "/chat/createChat";
    return apiGet.post(url, {
      senderId: data.senderId,
      receiverId: data.receiveId,
    });
  },
  getChat: (senderId, receiveId) => {
    const url = `/chat/${senderId}.${receiveId}`;
    return apiGet.get(url, {});
  },
};
