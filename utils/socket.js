import { io } from "socket.io-client";
import { baseURL } from "../api/URL/url";
const socket = io.connect(baseURL);
// const socket = io.connect("https://suar-app.herokuapp.com");
export default socket;
