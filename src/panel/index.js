import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import firebase from "../firebase";
import moment from "moment";
import DataTable, { createTheme } from "react-data-table-component";
import DatePicker from "react-datepicker";
import ReactExport from "react-data-export";
import ModalEliminar from "./ModalEliminar";
import ModalInsertar from "./ModalInsertar";

import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const url = "https://us-central1-yappareports.cloudfunctions.net/tookanQuery";
const dato = { date: "2021-04-17" };

createTheme("solarized", {
  text: {
    primary: "#268bd2",

    secondary: "#2aa198",
  },
  background: {
    default: "#002b36",
  },
  context: {
    background: "#cb4b16",
    text: "#FFFFFF",
  },
  divider: {
    default: "#073642",
  },
  action: {
    button: "rgba(0,0,0,.54)",
    hover: "rgba(0,0,0,.08)",
    disabled: "rgba(0,0,0,.12)",
  },
});

const Panel = () => {
  const [data, setData] = useState([]);
  const [dataBackup, setDataBackup] = useState([]);
  const [progress, setProgress] = useState(true);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [desde, setDesde] = useState(moment().subtract(7, "days"));
  const [hasta, setHasta] = useState(moment());

  const form = {
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
  };

  const peticionGet = () => {
    axios
      .post(url, dato)
      .then((response) => {
        setData(response.data.data);
        setDataBackup(response.data.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const peticionPost = () => {
    delete form.id;
    axios
      .post(url, form)
      .then(() => {
        setModalInsertar(false);
        peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleChange = async (e) => {
    e.persist();
    form[e.target.name] = e.target.value;
  };

  const onChangeSearch = async (e) => {
    setFilterSearch(e.target.value);
  };

  const fetchOrders = async () => {
    setProgress(true);
    let query = firebase.firestore().collection("orders_flattened");
    if (!!filterSearch) {
      query = query.where("restaurant_name", "==", filterSearch);
    }
    query
      .orderBy("accepted_at")
      .startAt(moment(desde).format("YYYY-MM-DD"))
      .endAt(moment(hasta).format("YYYY-MM-DD"))
      .get()
      .then((item) => {
        const items = item.docs.map((doc) => doc.data());
        setData(items);
        setProgress(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [filterSearch, desde, hasta]);

  return (
    <div className="App">
      <br />
      <h1>INFORME</h1>
      <br />
      <Container>
        <ExcelFile filename="reporte" element={<a href="#">Exportar Excel</a>}>
          <ExcelSheet data={data} name="Reporte">
            <ExcelColumn label="Order ID" value="id" />
            <ExcelColumn label="Tipo" value="type" />
            <ExcelColumn
              label="Fecha"
              value={(col) => moment(col.accepted_at).format("DD-MM-YYYY")}
            />
            <ExcelColumn
              label="Nombre"
              value={(col) =>
                col.client_first_name + " " + col.client_last_name
              }
            />
            <ExcelColumn label="Mail" value="client_email" />
            <ExcelColumn
              label="Venta Total sin descuento"
              value="total_price"
            />
            <ExcelColumn
              label="Venta total con descuento"
              value={(col) => (col.total_price * 0.965 - 0.35).toFixed(2)}
            />
            <ExcelColumn
              label="Descuento"
              value={(col) => ((col.total_price * 3.5) / 100 + 0.35).toFixed(2)}
            />
            <ExcelColumn label="Metodo" value="payment" />
            <ExcelColumn label="Restaurante" value="restaurant_name" />
          </ExcelSheet>
        </ExcelFile>
        <br />
        <br />
        <input
          className="form-control"
          placeholder="Buscar..."
          onChange={onChangeSearch}
        />
        <br />
        <Row>
          <Col>
            <label htmlFor="nombre">Desde</label>
            <DatePicker
              selected={desde.toDate()}
              onChange={(date) => setDesde(moment(date))}
              dateFormat="dd-MM-yyyy"
            />
          </Col>
          <Col>
            <label htmlFor="nombre">Hasta</label>
            <DatePicker
              selected={hasta.toDate()}
              onChange={(date) => setHasta(moment(date))}
              dateFormat="dd-MM-yyyy"
            />
          </Col>
        </Row>
        <div>
          <br />
        </div>
        <button
          className="btn btn-success"
          style={{ width: "98%" }}
          onClick={() => fetchOrders()}
        >
          Filtrar {">>"}
        </button>
        <div>
          <br />
        </div>
        <DataTable
          columns={[
            {
              name: "Order ID",
              sortable: true,
              selector: "id",
            },
            {
              name: "Tipo",
              sortable: true,
              selector: "type",
            },
            {
              name: "Fecha",
              sortable: true,
              cell: (row) => (
                <div>{moment(row.accepted_at).format("DD-MM-YYYY")}</div>
              ),
            },
            {
              name: "Nombre",
              sortable: true,
              cell: (row) => (
                <div>
                  {row.client_first_name} {row.client_last_name}
                </div>
              ),
            },
            {
              name: "Venta Total sin descuento",
              sortable: true,
              cell: (row) => <div>${row.total_price}</div>,
            },
            {
              name: "Venta total c. descuento",
              sortable: true,
              cell: (row) => (
                <div>${(row.total_price * 0.965 - 0.35).toFixed(2)}</div>
              ),
            },
            {
              name: "Descuento",
              sortable: true,
              cell: (row) => (
                <div>${((row.total_price * 3.5) / 100 + 0.35).toFixed(2)}</div>
              ),
            },
            {
              name: "Metodo",
              sortable: true,
              selector: "payment",
            },
            {
              name: "Mail",
              sortable: true,
              selector: "client_email",
            },
            {
              name: "Comercio",
              sortable: true,
              right: true,
              selector: "restaurant_name",
            },
          ]}
          data={data}
          pagination={true}
          responsive={true}
          progressPending={progress}
        />
      </Container>

      <ModalInsertar
        isOpen={!!modalInsertar}
        handleChange={handleChange}
        form={form}
        data={data}
        peticionPost={peticionPost}
        peticionGet={peticionGet}
        setModalInsertar={setModalInsertar}
      />

      <ModalEliminar
        isOpen={!!modalEliminar}
        form={form}
        setModalEliminar={setModalEliminar}
      />
    </div>
  );
};

export default Panel;
