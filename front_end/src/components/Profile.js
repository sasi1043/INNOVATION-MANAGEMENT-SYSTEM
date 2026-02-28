import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoleContext } from "../context/RoleContext";

const API = process.env.REACT_APP_BACKEND_URL;

function Profile() {
  const navigate = useNavigate();
  const { rolefun, userfun, emailfun, userId } = useRoleContext();

  useEffect(() => {
    const fetchViaBrowser = async () => {
      try {
        // IMPORTANT: browser-level fetch (not axios)
        const res = await fetch(`${API}/auth/profile`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();

        // save user
        localStorage.setItem("User", JSON.stringify(data));

        // set context
        userfun(data.name);
        rolefun(data.role);
        emailfun(data.email);
        userId(data.id);

        navigate("/home", { replace: true });
      } catch (err) {
        console.error("Profile auth failed");
        navigate("/", { replace: true });
      }
    };

    fetchViaBrowser();
  }, []);

  return <p>Redirecting...</p>;
}

export default Profile;
