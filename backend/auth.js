const jwt = require("jsonwebtoken");

function authMiddleware(req, res , next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error:"No token provided"});
    }

    const token = authHeader.split(" ")[1]; //Remove bearer

    try{
        const decoded = jwt.decode(token);
        if (!decoded || decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ error: "Token expired or invalid" });
            }

        if(!decoded){
            return res.status(401).json({error:"Invalid token"});
        }
        req.user= decoded;
        next();
    } catch (error) {
        return res.status(401).json({error:"Unauthorized"});
    }
}

module.exports = authMiddleware;