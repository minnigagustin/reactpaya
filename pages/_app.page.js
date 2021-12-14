import Router from "next/router";
import NProgress from "nprogress";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/App.css";
import "../styles/nprogress.css";

Router.events.on("routeChangeStart", (_) => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={5000} closeOnClick />
    </>
  );
}
export default MyApp;
