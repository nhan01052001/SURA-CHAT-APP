import { apiGet } from "./ApiManager";

export const apiFirebase = {
  uploadMessageImage: (token, data) => {
    const url = "/firebase/m-firebaseUploadMessageImage";
    return apiGet.post(url, data, token);
  },
};
