import axios from "axios";

axios.defaults.headers.common[`Content-Type`] = "application/json";
axios.interceptors.request.use((config) => {
  config["data"]["api_key"] =
    "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06";
  return config;
});

const baseUrl = "https://api.tookanapp.com/v2";

const api = {
  get_job_and_fleet_details: (dato) =>
    axios.post(`${baseUrl}/get_job_and_fleet_details`, dato),
  get_job_details: (job) =>
    axios
      .post(`${baseUrl}/get_job_details`, job)
      .then((response) => response.data),
  view_fleet_profile: (fleet_id) =>
    axios.post(`${baseUrl}/view_fleet_profile`, {
      api_key: `56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06`,
      fleet_id: fleet_id,
    }),
  create_transaction: (transaction) =>
    axios.post(`${baseUrl}/fleet/wallet/create_transaction`, transaction),
  send_notification: (notification) =>
    axios.post(`${baseUrl}/send_notification`, notification),
};

export default api;
