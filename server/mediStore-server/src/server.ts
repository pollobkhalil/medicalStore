import { Server } from 'http';
import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

let server: Server;

async function main() {
  try {
    // 1. Establish database connection first
    await prisma.$connect();
    console.log('✅ Database connected successfully!');

    // 2. Start listening to the server only after successful DB connection
    server = app.listen(config.port, () => {
      console.log(`🚀 MediStore Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server due to DB connection error:', err);
    process.exit(1);
  }
}

main();

// --- Handle Uncaught Exceptions (Synchronous Errors) ---
process.on('uncaughtException', (error) => {
  console.error('🔥 Uncaught Exception detected. Shutting down...');
  console.error(error);
  process.exit(1);
});

// --- Handle Unhandled Rejections (Asynchronous Errors) ---
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
  
  if (server) {
    server.close(async () => {
      // Disconnect from database before exiting
      await prisma.$disconnect();
      console.log('🛑 Server and DB closed due to unhandled rejection.');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// --- Handle Graceful Shutdown (SIGTERM & SIGINT) ---
const shutdown = async (signal: string) => {
  console.log(`\n📢 ${signal} received. Closing server gracefully...`);
  
  if (server) {
    server.close(async () => {
      // Ensure DB connection is closed safely
      await prisma.$disconnect();
      console.log('✅ Database disconnected and Server closed. Safe to exit.');
      process.exit(0);
    });
  } else {
    await prisma.$disconnect();
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));