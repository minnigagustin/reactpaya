import React from "react";
import firebase from "../components/firebase";
import { useRouter } from "next/router";

const Login = ({ children, title }) => {
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    let query = firebase.firestore().collection("admins");
    setLoading(true);
    setError(null);

    query
      .where("user", "==", user)
      .where("password", "==", password)
      .get()
      .then((querySnapshot) => {
        setLoading(false);
        if (!querySnapshot.empty && typeof window !== "undefined") {
          localStorage.setItem("authenticated", true);
          router.push("/general");
        } else {
          setError("Usuario o contraseña incorrectos");
        }
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
        setError("Usuario o contraseña incorrectos");
      });
  };

  return (
    <div className="wrapper fadeInDown">
      <div id="formContent">
        <div className="fadeIn first">
          <img
            src={"/logo.png"}
            alt="logo"
            style={{ width: "200px" }}
          />
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            id="user"
            className="fadeIn second"
            name="user"
            placeholder="Usuario"
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            type="password"
            id="password"
            className="fadeIn third"
            name="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>{error && <p className="text-danger">{error}</p>}</div>
          {loading && (
            <div className="spinner-border m-4" role="status">
              <span className="sr-only">Ingresando...</span>
            </div>
          )}

          <div className="m-4">
            <input type="submit" className="fadeIn fourth" value="Ingresar" />
            <br />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
