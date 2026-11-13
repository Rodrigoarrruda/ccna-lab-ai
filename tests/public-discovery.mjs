import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import sitemap from "../app/sitemap.ts";

const siteUrl = "https://olive-fox-987195.hostingersite.com";

const robotText = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
assert.match(robotText, /User-agent: \*/);
assert.match(robotText, /Allow: \//);
assert.match(robotText, /Disallow: \/api\//);
assert.match(robotText, /Content-Signal: search=yes, ai-train=no/);
assert.match(robotText, new RegExp(`Sitemap: ${siteUrl}/sitemap\\.xml`));

const siteMap = sitemap();
assert.deepEqual(siteMap, [
  {
    url: siteUrl,
    lastModified: siteMap[0].lastModified,
    changeFrequency: "weekly",
    priority: 1,
  },
]);
assert(siteMap[0].lastModified instanceof Date);

console.log("Public access and discovery metadata checks passed.");
