import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")

const { version } = require("maplibre-gl/package.json")
const distDir = dirname(require.resolve("maplibre-gl/package.json")) + "/dist"
const outRoot = join(projectRoot, "public", "maplibre")
const outDir = join(outRoot, version)

const WORKER_FILES = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]

const missing = WORKER_FILES.filter(
  (file) => !existsSync(join(distDir, file))
)

if (missing.length > 0) {
  console.error(
    `[maplibre-worker] expected files missing from ${distDir}: ${missing.join(", ")}`
  )
  process.exit(1)
}

if (existsSync(outRoot)) {
  for (const entry of readdirSync(outRoot)) {
    if (entry !== version) {
      rmSync(join(outRoot, entry), { recursive: true, force: true })
    }
  }
}

mkdirSync(outDir, { recursive: true })

for (const file of WORKER_FILES) {
  copyFileSync(join(distDir, file), join(outDir, file))
}

console.log(
  `[maplibre-worker] maplibre-gl@${version} -> public/maplibre/${version}`
)
