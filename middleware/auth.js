const jwt = require("jsonwebtoken");

let auth = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    try {
      let user = jwt.verify(token, "123");
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      console.error(error);
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = auth;
