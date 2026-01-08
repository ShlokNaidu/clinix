export const extractAppointmentInfoFallback = (text) => {
  const lower = text.toLowerCase();

  let urgency = "low";

  if (
    lower.includes("urgent") ||
    lower.includes("emergency") ||
    lower.includes("bahut") ||
    lower.includes("zyada") ||
    lower.includes("serious") ||
    lower.includes("severe")
  ) {
    urgency = "high";
  } else if (
    lower.includes("fever") ||
    lower.includes("bukhar") ||
    lower.includes("pain") ||
    lower.includes("dard") ||
    lower.includes("headache") ||
    lower.includes("pet dard")
  ) {
    urgency = "medium";
  }

  return {
    aiSummary: `Patient reports: ${text}.`,
    urgency,
    preferredDateTime: null
  };
};
