import NProgress from "nprogress";

import { Modal, ModalBody, ModalFooter } from "reactstrap";
import api from "../../components/api";

const ModalEnviarPropinas = ({ isOpen, onClose, data }) => {
  const enviarPropinas = async () => {
    NProgress.start();
    try {
      const envios = data.map((job) => {
        const datowallet = {
          fleet_id: job.fleet_id,
          amount: (
            job.custom_field[11].data -
            (job.custom_field[11].data * 3.5) / 100
          ).toFixed(2),
          transaction_type: 2,
          reference_id: String(job.job_id),
          wallet_type: 2,
          description: "Propina del pedido: " + job.job_id,
        };
        return process.env.NODE_ENV === "development"
          ? new Promise((resolve) => {
              setTimeout(() => {
                console.log(`Esperamos ${13000}ms`);
                resolve();
              }, 13000);
            })
          : api.create_transaction(datowallet);
      });
      await Promise.all(envios);
      NProgress.done();
      onClose();
    } catch (e) {
      NProgress.done();
      console.log(e);
    }
  };

  return (
    <Modal isOpen={isOpen} centered={true}>
      <ModalBody>
        <h4>Desea enviar la siguientes propinas?</h4>
        <div className="py-4 overflow-auto w-auto" style={{ height: "300px" }}>
          {data.map((job, index) => {
            const deliveryFee = job.fields.custom_field.find(
              (field) => field.label === "Delivery_Fee"
            )?.data;
            return (
              <div>
                {job.fleet_name}: $
                {(deliveryFee - (deliveryFee * 3.5) / 100).toFixed(2)}
              </div>
            );
          })}
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-danger" onClick={() => onClose(false)}>
          Salir
        </button>
        <button className="btn btn-success" onClick={enviarPropinas}>
          Enviar
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalEnviarPropinas;
