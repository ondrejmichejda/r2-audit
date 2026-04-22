const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const version = new Date().toISOString().replace(/\D/g, "").slice(0, 14);

const updateFile = (relativePath, updater) => {
  const filePath = path.join(root, relativePath);
  const current = fs.readFileSync(filePath, "utf8");
  const next = updater(current);

  if (next !== current) {
    fs.writeFileSync(filePath, next);
  }
};

updateFile("src/index.ts", (content) =>
  content.replace(/const appVersion = ".*?";/, `const appVersion = "${version}";`),
);

updateFile("index.html", (content) =>
  content
    .replace(/src\/styles\.css\?v=[^"]+/g, `src/styles.css?v=${version}`)
    .replace(/dist\/index\.js\?v=[^"]+/g, `dist/index.js?v=${version}`),
);

fs.writeFileSync(
  path.join(root, "data/version.json"),
  `${JSON.stringify({ version }, null, 2)}\n`,
);

console.log(`Build version: ${version}`);
