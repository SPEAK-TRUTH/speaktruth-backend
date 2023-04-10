const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  port: process.env.PORT,
  databaseURL: process.env.MONGODB_URI,
  databaseName: process.env.MONGODB_DBNAME,
  jwtSecret: process.env.JWT_SECRET,
  salt: Number(process.env.SALT),
  api: {
    prefix: '/api',
  },
  clientUrl: process.env.CLIENT_URL,
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },
  rootDir: process.cwd(),
};
