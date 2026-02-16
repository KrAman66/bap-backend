const express = require("express");
const router = express.Router();
const questionsController = require("../controllers/controller");
const asyncHandler = require("../middleware/asyncHandler");
const { authorize } = require("../middleware/authorize");
const mstController = require("../controllers/mstController");

router.post("/users/create-user", mstController.create("asa_user_mst"));
router.get("/users/get-all-users", mstController.getAll("asa_user_mst"));
router.get(
  "/users/get-user-by-id/:user_id",
  mstController.getOne("asa_user_mst", "user_id"),
);
router.put(
  "/users/update-user/:user_id",
  mstController.update("asa_user_mst", "user_id"),
);
router.delete(
  "/users/delete-user/:user_id",
  mstController.remove("asa_user_mst", "user_id"),
);

router.post("/roles/create-role", mstController.create("asa_role_mst"));

router.get("/roles/get-all-roles", mstController.getAll("asa_role_mst"));

router.get(
  "/roles/get-role-by-id/:role_id",
  mstController.getOne("asa_role_mst", "role_id"),
);

router.put(
  "/roles/update-role-by-id/:role_id",
  mstController.update("asa_role_mst", "role_id"),
);

router.delete(
  "/roles/delete-role-by-id/:role_id",
  mstController.remove("asa_role_mst", "role_id"),
);

router.get("/all-questions", asyncHandler(questionsController.getAllQuestions));
router.get("/question-by-id/:id", questionsController.getQuestionById);
router.get(
  "/control-by-question-id/:id",
  questionsController.getControlsByQuestionId,
);

router.get(
  "/get-applicaition-details/:id",
  questionsController.getQuestionControlMapping,
);

// ==========================================
// 1. Designation Role Mapping Routes
// Used to define permissions for titles (e.g., CISO gets Admin access)
// ==========================================
router.post(
  "/designations/role-mapping/create",
  mstController.create("asa_dsgn_role_mapping_mst"),
);

router.get(
  "/designations/role-mapping/get-all",
  mstController.getAll("asa_dsgn_role_mapping_mst"),
);

router.get(
  "/designations/role-mapping/:seq_id",
  mstController.getOne("asa_dsgn_role_mapping_mst", "seq_id"),
);

router.put(
  "/designations/role-mapping/:seq_id",
  mstController.update("asa_dsgn_role_mapping_mst", "seq_id"),
);

router.delete(
  "/designations/role-mapping/:seq_id",
  mstController.remove("asa_dsgn_role_mapping_mst", "seq_id"),
);

// ==========================================
// 2. User Designation Mapping Routes
// Used to appoint personnel (e.g., Assign User John as MPOC)
// ==========================================
router.post(
  "/users/designation-mapping/create",
  mstController.create("asa_user_dsgn_mapping"),
);

router.get(
  "/users/designation-mapping/get-all",
  mstController.getAll("asa_user_dsgn_mapping"),
);

router.get(
  "/users/designation-mapping/:seq_id",
  mstController.getOne("asa_user_dsgn_mapping", "seq_id"),
);

router.put(
  "/users/designation-mapping/:seq_id",
  mstController.update("asa_user_dsgn_mapping", "seq_id"),
);

router.delete(
  "/users/designation-mapping/:seq_id",
  mstController.remove("asa_user_dsgn_mapping", "seq_id"),
);

// ==========================================
// 3. Designation Master Routes (MISSING PART)
// Used to create the actual titles (CISO, MPOC, TPOC)
// ==========================================

router.post(
  "/designations/create-designation",
  mstController.create("asa_designation_mst"),
);

router.get(
  "/designations/get-all-designations",
  mstController.getAll("asa_designation_mst"),
);

router.get(
  "/designations/get-designation-by-id/:dsgn_id",
  mstController.getOne("asa_designation_mst", "dsgn_id"),
);

router.put(
  "/designations/update-designation/:dsgn_id",
  mstController.update("asa_designation_mst", "dsgn_id"),
);

router.delete(
  "/designations/delete-designation/:dsgn_id",
  mstController.remove("asa_designation_mst", "dsgn_id"),
);

module.exports = router;
