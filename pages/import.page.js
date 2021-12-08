import React from "react";
import firebase from "../components/firebase";

const firestore = firebase.firestore();
const dbOrders = firestore.collection("orders");

const Import = () => {
  const [importedOrders, setImportedOrders] = React.useState([]);

  const importOrders = () => {
    dbOrders
      .where("count", "==", 1)
      .get()
      .then(async (orderCollection) => {
        orderCollection.docs.forEach(async (order) => {
          console.info({ data: order.data() });
        });
        console.info({ cantidad_total: orderCollection.docs.length });
      });
  };

  const batchChange = async () => {
    const documentSnapshotArray = await dbOrders.where("count", "==", 1).get();
    const batch = firestore.batch();

    // console.info({ docs: documentSnapshotArray.docs });

    documentSnapshotArray.forEach((documentSnapshot) => {
      let documentData = documentSnapshot.data();

      if (documentData?.orders?.length === 1) {
        documentData = { ...documentData.orders[0], migrated: true };
      }
      // console.info({ documentData });

      batch.update(documentSnapshot.ref, documentData);
    });

    const commmit = await batch.commit();
    // console.info({ commmit });

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
    </div>
  );
};

export default Import;
