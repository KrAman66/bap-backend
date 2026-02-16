const authService = require("../services/auth.service");

async function login(req, res) {
  const { email, password } = req.body;
  const tokens = await authService.loginWithEmailPassword(email, password);
  res.status(200).json(tokens);
}

async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  const tokens = await authService.rotateRefreshToken(refreshToken);
  res.status(200).json(tokens);
}

module.exports = { login, refreshToken };
