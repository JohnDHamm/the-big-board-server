const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token)
    return res.status(401).send({auth: false, message: "No token provided."})

  jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err)
      return res
        .status(500)
        .send({auth: false, message: "Failed to authenticate token."})
    }
    req.user = user
    next()
  })
}

module.exports = authenticateToken
