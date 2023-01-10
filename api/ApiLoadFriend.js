import { apiGet } from "./ApiManager";

const ApiLoadFriend = {
  getFriend: async (token) => {
    const url = `/friend`;
    return await apiGet.get(url, token);
  },
  deleteFriend: async (token, friendId) => {
    const url = `/friend/m-deleteFriend`;
    return await apiGet.post(url, { token, friendId });
  },
};

export default ApiLoadFriend;
