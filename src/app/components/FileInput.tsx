import { useState, ChangeEvent } from 'react';

const FileInput: React.FC = () => {
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
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
        />
        <label
          htmlFor="file-input"
          className="bg-blue-500 text-white py-2 px-4 rounded-sm cursor-pointer hover:bg-blue-600"
        >
          Upload da foto
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
