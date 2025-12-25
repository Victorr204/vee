import { activationCodes } from "../data/activationCodes";

export function activateCode(code) {
  if (activationCodes.includes(code)) {
    localStorage.setItem("activated", "true");
    return true;
  }
  return false;
}

export function isActivated() {
  return localStorage.getItem("activated") === "true";
}
export const isTestActivated = () => {
  return localStorage.getItem("test_activated") === "true";
};

export const activateTest = () => {
  localStorage.setItem("test_activated", "true");
};
