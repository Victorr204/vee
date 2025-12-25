const express = require("express");
const router = express.Router();

const {
  verifyCode,
  getQuestionById,
} = require("../controllers/apiController");

router.post("/verify-code", verifyCode);
router.get("/questions/:id", getQuestionById);

module.exports = router;
