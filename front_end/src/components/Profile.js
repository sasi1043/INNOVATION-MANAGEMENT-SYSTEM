import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoleContext } from "../context/RoleContext";

const API = process.env.REACT_APP_BACKEND_URL;

function Profile() {
  const navigate = useNavigate();
  const { rolefun, userfun, emailfun, userId } = useRoleContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid");

    if (!uid) {
      navigate("/?error=invalid_user", { replace: true });
      return;
    }

    fetch(`${API}/user/${uid}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("User", JSON.stringify(data));

        userfun(data.name);
        rolefun(data.role);
        emailfun(data.email);
        userId(data._id);

        navigate("/home", { replace: true });
      })
      .catch(() => {
        navigate("/?error=invalid_user", { replace: true });
      });
<<<<<<< HEAD
  }, []);
=======
  }, [emailfun, rolefun, userfun, userId, navigate]);
>>>>>>> 24dbd94 (Updated React project with new changes and bug fixes)

  return <p>Redirecting...</p>;
}

<<<<<<< HEAD
export default Profile;
=======
export default Profile;
>>>>>>> 24dbd94 (Updated React project with new changes and bug fixes)
