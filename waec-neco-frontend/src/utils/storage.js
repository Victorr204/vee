export function getStoredQuestions() {
  return JSON.parse(localStorage.getItem("questions")) || [];
}

export function saveQuestions(qs) {
  localStorage.setItem("questions", JSON.stringify(qs));
}

export function getActivationCodes() {
  return JSON.parse(localStorage.getItem("codes")) || [];
}

export function saveActivationCodes(codes) {
  localStorage.setItem("codes", JSON.stringify(codes));
}