"use client"
import { createContext, ReactNode, useState } from "react";

const myContext = createContext<UserContextType | undefined>(undefined);

type MyProviderProps = {
    children: ReactNode;
};

interface UserContextType {
    user: Record<string, any>; // ou uma interface mais específica para o usuário
    setUser: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export function Myprovider ({children}:MyProviderProps){
    const [user,setUser] = useState<Record<string, any>>({});

    return(
        <myContext.Provider value={{user,setUser}}>
            {children}
        </myContext.Provider>
    )
}

export default myContext;