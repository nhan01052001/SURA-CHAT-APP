import { apiGet } from "./ApiManager";
import ApiManager from "./ApiManager";

const ApiLoadGroupChat = {
  getGroupChat: async (token) => {
    const url = `/groupChat/m-getGroupChat`;
    return await apiGet.get(url, token);
  },

  createGroup: async (token, data) => {
    const url = `/groupChat/m-createGroup`;
    return await apiGet.post(
      url,
      { nameGroupChat: data.nameGroupChat, memberChat: data.memberChat },
      token
    );
  },

  getMemberGroupChat: async (idGroupChat) => {
    const url = `/groupChat/${idGroupChat}`;
    return await apiGet.get(url, {});
  },

  deleteUserFromGroupChat: async (data) => {
    const url = `/groupChat/deleteUserFromGroupChat`;
    return await apiGet.put(url, data);
  },

  getInforGroupChat: async (idGroup) => {
    const url = `/groupChat/m-get-info-group/${idGroup}`;
    return await apiGet.get(url, {});
  },
  leaveGroup: (token, groupId, newAdminId) => {
    const url = `/groupChat/m-leaveGroup`;
    return apiGet.post(url, {
      token,
      groupId,
      newAdminId,
    });
  },

  deleteGroup: (groupId) => {
    const url = `/groupChat/delete`;
    return apiGet.post(url, {
      groupId,
    });
  },

  addUsersToGroup: (idGroupChat, listIdUser) => {
    const url = `/groupChat/add-users`;
    return apiGet.put(url, { idGroupChat, listIdUser });
  },

  franchiesAdmin: (groupId, newAdminId) => {
    const url = `/groupChat/franchies`;
    return apiGet.post(url, {
      groupId,
      newAdminId,
    });
  },

  deleteMemberFromGroup: (idGroup, idUserDeleted) => {
    const url = `/groupChat/deleteUserFromGroupChat`;
    return apiGet.put(url, {
      _id: idGroup,
      idUserDeleted,
    });
  },
};

export default ApiLoadGroupChat;
