import axios from "axios";
import ApiManager, { apiGet } from "./ApiManager";
import { baseURL } from "./URL/url";

// dong tam lai
//
// export const ApiUser = async (data) => {
//   console.log(data);
//   try {
//     const result = await ApiManager("/login", {
//       method: "POST",
//       headers: {
//         "content-type": "application/json",
//       },
//       // data: data,
//       body: JSON.stringify(data),
//     });

//     // const result = fetch(`http://localhost:3000/api/users/login`, {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //   },
//     //   body: JSON.stringify(data),
//     // });

//     return result;
//   } catch (error) {
//     return error.response.data;
//   }
// };

export const ApiUser = {
  login: (data) => {
    const url = `/login`;
    return ApiManager.post(url, data);
  },

  getAllUser: async (token) => {
    return await apiGet.get(`/getAllUser`, token);
  },
};

// export const ApiRegisterUser = async (data) => {
//   try {
//     const result = await ApiManager("/register", {
//       method: "POST",
//       headers: {
//         "content-type": "application/json",
//       },
//       data: data,
//     });
//     return result;
//   } catch (error) {
//     return error.response.data;
//   }
// };

export const ApiRegisterUser = {
  checkExistAccount: (data) => {
    const url = `/forgot/verify`;
    return ApiManager.post(url, data);
  },

  register: (data) => {
    const url = `/app/register`;
    return apiGet.post(url, data);
  },
};

export const ApiProfile = {
  //async (token) =>

  profile: (token) => {
    const url = `/me`;
    // return ApiManager.get(url, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    return axios.create({
      baseURL: baseURL,
      // baseURL: "https://suar-app.herokuapp.com/me",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  profile2: async (token) => {
    return await apiGet.get(`/me`, token);
  },

  updateProfile: async (token, data) => {
    return await apiGet.post(`/user/m-update`, data, token);
  },
};

export const ApiGetUser = {
  getProfileUserFromId: (id) => {
    const url = `/user/getProfileUserFromId/${id}`;
    return apiGet.get(url, {});
  },
};

export const TestGetFromHeroku = {
  getTest: (id) => {
    const url = `https://suar-app.herokuapp.com/user/getProfileUserFromId/${id}`;
    return apiGet.get(url, {});
  },
};
