import ApiManager, { apiGet } from "./ApiManager";

const friendApi = {
  // getFriend: (accessToken) => {
  //   const url = `/friend/get-all-friend`;
  //   return apiGet
  //     .get(url, {
  //       headers: {
  //         x_authorization: accessToken,
  //       },
  //     })
  //     .then((response) => {
  //       return response;
  //     });
  // },
  // Tìm bạn bè
  getIdRequest: (id) => {
    const url = `/request-friend/getIdRequest/${id}`;
    return apiGet.get(url, {});
  },
  findFriend: (username) => {
    const url = `/friend/${username}`;
    return apiGet.get(url, {});
  },
  // Tìm bạn bè theo id
  findFriendById: (id) => {
    const url = `/friend/id/${id}`;
    return apiGet.get(url, {});
  },
  // Gửi yêu cầu kết bạn
  requestFriend: (senderId, receiverId) => {
    const url = `/request-friend/send`;
    return apiGet.post(url, { senderId, receiverId });
  },
  // Lấy danh sách lời mời
  // Tìm bạn bè
  getInvitesFriend: (token) => {
    const url = `/request-friend/listRequest`;
    return apiGet.get(url, token);
  },
  // Lấy danh sách gửi yêu cầu kết bạn bằng id người gửi
  getAllRequestSentWithSenderId: (token) => {
    const url = `/request-friend/getAllRequestSentWithSenderId`;
    return apiGet.get(url, token);
  },
  // đồng ý lời mời
  acceptFriend: (idRequest) => {
    const url = `/request-friend/accept`;
    return apiGet.post(url, { idRequest });
  },
  // Thu hồi/ từ chối lời mời
  declineFriend: (idRequest) => {
    const url = `/request-friend/decline`;
    return apiGet.post(url, { idRequest });
  },
  deleteFriend: (token, friendId) => {
    const url = `/friend/deleteFriend`;
    return apiGet.post(url, { friendId, token });
  },
  // ???
  getIdRequestFinal: (token, receiverId) => {
    const url = `/request-friend/m-check/${receiverId}`;
    return apiGet.post(url, { token });
  },
  declineFriend_diff: (token, senderId) => {
    const url = `/request-friend/declineFriend_diff/${senderId}`;
    return apiGet.post(url, { token });
  },
  acceptFriend_diff: (token, senderId) => {
    const url = `/request-friend/acceptFriend_diff/${senderId}`;
    return apiGet.post(url, { token });
  },
};

export default friendApi;
