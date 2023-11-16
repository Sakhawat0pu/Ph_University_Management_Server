import mongoose from 'mongoose';
import config from './app/config';
import app from './app';

async function main() {
  await mongoose.connect(config.db_uri as string);
  app.listen(config.port, () => {
    console.log(`Basic server is running on ${config.port}`);
  });
}

main();
