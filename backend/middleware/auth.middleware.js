import jwt from 'jsonwebtoken';
import 'dotenv/config'

const checkToken = async (req, res, next) => {
    try {
        const authHead = req.headers.authorization || req.headers.Authorization;
        if (!authHead || !authHead.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Unauthorized Access" })
        };
        const token = authHead.split(' ')[1];
        const decode = jwt.verify(token,process.env.SECRET_KEY)
        req.user = decode;
        next()
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error", error });
    }
};

export {checkToken};