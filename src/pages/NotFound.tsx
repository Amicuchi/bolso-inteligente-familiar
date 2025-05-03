
import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! Página não encontrada
        </p>
        <Button asChild>
          <a href="/" className="inline-flex items-center gap-2">
            <Home size={18} />
            Voltar à página inicial
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
