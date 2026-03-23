import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";


const RoleContext = createContext(null);

export default function RoleProvider({ children }) {
  const navigate=useNavigate() 

  // Read from localStorage during initialization
  const storedUser = localStorage.getItem("users");
  const initialUser = storedUser ? JSON.parse(storedUser) : {};

  const [role, setRole] = useState(initialUser.role || null);
  const [email, setEmail] = useState(initialUser.email || "");
  const [user, setUser] = useState(initialUser.name || "");
  const [user_id, setUser_id] = useState(initialUser._id || "");

  
  console.log(render);
  const rolefun = (r) => setRole(r);
  const emailfun = (mail) => setEmail(mail);
  const userfun = (n) => setUser(n);
  const userId = (id) =>setUser_id(id);

 function handlelogout() {
  // 1. Remove user from localStorage
  localStorage.removeItem("users");

  // 2. Clear context state
  setRole(null);
  setEmail("");
  setUser("");
  setUser_id("");

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
