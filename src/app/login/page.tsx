"use client";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoginForm from "./components/login-form";
import SignUpForm from "./components/sign-up-form";

const AuthenticationPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="mb-10 text-4xl font-bold">STOCKLY</h1>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Criar Conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <SignUpForm />
        </TabsContent>
      </Tabs>
      <p className="text-muted-foreground mt-10 text-sm">
        by AdelTech Brasil &copy;
      </p>
    </div>
  );
};
export default AuthenticationPage;
