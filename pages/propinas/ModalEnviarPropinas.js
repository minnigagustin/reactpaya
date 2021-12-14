import { useState } from "react";
import NProgress from "nprogress";
import { getDeliveryFee } from "../../components/utils";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import api from "../../components/api";
import { toast } from "react-toastify";

const ModalEnviarPropinas = ({ isOpen, onClose, data, setTipsSent }) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendNotifications, setSendNotifications] = useState(false);

  const allProgress = (proms) => {
    let d = 0;
    setProgress(0);
    setLoading(true);
    for (const p of proms) {
      p.then(() => {
        d++;
        const p = (d * 100) / proms.length;
        console.log(`% Done = ${p.toFixed(2)}`);
        setProgress(p.toFixed(2));
      });
    }
    return Promise.all(proms);
  };

  const enviarPropinas = async () => {
    NProgress.start();
    try {
      setLoading(true);
      const envios = data.map((job) => {
        const deliveryFee = getDeliveryFee(job.fields.custom_field);
        const transaction = {
          fleet_id: job.fleet_id,
          amount: (deliveryFee.data - (deliveryFee.data * 3.5) / 100).toFixed(
            2
          ),
          transaction_type: 2,
          reference_id: String(job.job_id),
          wallet_type: 2,
          description: "Propina del pedido: " + job.job_id,
        };
        const promises = [];
        if (process.env.NODE_ENV === "development") {
          const espera = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
          const promesaMock = new Promise((resolve) => {
            setTimeout(() => {
              resolve({ ok: true });
            }, espera);
          });
          promises.push(promesaMock);
          if (sendNotifications) {
            promises.push(promesaMock);
          }
        } else {
          promises.push(api.create_transaction(transaction));
          if (sendNotifications) {
            const notification = {
              fleet_ids: job.fleet_id,
              message:
                "Hola " +
                fleet_profile.data.data.fleet_details[0].first_name +
                " " +
                fleet_profile.data.data.fleet_details[0].last_name +
                ", hemos realizado una transferencia a tu cuenta por $" +
                (deliveryFee - (deliveryFee * 3.5) / 100).toFixed(2),
            };
            promises.push(api.send_notification(notification));
          }
        }
        return toast.promise(
          Promise.all(promises),
          {
            pending: `Enviando dinero ${
              sendNotifications ? " y notificación" : ""
            } a motorista`,
            success: "Dinero enviado 👌",
            error: "Error al enviar el dinero 🤯",
          },
          {
            autoClose: 1000,
          }
        );
      });
      await Promise.all(envios);
      NProgress.done();
      setLoading(false);
      onClose(false);
      toast("Las propinas han sido enviadas", {
        variant: "success",
      });
      setTipsSent(true);
    } catch (e) {
      NProgress.done();
      console.info(e);
    }
  };

  return (
    <Modal isOpen={isOpen} centered={true}>
      <ModalBody>
        <h4>Desea enviar la siguientes propinas?</h4>
        <div className="py-4 px-2">
          <input
            type="checkbox"
            onChange={(e) => {
              console.info({ e });
              setSendNotifications(e);
            }}
          />{" "}
          <i>Enviar notificaciónes a los motoristas</i>
        </div>
        <div className="overflow-auto w-auto" style={{ height: "300px" }}>
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
