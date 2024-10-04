"use client"

import Image from "next/image";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface props {
    isEmplloyee:boolean,
    nome:string,
    cargo:string
}

export default function SideBar ({isEmplloyee,nome,cargo}:props) {

    const router = useRouter();

    const handleSignOut = ()=>{
        signOut(auth).then(() => {
            localStorage.removeItem("user")
            router.push("/")
          }).catch((error) => {
            console.log(error)
          });
    }
    

  return (
    <div className="bg-blue-500 h-screen w-[330px] relative">
    <div className="flex ml-2 gap-2 mb-8">
        <Image className="rounded-full object-cover mt-4" src="/images/profilePhoto.avif" width={50} height={50} alt="profile photo"></Image>
        <div className="mt-4">
            <h3 className="text-white font-bold text-lg">{nome}</h3>
            {isEmplloyee && (<h5 className="text-white font-medium">{cargo}</h5>)}
        </div>
    </div>
      <ul className="ml-2">
        <li className="cursor-pointer text-white text-xl"><Link href={"/dados"}>Editar meus dados</Link></li>
        
        {isEmplloyee && (
            <span>
                <li className="cursor-pointer text-white my-1 text-xl">Adicionar serviços</li>
                <li className="cursor-pointer text-white my-1 text-xl">Atualizar serviço</li>
                <li className="cursor-pointer text-white my-1 text-xl">Remover Serviço</li>
            </span>
        )}
      </ul>

      <button onClick={handleSignOut} className="absolute bottom-3 left-2">
        <Image src="/images/log-out.png" width={40} height={40} alt="logout"></Image>
      </button>
    </div>
  );
}
