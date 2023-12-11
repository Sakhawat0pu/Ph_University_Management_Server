import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { Server } from 'http';

let server: Server;

async function main() {
  await mongoose.connect(config.db_uri as string);
  server = app.listen(config.port, () => {
    console.log(`Basic server is running on ${config.port}`);
  });
}

main();

process.on('unhandledRejection', () => {
  console.log('Unhandled Reject detected. The server is closing...');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('Uncaught Exception detected. The server is closing...');
  process.exit(1);
});
