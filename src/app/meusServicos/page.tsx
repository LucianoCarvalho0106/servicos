"use client"
import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [updatedServico, setUpdatedServico] = useState<Servico | null>(null);
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const storage = getStorage();
  const [error, setError] = useState<string | null>(null);

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

  const handleUpdateClick = (servico: Servico) => {
    setUpdatedServico({ ...servico });
    setIsModalUpdateOpen(true);
  };

  const handleDeleteClick = async (servicoNome: string) => {
    if (userData) {
      try {
        const userDocRef = doc(db, "users", auth.currentUser!.uid);
        const updatedServicos = userData.servicos.filter(
          (servico) => servico.nome !== servicoNome
        );

        // Atualiza os dados no Firestore
        await updateDoc(userDocRef, {
          servicos: updatedServicos,
        });

        // Atualiza o estado local e o localStorage
        setUserData({ ...userData, servicos: updatedServicos });
        localStorage.setItem("userData", JSON.stringify({ ...userData, servicos: updatedServicos }));

        console.log(`Serviço ${servicoNome} excluído com sucesso.`);
      } catch (error) {
        console.error("Erro ao excluir o serviço:", error);
        setError("Falha ao excluir o serviço.");
      }
    }
  };

  const handleCloseUpdateModal = () => {
    setUpdatedServico(null);
    setNewLogo(null);
    setIsModalUpdateOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (updatedServico) {
      setUpdatedServico({
        ...updatedServico,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewLogo(e.target.files[0]);
    }
  };

  const handleUpdateService = async () => {
    if (updatedServico) {
      let newLogoURL = updatedServico.logo;

      // Se o usuário escolheu uma nova imagem
      if (newLogo) {
        try {
          const storageRef = ref(storage, `logos/${newLogo.name}`);
          await uploadBytes(storageRef, newLogo);
          newLogoURL = await getDownloadURL(storageRef); // Obtém a URL da nova imagem
        } catch (error) {
          console.error("Erro ao fazer upload da imagem:", error);
          setError("Falha ao carregar a nova imagem.");
          return;
        }
      }

      updatedServico.logo = newLogoURL;

      // Atualiza o Firestore
      if (userData) {
        const userDocRef = doc(db, "users", auth.currentUser!.uid);
        const updatedServicos = userData.servicos.map((servico) =>
          servico.nome === selectedServico?.nome
            ? updatedServico // Substitui o serviço antigo pelo novo
            : servico
        );

        try {
          // Atualiza o Firestore com os novos dados do serviço
          await updateDoc(userDocRef, {
            servicos: updatedServicos,
          });

          // Atualiza o estado local com os dados atualizados
          setUserData({ ...userData, servicos: updatedServicos });
          localStorage.setItem("userData", JSON.stringify({ ...userData, servicos: updatedServicos }));

          handleCloseUpdateModal();
        } catch (error) {
          console.error("Erro ao atualizar Firestore:", error);
          setError("Falha ao atualizar os dados no Firestore.");
        }
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

  // Função para abrir o modal de informações ao clicar na div do serviço
  const handleServicoClick = (servico: Servico) => {
    setSelectedServico(servico);
    setIsModalInfoOpen(true); // Abre o modal de informações
  };

  const handleCloseInfoModal = () => {
    setIsModalInfoOpen(false);
  };

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
            className="border border-gray-500 rounded w-full my-2 p-2 flex items-center gap-2 cursor-pointer"
            key={servico.nome}
            onClick={() => handleServicoClick(servico)} // Abre o modal de informações
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
            <div className="font-semibold capitalize ml-3">{servico.nome}</div>

            <div className="ml-auto flex gap-4 mr-5">
              {/* Botão de atualizar */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Evita que o click no botão de update abra o modal
                  handleUpdateClick(servico);
                }}
              >
                <Image src="/images/atualizar.png" width={30} height={30} alt="atualizar"></Image>
              </button>
              {/* Botão de excluir */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Evita que o click no botão de delete abra o modal
                  handleDeleteClick(servico.nome);
                }}
              >
                <Image src="/images/excluir.png" width={30} height={30} alt="atualizar"></Image>
              </button>
            </div>
          </div>
        ))}

        
   {/* Novo Modal de Informações */}
{isModalInfoOpen && selectedServico && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-96 max-w-full flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Detalhes do Serviço</h2>

      <div className="mb-4 w-full">
        <div className="flex justify-center">
          {selectedServico.logo ? (
            <Image
              src={selectedServico.logo}
              alt={`Logo do serviço ${selectedServico.nome}`}
              width={128}
              height={128}
              className="rounded-full"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-full">
              <span>Sem logo</span>
            </div>
          )}
        </div>
      </div>

      {/* Exibição do nome */}
      <div className="mb-4 w-full">
        <div className="font-semibold">Nome do Serviço:</div>
        <div>{selectedServico.nome}</div>
      </div>

      {/* Exibição da descrição */}
      <div className="mb-4 w-full">
        <div className="font-semibold">Descrição:</div>
        <div
            className="text-md text-gray-600 overflow-y-auto"
            style={{ maxHeight: '150px' }}
        >
            {selectedServico.descricao}
        </div>
       </div>

      

      {/* Botão de fechar */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={handleCloseInfoModal}
      >
        Fechar
      </button>
    </div>
  </div>
)}




        {/* Modal de Atualização */}
        {isModalUpdateOpen && updatedServico && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 max-w-full">
              <h2 className="text-xl font-bold mb-4">Atualizar Serviço</h2>
              <div className="mb-4">
                <label htmlFor="nome" className="block text-sm font-medium">Nome:</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={updatedServico.nome}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="descricao" className="block text-sm font-medium">Descrição:</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={updatedServico.descricao}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4 p-2 border border-gray-300 rounded"
              />
              <div className="flex justify-between w-full">
                <button
                  onClick={handleUpdateService}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Atualizar
                </button>
                <button
                  onClick={handleCloseUpdateModal}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
