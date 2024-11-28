import { useState, ChangeEvent } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../config/firebase'; // Certifique-se que o caminho esteja correto
import { IdadosForm } from './MultStepForm';
import { auth } from "../../../config/firebase";


interface FileInputProps {
  setDadosUser: React.Dispatch<React.SetStateAction<Partial<IdadosForm>>>;
}

const FileInput: React.FC<FileInputProps> = ({ setDadosUser }) => {
  const [fileName, setFileName] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const user = auth.currentUser;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);

      // Lógica de upload da imagem
      const file = e.target.files[0];
      const storageRef = ref(storage, `uploads/${user!.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Aqui você pode adicionar lógica para mostrar o progresso se quiser
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload está ${progress}% completo`);
        },
        (error) => {
          console.error('Erro no upload:', error);
          setUploading(false);
        },
        () => {
          // Upload completo
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('Imagem disponível em:', downloadURL);

            // Atualiza o estado do formulário com a URL da imagem
            setDadosUser((prev) => ({ ...prev, foto: downloadURL }));
            setUploading(false);
          });
        }
      );
    } else {
      setFileName('');
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative">
        <input
          type="file"
          id="file-input"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label
          htmlFor="file-input"
          className={`bg-blue-500 text-white py-2 px-4 rounded-sm cursor-pointer hover:bg-blue-600 ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? 'Enviando...' : 'Upload da foto'}
        </label>
      </div>
      {fileName && (
        <p className="mt-3 text-gray-600">
          Arquivo selecionado: <span className="font-semibold">{fileName}</span>
        </p>
      )}
    </div>
  );
};

export default FileInput;
