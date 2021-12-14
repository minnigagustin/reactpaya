import axios from "axios";

const API_KEY = "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06";
const baseUrl = "https://api.tookanapp.com/v2";

const createAxios = () => {
  axios.create();
  axios.defaults.headers.common[`Content-Type`] = "application/json";
  axios.interceptors.request.use((config) => {
    config["data"]["api_key"] =
      "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06";
    return config;
  });
  return axios;
};

const api = {
  get_all_tasks: (dato) =>
    createAxios()
      .post(
        `${baseUrl}/get_all_tasks`,
        { ...dato, api_key: API_KEY },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => res.data),
  get_job_and_fleet_details: (dato) =>
    createAxios().post(
      `${baseUrl}/get_job_and_fleet_details`,
      { ...dato, api_key: API_KEY },
      {
        headers: { "Content-Type": "application/json" },
      }
    ),
  get_job_details: (job) =>
    createAxios()
      .post(
        `${baseUrl}/get_job_details`,
        { ...job, api_key: API_KEY },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => response.data),
  view_fleet_profile: (fleet_id) =>
    createAxios().post(
      `${baseUrl}/view_fleet_profile`,
      {
        api_key: `56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06`,
        fleet_id: fleet_id,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    ),
  create_transaction: (transaction) =>
    createAxios().post(
      `${baseUrl}/fleet/wallet/create_transaction`,
      { ...transaction, api_key: API_KEY },
      {
        headers: { "Content-Type": "application/json" },
      }
    ),
  send_notification: (notification) =>
    createAxios().post(
      `${baseUrl}/send_notification`,
      { ...notification, api_key: API_KEY },
      {
        headers: { "Content-Type": "application/json" },
      }
    ),
};

export default api;
