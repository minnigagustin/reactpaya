import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Button } from "reactstrap";
import firebase from "../firebase";
import moment from "moment";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import ReactExport from "react-data-export";
import ModalEliminar from "./ModalEliminar";
import ModalInsertar from "./ModalInsertar";
import Layout from "../layout";

import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const url = "https://us-central1-yappareports.cloudfunctions.net/tookanQuery";
const dato = { date: "2021-04-17" };

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
    firebase
      .firestore()
      .collection("orders")
      .where("migrated", "==", true)
      .orderBy("accepted_at", "asc")
      .startAt(moment(desde).format("YYYY-MM-DD"))
      .endAt(moment(hasta).add(1, "days").format("YYYY-MM-DD"))
      .get()
      .then((item) => {
        let items = item.docs.map((doc) => doc.data());

        if (filterSearch !== "") {
          items = items.filter((item) => {
            return (
              item.restaurant_name
                .toUpperCase()
                .indexOf(filterSearch.toUpperCase()) > -1 ||
              (item.client_first_name + " " + item.client_last_name)
                .toUpperCase()
                .indexOf(filterSearch.toUpperCase()) > -1
            );
          });
        }
        setData(items);
        setProgress(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [desde, hasta]);

  return (
    <Layout title="Panel">
      <Row className="d-flex py-4 align-items-end">
        <Col>
          <label>Búsqueda</label>
          <br />
          <input
            className="form-control"
            placeholder=""
            onChange={onChangeSearch}
            onBlur={onChangeSearch}
          />
        </Col>
        <Col>
          <label htmlFor="nombre">Desde</label>
          <DatePicker
            customInput={<input className="form-control" />}
            selected={desde.toDate()}
            onChange={(date) => setDesde(moment(date))}
            dateFormat="dd-MM-yyyy"
          />
        </Col>
        <Col>
          <label htmlFor="nombre">Hasta</label>
          <DatePicker
            customInput={<input className="form-control" />}
            selected={hasta.toDate()}
            onChange={(date) => setHasta(moment(date))}
            dateFormat="dd-MM-yyyy"
          />
        </Col>
        <Col>
          <Button className="btn btn-primary" onClick={() => fetchOrders()}>
            Filtrar <i className="bi bi-filter"></i>
          </Button>
        </Col>
        <Col>
          <ExcelFile
            filename="reporte"
            element={
              <Button className="btn btn-primary" href="#">
                Exportar Excel <i className="bi bi-download"></i>
              </Button>
            }
          >
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
                value={(col) =>
                  ((col.total_price * 3.5) / 100 + 0.35).toFixed(2)
                }
              />
              <ExcelColumn label="Metodo" value="payment" />
              <ExcelColumn label="Restaurante" value="restaurant_name" />
            </ExcelSheet>
          </ExcelFile>
        </Col>
      </Row>
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
    </Layout>
  );
};

export default Panel;
