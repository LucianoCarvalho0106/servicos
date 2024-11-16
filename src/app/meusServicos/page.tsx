"use client"
import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { auth, db } from "../../../config/firebase";
import Image from "next/image";

type Servico = {
  descricao: string;
  nome: string;
  logo?: string;
};

type Atividade = {
  descricaoAtividades: string;
  empresa: string;
  cargo: string;
  contato: string;
  descricaoHabilidades: string;
  endereco: string;
  foto: string;
  idade: string;
  nome: string;
  servicos: Servico[];
};

export default function MeusServicos() {
  const router = useRouter();
  const [userData, setUserData] = useState<Atividade | null>(null);
  const storage = getStorage(); // Inicializa o Firebase Storage

  const fetchUserData = async () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;

      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as Atividade;
          setUserData(data);
          localStorage.setItem("userData", JSON.stringify(data));
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

  const handleDeleteServico = async (servicoNome: string, logoPath?: string) => {
    if (!userData) return;

    const updatedServicos = userData.servicos.filter(
      (servico) => servico.nome !== servicoNome
    );

    const updatedUserData = { ...userData, servicos: updatedServicos };

    try {
      // Excluir a imagem associada ao serviço no Storage
      if (logoPath) {
        const logoRef = ref(storage, logoPath);
        await deleteObject(logoRef);
        console.log(`Imagem "${logoPath}" excluída com sucesso.`);
      }

      // Atualizar o Firestore
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, { servicos: updatedServicos });
      }

      // Atualizar o estado e o localStorage
      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      console.log(`Serviço "${servicoNome}" excluído com sucesso.`);
    } catch (error) {
      console.error("Erro ao excluir o serviço ou imagem:", error);
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      fetchUserData();
    }

    const token = localStorage.getItem("user");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="flex w-screen h-screen">
      <SideBar
        nome={userData?.nome || ""}
        cargo={userData?.cargo || ""}
        isEmplloyee={true}
        src={userData?.foto || ""}
      ></SideBar>
      <div className="w-full p-4">
        {userData?.servicos?.map((servico: Servico) => (
          <div
            className="border border-gray rounded w-full my-2 p-2 flex items-center gap-2"
            key={servico.nome}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <Image
                className="object-cover"
                src={servico.logo || "/images/placeholder.png"}
                height={64}
                width={64}
                alt={`Logo do serviço ${servico.nome}`}
              />
            </div>
            <div className="w-full flex justify-between">
              <div className="font-semibold capitalize">{servico.nome}</div>
              <div className="flex items-center gap-6 mr-6">
                <button>
                  <Image
                    src="/images/atualizar.png"
                    width={30}
                    height={30}
                    alt="atualizar"
                  />
                </button>
                <button
                  onClick={() =>
                    handleDeleteServico(servico.nome, servico.logo)
                  }
                >
                  <Image
                    src="/images/excluir.png"
                    width={30}
                    height={30}
                    alt="excluir"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
