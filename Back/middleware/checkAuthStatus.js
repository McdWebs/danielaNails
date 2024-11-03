const jwt = require("jsonwebtoken");

const checkAuthStatus = (req, res) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    res.json({
      success: true,
      user: { id: user.id, username: user.username },
    });
  });
};

module.exports = checkAuthStatus;
