const AppError = require("../utils/appError");
const { verifyAccessToken } = require("../utils/jwt");
const db = require("../db");

async function authenticate(req, res, next) {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) throw new AppError("Missing Authorization token", 401);

    const decoded = verifyAccessToken(token);

    const userRes = await db.query(
      `SELECT user_id, email_id, full_name, is_active FROM asa.asa_user_mst WHERE user_id = $1`,
      [decoded.sub],
    );
    if (userRes.rowCount === 0) throw new AppError("User not found", 401);
    const user = userRes.rows[0];
    if (!user.is_active) throw new AppError("User is inactive", 403);

    let roles = decoded.roles;
    if (!roles) {
      const r = await db.query(
        `SELECT r.role_name FROM asa.asa_user_role_mapping ur
         JOIN asa.asa_role_mst r ON r.role_id = ur.role_id
         WHERE ur.user_id = $1`,
        [user.id],
      );
      roles = r.rows.map((x) => x.name);
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.full_name,
      roles,
    };
    res.locals.user = req.user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Access token expired", 401));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }
    next(err);
  }
}

module.exports = { authenticate };
