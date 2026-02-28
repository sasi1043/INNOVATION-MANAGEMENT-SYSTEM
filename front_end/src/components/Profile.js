import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoleContext } from "../context/RoleContext";

const API = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { rolefun, userfun, emailfun, userId } = useRoleContext();

  useEffect(() => {
    let attempts = 0;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/auth/profile`);

        const data = res.data;

        // store user
        localStorage.setItem("User", JSON.stringify(data));

        // context updates
        userfun(data.name);
        rolefun(data.role);
        emailfun(data.email);
        userId(data.id);

        // go home
        navigate("/home", { replace: true });
      } catch (err) {
        attempts += 1;

        if (attempts < 6) {
          // wait for session cookie to settle
          setTimeout(fetchProfile, 1000);
        } else {
          console.error("Profile fetch failed");
          navigate("/", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return <p>{loading ? "Loading..." : "Redirecting..."}</p>;
}

export default Profile;
