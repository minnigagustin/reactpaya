import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ children, title }) => {
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === "payaadmin" && password === "payaadmin") {
      localStorage.setItem("authenticated", true);
      window.location.href = "/payatookan";
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="wrapper fadeInDown">
      <div id="formContent">
        <div className="fadeIn first pv-10">
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="logo" />
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            id="login"
            className="fadeIn second"
            name="login"
            placeholder="Usuario"
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            type="password"
            id="password"
            className="fadeIn third"
            name="login"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>{error && <p className="text-danger">{error}</p>}</div>
          <input type="submit" className="fadeIn fourth" value="Ingresar" />
        </form>
      </div>
    </div>
  );
};

export default Login;
