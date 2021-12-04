import React from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Layout = ({ children, title }) => {
  const location = useLocation();
  if (localStorage.getItem("authenticated") !== "true") {
    window.location.href = "/payatookan/login";
  }

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    window.location.href = "/payatookan/login";
  };

  return (
    <>
      <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">
          Payá Reports
        </a>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 d-none d-md-block bg-light sidebar">
            <div className="sidebar-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      location.pathname === "/payatookan" ? "active" : ""
                    }`}
                    href="/payatookan"
                  >
                    <i className="bi bi-house"></i> General
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      location.pathname === "/payatookan/panel" ? "active" : ""
                    }`}
                    href="/payatookan/panel"
                  >
                    <span data-feather="Layout"></span>
                    <i className="bi bi-card-list"></i> Panel
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      location.pathname === "/payatookan/propina"
                        ? "active"
                        : ""
                    }`}
                    href="/payatookan/propina"
                  >
                    <i className="bi bi-cash-coin"></i> Propinas
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      location.pathname === "/payatookan/auto" ? "active" : ""
                    }`}
                    href="/payatookan/auto"
                  >
                    <span data-feather="file"></span>
                    <i className="bi bi-arrow-clockwise"></i> Automatización
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      location.pathname === "/payatookan/envios" ? "active" : ""
                    }`}
                    href="/payatookan/envios"
                  >
                    <span data-feather="file"></span>
                    <i className="bi bi-bicycle"></i> Envíos
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      location.pathname === "/payatookan/noti" ? "active" : ""
                    }`}
                    href="/payatookan/noti"
                  >
                    <span data-feather="file"></span>
                    <i className="bi bi-bell"></i> Notificaciones
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
              <h1 className="h2">{title}</h1>
              <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                  <button className="btn btn-secondary" onClick={handleLogout}>
                    SALIR
                  </button>
                </li>
              </ul>
            </div>
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
