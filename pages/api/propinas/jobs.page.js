import nextConnect from "next-connect";
import api from "../../../components/api";
import _ from "lodash";

const baseUrl = `${process.env.NEXT_PUBLIC_MOODLE_WEBSERVICE_URL}/webservice/rest/server.php`;

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed.` });
  },
});

apiRoute.get(async (req, res) => {
  switch (req.method) {
    case "GET":
      const { start_date, end_date, search, comercio } = req.query;

      let { data: jobs } = await api.get_all_tasks({
        team_id: "449045",
        job_status: 2,
        job_type: 1,
        start_date,
        end_date,
        custom_fields: 1,
        is_pagination: 1,
        requested_page: 1,
      });

      jobs = jobs.filter((job) => {
        const deliveryFee = getDeliveryFee(job.fields.custom_field);
        return deliveryFee !== "-" && deliveryFee !== "";
      });

      if (!!search) {
        jobs = jobs.filter(
          (job) =>
            String(job.job_id) === search.toLowerCase() ||
            job.job_pickup_name.toLowerCase().includes(search.toLowerCase()) ||
            job.fleet_name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (!!comercio) {
        jobs = jobs.filter((item) => {
          return comercio
            .toLowerCase()
            .includes(item.job_pickup_name.toLowerCase());
        });
      }
      //   const jobsNumbers = _.map(job_and_fleet_details, "job_id");
      //   const jobsNumbersSplit = _.chunk(jobsNumbers, 100);
      //   const job_details = await Promise.all(
      //     jobsNumbersSplit.map((jobNumberArray) =>
      //       api.get_job_details({
      //         job_ids: jobNumberArray,
      //         include_task_history: 0,
      //       })
      //     )
      //   );

      //   const jobs = _.flatten(
      //     job_details.map((job_details) => job_details.data)
      //   );
      // .map((res) => {
      //   const job_pickup_name = jobList.find(
      //     (job) => job.job_id === res.job_id
      //   ).job_pickup_name;
      //   return { ...res, job_pickup_name: job_pickup_name };
      // });

      const comercios = _.uniqBy(
        jobs.map((job) => {
          return {
            value: job.job_pickup_name,
            label: job.job_pickup_name,
          };
        }),
        (job) => job.value
      );

      return res.status(200).json({ jobs, comercios });
    default:
      return res.status(404).json({});
  }
});

export default apiRoute;

const getDeliveryFee = (custom_fields) => {
  return custom_fields.find((field) => field.label === "Delivery_Fee")?.data;
};
