import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import firebase from "./firebase";

const dbOrders = firebase.firestore().collection("orders");
const dbOrdersFlattened = firebase.firestore().collection("orders_flattened");

const Import = () => {
  const [importedOrders, setImportedOrders] = React.useState([]);
  const importOrders = () => {
    dbOrders.get().then((orderCollection) => {
      const orderCollections = orderCollection.docs.map((doc) => doc.data());
      console.info({count: orderCollections.length});
      // orderCollections.map((orderCollection) => {
      //   const order = orderCollection.orders[0];
      //   const id = order.id;
      //   delete order.id;
      //   console.info(`INSERTANDO ID ${id}:`, { id, ...order });
      //   dbOrdersFlattened.doc(String(id)).set(order);
      //   setImportedOrders((orders) => [...orders, id]);
      // });
    });
  };
  return (
    <div className="App">
      <button onClick={importOrders}>Importar</button>
      <br />
      <br />
      COUNT: {importedOrders.count}
      <br />
      {importedOrders.map((id) => (
        <div key={id}>{id}</div>
      ))}
    </div>
  );
};

export default Import;
