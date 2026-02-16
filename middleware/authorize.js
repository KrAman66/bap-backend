const AppError = require("../utils/appError");

function authorize(...allowedRoles) {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    const ok = roles.some((r) => allowedRoles.includes(r));
    if (!ok) return next(new AppError("Forbidden", 403));
    next();
  };
}

module.exports = { authorize };
