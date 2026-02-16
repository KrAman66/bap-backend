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

module.exports = router;
