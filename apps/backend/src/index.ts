import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { server } from "./server/Server";
import { start } from "repl";

// Configuração
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

//inicialização e verificação de porta do servidor
console.log("iniciando server...");

const startServer = () => {
  server
    .listen(parseInt(process.env.PORT || "3333"), "::", () => {
      console.log(`server rodando na porta numero: ${process.env.PORT}`);
      console.log("Acesse em: http://localhost:" + PORT);
    })
    .on("error", (err) => {
      console.log(
        `falha ao iniciar o server em: ${process.env.PORT}`,
        err.message
      );
    });
};

startServer();
