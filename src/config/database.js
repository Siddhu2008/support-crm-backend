import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dns from 'node:dns';

let mongoMemoryServer;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    if (mongoUri.startsWith('mongodb+srv://')) {
      dns.setServers(['1.1.1.1', '8.8.8.8']);
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected to configured URI');
    return;
  }

  mongoMemoryServer = await MongoMemoryServer.create();
  const uri = mongoMemoryServer.getUri();

  await mongoose.connect(uri);
  console.log('MongoDB connected using in-memory server');
};

export const disconnectDB = async () => {
  await mongoose.disconnect();

  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
