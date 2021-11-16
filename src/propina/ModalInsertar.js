import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Container,
  Row,
  Col,
} from "reactstrap";

import api from "../api";

const ModalEliminar = ({
  data,
  form,
  isOpen,
  setModalInsertar,
  setIsLoading,
  handleChange,
  tipoModal,
}) => {
  const update = async () => {
    setIsLoading(true);
    await api.create_transaction({
      fleet_id: form.id,
      amount: form.total,
      transaction_type: form.aurest,
      reference_id: form.reference_id,
      wallet_type: form.crediwallet,
      description: form.razon,
    });
    setModalInsertar((modalInsertar) => !modalInsertar);
    setIsLoading(false);
  };

  const insert = async () => {
    delete form.id;
    setIsLoading(true);
    await api.get_job_and_fleet_details(form);
    setIsLoading(false);
    setModalInsertar((modalInsertar) => !modalInsertar);
  };

  return (
    <Modal isOpen={isOpen} centered={true}>
      <ModalHeader style={{ display: "block" }}>
        <span
          style={{ float: "right" }}
          onClick={() => setModalInsertar((modalInsertar) => !modalInsertar)}
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
            onChange={handleChange}
            value={form ? form.id : data.length + 1}
          />
          <br />
          <label htmlFor="nombre">Nombre</label>
          <input
            className="form-control"
            type="text"
            name="nombre"
            id="nombre"
            readOnly
            onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
              onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            value={form ? form.razons : ""}
          />
        </div>
      </ModalBody>

      <ModalFooter>
        {tipoModal === "insertar" ? (
          <button className="btn btn-success" onClick={insert}>
            Insertar
          </button>
        ) : (
          <button className="btn btn-primary" onClick={update}>
            Actualizar
          </button>
        )}
        <button
          className="btn btn-danger"
          onClick={() => setModalInsertar((modalInsertar) => !modalInsertar)}
        >
          Cancelar
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalEliminar;
