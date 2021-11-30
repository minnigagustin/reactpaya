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
import Layout from "./layout";
// import { DistanceMatrixService, LoadScript } from '@react-google-maps/api';

const url = "https://api.tookanapp.com/v2/send_notification";

const headers = {
  "Content-Type": "application/json",
};

class Automatizacion extends Component {
  state = {
    jobArray: null,
    id: 0,
    total: 0,
    job_latitude: 0,
    job_longitude: 0,
    job_pickup_latitude: 0,
    job_pickup_longitude: 0,
    job_pickup_address: "",
    job_address: "",
    modalInsertar: false,
    modalEliminar: false,
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

  noti = () => {
    const dato = {
      api_key: "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      fleet_ids: [636771, 1060358],
      message: "Probando propina Jose Manuel, Rosa",
    };
    axios.post(url, dato, headers).then((response) => {
      console.log(response.data);
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
      total: e.target.value,
    });
  };

  render() {
    const { form, data } = this.state;

    return (
      <Layout title="Notificaciones">
        <Container>
          <input
            className="form-control"
            type="text"
            name="total"
            id="total"
            placeholder="Texto"
            onChange={this.handleChange}
          />
          <br />
          <button
            className="btn btn-success"
            style={{ width: "100%" }}
            onClick={() => this.noti()}
          >
            Notificacion
          </button>
        </Container>

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
