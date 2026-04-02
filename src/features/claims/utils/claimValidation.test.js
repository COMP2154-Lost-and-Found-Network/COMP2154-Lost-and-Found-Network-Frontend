import { describe, it, expect } from "vitest";
import { validateClaimForm } from "./claimValidation";

describe("validateClaimForm", () => {
  // TC-FE-CLAIM-002: required field blank → validation error
  it("returns an error when verification_details is missing", () => {
    const errors = validateClaimForm({ verification_details: "" });
    expect(errors.verification_details).toBeDefined();
  });

  it("returns an error when verification_details is null", () => {
    const errors = validateClaimForm({ verification_details: null });
    expect(errors.verification_details).toBeDefined();
  });

  it("returns an error when verification_details is under 20 characters", () => {
    const errors = validateClaimForm({ verification_details: "too short" });
    expect(errors.verification_details).toBeDefined();
  });

  it("returns an error when verification_details is only whitespace", () => {
    const errors = validateClaimForm({ verification_details: "                    " });
    expect(errors.verification_details).toBeDefined();
  });

  // TC-FE-CLAIM-001: valid details submitted → no errors
  it("returns no errors when verification_details meets the 20 character minimum", () => {
    const errors = validateClaimForm({
      verification_details: "This is my wallet with my student card inside.",
    });
    expect(errors).toEqual({});
  });

  it("returns no errors when verification_details is exactly 20 characters", () => {
    const errors = validateClaimForm({ verification_details: "12345678901234567890" });
    expect(errors).toEqual({});
  });
});
