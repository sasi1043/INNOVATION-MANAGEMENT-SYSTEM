import { createContext, useContext, useState } from "react";

const IdeaContext = createContext();


export default function IdeaProvider({children}) {


    const [currIdea , setCurrIdea] = useState(null);

    const CurrentIdea=(idea)=>{
        setCurrIdea(idea)
    }


  return (
    <IdeaContext.Provider value={{currIdea , CurrentIdea}}> {children}</IdeaContext.Provider>
  )
}

export function useIdeaContext(){
    const context = useContext(IdeaContext);
      if (!context) {
        throw new Error("useRoleContext must be used inside RoleProvider");
      }
      return context;
}