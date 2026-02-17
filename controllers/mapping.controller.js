const prisma = require("../prisma/db");
const appResponse = require("../utils/appResponse");
const AppError = require("../utils/appError");

// 1. Get User-Designation Mappings (Flattened)
// Desired: user_id, user_name, designation_id, designation_name, dsgn_code
async function getUserDesignationMappings(req, res, next) {
  try {
    const mappings = await prisma.asa_user_dsgn_mapping.findMany({
      where: { is_active: true },
      include: {
        // Relation to User Table (check your schema for exact relation name)
        asa_user_mst_asa_user_dsgn_mapping_user_idToasa_user_mst: {
          select: { full_name: true },
        },
        // Relation to Designation Table
        asa_designation_mst: {
          select: { dsgn_name: true, dsgn_code: true },
        },
      },
    });

    // Flatten the response
    const formattedData = mappings.map((item) => ({
      seq_id: item.seq_id,
      user_id: item.user_id,
      user_name:
        item.asa_user_mst_asa_user_dsgn_mapping_user_idToasa_user_mst
          ?.full_name || "N/A",
      designation_id: item.designation_id,
      designation_name: item.asa_designation_mst?.dsgn_name || "N/A",
      designation_code: item.asa_designation_mst?.dsgn_code || "N/A",
      is_primary: item.is_primary_dsgn,
      is_active: item.is_active,
    }));

    return res
      .status(200)
      .json(
        new appResponse("User Mappings fetched successfully", formattedData),
      );
  } catch (err) {
    console.error(err);
    return next(new AppError("Failed to fetch user mappings", 500));
  }
}

// 2. Get Designation-Role Mappings (Flattened)
// Desired: designation_id, designation_name, dsgn_code, role_id, role_name, role_code
async function getDesignationRoleMappings(req, res, next) {
  try {
    const mappings = await prisma.asa_dsgn_role_mapping_mst.findMany({
      where: { is_active: true },
      include: {
        asa_designation_mst: {
          select: { dsgn_name: true, dsgn_code: true },
        },
        asa_role_mst: {
          select: { role_name: true, role_code: true },
        },
      },
    });

    // Flatten the response
    const formattedData = mappings.map((item) => ({
      seq_id: item.seq_id,
      designation_id: item.designation_id,
      designation_name: item.asa_designation_mst?.dsgn_name || "N/A",
      designation_code: item.asa_designation_mst?.dsgn_code || "N/A",
      role_id: item.role_id,
      role_name: item.asa_role_mst?.role_name || "N/A",
      role_code: item.asa_role_mst?.role_code || "N/A",
      is_active: item.is_active,
    }));

    return res
      .status(200)
      .json(
        new appResponse("Role Mappings fetched successfully", formattedData),
      );
  } catch (err) {
    console.error(err);
    return next(new AppError("Failed to fetch role mappings", 500));
  }
}

module.exports = {
  getUserDesignationMappings,
  getDesignationRoleMappings,
};
