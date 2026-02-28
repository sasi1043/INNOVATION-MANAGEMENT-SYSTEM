import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_BACKEND_URL

const RoleContext = createContext(null);

export default function RoleProvider({ children }) {
  const navigate=useNavigate() 

  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [user_id,setUser_id]=useState("")

  useEffect(() => {
  const storedUser = localStorage.getItem("User");

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);

    setRole(parsedUser.role);
    setEmail(parsedUser.email);
    setUser(parsedUser.name);
    setUser_id(parsedUser.id);
  }
}, []);

  const rolefun = (r) => setRole(r);
  const emailfun = (mail) => setEmail(mail);
  const userfun = (n) => setUser(n);
  const userId = (id) =>setUser_id(id);
 function handlelogout() {
  // 1. Remove user from localStorage
  localStorage.removeItem("User");

  // 2. Clear context state
  setRole(null);
  setEmail("");
  setUser("");
  setUser_id("");

  // 3. Redirect to login page
  navigate("/", { replace: true });
}
  return (
    <RoleContext.Provider
      value={{
        role,
        email,
        user,
        user_id,
        rolefun,
        emailfun,
        userfun,
        userId,
        handlelogout
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used inside RoleProvider");
  }
  return context;
}
