// controllers/mstController.js
const mstService = require("../services/mstService");
const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const prisma = require("../prisma/db");

const getId = (req, primaryKey) => {
  const raw = req.params?.[primaryKey] ?? req.params?.id;
  if (raw === undefined || raw === null) return undefined;
  return Number.isNaN(Number(raw)) ? raw : Number(raw);
};

exports.create = (model) => {
  return async (req, res, next) => {
    try {
      if (!Object.keys(req.body || {}).length) {
        return next(new AppError("Request body cannot be empty", 400));
      }

      const result = await mstService.create(model, req.body);
      //   return appResponse.created(res, "Created successfully", result);
      return res
        .status(200)
        .json(new appResponse("Created successfully", result));
    } catch (error) {
      console.error("Create error:", error);
      return next(new AppError("Failed to create", 400));
    }
  };
};

exports.getAll = (model, onlyActive = true) => {
  return async (req, res, next) => {
    try {
      const result = await mstService.findAll(model, onlyActive);
      //   return appResponse.ok(res, "Data fetched successfully", result);
      return res
        .status(200)
        .json(new appResponse("Data fetched successfully", result));
    } catch (error) {
      console.error("Fetch all error:", error);
      return next(new AppError("Failed to fetch data", 400));
    }
  };
};

exports.getOne = (model, primaryKey = "id") => {
  return async (req, res, next) => {
    try {
      if (!primaryKey) {
        return next(new AppError("Primary key not provided", 400));
      }

      const id = getId(req, primaryKey);
      if (
        id === undefined ||
        id === null ||
        (typeof id === "number" && Number.isNaN(id))
      ) {
        return next(
          new AppError(`Invalid or missing '${primaryKey}' in path`, 400),
        );
      }

      //   const result = await mstService.findOne(model, primaryKey, id);
      const result = await prisma[model].findUnique({
        where: { [primaryKey]: id },
      });

      if (!result) {
        return next(new AppError("Data Not Found", 404));
      }

      //   return appResponse.ok(res, "Data fetched successfully", result);
      return res
        .status(200)
        .json(new appResponse("Data fetched successfully", result));
    } catch (error) {
      console.error("Fetch one error:", error);
      return next(new AppError("Failed to fetch data", 400));
    }
  };
};

exports.update = (model, primaryKey = "user_id") => {
  return async (req, res, next) => {
    try {
      const id = getId(req, primaryKey);
      if (
        id === undefined ||
        id === null ||
        (typeof id === "number" && Number.isNaN(id))
      ) {
        return next(
          new AppError(`Invalid or missing '${primaryKey}' in path`, 400),
        );
      }

      if (!Object.keys(req.body || {}).length) {
        return next(new AppError("Nothing to update", 400));
      }

      const updated = await mstService.update(model, primaryKey, id, req.body);

      //   return appResponse.ok(res, "Updated successfully", updated);
      return res
        .status(200)
        .json(new appResponse("Updated successfully", updated));
    } catch (error) {
      console.error("Update error:", error);
      return next(new AppError("Failed to update data", 400));
    }
  };
};

exports.remove = (model, primaryKey = "user_id") => {
  return async (req, res, next) => {
    try {
      const id = getId(req, primaryKey);
      if (
        id === undefined ||
        id === null ||
        (typeof id === "number" && Number.isNaN(id))
      ) {
        return next(
          new AppError(`Invalid or missing '${primaryKey}' in path`, 400),
        );
      }

      const result = await mstService.remove(model, primaryKey, id);

      //   return appResponse.ok(
      //     res,
      //     result.softDeleted
      //       ? "Soft deleted successfully"
      //       : "Deleted successfully",
      //   );
      return res.status(200).json(new appResponse("Deleted", result));
    } catch (error) {
      console.error("Delete error:", error);
      return next(new AppError("Failed to delete data", 400));
    }
  };
};
