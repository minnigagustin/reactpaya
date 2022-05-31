import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import moment from "moment";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Container,
  Row,
  Col,
} from "reactstrap";
// import { DistanceMatrixService, LoadScript } from '@react-google-maps/api';
import Layout from "./layout";

const url = "https://api.tookanapp.com/v2/get_job_and_fleet_details";

const headers = {
  "Content-Type": "application/json",
};

class Automatizacion extends Component {
  state = {
    jobArray: null,
    data: {
      id: "",
      envio: 0,
      distancia: 0,
      tiempo: 0,
    },
    id: 0,
    job_latitude: 0,
    job_longitude: 0,
    job_pickup_latitude: 0,
    job_pickup_longitude: 0,
    job_pickup_address: "",
    job_address: "",
    modalInsertar: false,
    modalEliminar: false,
    fecha: {
      inicial: "",
      final: "",
    },
    form: {
      id: "",
      nombre: "",
      pais: 0,
      razon: "",
      razons: "",
      reference_id: "",
      tipoModal: "",
      aurest: 2,
      crediwallet: 2,
      wallettotal: 0,
      total: 0,
    },
  };

  peticionPrimera = () => {
    const dato = {
      api_key: "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      team_id: "449045",
      date: moment().subtract(1, "days").format("YYYY-MM-DD"),
    };
    axios.post(url, dato, headers).then((response) => {
      // console.log(response.data);
      const jobList = _.get(response.data, "data.teams.449045.jobs");
      const jobsNumbers = _.map(jobList, "job_id");
      const jobsNumbersSplit = _.chunk(jobsNumbers, 100);
      // console.log(jobsNumbersSplit)

      var arraynuevo = [];

      for (const jobNumberArray of jobsNumbersSplit) {
        const urldato = "https://api.tookanapp.com/v2/get_job_details";
        const datowallet = {
          api_key: "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
          job_ids: jobNumberArray,
          include_task_history: 0,
        };
        axios.post(urldato, datowallet, headers).then((response) => {
          const jobsListDetails = _.get(response.data, "data");

          arraynuevo = _.concat(arraynuevo, jobsListDetails);
          //console.log(arraynuevo);
          this.setState({ jobArray: arraynuevo });
        });
        console.log(this.state.jobArray);
      }
    });
  };

