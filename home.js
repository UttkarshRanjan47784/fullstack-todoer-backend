import jwt from 'jsonwebtoken'
import env from "dotenv"

env.config()

const secret = process.env.SERVER_SECRET;

async function verifyUser (req, res) {
    try {
        let token = req.headers["authorization"]
        let user = jwt.decode(token)["username"]
        jwt.verify(token, secret);
        res.json({
            stat : true,
            msg : `${user}`
        })
    } catch (error) {
        res.json({
            stat : false,
            msg : `Unauthorized User : ${error.message}`
        })
    }
}

export { verifyUser }