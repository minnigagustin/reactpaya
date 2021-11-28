import React, { useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import DataTable from "react-data-table-component";
import ReactExport from "react-data-export";
import DatePicker from "react-datepicker";
import { default as ReactSelect, components } from "react-select";

import ModalEliminar from "./ModalEliminar";
import ModalInsertar from "./ModalInsertar";

import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const Propina = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataBackup, setDataBackup] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [modalInsertar, setModalInsertar] = React.useState(false);
  const [modalEliminar, setModalEliminar] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState(new Date());
  const [searchFilter, setSearchFilter] = React.useState("");
  const [comerciosFilter, setComerciosFilter] = React.useState([]);
  const [optionsComercios, setOptionsComercios] = React.useState([]);
  const [searchTimeout, setSearchTimeout] = React.useState();
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
    const job_and_fleet_details = await api.get_job_and_fleet_details({
      team_id: "449045",
      date: dateFilter
        ? moment(dateFilter).subtract(8, "days").format("YYYY-MM-DD")
        : moment().subtract(8, "days").format("YYYY-MM-DD"),
      ignore_fleets: "0",
      search_string: !!searchFilter ? searchFilter : "",
    });

    const jobList = _.get(job_and_fleet_details.data, "data.teams.449045.jobs");
    const jobsNumbers = _.map(jobList, "job_id");
    const jobsNumbersSplit = _.chunk(jobsNumbers, 100);

    const job_details = await Promise.all(
      jobsNumbersSplit.map((jobNumberArray) =>
        api.get_job_details({
          job_ids: jobNumberArray,
          include_task_history: 0,
        })
      )
    );
    const jobsListDetails = _.flatten(
      job_details.map((job_details) => job_details.data)
    );
    const resultadoFilteredByJobStatus = _.filter(jobsListDetails, {
      job_status: 2,
    });
    const resultadoFilteredByOrderId = _.filter(
      resultadoFilteredByJobStatus,
      "order_id"
    );
    const resultadoFilteredByJobType = _.filter(resultadoFilteredByOrderId, {
      job_type: 1,
    });
    const resultadoFilteredByItemLabel = resultadoFilteredByJobType.filter(
      (item) => item.custom_field[11].label !== "Items"
    );
    const resultadoFilteredByComercio = resultadoFilteredByItemLabel.filter(
      (item) => {
        console.info("FILTRO", item.job_pickup_name, comerciosFilter);
        return comerciosFilter.length > 0
          ? !!comerciosFilter.find(
              (comercio) => comercio.value === item.job_pickup_name
            )
          : true;
      }
    );
    const resultadoWithFleetName = resultadoFilteredByComercio.map((res) => {
      const fleetName = jobList.find(
        (job) => job.job_id === res.job_id
      ).fleet_name;
      return { ...res, fleet_name: fleetName };
    });
    console.info({ resultadoWithFleetName });
    const listOfComercios = [
      ...new Set(
        resultadoWithFleetName.map((item) => ({
          value: item.job_pickup_name,
          label: item.job_pickup_name,
        }))
      ),
    ];
    const uniqComercios = _.uniqBy(
      listOfComercios,
      (comercio) => comercio.label
    );
    setOptionsComercios(_.uniq(uniqComercios));
    setComerciosFilter(_.uniq(uniqComercios));

    setData(resultadoWithFleetName);
    setDataBackup(resultadoWithFleetName);
    setIsLoading(false);
  };

  const handleChange = async (e) => {
    e.persist();
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const selectNotification = async (order) => {
    const datowallet = {
      fleet_id: order.fleet_id,
      amount: 0,
      transaction_type: 2,
      reference_id: String(order.job_id),
      wallet_type: 2,
      description: "Propina del pedido: " + order.job_id,
    };
    setIsLoading(true);
    const transaccion = await api.create_transaction(datowallet);

    const fleet_profile = await api.view_fleet_profile(order.fleet_id);
    setData((data) => {
      console.info({ data, order });
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
    setModalEliminar((modalEliminar) => !modalEliminar);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      fetchJobs();
    }
  }, [dateFilter, searchFilter, comerciosFilter]);

  const handleSearchChange = (e) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        setSearchFilter(e.target.value);
      }, 500)
    );
  };

  const comercios = [
    { value: "ocean1", label: "Ocean" },
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
    { value: "yellow", label: "Yellow" },
    { value: "green", label: "Green" },
    { value: "forest", label: "Forest" },
    { value: "slate", label: "Slate" },
    { value: "silver", label: "Silver" },
  ];

  return (
    <div className="App">
      <br />
      <h1>PROPINAS</h1>
      <br />
      <div class="container">
        <div class="row">
          <div class="col-sm">
            Fecha:
            <br />
            <DatePicker
              selected={dateFilter}
              onChange={(date) => setDateFilter(date)}
            />
          </div>
          <div class="col-sm">
            Buscar:
            <br />
            <input placeholder="Buscar..." onChange={handleSearchChange} />
          </div>
          <div class="col-sm">
            Comercios:
            <br />
            <ReactSelect
              options={optionsComercios}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{ Option }}
              onChange={(selected) => {
                setComerciosFilter(selected);
              }}
              allowSelectAll={true}
              value={comerciosFilter}
            />
          </div>
        </div>
      </div>
      <ExcelFile
        filename="reporte"
        element={
          <button
            className="btn btn-success"
            style={{ width: "98%", margin: "6px" }}
          >
            Exportar Excel {">>"}
          </button>
        }
      >
        <ExcelSheet data={data} name="Reporte">
          <ExcelColumn label="Job ID" value="job_id" />
          <ExcelColumn
            label="Nombre"
            value={(col) =>
              col.custom_field[0].data
                ? col.custom_field[0].data
                : col.custom_field[1].data
            }
          />

          <ExcelColumn
            label="Venta Total sin descuento"
            value={(col) =>
              col.custom_field[11].label !== "Items"
                ? "$" + col.custom_field[11].data
                : "SIN PROPINA"
            }
          />
          <ExcelColumn
            label="Venta total con descuento"
            value={(col) =>
              col.custom_field[11].label !== "Items"
                ? "$" + ((col.custom_field[11].data * 3.5) / 100).toFixed(2)
                : "SIN PROPINA"
            }
          />
          <ExcelColumn
            label="Recibe"
            value={(col) =>
              col.custom_field[11].label !== "Items"
                ? "$" +
                  (
                    col.custom_field[11].data -
                    (col.custom_field[11].data * 3.5) / 100
                  ).toFixed(2)
                : "SIN PROPINA"
            }
          />
          <ExcelColumn label="Motorizado" value="fleet_name" />
        </ExcelSheet>
      </ExcelFile>

      <DataTable
        columns={[
          {
            name: "Order ID",
            sortable: true,
            cell: (row) => row["job_id"],
          },
          {
            name: "Nombre",
            sortable: true,
            cell: (row) => <div>{row.job_pickup_name}</div>,
          },
          {
            name: "Propina",
            sortable: true,
            cell: (row) => (
              <div>
                {row.custom_field[11].label !== "Items"
                  ? "$" + row.custom_field[11].data
                  : "SIN PROPINA"}
              </div>
            ),
          },
          {
            name: "3.5%",
            sortable: true,
            cell: (row) => (
              <div>
                {row.custom_field[11].label !== "Items"
                  ? "$" + ((row.custom_field[11].data * 3.5) / 100).toFixed(2)
                  : "SIN PROPINA"}
              </div>
            ),
          },
          {
            name: "Recibe",
            sortable: true,
            cell: (row) => (
              <div>
                {row.custom_field[11].label !== "Items"
                  ? "$" +
                    (
                      row.custom_field[11].data -
                      (row.custom_field[11].data * 3.5) / 100
                    ).toFixed(2)
                  : "SIN PROPINA"}
              </div>
            ),
          },
          {
            name: "Motorizado",
            sortable: true,
            cell: (row) => (
              <div>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    selectNotification(row);
                  }}
                >
                  {row.fleet_name}
                </button>
              </div>
            ),
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
      <ModalEliminar
        noti={noti}
        isOpen={modalEliminar}
        setModalEliminar={setModalEliminar}
        setIsLoading={setIsLoading}
        total={total}
      />
    </div>
  );
};

export default Propina;
