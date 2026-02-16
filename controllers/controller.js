// controllers/questions.controller.js
const questionsService = require("../services/service");
const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");

async function getAllQuestions(req, res, next) {
  try {
    const rows = await questionsService.fetchAllQuestions();
    return res
      .status(200)
      .json(new appResponse("Questions fetched successfully", rows));
  } catch (err) {
    return next(new AppError("Error fetching questions", 400));
  }
}

async function getQuestionById(req, res, next) {
  const { id } = req.params;

  const qId = Number(id);
  if (!Number.isInteger(qId) || qId <= 0) {
    return next(new AppError("Invalid question id", 400));
  }

  const question = await questionsService.fetchQuestionById(qId);
  if (!question) {
    return next(new AppError("Question not found", 404));
  }
  // res.status(200).json(question);
  return res
    .status(200)
    .json(new appResponse("Question fetched successfully", question));
}

async function getControlsByQuestionId(req, res, next) {
  const { id } = req.params;

  const qId = Number(id);
  if (!Number.isInteger(qId) || qId <= 0) {
    return next(new AppError("Invalid question id", 400));
  }

  const controls = await questionsService.fetchControlsByQuestionId(qId);
  if (!controls || controls.length === 0) {
    return next(new AppError("Options not found", 404));
  }
  // res.status(200).json(controls);
  return res
    .status(200)
    .json(new appResponse("Controls fetched successfully", controls));
}

async function getQuestionControlMapping(req, res, next) {
  const { id } = req.params;

  const applicationId = Number(id);

  if (!Number.isInteger(applicationId) || applicationId <= 0) {
    return next(new AppError("Invalid application id", 400));
  }
  const application =
    await questionsService.fetchQuestionControlMapping(applicationId);
  if (!application || application.length === 0) {
    return next(new AppError("Application not found", 404));
  }
  // res.status(200).json(application);
  return res
    .status(200)
    .json(
      new appResponse("Application Details fetched successfully", application),
    );
}

module.exports = {
  getAllQuestions,
  getQuestionById,
  getControlsByQuestionId,
  getQuestionControlMapping,
};
