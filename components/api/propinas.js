import axios from "axios";

const baseUrl = "http://localhost:3000/api/propinas";

const createAxios = () => {
  axios.create();
  axios.defaults.headers.common[`Content-Type`] = "application/json";
  return axios;
};

const api = {
  get_jobs: (data) => {
    console.info({ data });
    return createAxios()
      .get(`${baseUrl}/jobs`, {
        params: data,
      })
      .then((res) => res.data);
  },
};

export default api;
