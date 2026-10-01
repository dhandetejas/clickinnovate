const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/exam_hallpass_portal';
  
  try {
    // Attempt standard connection to specified URI or local MongoDB
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500 // Quick timeout to fallback if daemon is not running
    });
    console.log(`[Database] Successfully connected to MongoDB at ${mongoUri}`);
  } catch (err) {
    console.warn(`[Database] Local MongoDB server not reachable (${err.message}). Launching in-memory MongoDB server fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoMemoryServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Successfully connected to MongoMemoryServer at ${inMemoryUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to connect to MongoDB or MongoMemoryServer fallback:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
