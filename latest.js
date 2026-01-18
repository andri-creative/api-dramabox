import axios from 'axios';
import { token } from './get-token.js'; 

try {
const gettoken = await token();
const url = "https://sapi.dramaboxdb.com/drama-box/he001/theater";

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
  newChannelStyle: 1,
  isNeedRank: 1,
  pageNo: 1, // page number
  index: 1,
  channelId: 43
};

const res = await axios.post(url, data, { headers })
console.log(res.data.data.newTheaterList.records); // output list drama
} catch (error) {
    console.error(error);
}