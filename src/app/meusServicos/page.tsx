"use client";

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
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null); // Serviço selecionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal
  const storage = getStorage();

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

  const handleServiceClick = (servico: Servico) => {
    setSelectedServico(servico); // Define o serviço selecionado
    setIsModalOpen(true); // Abre o modal
  };

  const handleCloseModal = () => {
    setSelectedServico(null); // Remove o serviço selecionado
    setIsModalOpen(false); // Fecha o modal
  };

  const handleUpdateService = (servico: Servico) => {
    console.log("Atualizando serviço:", servico.nome);
    // Adicione aqui a lógica para atualizar o serviço
  };

  const handleDeleteService = async (servico: Servico) => {
    console.log("Excluindo serviço:", servico.nome);

    // Excluir logo do serviço do Firebase Storage
    if (servico.logo) {
      const logoRef = ref(storage, servico.logo);
      try {
        await deleteObject(logoRef);
        console.log("Logo excluído com sucesso.");
      } catch (error) {
        console.error("Erro ao excluir logo:", error);
      }
    }

    // Atualizar o Firestore removendo o serviço
    if (userData) {
      const updatedServicos = userData.servicos.filter(
        (s) => s.nome !== servico.nome
      );
      const userDocRef = doc(db, "users", auth.currentUser!.uid);

      try {
        await updateDoc(userDocRef, { servicos: updatedServicos });
        console.log("Serviço excluído do Firestore.");
        setUserData({ ...userData, servicos: updatedServicos });
        localStorage.setItem(
          "userData",
          JSON.stringify({ ...userData, servicos: updatedServicos })
        );
      } catch (error) {
        console.error("Erro ao atualizar Firestore:", error);
      }
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
            className="border border-gray-500 rounded w-full my-2 p-2 flex items-center gap-2"
            key={servico.nome}
          >
            {/* Clique no restante do card para abrir o modal */}
            <div
              className="flex-1 cursor-pointer"
              onClick={() => handleServiceClick(servico)}
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
              <div className="font-semibold capitalize">{servico.nome}</div>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center gap-6">
              <button onClick={() => handleUpdateService(servico)}>
                <Image
                  src="/images/atualizar.png"
                  width={30}
                  height={30}
                  alt="atualizar"
                />
              </button>
              <button onClick={() => handleDeleteService(servico)}>
                <Image
                  src="/images/excluir.png"
                  width={30}
                  height={30}
                  alt="excluir"
                />
              </button>
            </div>
          </div>
        ))}

        {/* Modal */}
        {isModalOpen && selectedServico && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 max-w-full flex flex-col items-center text-center">
              {/* Título */}
              <h2 className="text-xl font-bold mb-4">{selectedServico.nome}</h2>

              {/* Foto */}
              {selectedServico.logo && (
                <div className="w-32 h-32 mb-4">
                  <Image
                    className="object-cover rounded-full"
                    src={selectedServico.logo}
                    alt={`Logo do serviço ${selectedServico.nome}`}
                    width={128}
                    height={128}
                  />
                </div>
              )}

              {/* Descrição com rolagem */}
              <div className="text-sm text-gray-600 mb-6 break-words overflow-y-auto max-h-40 w-full px-2">
                {selectedServico.descricao}
              </div>

              {/* Botão de Fechar */}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={handleCloseModal}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
