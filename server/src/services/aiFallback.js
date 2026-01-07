export const extractAppointmentInfoFallback = (text) => {
  const lower = text.toLowerCase();

  let urgency = "low";

  if (
    lower.includes("urgent") ||
    lower.includes("emergency") ||
    lower.includes("bahut") ||
    lower.includes("serious") ||
    lower.includes("severe")
  ) {
    urgency = "high";
  } else if (
    lower.includes("fever") ||
    lower.includes("bukhar") ||
    lower.includes("pain") ||
    lower.includes("dard") ||
    lower.includes("headache")
  ) {
    urgency = "medium";
  }

  let preferredDateTime = null;
  if (lower.includes("today") || lower.includes("aaj")) {
    preferredDateTime = "today";
  } else if (lower.includes("tomorrow") || lower.includes("kal")) {
    preferredDateTime = "tomorrow";
  }

  return {
    symptoms: text,
    preferredDateTime,
    urgency
  };
};
