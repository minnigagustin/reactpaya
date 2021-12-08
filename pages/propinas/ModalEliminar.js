import { Modal, ModalBody, ModalFooter } from "reactstrap";

import api from "../../components/api";

const ModalEliminar = ({ noti, isOpen, setModalEliminar, setIsLoading, total }) => {
  const enviarNotificacion = async () => {
    setIsLoading(true);
    const notiid = [];
    notiid.push(noti.id);
    const dato = {
      fleet_ids: notiid,
      message:
        "Hola " +
        noti.nombre +
        ", hemos realizado una transferencia a tu cuenta por $" +
        total,
    };
    const notification = await api.send_notification(dato);
    console.info({ notification });
    setModalEliminar((modalEliminar) => !modalEliminar);
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} centered={true}>
      <ModalBody>
        <div className="form-group">
          <label htmlFor="nombre">
            Monto depositado a {noti.nombre + " "}{" "}
          </label>
          <label htmlFor="nombr"> - TOTAL: {" " + noti.total}</label>
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          className="btn btn-danger"
          onClick={() => setModalEliminar(false)}
        >
          Salir
        </button>
        <button className="btn btn-success" onClick={enviarNotificacion}>
          Notificacion
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalEliminar;
