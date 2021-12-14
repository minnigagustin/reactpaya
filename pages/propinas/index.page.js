import React, { useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import DataTable from "react-data-table-component";
import ReactExport from "react-data-export";
import DatePicker from "react-datepicker";
import { default as ReactSelect, components } from "react-select";
import Layout from "../../components/layout";
import { Row, Col, Button } from "reactstrap";

import ModalEnviarNotificacion from "./ModalEnviarNotificacion";
import ModalEnviarPropinas from "./ModalEnviarPropinas";

import ModalInsertar from "./ModalInsertar";

import api from "../../components/api";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const Propina = () => {
  const [showModalEnviarPropinas, setShowModalEnviarPropinas] =
    React.useState(false);
  const [tipsSent, setTipsSent] = React.useState(false);
  const isDevelopment = process.env.NODE_ENV === "development";
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataBackup, setDataBackup] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [modalInsertar, setModalInsertar] = React.useState(false);
  const [modalEnviarNotificacion, setModalEnviarNotificacion] =
    React.useState(false);

  const [startDateFilter, setStartDateFilter] = React.useState(
    moment().subtract(7, "days")
  );
  const [endDateFilter, setEndDateFilter] = React.useState(moment());
  const [searchFilter, setSearchFilter] = React.useState("");
  const [comercioFilter, setComercioFilter] = React.useState();
  const [optionsComercios, setOptionsComercios] = React.useState([]);
  const [form, setForm] = React.useState({
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
  });
  const [noti, setNoti] = React.useState({ id: 0, nombre: "", total: 0 });
  const [tipoModal, setTipoModal] = React.useState("");

  const fetchJobs = async () => {
    setIsLoading(true);
    const { jobs, comercios } = await api.get_jobs({
      start_date: startDateFilter.format("YYYY-MM-DD"),
      end_date: endDateFilter.format("YYYY-MM-DD"),
      search: !!searchFilter ? searchFilter : null,
      comercio: comercioFilter ? comercioFilter.value : null,
    });

    setComercioFilter();
    if (!comercioFilter) {
      setOptionsComercios(comercios);
    }

    setTipsSent(false)
    setData(jobs);
    setDataBackup(jobs);
    setIsLoading(false);
  };

  const handleChange = async (e) => {
    e.persist();
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const enviarPropina = async (order) => {
    if (!window.confirm("Estás seguro que deseas enviar el monto?")) return;

    const datowallet = {
      fleet_id: order.fleet_id,
      amount: (
        order.custom_field[11].data -
        (order.custom_field[11].data * 3.5) / 100
      ).toFixed(2),
      transaction_type: 2,
      reference_id: String(order.job_id),
      wallet_type: 2,
      description: "Propina del pedido: " + order.job_id,
    };
    setIsLoading(true);
    const transaccion = await api.create_transaction(datowallet);

    const fleet_profile = await api.view_fleet_profile(order.fleet_id);
    setData((data) => {
      return data.filter((job) => {
        return job.job_id !== order.job_id;
      });
    });
    setTotal(0);
    setNoti({
      id: order.fleet_id,
      nombre:
        fleet_profile.data.data.fleet_details[0].first_name +
        " " +
        fleet_profile.data.data.fleet_details[0].last_name,
      total: !isDevelopment
        ? (
            order.custom_field[11].data -
            (order.custom_field[11].data * 3.5) / 100
          ).toFixed(2)
        : 0,
    });
    setModalEnviarNotificacion(
      (modalEnviarNotificacion) => !modalEnviarNotificacion
    );
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      fetchJobs();
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const getDeliveryFee = (custom_fields) => {
    return custom_fields.find((field) => field.label === "Delivery_Fee")?.data;
  };

  return (
    <Layout title="Propinas">
      <Row className="d-flex py-4 align-items-end">
        <Col>
          Desde:
          <br />
          <DatePicker
            customInput={<input className="form-control" />}
            selected={startDateFilter.valueOf()}
            onChange={(date) => {
              setStartDateFilter(moment(date));
              setOptionsComercios();
            }}
          />
        </Col>
        <Col>
          Hasta:
          <br />
          <DatePicker
            customInput={<input className="form-control" />}
            selected={endDateFilter.valueOf()}
            onChange={(date) => {
              setEndDateFilter(moment(date));
              setOptionsComercios();
            }}
          />
        </Col>
        <Col>
          Buscar:
          <br />
          <input
            className="form-control"
            placeholder="Buscar..."
            onChange={handleSearchChange}
          />
        </Col>
        <Col>
          Comercios:
          <br />
          <ReactSelect
            options={optionsComercios}
            components={{ Option }}
            onChange={(selected) => {
              setComercioFilter(selected);
            }}
            loading={isLoading}
            value={comercioFilter}
            isDisabled={!optionsComercios}
          />
        </Col>
        <Col>
          <Button className="btn btn-primary" onClick={() => fetchJobs()}>
            Filtrar <i className="bi bi-filter"></i>
          </Button>
        </Col>
        <Col>
          <Button
            className={`btn btn-primary ${
              isLoading || !data.length || tipsSent ? "disabled" : ""
            }`}
            onClick={() => setShowModalEnviarPropinas(true)}
          >
            Enviar propinas
          </Button>
        </Col>

        <Col>
          <ExcelFile
            filename="reporte"
            element={
              <Button
                className={`btn btn-primary ${
                  isLoading || !data.length ? "disabled" : ""
                }`}
                href="#"
              >
                Exportar Excel <i className="bi bi-download"></i>
              </Button>
            }
          >
            <ExcelSheet data={data} name="Reporte">
              <ExcelColumn label="Job ID" value="job_id" />
              <ExcelColumn
                label="Nombre"
                value={(col) =>
                  col.fields.custom_field[0].data
                    ? col.fields.custom_field[0].data
                    : col.fields.custom_field[1].data
                }
              />

              <ExcelColumn
                label="Venta Total sin descuento"
                value={(col) => {
                  const data = getDeliveryFee(col.fields.custom_field);
                  return data ? "$" + data : "SIN PROPINA";
                }}
              />
              <ExcelColumn
                label="Venta total con descuento"
                value={(col) => {
                  const data = getDeliveryFee(col.fields.custom_field);
                  return !!data
                    ? "$" + ((data * 3.5) / 100).toFixed(2)
                    : "SIN PROPINA";
                }}
              />
              <ExcelColumn
                label="Recibe"
                value={(col) => {
                  const data = getDeliveryFee(col.fields.custom_field);
                  return !!data
                    ? "$" + (data - (data * 3.5) / 100).toFixed(2)
                    : "SIN PROPINA";
                }}
              />
              <ExcelColumn label="Motorizado" value="fleet_name" />
            </ExcelSheet>
          </ExcelFile>
        </Col>
      </Row>

      <DataTable
        columns={[
          {
            name: "Job ID",
            sortable: true,
            cell: (row) => row["job_id"],
          },
          {
            name: "Nombre",
            sortable: true,
            cell: (row) => {
              return <div>{row.job_pickup_name}</div>;
            },
          },
          {
            name: "Propina",
            sortable: true,
            cell: (row) => {
              const data = getDeliveryFee(row.fields.custom_field);
              return <div>{!!data ? "$" + data : "SIN PROPINA"}</div>;
            },
          },
          {
            name: "3.5%",
            sortable: true,
            cell: (row) => {
              const data = getDeliveryFee(row.fields.custom_field);
              return (
                <div>
                  {!!data
                    ? "$" + ((data * 3.5) / 100).toFixed(2)
                    : "SIN PROPINA"}
                </div>
              );
            },
          },
          {
            name: "Recibe",
            sortable: true,
            cell: (row) => {
              const data = getDeliveryFee(row.fields.custom_field);
              return (
                <div>
                  {!!data
                    ? "$" + (data - (data * 3.5) / 100).toFixed(2)
                    : "SIN PROPINA"}
                </div>
              );
            },
          },
          {
            name: "Motorizado",
            sortable: true,
            cell: (row) => <div>{row.fleet_name}</div>,
          },
          {
            name: "Acción",
            sortable: true,
            cell: (row) => {
              const deliveryFee = getDeliveryFee(row.fields.custom_field);
              return (
                <div>
                  <button
                    className="btn btn-success"
                    onClick={() => enviarPropina(row)}
                  >
                    Enviar $
                    {(deliveryFee - (deliveryFee * 3.5) / 100).toFixed(2)} a
                    wallet
                  </button>
                </div>
              );
            },
          },
        ]}
        data={data}
        pagination={true}
        responsive={true}
        progressPending={isLoading}
      />

      <ModalInsertar
        data={data}
        form={form}
        isOpen={modalInsertar}
        setModalInsertar={setModalInsertar}
        handleChange={handleChange}
        tipoModal={tipoModal}
        setIsLoading={setIsLoading}
      />
      <ModalEnviarNotificacion
        noti={noti}
        isOpen={modalEnviarNotificacion}
        setModalEnviarNotificacion={setModalEnviarNotificacion}
        setIsLoading={setIsLoading}
        total={total}
      />
      <ModalEnviarPropinas
        isOpen={showModalEnviarPropinas}
        onClose={() => setShowModalEnviarPropinas(false)}
        data={data}
        setTipsSent={setTipsSent}
      />
    </Layout>
  );
};

export default Propina;
