import logo from "../images/IMS -LOGO.jpg";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";

const API = process.env.REACT_APP_BACKEND_URL;

function Login() {
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const err = params.get("error");

    if (err === "invalid_user") {
      setError("Invalid user. Please contact admin.");
    } else {
      setError("");
    }
  }, [location.search]);

  const handleLogin = () => {
    window.location.href = `${API}/auth/google`;
  };

  return (
    <div className="d-flex justify-content-center align-items-center home-bg vh-100">
      <div className="text-center">
        {error && <p className="text-danger fw-bold">{error}</p>}

        <h4>INNOVATION MANAGEMENT SYSTEM</h4>
        <h5>Welcome</h5>

        <img src={logo} height={150} width={150} alt="ims-logo" />

        <div className="mt-4">
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ backgroundColor: "#1a73e8" }}
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