  peticionSegunda = () => {
    const data = this.state.jobArray;
    const resultad = _.filter(data, { job_status: 2 });
    const result = _.uniqBy(resultad, "order_id");

    var date = new Date();
    console.log(date.getDate() - 1);

    for (let i = 0; i < result.length; i++) {
      const job = result[i];
      console.log(result[i]);
      const orderDistance = String(job.total_distance_travelled);
      console.log(job);
      if (orderDistance === "null") {
        const urlpre = "https://api.tookanapp.com/v2/get_fare_estimate";
        const datopre = {
          template_name: "Order_Details",
          delivery_latitude: job.job_latitude,
          delivery_longitude: job.job_longitude,
          api_key: "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
          pickup_latitude: job.job_pickup_latitude,
          pickup_longitude: job.job_pickup_longitude,
          formula_type: 1,
          map_keys: {
            map_plan_type: 1,

            google_api_key: "AIzaSyDVkVjap_CH32oy6A3V6T_ewq9jIq8q5eY",
          },
        };

        axios
          .post(urlpre, datopre, headers)
          .then((response) => {
            console.log(response.data.data.estimated_fare);

            const urldato =
              "https://api.tookanapp.com/v2/fleet/wallet/create_transaction";
            const datowallet = {
              api_key: "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
              fleet_id: job.fleet_id,
              amount: response.data.data.estimated_fare - 2.5,
              transaction_type: 2,
              reference_id: String(job.job_id),
              wallet_type: 2,
              description: "Correccion pedido: #" + job.job_id,
            };
            axios.post(urldato, datowallet, headers).then((response) => {
              console.log(response);
              this.setState({ modalInsertar: true });
            });
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    }
  };

  peticionGet = () => {
    const dato = {
      template_name: "Order_Details",
      delivery_latitude: this.state.job_latitude,
      delivery_longitude: this.state.job_longitude,
      api_key: "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      pickup_latitude: this.state.job_pickup_latitude,
      pickup_longitude: this.state.job_pickup_longitude,
      formula_type: 1,
      map_keys: {
        map_plan_type: 1,

        google_api_key: "AIzaSyDVkVjap_CH32oy6A3V6T_ewq9jIq8q5eY",
      },
    };
    axios
      .post(url, dato, headers)
      .then((response) => {
        // console.log(response.data);
        this.setState({
          data: {
            envio: response.data.data.estimated_fare,
            distancia: response.data.data.distance / 1000,
            tiempo: response.data.data.time / 60,
          },
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionPost = async () => {
    delete this.state.form.id;
    await axios
      .post(url, this.state.form)
      .then((response) => {
        this.modalInsertar();
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionPut = () => {
    this.setState({
      data: {
        envio: "Cargando...",
        distancia: "Cargando...",
        tiempo: "Cargando...",
      },
    });

    const urldato = "https://api.tookanapp.com/v2/get_job_details";
    const datowallet = {
      api_key: "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      job_ids: [this.state.id],
      include_task_history: 0,
    };
    axios.post(urldato, datowallet, headers).then((response) => {
      // console.log(response.data.data[0]);
      this.setState({
        job_latitude: response.data.data[0].job_latitude,
        job_longitude: response.data.data[0].job_longitude,
        job_pickup_latitude: response.data.data[0].job_pickup_latitude,
        job_pickup_longitude: response.data.data[0].job_pickup_longitude,
        job_pickup_address: response.data.data[0].job_pickup_address,
        job_address: response.data.data[0].job_address,
      });
      this.peticionGet();
    });
  };

  peticionDelete = () => {
    axios.delete(url + this.state.form.id).then((response) => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarEmpresa = (empresa) => {
    this.setState({
      tipoModal: "actualizar",
      form: {
        id: empresa.fleet_id,
        nombre: empresa.name,
        pais: "Cargando...",
        aurest: 2,
        crediwallet: 2,
        wallettotal: "Cargando...",
        capital_bursatil: empresa.pais,
      },
    });
    const urldato =
      "https://api.tookanapp.com/v2/fleet/wallet/read_transaction_history";
    const datowallet = {
      api_key: "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      fleet_id: empresa.fleet_id,
      wallet_type: 2,
      starting_date: "2019-06-21",
      ending_date: "2023-06-21",
    };
    axios
      .post(urldato, datowallet, headers)
      .then((response) => {
        // var total = 0
        // const cart = response.data.data.transaction_history
        // for (var i = 0; i < cart.length; i++) {
        //  total = total + cart[i].amount
        // }
        // console.log(response.data.data)
        if (response.data.data.wallet_balance[0].wallet_type === 1) {
          var crediwal = response.data.data.wallet_balance[0].wallet_balance;
        } else {
          crediwal = "Cargando...";
        }
        this.setState({
          tipoModal: "actualizar",
          form: {
            id: empresa.fleet_id,
            nombre: empresa.name,
            pais: response.data.data.wallet_balance[
              response.data.data.wallet_balance.length - 1
            ].wallet_balance,
            aurest: 2,
            crediwallet: 2,
            wallettotal: crediwal,
            capital_bursatil: empresa.pais,
          },
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  handleChangeFecha = async (e) => {
    e.persist();
    await this.setState({
      fecha: {
        ...this.state.fecha,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleChange = async (e) => {
    e.persist();
    await this.setState({
      id: e.target.value,
    });
  };

  render() {
    const { form, data } = this.state;

    return (
      <Layout title="Automatización">
        <button
          className="btn btn-success"
          style={{ width: "98%" }}
          onClick={() => this.peticionPrimera()}
        >
          Actualizar
        </button>

        <Modal isOpen={this.state.modalInsertar} centered={true}>
          <ModalHeader style={{ display: "block" }}>
            <span
              style={{ float: "right" }}
              onClick={() => this.modalInsertar()}
            >
              x
            </span>
          </ModalHeader>
          <ModalBody>
            <h1>Actualizado</h1>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() => this.modalInsertar()}
            >
              Salir
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar a la empresa {form && form.nombre}
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() => this.peticionDelete()}
            >
              Sí
            </button>
            <button
              className="btn btn-secundary"
              onClick={() => this.setState({ modalEliminar: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </Layout>
    );
  }
}
export default Automatizacion;
