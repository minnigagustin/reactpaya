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
      .where("count", "==", 1)
      .limit(100)
      .get()
      .then(async (orderCollection) => {
        const docs = orderCollection.docs;
        await docs.map(async (doc) => {
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
    const documentSnapshotArray = await dbOrders.where("count", "==", 1).get();
    const batch = firestore.batch();

    console.info({ docs: documentSnapshotArray.docs });

    documentSnapshotArray.forEach((documentSnapshot) => {
      let documentData = documentSnapshot.data();

      if (documentData?.orders?.length === 1) {
        documentData = { ...documentData.orders[0], migrated: true };
      }
      console.info({ documentData });

      batch.update(documentSnapshot.ref, documentData);
    });

    const commmit = await batch.commit();
    console.info({ commmit });

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
