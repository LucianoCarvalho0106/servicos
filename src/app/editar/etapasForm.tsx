import { useEffect, useState } from "react"; 

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

interface StepProps {
  dadosUser: Partial<IdadosForm>;
  setDadosUser: React.Dispatch<React.SetStateAction<Partial<IdadosForm>>>;
  user: any;
}

interface Atividade {
  empresa: string;
  descricaoAtividades: string;
}

interface User {
  nome: string;
  contato: string;
  idade: number;
  endereco: string;
  atividades: Atividade[]; 
  cargo: string;
  descricaoHabilidades: string;
  foto: string;
}

const Step1: React.FC<StepProps> = ({ dadosUser, setDadosUser, user }) => {
  const [initialState, setInitialState] = useState({
    nome: user?.nome || "",
    contato: user?.contato || "",
    idade: user?.idade || 0,
    endereco: user?.endereco || "",
    cargo: user?.cargo || "",
    descricaoHabilidades: user?.descricaoHabilidades || "",
    foto: user?.foto || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const updatedState = { ...initialState, [id]: value };
    setInitialState(updatedState);
    setDadosUser(updatedState); // Atualiza os dados do usuário com o estado atualizado
  };

  return (
    <div className="w-1/3">
      <div className="flex justify-center items-center mb-12">
        <h2 className="text-2xl text-white bg-blue-500 rounded-full w-16 h-16 text-center pt-4">1</h2>
        <p className="font-bold mr-4 ml-2">Dados pessoais</p>
        <h2 className="text-2xl text-white bg-gray-500 rounded-full w-16 h-16 text-center pt-4">2</h2>
        <p className="font-bold mr-4 ml-2">Experiência</p>
        <h2 className="text-2xl text-white bg-gray-500 rounded-full w-16 h-16 text-center pt-4">3</h2>
        <p className="font-bold mr-4 ml-2">Descrição do perfil</p>
      </div>
      <form>
        <div className="flex justify-between">
          <div>
            <label className="font-bold" htmlFor="nome">Nome:</label><br />
            <input
              className="outline-none p-1 border border-slate-400 rounded-sm w-72 mb-8"
              type="text"
              placeholder="Nome"
              id="nome"
              value={initialState.nome} // Usa o estado inicial
              onChange={handleChange}
            />
            <br />
            <label className="font-bold" htmlFor="idade">Idade:</label><br />
            <input
              className="outline-none p-1 border border-slate-400 rounded-sm w-72"
              type="number"
              placeholder="Idade"
              id="idade"
              value={initialState.idade} // Usa o estado inicial
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="font-bold" htmlFor="contato">Contato:</label><br />
            <input
              className="outline-none p-1 border border-slate-400 rounded-sm w-72 mb-8"
              type="text"
              placeholder="(xx) x xxxx-xxxx"
              id="contato"
              value={initialState.contato} // Usa o estado inicial
              onChange={handleChange}
            />
            <br />
            <label className="font-bold" htmlFor="endereco">Endereço:</label><br />
            <input
              className="outline-none p-1 border border-slate-400 rounded-sm w-72"
              type="text"
              placeholder="Endereço"
              id="endereco"
              value={initialState.endereco} // Usa o estado inicial
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

const Step2: React.FC<StepProps> = ({ dadosUser, setDadosUser, user }) => {
  const [initialState, setInitialState] = useState({
    empresa: user?.atividades?.[0]?.empresa || "",
    descricaoAtividades: user?.atividades?.[0]?.descricaoAtividades || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    const updatedState = { ...initialState, [id]: value };
    setInitialState(updatedState);

    // Atualiza dadosUser com o objeto atividades que não pode ter valores undefined
    setDadosUser({
      ...dadosUser,
      atividades: [{
        empresa: updatedState.empresa,
        descricaoAtividades: updatedState.descricaoAtividades,
      }]
    }); 
  };

  return (
    <div className="w-1/3">
      <div className="flex justify-center items-center mb-12">
        <h2 className="text-2xl text-white bg-gray-500 rounded-full w-16 h-16 text-center pt-4">1</h2>
        <p className="font-bold mr-4 ml-2">Dados pessoais</p>
        <h2 className="text-2xl text-white bg-blue-500 rounded-full w-16 h-16 text-center pt-4">2</h2>
        <p className="font-bold mr-4 ml-2">Experiência</p>
        <h2 className="text-2xl text-white bg-gray-500 rounded-full w-16 h-16 text-center pt-4">3</h2>
        <p className="font-bold mr-4 ml-2">Descrição do perfil</p>
      </div>
      <form>
        <div className="flex-col gap-10 items-center">
          <div className="flex items-center gap-8">
            <div>
              <label className="font-bold" htmlFor="empresa">Empresa:</label><br />
              <input
                className="outline-none p-1 border border-slate-400 rounded-sm w-72 mb-8"
                type="text"
                placeholder="Nome"
                id="empresa"
                value={initialState.empresa} // Usa o estado inicial
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="font-bold" htmlFor="descricaoAtividades">Descrição das atividades:</label>
            <textarea
              className="w-full h-52 border p-1 border-black"
              name="descricaoAtividades"
              id="descricaoAtividades"
              value={initialState.descricaoAtividades} // Usa o estado inicial
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
};

const Step3: React.FC<StepProps> = ({ dadosUser, setDadosUser, user }) => {
  const [initialState, setInitialState] = useState({
    cargo: user?.cargo || "",
    descricaoHabilidades: user?.descricaoHabilidades || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const updatedState = { ...initialState, [id]: value };
    setInitialState(updatedState);
    setDadosUser({ ...dadosUser, [id]: value }); // Atualiza os dados do usuário
  };

  return (
    <div className="w-1/3">
      <div className="flex justify-center items-center mb-12">
        <h2 className="text-2xl text-white bg-gray-500 rounded-full w-16 h-16 text-center pt-4">1</h2>
        <p className="font-bold mr-4 ml-2">Dados pessoais</p>
        <h2 className="text-2xl text-white bg-gray-500 rounded-full w-16 h-16 text-center pt-4">2</h2>
        <p className="font-bold mr-4 ml-2">Experiência</p>
        <h2 className="text-2xl text-white bg-blue-500 rounded-full w-16 h-16 text-center pt-4">3</h2>
        <p className="font-bold mr-4 ml-2">Descrição do perfil</p>
      </div>
      <form>
        <div className="flex-col gap-10 items-center">
          <div className="flex items-center gap-8">
            <div>
              <label className="font-bold" htmlFor="cargo">Cargo:</label><br />
              <input
                className="outline-none p-1 border border-slate-400 rounded-sm w-72 mb-8"
                type="text"
                placeholder="Cargo"
                id="cargo"
                value={initialState.cargo} // Usa o estado inicial
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="font-bold" htmlFor="descricaoHabilidades">Descrição das habilidades:</label>
            <textarea
              className="w-full h-52 border p-1 border-black"
              name="descricaoHabilidades"
              id="descricaoHabilidades"
              value={initialState.descricaoHabilidades} // Usa o estado inicial
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
};

export { Step1, Step2, Step3 };
