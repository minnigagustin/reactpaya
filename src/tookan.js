import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
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

const url = "https://api.tookanapp.com/v2/get_all_fleets";
const dato = {
  api_key: "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
};
const headers = {
  "Content-Type": "application/json",
};

class Home extends Component {
  state = {
    data: [],
    dataBackup: [],
    modalInsertar: false,
    modalEliminar: false,
    total: 0,
    textSearch: "",
    fecha: {
      inicial: "",
      final: "",
    },
    noti: {
      id: 0,
      nombre: "",
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

  peticionGet = () => {
    axios
      .post(url, dato, headers)
      .then((response) => {
        this.setState({
          data: response.data.data,
          dataBackup: response.data.data,
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
    const urldato =
      "https://api.tookanapp.com/v2/fleet/wallet/create_transaction";
    const datowallet = {
      api_key: "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      fleet_id: this.state.form.id,
      amount: this.state.form.total,
      transaction_type: this.state.form.aurest,
      reference_id: this.state.form.reference_id,
      wallet_type: this.state.form.crediwallet,
      description: this.state.form.razon,
    };
    axios.post(urldato, datowallet, headers).then((response) => {
      this.modalInsertar();
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
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleChangeNoti = async (e) => {
    e.persist();
    await this.setState({
      [e.target.name]: e.target.value,
    });
  };

  seleccionarNoti = (empresa) => {
    this.setState({
      total: 0,
      noti: {
        id: empresa.fleet_id,
        nombre: empresa.name,
      },
      modalEliminar: !this.state.modalEliminar,
    });
  };

  EnviarNoti = () => {
    const notiid = [];
    notiid.push(this.state.noti.id);
    const urlnueva = "https://api.tookanapp.com/v2/send_notification";
    const dato = {
      api_key: "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      fleet_ids: notiid,
      message:
        "Hola " +
        this.state.noti.nombre +
        ", hemos realizado una transferencia a tu cuenta por $" +
        this.state.total,
    };
    axios.post(urlnueva, dato, headers).then((response) => {
      console.log(response.data);
      this.setState({
        modalEliminar: !this.state.modalEliminar,
      });
    });
  };

  onChangeSearch = async (e) => {
    e.persist();
    const data = this.state.dataBackup;
    const newData = data.filter(function (item) {
      const itemData = item.name.toUpperCase();
      const textData = e.target.value.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      data: newData,
    });
  };

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form } = this.state;

    return (
      <Layout title="General">
        <input placeholder="Buscar..." onChange={this.onChangeSearch} />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((empresa) => {
              return (
                <tr>
                  <td>{empresa.fleet_id}</td>
                  <td>{empresa.name}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        this.seleccionarEmpresa(empresa);
                        this.modalInsertar();
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    |
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        this.seleccionarNoti(empresa);
                      }}
                    >
                      N
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

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
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input
                className="form-control"
                type="text"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.id : this.state.data.length + 1}
              />
              <br />
              <label htmlFor="nombre">Nombre</label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                id="nombre"
                readOnly
                onChange={this.handleChange}
                value={form ? form.nombre : ""}
              />
              <br />
              <Container>
                <Row>
                  <Col>
                    <label htmlFor="nombre">Wallet</label>
                    <input
                      className="form-control"
                      type="text"
                      name="wallettotal"
                      id="wallettotal"
                      readOnly
                      onChange={this.handleChange}
                      value={
                        form.wallettotal !== "Cargando..."
                          ? "$" + form.wallettotal.toFixed(2)
                          : form.wallettotal
                      }
                    />
                  </Col>
                  <Col>
                    <label htmlFor="nombre">Credito</label>
                    <input
                      className="form-control"
                      type="text"
                      name="pais"
                      id="pais"
                      readOnly
                      onChange={this.handleChange}
                      value={
                        form.pais !== "Cargando..."
                          ? "$" + form.pais.toFixed(2)
                          : form.pais
                      }
                    />
                  </Col>
                </Row>
                <br />

                <select
                  className="form-control"
                  name="crediwallet"
                  id="crediwallet"
                  onChange={this.handleChange}
                >
                  <option value="2">Credito</option>
                  <option value="1">Wallet</option>
                </select>
                <br />
                <Row>
                  <Col>
                    <select
                      className="form-control"
                      name="aurest"
                      id="aurest"
                      onChange={this.handleChange}
                    >
                      <option value="2">Aumentar</option>
                      <option value="1">Restar</option>
                    </select>
                  </Col>
                  <Col>
                    <input
                      className="form-control"
                      type="number"
                      inputmode="numeric"
                      name="total"
                      id="total"
                      onChange={this.handleChange}
                      value={form ? form.capital_bursatil : ""}
                    />
                  </Col>
                </Row>
              </Container>
              <br />
              <label htmlFor="nombre">Razon</label>
              <input
                className="form-control"
                type="text"
                name="razon"
                id="razon"
                onChange={this.handleChange}
                value={form ? form.razon : ""}
              />
              <br />
              <label htmlFor="nombre">Task ID</label>
              <input
                className="form-control"
                type="number"
                inputmode="numeric"
                name="reference_id"
                id="reference_id"
                onChange={this.handleChange}
                value={form ? form.razons : ""}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === "insertar" ? (
              <button
                className="btn btn-success"
                onClick={() => this.peticionPost()}
              >
                Insertar
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                Actualizar
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={() => this.modalInsertar()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar} centered={true}>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="nombre">
                Monto depositado a {this.state.noti.nombre}
              </label>
              <input
                className="form-control"
                type="number"
                inputmode="numeric"
                name="total"
                id="total"
                onChange={this.handleChangeNoti}
                value={this.state.total ? this.state.total : ""}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modalEliminar: false })}
            >
              Salir
            </button>
            <button
              className="btn btn-success"
              onClick={() => this.EnviarNoti()}
            >
              Notificacion
            </button>
          </ModalFooter>
        </Modal>
      </Layout>
    );
  }
}
export default Home;
