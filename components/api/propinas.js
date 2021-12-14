import axios from "axios";

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/propinas`;

const createAxios = () => {
  axios.create();
  axios.defaults.headers.common[`Content-Type`] = "application/json";
  return axios;
};

const api = {
  get_jobs: (data) => {
    return createAxios()
      .get(`${baseUrl}/jobs`, {
        params: data,
      })
      .then((res) => res.data);
  },
};

export default api;
