import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./tookan";
import Gps from "./gps";
import Automatizacion from "./automatizacion";
import Panel from "./panel";
import Notif from "./notif";
import Import from "./import";
import Propina from "./propina";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path="/payatookan" exact>
          <Home />
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
      </BrowserRouter>
    );
  }
}
export default App;
