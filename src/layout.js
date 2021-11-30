import React from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Layout = ({ children, title }) => {
  const location = useLocation();
  if (localStorage.getItem("authenticated") !== "true") {
    window.location.href = "/";
  }

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    window.location.href = "/";
  };

  return (
    <>
      <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
        <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">
          Payá Reports
        </a>
      </nav>
      <div class="container-fluid">
        <div class="row">
          <nav class="col-md-2 d-none d-md-block bg-light sidebar">
            <div class="sidebar-sticky">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a
                    class={`nav-link ${
                      location.pathname === "/payatookan" ? "active" : ""
                    }`}
                    href="/payatookan"
                  >
                    <i class="bi bi-house"></i> General
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class={`nav-link ${
                      location.pathname === "/payatookan/panel" ? "active" : ""
                    }`}
                    href="/payatookan/panel"
                  >
                    <span data-feather="Layout"></span>
                    <i class="bi bi-card-list"></i> Panel
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class={`nav-link ${
                      location.pathname === "/payatookan/propina"
                        ? "active"
                        : ""
                    }`}
                    href="/payatookan/propina"
                  >
                    <i class="bi bi-cash-coin"></i> Propinas
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class={`nav-link ${
                      location.pathname === "/payatookan/auto" ? "active" : ""
                    }`}
                    href="/payatookan/auto"
                  >
                    <span data-feather="file"></span>
                    <i class="bi bi-arrow-clockwise"></i> Automatización
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class={`nav-link ${
                      location.pathname === "/payatookan/envios" ? "active" : ""
                    }`}
                    href="/payatookan/envios"
                  >
                    <span data-feather="file"></span>
                    <i class="bi bi-bicycle"></i> Envíos
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class={`nav-link ${
                      location.pathname === "/payatookan/noti" ? "active" : ""
                    }`}
                    href="/payatookan/noti"
                  >
                    <span data-feather="file"></span>
                    <i class="bi bi-bell"></i> Notificaciones
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
              <h1 class="h2">{title}</h1>
              <ul class="navbar-nav px-3">
                <li class="nav-item text-nowrap">
                  <button class="btn btn-secondary" onClick={handleLogout}>
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
