import axios from 'axios';
import { token } from './get-token.js'; 

try {
const gettoken = await token();
const url = "https://sapi.dramaboxdb.com/drama-box/search/suggest";

const headers = {
  "User-Agent": "okhttp/4.10.0",
  "Accept-Encoding": "gzip",
  "Content-Type": "application/json",
  "tn": `Bearer ${gettoken.token}`,
  "version": "430",
  "vn": "4.3.0",
  "cid": "DRA1000042",
  "package-name": "com.storymatrix.drama",
  "apn": "1",
  "device-id": gettoken.deviceid,
  "language": "in",
  "current-language": "in",
  "p": "43",
  "time-zone": "+0800",
  "content-type": "application/json; charset=UTF-8"
};

const data = {
    keyword: "pewaris", // keyword pencarian
};

const res = await axios.post(url, data, { headers })
console.log(res.data.data.suggestList); // output list drama yang dicari
} catch (error) {
    console.error(error);
}