"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { auth, db, storage } from "../../../config/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import Image from "next/image";

export default function App() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>({});
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);

  const fetchUserData = () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;

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

        return unsubscribe;
      } catch (error) {
        console.error("Erro ao configurar listener de dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário conectado.");
    }
  };

  const fetchServices = () => {
    try {
      const servicesCollectionRef = collection(db, "users");

      // Listener em tempo real para a coleção de serviços
      const unsubscribe = onSnapshot(servicesCollectionRef, (querySnapshot) => {
        const user = auth.currentUser;
        const servicesData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((service) => service.id !== user?.uid); // Filtra o próprio usuário

        setServices(servicesData);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
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

    const unsubscribeUser = fetchUserData();
    const unsubscribeServices = fetchServices();

    return () => {
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeServices) unsubscribeServices();
    };
  }, [router]);

  return (
    <div className="flex">
      <SideBar
        nome={userData.nome}
        cargo={userData.cargo}
        isEmplloyee={true}
        src={userPhotoURL || userData.foto}
      />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Serviços Disponíveis</h1>
        <ul className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-4 border rounded-md shadow-md flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Image
                  className="rounded"
                  src={service.foto}
                  alt="foto"
                  width={40}
                  height={40}
                />
                <div>
                  <h2 className="text-lg font-semibold">{service.nome}</h2>
                  <p>{service.description}</p>
                  {service.cargo && (
                    <p className="text-gray-700">{service.cargo}</p>
                  )}
                </div>
              </div>
              <button className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600">
                Conversar
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
