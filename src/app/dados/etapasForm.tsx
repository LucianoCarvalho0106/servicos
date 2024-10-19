
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
  }


// Step1.js
const Step1: React.FC<StepProps> = ({ dadosUser, setDadosUser })  => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDadosUser((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
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
                value={dadosUser.nome || ''}
                onChange={handleChange}
              />
              <br />
              <label className="font-bold" htmlFor="idade">Idade:</label><br />
              <input
                className="outline-none p-1 border border-slate-400 rounded-sm w-72"
                type="number"
                placeholder="Idade"
                id="idade"
                value={dadosUser.idade || ''}
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
                value={dadosUser.contato || ''}
                onChange={handleChange}
              />
              <br />
              <label className="font-bold" htmlFor="endereco">Endereço:</label><br />
              <input
                className="outline-none p-1 border border-slate-400 rounded-sm w-72"
                type="text"
                placeholder="Endereço"
                id="endereco"
                value={dadosUser.endereco || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </div>
    );
  };
  
  
  
  
  // Step2.js
  const Step2: React.FC<StepProps> = ({ dadosUser, setDadosUser }) => {
    const handleChangeAtividade = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
  
      // Atualizando o primeiro item das atividades (index 0)
      setDadosUser((prev) => {
        const atividadesAtualizadas = prev.atividades ? [...prev.atividades] : [{ empresa: '', descricaoAtividades: '' }];
        atividadesAtualizadas[0] = {
          ...atividadesAtualizadas[0],
          [id]: value,
        };
  
        return {
          ...prev,
          atividades: atividadesAtualizadas,
        };
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
                  value={dadosUser.atividades?.[0]?.empresa || ''}
                  onChange={handleChangeAtividade}  // Use a função handleChangeAtividade
                />
              </div>
  
              
            </div>
  
            <div>
              <label className="font-bold" htmlFor="descricaoAtividades">Descrição das atividades:</label>
              <textarea
                className="w-full h-52 border p-1 border-black"
                name="descricaoAtividades"
                id="descricaoAtividades"
                value={dadosUser.atividades?.[0]?.descricaoAtividades || ''}
                onChange={handleChangeAtividade} // Use a função handleChangeAtividade
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    );
  };
  
  
  
  // Step3.js
  const Step3:React.FC<StepProps> = ({ dadosUser, setDadosUser }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDadosUser((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
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
                  id="cargo"
                  value={dadosUser.cargo || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
  
            <div>
              <label className="font-bold" htmlFor="descricaoHabilidades">Descreva suas habilidades:</label>
              <textarea
                className="w-full h-52 border p-1 border-black"
                name="descricaoHabilidades"
                id="descricaoHabilidades"
                value={dadosUser.descricaoHabilidades || ''}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    );
  };
  
  
  
  export {Step1,Step2,Step3};
  