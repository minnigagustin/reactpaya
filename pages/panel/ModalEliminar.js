import { Modal, ModalBody, ModalFooter } from "reactstrap";

const ModalEliminar = ({ isOpen, form, setModalEliminar }) => {
  return (
    <Modal isOpen={false}>
      <ModalBody>
        Estás seguro que deseas eliminar a la empresa {form && form.nombre}
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-danger" onClick={() => {}}>
          Sí
        </button>
        <button
          className="btn btn-secundary"
          onClick={() => setModalEliminar(false)}
        >
          No
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalEliminar;
