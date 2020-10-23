import axios from 'axios'

const Api = axios.create({
  baseURL: 'https://1ec16db1fd36.ngrok.io/api/v1'
});

export default Api;