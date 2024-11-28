"use client";

import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import { doc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../../../config/firebase";

export default function App() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>({});
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);

  const fetchUserData = () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid; // Obtém o uid do usuário

      try {
        const userDocRef = doc(db, "users", uid);

        // Listener em tempo real
        const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUserData(data);

            // Atualizar localStorage
            localStorage.setItem("userData", JSON.stringify(data));

            // Buscar a foto no Firebase Storage
            try {
              const photoRef = ref(storage, `/uploads/${uid}`);
              const photoURL = await getDownloadURL(photoRef);
              setUserPhotoURL(photoURL);
            } catch (error) {
              console.error("Erro ao buscar imagem:", error);
            }
          } else {
            console.log("Nenhum documento encontrado para este usuário.");
          }
        });

        // Retorna a função de cleanup para o listener
        return unsubscribe;
      } catch (error) {
        console.error("Erro ao configurar listener de dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário conectado.");
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    const token = localStorage.getItem("user");
    if (!token) {
      router.push("/");
    }

    // Configura o listener em tempo real
    const unsubscribe = fetchUserData();

    // Cleanup ao desmontar o componente
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router]);

  return (
    <div className="flex">
      <SideBar
        nome={userData.nome}
        cargo={userData.cargo}
        isEmplloyee={true}
        src={userPhotoURL || userData.foto} // Usa a URL do Storage ou fallback para a propriedade "foto"
      />
      <div></div>
    </div>
  );
}
