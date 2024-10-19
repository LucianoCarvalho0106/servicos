"use client"

import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../../config/firebase";

export default function App() {
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
          localStorage.setItem('userData', JSON.stringify(data)); // Armazenando os dados no localStorage
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
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData)); // Usando os dados armazenados
    } else {
      fetchUserData(); // Buscar dados do Firestore se não estiverem armazenados
    }

    const token = localStorage.getItem('user');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  useEffect(()=>{fetchUserData()},[])

  return (
    <>
      <SideBar nome={userData.nome} cargo={userData.cargo} isEmplloyee={true} src={userData.foto}></SideBar>
    </>
  );
}
