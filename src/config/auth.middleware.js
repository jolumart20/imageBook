import { authCtrl } from "../controllers/index.js";
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = authCtrl.tok;
    if (!token) {
        next();
        return res.status(401).json({ error: 'No se proporcionó un token de acceso.' });
        
    }

    jwt.verify(token, 'secreto', (error, decoded) => {
        if (error) {
            return res.status(401).json({ error: 'Token inválido.' });
        }
        req.userId = decoded.userId;
        next();
    }
    );
};
