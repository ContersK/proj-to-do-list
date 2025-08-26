import { server } from './server/Server';

//inicialização e verificação de porta do servidor
console.log('iniciando server...');

const startServer = () => {
  server
    .listen(parseInt(process.env.PORT || '3333'), '::', () => {
      console.log(`server rodando na porta numero: ${process.env.PORT}`);
      console.log(`http://localhost:${process.env.PORT}`);
    })
    .on('error', (err) => {
      console.error(
        'Erro ao iniciar o servidor. Verifique se a porta já não está em uso.',
        err.message,
      );
    });
};

startServer();
