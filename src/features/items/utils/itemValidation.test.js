import { describe, it, expect } from "vitest";
import { validateItemForm } from "./itemValidation";

const validBase = {
  title: "Black iPhone 13",
  category_id: 1,
  description: "Found near the cafeteria on the second floor.",
  date: "2026-03-01",
  location_id: 2,
};

// TC-FE-ITEM-001 / TC-FE-ITEM-002: all fields valid → no errors
describe("validateItemForm — valid input", () => {
  it("returns no errors when all required fields are provided", () => {
    expect(validateItemForm(validBase)).toEqual({});
  });

  it("returns no errors for a found item when image is provided and required", () => {
    const image = { size: 1024 * 1024, type: "image/jpeg" };
    expect(validateItemForm({ ...validBase, image }, { imageRequired: true })).toEqual({});
  });
});

// TC-FE-ITEM-003: required field blank → validation error
describe("validateItemForm — title", () => {
  it("returns an error when title is missing", () => {
    const errors = validateItemForm({ ...validBase, title: "" });
    expect(errors.title).toBeDefined();
  });

  it("returns an error when title is under 3 characters", () => {
    const errors = validateItemForm({ ...validBase, title: "ab" });
    expect(errors.title).toBeDefined();
  });

  it("returns no error when title is exactly 3 characters", () => {
    const errors = validateItemForm({ ...validBase, title: "Bag" });
    expect(errors.title).toBeUndefined();
  });
});

describe("validateItemForm — category", () => {
  it("returns an error when category_id is missing", () => {
    const errors = validateItemForm({ ...validBase, category_id: null });
    expect(errors.category_id).toBeDefined();
  });
});

describe("validateItemForm — description", () => {
  it("returns an error when description is missing", () => {
    const errors = validateItemForm({ ...validBase, description: "" });
    expect(errors.description).toBeDefined();
  });

  it("returns an error when description is only whitespace", () => {
    const errors = validateItemForm({ ...validBase, description: "   " });
    expect(errors.description).toBeDefined();
  });
});

describe("validateItemForm — date", () => {
  it("returns an error when date is missing", () => {
    const errors = validateItemForm({ ...validBase, date: "" });
    expect(errors.date).toBeDefined();
  });

  it("returns an error when date is in the future", () => {
    const errors = validateItemForm({ ...validBase, date: "2099-01-01" });
    expect(errors.date).toBeDefined();
  });
});

describe("validateItemForm — location", () => {
  it("returns an error when location_id is missing", () => {
    const errors = validateItemForm({ ...validBase, location_id: null });
    expect(errors.location_id).toBeDefined();
  });
});

// TC-FE-ITEM-006: found item — image not attached → validation error
describe("validateItemForm — image (found items)", () => {
  it("returns an error when image is required but not provided", () => {
    const errors = validateItemForm({ ...validBase, image: null }, { imageRequired: true });
    expect(errors.image).toBeDefined();
  });

  it("returns no error when image is not required and not provided", () => {
    const errors = validateItemForm({ ...validBase });
    expect(errors.image).toBeUndefined();
  });

  it("returns an error when image exceeds 5 MB", () => {
    const image = { size: 6 * 1024 * 1024, type: "image/jpeg" };
    const errors = validateItemForm({ ...validBase, image });
    expect(errors.image).toBeDefined();
  });

  it("returns an error when image type is not allowed", () => {
    const image = { size: 1024, type: "application/pdf" };
    const errors = validateItemForm({ ...validBase, image });
    expect(errors.image).toBeDefined();
  });

  it("returns no error for a valid PNG image", () => {
    const image = { size: 500 * 1024, type: "image/png" };
    const errors = validateItemForm({ ...validBase, image });
    expect(errors.image).toBeUndefined();
  });
});
