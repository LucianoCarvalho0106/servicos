"use client"
import { createContext, ReactNode, useState } from "react";
import { IdadosForm } from "../dados/etapasForm";

const myContext = createContext<UserContextType | undefined>(undefined);

type MyProviderProps = {
    children: ReactNode;
};

interface UserContextType {
    user: Record<string, any>;
    setUser: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}



export function Myprovider ({children}:MyProviderProps){
    const [user,setUser] = useState<Partial<IdadosForm>>({
        nome: '',
        contato: '',
        idade: 0,
        endereco: '',
        atividades: [
          {
            empresa: '',
            descricaoAtividades: ''
          }
        ],
        cargo: '',
        descricaoHabilidades: '',
        foto: ''
      });

    return(
        <myContext.Provider value={{user,setUser}}>
            {children}
        </myContext.Provider>
    )
}

export default myContext;