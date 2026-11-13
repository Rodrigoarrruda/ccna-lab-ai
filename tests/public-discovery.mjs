import assert from "node:assert/strict";
import robots from "../app/robots.ts";
import sitemap from "../app/sitemap.ts";

const siteUrl = "https://olive-fox-987195.hostingersite.com";

const robotRules = robots();
assert.equal(robotRules.rules.allow, "/");
assert.equal(robotRules.rules.disallow, "/api/");
assert.equal(robotRules.sitemap, `${siteUrl}/sitemap.xml`);

assert.deepEqual(sitemap(), [
  {
    url: siteUrl,
    changeFrequency: "weekly",
    priority: 1,
  },
]);

console.log("Public access and discovery metadata checks passed.");
