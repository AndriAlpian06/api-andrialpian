import dotenv from 'dotenv'
dotenv.config()

if(!process.env.JWT_SECRET){
  throw new Error('JWT_SECRET environment variable is not defined');
}

// config/jwtConfig.ts
const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h' // Token akan kedaluwarsa dalam 1 jam
};

export default jwtConfig;