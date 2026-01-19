export default function parseNestedError(input: string | object) {
  try {
    // Step 1: Parse outer JSON if it's a string
    const outer =
      typeof input === "string" ? JSON.parse(input) : input;

    // Step 2: Parse inner JSON string
    if (typeof outer?.error === "string") {
      const cleaned = outer.error.trim();
      return JSON.parse(cleaned);
    }

    return outer;
  } catch {
    throw new Error("Failed to parse nested error JSON");
  }
}
