import assert from "node:assert/strict";
import {
  createSiteSession,
  isSitePasswordConfigured,
  isSiteSessionValid,
  MIN_SITE_PASSWORD_LENGTH,
  passwordMatches,
  SITE_SESSION_SECONDS,
} from "../lib/site-auth.ts";

const password = "local-test-password-123";
const now = 1_794_710_000_000;

assert.equal(MIN_SITE_PASSWORD_LENGTH, 16);
assert.equal(isSitePasswordConfigured(password), true);
assert.equal(isSitePasswordConfigured("too-short"), false);
assert.equal(isSitePasswordConfigured(undefined), false);
assert.equal(passwordMatches(password, password), true);
assert.equal(passwordMatches("wrong-password", password), false);

const session = createSiteSession(password, now);
assert.equal(isSiteSessionValid(session, password, now), true);
assert.equal(
  isSiteSessionValid(session, password, now + SITE_SESSION_SECONDS * 1000 - 1),
  true,
);
assert.equal(
  isSiteSessionValid(session, password, now + SITE_SESSION_SECONDS * 1000),
  false,
);
assert.equal(isSiteSessionValid(session, "another-local-test-password", now), false);
assert.equal(isSiteSessionValid(`${session}x`, password, now), false);
assert.equal(isSiteSessionValid(undefined, password, now), false);

console.log("Site password configuration, comparison, and session expiry passed.");
