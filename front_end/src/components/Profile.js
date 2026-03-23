import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoleContext } from "../context/RoleContext";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

function Profile() {
  const navigate = useNavigate();
  const { userfun, userId, rolefun, emailfun } = useRoleContext();

  useEffect(() => {
    const fetchUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const uid = params.get("uid");

      if (!uid) {
        navigate("/?error=invalid_user", { replace: true });
        return;
      }

      try {
        const res = await axios.get(`${API}/user/${uid}`);
        const data = res.data;
        console.log("Backend response:", data); 
        localStorage.setItem("users", JSON.stringify(data));

        // Update context
        userfun(data.name);
        rolefun(data.role);
        emailfun(data.email);
        userId(data._id);

        // Navigate to home
        if(data._id){
        navigate("/home", { replace: true });
        }
      } catch (err) {
        console.error(err);
        navigate("/?error=invalid_user", { replace: true });
      }
    };

    fetchUser();
  }, [emailfun, rolefun, userfun, userId, navigate]);

  return <p>Redirecting...</p>;
}

export default Profile;