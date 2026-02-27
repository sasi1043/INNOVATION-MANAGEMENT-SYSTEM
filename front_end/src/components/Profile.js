import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../context/RoleContext';
import { useNavigate } from 'react-router-dom';

const API= process.env.REACT_APP_BACKEND_URL
axios.defaults.withCredentials = true;


function Profile() {

    const navigate = useNavigate()
    const[user,setUser]=useState(null);
    const {rolefun , userfun , emailfun,userId} = useRoleContext();

    useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/auth/profile`, {
          withCredentials: true,
        });
        localStorage.setItem("User",JSON.stringify(res.data))
        setUser(res.data);
        userfun(res.data.name); 
        rolefun(res.data.role);
        emailfun(res.data.email);
        userId(res.data.id);
        navigate('/home');
        
      } catch (e) {
        console.log("Profile error:", e.response?.status, e.response?.data);
      }
    };

    load();
  }, [rolefun, emailfun,userfun, navigate,userId]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
   <p>user Login Successfull</p>
  )
}

export default Profile
