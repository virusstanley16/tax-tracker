'use client'
import Image from "next/image";
import { Button,Text, Checkbox, TextField } from "@radix-ui/themes";
import Link from "next/link";
import { Spinner } from "@radix-ui/themes";
import { Box } from "@radix-ui/themes";

interface LoginForm {
  // Define any props if needed
  login: string;
  password: string;

}
import React, { useState } from "react";
const handleLogin = async (data: LoginForm) => {
  // Handle form submission logic here
  console.log("Login data submitted:", data);
  // You can send this data to your API or handle it as needed
}

export default function Home() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const register = (name: string, options: { required: boolean }) => ({
    name,
    ...(options.required ? { required: true } : {}),
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleLogin({ login, password });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <>
    <main className="flex flex-col items-center min-h-screen Text-4 bg-gray-50">
      <h1 className="text-4xl font-bold">Welcome to Harmony Fiscalis Cameroon.</h1>
      <form action={'submite'} className='flex flex-col items-center space-y-4 mt-8' onSubmit={onSubmit}>
      <Box className='flex-1/3 py-4 place-items-baseline' maxWidth='500px'>
      <Text>LogIn/NIU:
        <TextField.Root
          className='flex px-20 py-1 w-100'
          type='text'
          size='2'
          placeholder='Enter your here.'
          value={login}
          onChange={e => setLogin((e.target as HTMLInputElement).value)}
          {...register('Login', { required: true })}
        ></TextField.Root>
        </Text>
        <Text className="py-2">Password:
        <TextField.Root
          className='flex px-20 py-1 w-100'
          type='password'
          size='2'
          placeholder='Enter your password.'
          value={password}
          onChange={e => setPassword((e.target as HTMLInputElement).value)}
          {...register('Password', { required: true })}
        ></TextField.Root>
        </Text>
      </Box>
      <Button disabled={isSubmitting} className='flex py-2 px-4' >Log In{isSubmitting && <Spinner />}</Button>
      <Text className='flex py-2 px-2 items-baseline-last'><Checkbox className='flex py-2' /> Stay connected</Text>
      </form>
      </main>
     <Text>I am not yet Registered <Link className='flex items-start justify-between text-blue-400 hover:text-blue-800 transition-colors' href='Register'>Create an Account.</Link></Text>
  </>
  
  );
}

