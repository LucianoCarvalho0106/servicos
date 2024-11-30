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

  const [loading, setLoading] = useState(true); // Gerenciar o estado de carregamento
  const [userData, setUserData] = useState<Partial<IdadosForm> | null>(null); // Dados do usuário do Firebase
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

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (!user) {
        // Redireciona para o login se o usuário não estiver autenticado
        router.push("/");
        return;
      }

      const uid = user.uid;
      const userDocRef = doc(db, "users", uid);

      try {
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data() as IdadosForm;
          setUserData(userData); // Define os dados do Firebase
          setDadosUser(userData); // Preenche o formulário com os dados existentes
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false); // Finaliza o estado de carregamento
      }
    };

    fetchUserData();
  }, [router]);

  // Define os passos do formulário, incluindo `user` e `dadosUser`
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold ml-8 pt-8 absolute">Preencha alguns dados...</h2>

      <div className="h-screen flex flex-col items-center justify-center">
        {steps[currentStep]}

        <div className="mt-12 w-1/3">
          {currentStep === 0 && <FileInput setDadosUser={setDadosUser} />}

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
              {currentStep === steps.length - 1 ? "Salvar" : "Avançar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
