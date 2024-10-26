"use client";
import { useEffect, useState } from 'react';
import { Step1, Step2, Step3 } from '../editar/etapasForm';
import FileInput from './FileInput';
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from '../../../config/firebase';
import { useRouter } from 'next/navigation';

export interface IdadosForm {
  nome: string;
  contato: string;
  idade: number;
  endereco: string;
  atividades: {
    empresa: string;
    descricaoAtividades: string;
  }[]; // Um array de objetos de atividades
  cargo: string;
  descricaoHabilidades: string;
  foto: string;
}

const MultiStepForm = () => {
  // Gerencia o índice da etapa atual
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const [userData,setUserData] = useState({})
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userData")!)
    setUserData(user)
    console.log(user)
  },[])

  // Estado para armazenar dados do formulário
  const [dadosUser, setDadosUser] = useState<Partial<IdadosForm>>({
    nome: '',
    contato: '',
    idade: 0,
    endereco: '',
    atividades: [
      {
        empresa: '',
        descricaoAtividades: ''
      }
    ], // Inicializa com um array contendo um objeto vazio para "atividades"
    cargo: '',
    descricaoHabilidades: '',
    foto: ''
  });

  // Definir os passos do formulário
  const steps = [
    <Step1 user={userData} dadosUser={dadosUser} setDadosUser={setDadosUser} />,
    <Step2 user={userData}  dadosUser={dadosUser} setDadosUser={setDadosUser} />,
    <Step3 user={userData}  dadosUser={dadosUser} setDadosUser={setDadosUser} />
  ];

  // Função para avançar para a próxima etapa
  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Caso seja a última etapa, salva os dados no Firebase
      try {
        const user = auth.currentUser;

        if (user) {
          const uid = user.uid;

          // Adiciona os dados com o uid do usuário
          await setDoc(doc(db, "users", uid), dadosUser);
          alert("Dados salvos com sucesso!");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Erro ao salvar os dados: ", error);
        alert("Houve um erro ao salvar os dados.");
      }
    }
  };

  // Função para voltar para a etapa anterior
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold ml-8 pt-8 absolute">Preencha alguns dados ...</h2>

      <div className="h-screen flex flex-col items-center justify-center">
        {/* Renderiza o componente da etapa atual */}
        {steps[currentStep]}

        <div className="mt-12 w-1/3">
          {/* Exibe o FileInput na primeira etapa */}
          {currentStep === 0 ? <FileInput setDadosUser={setDadosUser} /> : null}

          <div className="flex justify-between mt-4">
            {/* Botão para voltar */}
            <button
              className="bg-blue-500 text-white p-2 w-72 rounded-sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Voltar
            </button>

            {/* Botão para avançar */}
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
