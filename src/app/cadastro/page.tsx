"use client"

import Image from 'next/image'
import Link from 'next/link';

export default function Home() {
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
        <input className='border-2 border-gray-300 outline-none rounded p-1 w-full my-3 tracking-wider' type="text" placeholder='E-mail: ' />
        <input className='border-2 border-gray-300 outline-none rounded p-1 w-full' type="password" placeholder='Senha: ' />
        <input className='w-full bg-blue-500 rounded py-2 my-3 text-gray-50 font-bold text-xl cursor-pointer hover:bg-blue-600  duration-200' type="submit" value='Cadastrar' onClick={e=>e.preventDefault()}/>
      </form>

      <Link href="/" className='hover:text-blue-500 duration-200'>Já tem cadastro? faça o login</Link>
      <button className='mt-4 cursor-pointer'>
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"/><path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"/><polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"/><path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"/><path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"/></svg>
      </button>

    </div>
  );
}
