import React from "react";
import { useRouter } from "next/router";

const Layout = ({ children, title }) => {
  const router = useRouter();
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("authenticated") !== "true"
  ) {
    router.push("/login");
    // window.location.href = "/login";
  }

  const handleLogout = () => {
    typeof window !== "undefined" && localStorage.removeItem("authenticated");
    router.push("/login");
    // window.location.href = "/login";
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
                      router.asPath === "/general" ? "active" : ""
                    }`}
                    href="/general"
                  >
                    <i className="bi bi-house"></i> General
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      router.asPath === "/panel" ? "active" : ""
                    }`}
                    href="/panel"
                  >
                    <span data-feather="Layout"></span>
                    <i className="bi bi-card-list"></i> Panel
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      router.asPath === "/propina" ? "active" : ""
                    }`}
                    href="/propina"
                  >
                    <i className="bi bi-cash-coin"></i> Propinas
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      router.asPath === "/automatizacion" ? "active" : ""
                    }`}
                    href="/automatizacion"
                  >
                    <span data-feather="file"></span>
                    <i className="bi bi-arrow-clockwise"></i> Automatización
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      router.asPath === "/envios" ? "active" : ""
                    }`}
                    href="/envios"
                  >
                    <span data-feather="file"></span>
                    <i className="bi bi-bicycle"></i> Envíos
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      router.asPath === "/notificaciones" ? "active" : ""
                    }`}
                    href="/notificaciones"
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
