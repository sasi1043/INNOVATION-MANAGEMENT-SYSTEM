import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRoleContext } from '../context/RoleContext';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { rolefun, userfun, emailfun, userId } = useRoleContext();

  useEffect(() => {
  const load = async () => {
    try {
      const res = await axios.get(`${API}/auth/profile`, {
        withCredentials: true,
      });

      const data = res.data;

      localStorage.setItem("User", JSON.stringify(data));
      setUser(data);

      userfun(data.name);
      rolefun(data.role);
      emailfun(data.email);
      userId(data.id);

      navigate("/home", { replace: true });
    } catch (e) {
      console.log("Retrying profile fetch...");
      setTimeout(load, 800); // 👈 IMPORTANT delay
    }
  };

  load();
}, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return <p>User Login Successful</p>;
}

export default Profile;
