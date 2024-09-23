"use client"

import Image from 'next/image'
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { auth } from '../../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';


export default function Home() {

  const [email,setEmail] = useState<string>();
  const [senha,setSenha] = useState<string>();

  const router = useRouter();

  const cadastro = async (e:React.MouseEvent<HTMLInputElement>)=>{
    e.preventDefault()

    if (!email || !senha) {
      console.log('Por favor, preencha todos os campos');
      return;
    }


    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      console.log("Usuário cadastrado com sucesso:", user);
      setEmail("");
      setSenha("");
      router.push("/");
      
    } catch (error) {
      console.log("Erro ao criar o documento")
    }
}
  return (
    
    <div className='flex flex-col items-center justify-center h-screen'>
      <Image
        src="/images/servicosLogo.png"
        width={220}
        height={220}
        alt="Logo servicos"
        className='mb-10'
      />

      <h1 className='text-4xl text font-bold'>Precisando de algun serviço?</h1>
      <p className='text-xl mb-6'>Venha conhecer nossa plataforma  multi utilidades!</p>


      <form className='w-1/3'>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} className='border-2 border-gray-300 outline-none rounded p-1 w-full my-3 tracking-wider' type="text" placeholder='E-mail: ' />
        <input value={senha} onChange={(e)=>setSenha(e.target.value)}className='border-2 border-gray-300 outline-none rounded p-1 w-full' type="password" placeholder='Senha: ' />
        <input className='w-full bg-blue-500 rounded py-2 my-3 text-gray-50 font-bold text-xl cursor-pointer hover:bg-blue-600  duration-200' type="submit" value='Cadastrar' onClick={cadastro}/>
      </form>

      <Link href="/" className='hover:text-blue-500 duration-200'>Já tem cadastro? faça o login</Link>
      
    </div>
  );
}
