const activationCodes = [
  { code: "ABC123", used: false },
  { code: "XYZ789", used: false },
];

const questions = [
  {
    id: "1",
    subject: "Mathematics",
    question_text: "What is 2 + 2?",
    answer_text: "4",
    is_premium: true,
  },
];

exports.verifyCode = (req, res) => {
  const { code } = req.body;

  const found = activationCodes.find((c) => c.code === code && !c.used);

  if (!found) {
    return res.status(403).json({ message: "Invalid or used code" });
  }

  found.used = true;
  res.json({ message: "Activation successful" });
};

exports.getQuestionById = (req, res) => {
  const code = req.headers["x-activation-code"];
  const question = questions.find((q) => q.id === req.params.id);

  if (!question) {
    return res.status(404).json({ message: "Not found" });
  }

  if (question.is_premium && !code) {
    return res.json({
      ...question,
      answer_text: null,
    });
  }

  res.json(question);
};
