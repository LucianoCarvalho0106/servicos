"use client";
import { setDoc, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth, db, storage } from "../../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function AdicionarServico() {
  const [nomeServico, setNomeServico] = useState("");
  const [fileName, setFileName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();
  const user = auth.currentUser;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files![0];
    setFile(selectedFile); // Salva o arquivo selecionado no estado
    setFileName(selectedFile ? selectedFile.name : "Nenhum arquivo selecionado");
  };

  const salvarServico = async () => {
    try {
      // Verifica se um arquivo foi selecionado
      let logoURL = "";
      if (file) {
        // Cria uma referência para o arquivo no Firebase Storage
        const storageRef = ref(storage, `logos/${user!.uid}/${file.name}`);
        await uploadBytes(storageRef, file); // Faz o upload do arquivo
        logoURL = await getDownloadURL(storageRef); // Obtém a URL do arquivo
      }

      // Referência ao documento do usuário
      const userDocRef = doc(db, "users", user!.uid);
      const userDoc = await getDoc(userDocRef);

      // Verifica se o documento já existe
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const servicos = userData.servicos || []; // Obtém o array de serviços, ou cria um novo se não existir

        // Adiciona o novo serviço ao array
        servicos.push({ nome: nomeServico, descricao, logo: logoURL });

        // Atualiza o documento com o novo array de serviços
        await setDoc(userDocRef, { servicos }, { merge: true });
      } else {
        // Se o documento não existir, cria um novo com o serviço
        await setDoc(userDocRef, {
          servicos: [{ nome: nomeServico, descricao, logo: logoURL }],
        });
      }

      alert("Serviço salvo com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar serviço: ", error);
      alert("Erro ao salvar serviço. Tente novamente.");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center relative">
      <h1 className="text-2xl font-bold text-center mb-6 absolute top-8 left-8">Adicione um Serviço</h1>
      <div className="flex flex-col items-center w-1/2 gap-6 border border-black p-8 rounded-md">
        
        <div className="flex justify-center items-start gap-4 w-full">
          <div className="flex flex-col w-1/2">
            <label htmlFor="nome" className="text-left mb-1">Nome:</label>
            <input
              className="border-2 border-gray-500 h-10 w-full px-2 outline-none"
              type="text"
              onChange={(e) => setNomeServico(e.target.value)} // Corrigido para setNomeServico
              value={nomeServico}
            />
          </div>
          
          <div className="flex flex-col w-1/2">
            <label htmlFor="file-input" className="text-left mb-1 ">
              Selecione um arquivo de imagem
            </label>
            <label
              htmlFor="file-input"
              className="file-label flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-sm cursor-pointer hover:bg-blue-600 transition h-10"
            >
              <Image
                className="mr-2"
                src={"/images/upload.png"}
                width={30}
                height={30}
                alt="upload"
              />
              Upload da logo
            </label>
            <input
              type="file"
              id="file-input"
              className="file-input hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        <span className="file-name text-gray-600 text-center">{fileName}</span>

        <div className="w-full">
          <label htmlFor="descricao" className="text-left mb-1">Descrição:</label>
          <textarea 
            name="descricao" 
            id="descricao" 
            className="border border-gray-600 outline-none w-full h-52 resize-none"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
          />
        </div>
        
        <div className="flex justify-center gap-8">
          <button 
            className="bg-red-500 text-xl text-white py-2 px-4 rounded-sm hover:bg-red-600 transition" 
          >
            <Link href={"dashboard"}>Cancelar</Link>
          </button>
          <button 
            className="bg-green-500 text-xl text-white py-2 px-4 rounded-sm hover:bg-green-600 transition"
            onClick={salvarServico}
          >
            Salvar
          </button>
        </div>
        
      </div>
    </div>
  );
}
