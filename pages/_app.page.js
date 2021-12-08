import Router from 'next/router';
import NProgress from 'nprogress';

import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/App.css";
import "../styles/nprogress.css";

Router.events.on('routeChangeStart', _ => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
export default MyApp;
