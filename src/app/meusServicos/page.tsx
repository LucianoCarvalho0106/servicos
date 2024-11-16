"use client";

import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../../config/firebase";
import Image from "next/image";


type Servico = {
    descricao: string;
    nome: string;
    logo?: string; // É opcional, pois nem todos os serviços possuem logo.
  };
  
  type Atividade = {
    descricaoAtividades: string;
    empresa: string;
    cargo: string;
    contato: string;
    descricaoHabilidades: string;
    endereco: string;
    foto: string;
    idade: string; // Pode ser convertido para `number` se necessário.
    nome: string;
    servicos: Servico[];
  };
  
  type Atividades = Atividade[]; // Representa um array de atividades.

  


export default function meusServicos() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>({});

  const fetchUserData = async () => {
    const user = auth.currentUser; // Obtém o usuário atual

    if (user) {
      const uid = user.uid; // Obtém o uid do usuário

      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          console.log("Dados do usuário:", userDoc.data());
          const data = userDoc.data();
          setUserData(data);
          localStorage.setItem("userData", JSON.stringify(data)); // Armazenando os dados no localStorage
        } else {
          console.log("Nenhum documento encontrado para este usuário.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário conectado.");
    }
  };

  useEffect(() => {
    // Buscar e exibir somente o conteúdo do userData no localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      console.log("Conteúdo do userData no localStorage:", JSON.parse(storedUserData));
      setUserData(JSON.parse(storedUserData)); // Usando os dados armazenados
    } else {
      fetchUserData(); // Buscar dados do Firestore se não estiverem armazenados
    }

    const token = localStorage.getItem("user");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex w-screen h-screen">
      <SideBar
        nome={userData.nome}
        cargo={userData.cargo}
        isEmplloyee={true}
        src={userData.foto}
      ></SideBar>
      <div className="w-full p-4">
        {userData.servicos?.map((servico: Servico) => (
          <div className="border border-gray-50000 rounded w-full my-2 p-2 flex items-center gap-2" key={servico.nome}>
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <Image
                className="object-cover"
                src={servico.logo!}
                height={64}
                width={64}
                alt={`Logo do serviço ${servico.nome}`}
              />
            </div>
            <div className="w-full flex justify-between">
                <div className="font-semibold capitalize">{servico.nome}</div>
                <div className="flex items-center gap-6 mr-6">
                    <button className=""><Image src="/images/atualizar.png" width={30} height={30} alt="atualizar"></Image></button>
                    <button className=""><Image src="/images/excluir.png" width={30} height={30} alt="excluir"></Image></button>
                </div>
                
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}  
