"use client";
import { useEffect, useState } from "react";
import { Step1, Step2, Step3 } from "../editar/etapasForm";
import FileInput from "./FileInput";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../../config/firebase";
import { useRouter } from "next/navigation";

export interface IdadosForm {
  nome: string;
  contato: string;
  idade: number;
  endereco: string;
  atividades: {
    empresa: string;
    descricaoAtividades: string;
  }[];
  cargo: string;
  descricaoHabilidades: string;
  foto: string;
}

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  // Armazena os dados do usuário autenticado
  const [userData, setUserData] = useState<Partial<IdadosForm> | null>(null);

  // Estado para armazenar dados do formulário
  const [dadosUser, setDadosUser] = useState<Partial<IdadosForm>>({
    nome: "",
    contato: "",
    idade: 0,
    endereco: "",
    atividades: [{ empresa: "", descricaoAtividades: "" }],
    cargo: "",
    descricaoHabilidades: "",
    foto: "",
  });

  // Buscar dados do Firebase com base no usuário logado
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const uid = user.uid;
        const userDocRef = doc(db, "users", uid);

        try {
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data() as IdadosForm;
            setUserData(userData); // Armazena os dados do Firebase no estado
            setDadosUser(userData); // Preenche o formulário com os dados existentes
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Definir os passos do formulário
  const steps = [
    <Step1 user={userData} dadosUser={dadosUser} setDadosUser={setDadosUser} />,
    <Step2 user={userData} dadosUser={dadosUser} setDadosUser={setDadosUser} />,
    <Step3 user={userData} dadosUser={dadosUser} setDadosUser={setDadosUser} />,
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        const user = auth.currentUser;

        if (user) {
          const uid = user.uid;
          await setDoc(doc(db, "users", uid), dadosUser);
          alert("Dados salvos com sucesso!");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Erro ao salvar os dados:", error);
        alert("Houve um erro ao salvar os dados.");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!userData) {
    return <p>Carregando...</p>; // Mostra um estado de carregamento enquanto os dados do usuário estão sendo buscados
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold ml-8 pt-8 absolute">Preencha alguns dados...</h2>

      <div className="h-screen flex flex-col items-center justify-center">
        {steps[currentStep]}

        <div className="mt-12 w-1/3">
          {currentStep === 0 ? <FileInput setDadosUser={setDadosUser} /> : null}

          <div className="flex justify-between mt-4">
            <button
              className="bg-blue-500 text-white p-2 w-72 rounded-sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Voltar
            </button>
            <button
              className="bg-green-600 text-white p-2 w-72 rounded-sm"
              onClick={handleNext}
            >
              Avançar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
