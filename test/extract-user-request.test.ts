import { describe, test, expect } from "bun:test";
import { extractUserRequest } from "../src/utils/extract-user-request";

describe("extractUserRequest", () => {
  test("extracts text after @claw trigger", () => {
    expect(extractUserRequest("@claw /review-pr", "@claw")).toBe(
      "/review-pr",
    );
  });

  test("extracts slash command with arguments", () => {
    expect(
      extractUserRequest(
        "@claw /review-pr please check the auth module",
        "@claw",
      ),
    ).toBe("/review-pr please check the auth module");
  });

  test("handles trigger phrase with extra whitespace", () => {
    expect(extractUserRequest("@claw    /review-pr", "@claw")).toBe(
      "/review-pr",
    );
  });

  test("handles trigger phrase at start of multiline comment", () => {
    const comment = `@claw /review-pr
Please review this PR carefully.
Focus on security issues.`;
    expect(extractUserRequest(comment, "@claw")).toBe(
      `/review-pr
Please review this PR carefully.
Focus on security issues.`,
    );
  });

  test("handles trigger phrase in middle of text", () => {
    expect(
      extractUserRequest("Hey team, @claw can you review this?", "@claw"),
    ).toBe("can you review this?");
  });

  test("returns null for empty comment body", () => {
    expect(extractUserRequest("", "@claw")).toBeNull();
  });

  test("returns null for undefined comment body", () => {
    expect(extractUserRequest(undefined, "@claw")).toBeNull();
  });

  test("returns null when trigger phrase not found", () => {
    expect(extractUserRequest("Please review this PR", "@claw")).toBeNull();
  });

  test("returns null when only trigger phrase with no request", () => {
    expect(extractUserRequest("@claw", "@claw")).toBeNull();
  });

  test("handles custom trigger phrase", () => {
    expect(extractUserRequest("/claw help me", "/claw")).toBe("help me");
  });

  test("handles trigger phrase with special regex characters", () => {
    expect(
      extractUserRequest("@claw[bot] do something", "@claw[bot]"),
    ).toBe("do something");
  });

  test("is case insensitive", () => {
    expect(extractUserRequest("@CLAW /review-pr", "@claw")).toBe(
      "/review-pr",
    );
    expect(extractUserRequest("@Claw /review-pr", "@claw")).toBe(
      "/review-pr",
    );
  });
});
