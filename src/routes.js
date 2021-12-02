import React, { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Tookan from "./tookan";
import Gps from "./gps";
import Automatizacion from "./automatizacion";
import Panel from "./panel";
import Notif from "./notif";
import Import from "./import";
import Propina from "./propina";
import Login from "./login";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path="/payatookan/login" exact>
          <Login />
        </Route>
        <Route path="/payatookan/general" exact>
          <Tookan />
        </Route>
        <Route path="/payatookan/envios/">
          <Gps />
        </Route>
        <Route path="/payatookan/propina/">
          <Propina />
        </Route>
        <Route path="/payatookan/auto/">
          <Automatizacion />
        </Route>
        <Route path="/payatookan/panel/">
          <Panel />
        </Route>
        <Route path="/payatookan/noti/">
          <Notif />
        </Route>
        <Route path="/payatookan/import/">
          <Import />
        </Route>
        <Route exact path="/payatookan/">
          <Redirect to="/payatookan/login" />
        </Route>
      </BrowserRouter>
    );
  }
}
export default App;
