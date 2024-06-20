// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig'

interface CustomRequest extends Request {
    user?:any;
}

const authenticateToken = (req: CustomRequest , res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.sendStatus(401).json({ message: 'Access denied, no token provided.'})
    }

    jwt.verify(token, jwtConfig.secret, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
              return res.status(401).json({ error: 'Token has expired. Please log in again.' });
            }
            if (err.name === 'JsonWebTokenError') {
              return res.status(401).json({ error: 'Invalid token. Access denied.' });
            }
            
            return res.status(401).json({ error: 'Unauthorized access. Token verification failed.' });
        }

        req.user = user;
        next()
    })
}

export default authenticateToken;