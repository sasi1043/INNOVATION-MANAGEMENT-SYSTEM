import axios from "axios";
import { useEffect } from "react";
import { useRoleContext } from "../context/RoleContext";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_BACKEND_URL;

// IMPORTANT
axios.defaults.withCredentials = true;

function Profile() {
  const navigate = useNavigate();
  const { rolefun, userfun, emailfun, setUserId } = useRoleContext();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(`${API}/auth/profile`, {
          withCredentials: true,
        });

        const user = res.data;

        // save globally
        userfun(user.name);
        rolefun(user.role);
        emailfun(user.email);
        setUserId(user.id);

        // optional localStorage
        localStorage.setItem("User", JSON.stringify(user));

        // redirect AFTER state is set
        navigate("/home", { replace: true });
      } catch (err) {
        console.error("Profile fetch failed", err.response?.status);

        // 🔴 very important fallback
        navigate("/", { replace: true });
      }
    };

    loadProfile();
  }, [navigate, rolefun, userfun, emailfun, setUserId]);

  return <p>Loading...</p>;
}

export default Profile;
