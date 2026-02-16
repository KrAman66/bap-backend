const bcrypt = require("bcrypt");
const db = require("../db");
const AppError = require("../utils/appError");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

async function loginWithEmailPassword(email, password) {
  const u = await db.query(
    `SELECT id, email, password_hash, full_name, is_active
     FROM asa.users WHERE email = $1`,
    [email],
  );
  if (u.rowCount === 0) throw new AppError("Invalid credentials", 401);

  const user = u.rows[0];
  if (!user.is_active) throw new AppError("Account disabled", 403);

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new AppError("Invalid credentials", 401);

  const rolesRes = await db.query(
    `SELECT r.name FROM asa.user_roles ur
     JOIN asa.roles r ON r.id = ur.role_id
     WHERE ur.user_id = $1`,
    [user.id],
  );
  const roles = rolesRes.rows.map((r) => r.name);

  const payload = { sub: user.id, email: user.email, roles };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ sub: user.id, tokenUse: "refresh" });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.full_name,
      roles,
    },
  };
}

async function rotateRefreshToken(token) {
  try {
    const decoded = verifyRefreshToken(token);
    if (decoded.tokenUse !== "refresh") {
      throw new AppError("Invalid refresh token", 401);
    }

    const u = await db.query(
      `SELECT id, email, full_name, is_active FROM asa.users WHERE id = $1`,
      [decoded.sub],
    );
    if (u.rowCount === 0) throw new AppError("User not found", 401);
    const user = u.rows[0];
    if (!user.is_active) throw new AppError("Account disabled", 403);

    const rolesRes = await db.query(
      `SELECT r.name FROM asa.user_roles ur
       JOIN asa.roles r ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id],
    );
    const roles = rolesRes.rows.map((r) => r.name);

    const payload = { sub: user.id, email: user.email, roles };
    const accessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken({
      sub: user.id,
      tokenUse: "refresh",
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, email: user.email, name: user.full_name, roles },
    };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Refresh token expired", 401);
    }
    if (err.name === "JsonWebTokenError") {
      throw new AppError("Invalid refresh token", 401);
    }
    throw err;
  }
}

module.exports = { loginWithEmailPassword, rotateRefreshToken };
