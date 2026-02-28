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
        <div className=" text-center">
          {error && (
          <p className="text-danger mt-3 fw-bold">
            {error}
          </p>
        )}
          <div >
          <h4>INNOVATION MANAGEMENT SYSTEM</h4>
          <h5>Welcome</h5>
          <div>
            <img src={logo} height={150} width={150}  alt='ims-logo' style={{borderRadius:"50px"}}></img>
          </div>
          <div className='d-flex justify-content-center mt-4 w-100'>
        <Button
               variant="contained"
               startIcon={
               <img
                src="https://developers.google.com/identity/images/g-logo.png"
                 alt="Google"
                 style={{ width: 18, height: 18 ,borderRadius:"50px" }}
                />
                }
                 sx={{
                   backgroundColor: "#1a73e8", // Google dark blue
                   color: "white",
                   textTransform: "none",
                   fontWeight: 500,
                   borderRadius: "8px",
                   px: 2,
                   "&:hover": {
                   backgroundColor: "#1558b0",
                },
              }}
            className="w-100"
            onClick={handleLogin}
          >
       Sign in with Google
      </Button>
          </div>
          </div>
        </div>
        
    </div>
  );
}

export default Login;
