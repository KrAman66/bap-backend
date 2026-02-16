const jwt = require("jsonwebtoken");

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpires = process.env.JWT_ACCESS_EXPIRES || "15m";
const refreshExpires = process.env.JWT_REFRESH_EXPIRES || "7d";

function signAccessToken(payload) {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpires });
}
function signRefreshToken(payload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpires });
}
function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret);
}
function verifyRefreshToken(token) {
  return jwt.verify(token, refreshSecret);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
