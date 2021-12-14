import { useEffect, useState } from "react";
import NProgress from "nprogress";
import { getDeliveryFee } from "../../components/utils";
import { Row, Col, Modal, ModalBody, ModalFooter } from "reactstrap";
import api from "../../components/api";
import { toast } from "react-toastify";
import { Formik, FieldArray, Form } from "formik";
const ModalEnviarPropinas = ({ isOpen, onClose, data, setTipsSent }) => {
  const [sendNotifications, setSendNotifications] = useState(false);
  const [initialJobs, setInitialJobs] = useState([]);
  const enviarPropinas = async (values) => {
    NProgress.start();
    try {
      const envios = values.jobs.map((job) => {
        const transaction = {
          fleet_id: job.fleet_id,
          amount: job.amount,
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
                job.fleet_name +
                ", hemos realizado una transferencia a tu cuenta por $" +
                job.amount,
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

  useEffect(() => {
    setInitialJobs(
      data.map((job) => {
        const deliveryFee = getDeliveryFee(job.fields.custom_field);
        return {
          fleet_id: job.fleet_id,
          job_id: job.job_id,
          amount: (deliveryFee - (deliveryFee * 3.5) / 100).toFixed(2),
          fleet_name: job.fleet_name,
          job_pickup_name: job.job_pickup_name,
        };
      })
    );
  }, [data]);

  return (
    <Modal isOpen={isOpen} centered={true}>
      <Formik
        initialValues={{
          jobs: initialJobs,
        }}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={enviarPropinas}
        render={(formik) => (
          <>
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
              <div
                style={{
                  height: "300px",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <FieldArray
                  name="supportFiles"
                  validateOnChange={false}
                  render={(arrayHelpers) => (
                    <>
                      {formik.values.jobs?.map((job, index) => {
                        return (
                          <Row className="justify-content-start my-2">
                            <Col className="align-self-center col-8">
                              {job.fleet_name}: <br />
                              <small style={{ fontSize: "11px" }}>
                                #{job.job_id} - {job.job_pickup_name}
                              </small>
                            </Col>
                            <Col className="align-self-center col-4">
                              <input
                                className=""
                                type="text"
                                key={`jobs-${index}`}
                                id={`jobs.${index}.amount`}
                                name={`jobs.${index}.amount`}
                                onChange={formik.handleChange}
                                value={job.amount}
                                maxLength={256}
                              />
                            </Col>
                          </Row>
                        );
                      })}
                    </>
                  )}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={() => onClose(false)}>
                Salir
              </button>
              <button className="btn btn-success" onClick={formik.handleSubmit}>
                Enviar
              </button>
            </ModalFooter>
          </>
        )}
      />
    </Modal>
  );
};

export default ModalEnviarPropinas;
