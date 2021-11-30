import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import firebase from "./firebase";

const firestore = firebase.firestore();
const dbOrders = firestore.collection("orders");

const Import = () => {
  const [importedOrders, setImportedOrders] = React.useState([]);
  const importOrders = () => {
    dbOrders
      .where("migrated", "==", false)
      .limit(100)
      .get()
      .then((orderCollection) => {
        const docs = orderCollection.docs;
        docs.map(async (doc) => {
          const id = doc.id;
          const data = doc.data();
          console.info(`MIGRATED ${id}: `, data.orders.length === 1);
          if (data.orders.length === 1) {
            await dbOrders.doc(id).set({ ...data.orders[0], migrated: true });
          }
        });
      });
  };

  const batchChange = async () => {
    const documentSnapshotArray = await dbOrders.limit(10).get();
    const batch = firestore.batch();

    documentSnapshotArray.forEach((documentSnapshot) => {
      let documentData = documentSnapshot.data();
      console.info({ documentData });

      if (documentData?.orders?.length === 1) {
        documentData = { ...documentData.orders[0], migrated: true };
      }

      batch.update(documentSnapshot.ref, documentData);
    });

    await batch.commit();

    return;
  };

  return (
    <div className="App">
      <button onClick={importOrders}>Importar</button>
      <br />
      <br />
      <button onClick={batchChange}>BATCH</button>
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
