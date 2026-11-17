const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows ISP DNS SRV resolution issue with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Fallback if permission not granted
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error (${error.name || 'UnknownError'}). Verify MONGO_URI and MongoDB availability.`);
    process.exit(1);
  }
};

module.exports = connectDB;