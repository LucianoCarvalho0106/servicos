"use client"

import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import { useEffect } from "react";

export default function App () {

  const router = useRouter();

  useEffect(()=>{
    const token = localStorage.getItem('user');
    console.log(JSON.parse(token!))
    if (!token) {
      router.push('/');
    }
  },[router])

  return (
  <>
    <SideBar nome="Marcelo" cargo="Desenvolvedor" isEmplloyee={true}></SideBar>
  </>
    
  );
}
