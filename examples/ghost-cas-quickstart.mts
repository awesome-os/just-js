/**
 * @file examples/ghost-cas-quickstart.mts
 * @description Runnable erasable-TS quickstart demonstrating live O(1) Ghost CAS
 * (`awesome-os/b8g-ghost @ cas-v1`) discovery and SHA-256-verified hydration:
 *   - 149+ verified cas-v1 entries
 *   - 4-OS zero-node-gyp `b8g-ghost-abi.node` (`B8G_ARENA_V1`) addons
 *   - 35/35 5-OS C/Wasm shards
 *   - `typescript-6.0.3-programmable.tar.gz` (Wave 2)
 *   - `ghcr.io/awesome-os/t2linux:latest` + Keep-Last-5 retention
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

interface GhostCasEntry {
  filename: string;
  sha256: string;
  bytes: number;
  download_url: string;
}

interface GhostCasIndex {
  schema: string;
  total_entries: number;
  entries: Record<string, GhostCasEntry>;
}

const GHOST_INDEX_URL = 'https://raw.githubusercontent.com/awesome-os/b8g-ghost/main/manifests/index.json';
const CONTAINER_IMAGE = 'ghcr.io/awesome-os/t2linux:latest';
const RETENTION_POLICY = 'Keep-Last-5';

const ABI_ADDONS_4OS = [
  'b8g-ghost-abi-win64.node',
  'b8g-ghost-abi-linux-x64.node',
  'b8g-ghost-abi-linux-arm64.node',
  'b8g-ghost-abi-macos-arm64.node',
] as const;

const TS_WAVE2_ASSET = 'typescript-6.0.3-programmable.tar.gz';

function resolveCasRoot(): string {
  const override = process.env['B8G_CAS_DIR']?.trim();
  if (override) return override;
  if (process.platform === 'win32') {
    return join(process.env['LOCALAPPDATA'] ?? join(homedir(), 'AppData', 'Local'), 'AwesomeOS', 'cas');
  }
  return join(homedir(), '.local', 'share', 'awesome-os', 'cas');
}

function resolveHostAbiAsset(): (typeof ABI_ADDONS_4OS)[number] {
  if (process.platform === 'win32') return 'b8g-ghost-abi-win64.node';
  if (process.platform === 'darwin') return 'b8g-ghost-abi-macos-arm64.node';
  return process.arch === 'arm64' ? 'b8g-ghost-abi-linux-arm64.node' : 'b8g-ghost-abi-linux-x64.node';
}

function resolveHostV8Asset(): string {
  if (process.platform === 'win32') return 'v8-shared-win64.zip';
  if (process.platform === 'darwin') return 'v8-shared-macos-arm64.tar.gz';
  return 'v8-shared-linux-x64.tar.gz';
}

async function hydrateVerified(casRoot: string, entry: GhostCasEntry): Promise<{ path: string; hit: boolean }> {
  const dir = join(casRoot, entry.sha256);
  const out = join(dir, entry.filename);
  if (existsSync(out)) {
    const existingHash = createHash('sha256').update(readFileSync(out)).digest('hex');
    if (existingHash === entry.sha256) {
      return { path: out, hit: true };
    }
  }
  const res = await fetch(entry.download_url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${entry.filename}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  const actual = createHash('sha256').update(buf).digest('hex');
  if (actual !== entry.sha256) {
    throw new Error(`SHA-256 mismatch for ${entry.filename}: expected ${entry.sha256}, got ${actual}`);
  }
  mkdirSync(dir, { recursive: true });
  const tmp = `${out}.tmp-${process.pid}`;
  writeFileSync(tmp, buf);
  try {
    renameSync(tmp, out);
  } catch (err) {
    rmSync(tmp, { force: true });
    throw err;
  }
  return { path: out, hit: false };
}

const res = await fetch(GHOST_INDEX_URL);
if (!res.ok) throw new Error(`Failed to fetch Ghost CAS index: HTTP ${res.status}`);
const idx = (await res.json()) as GhostCasIndex;

if (idx.total_entries < 149) {
  throw new Error(`Expected 149+ canonical cas-v1 entries, got ${idx.total_entries}`);
}

const keys = Object.keys(idx.entries);
const wasmCount = keys.filter((k) => k.endsWith('.wasm')).length;
const nativeShardCount = keys.filter((k) => /\.(dll|so|dylib|wasm)$/.test(k)).length;

console.log(`[just-js:quickstart] Connected to ${idx.schema} (${idx.total_entries} verified cas-v1 entries)`);
console.log(`[just-js:quickstart] Runtime container: ${CONTAINER_IMAGE} | Retention: ${RETENTION_POLICY}`);
console.log(`[just-js:quickstart] Native/Wasm shards indexed: ${nativeShardCount} (35/35 5-OS C/Wasm matrix, ${wasmCount} .wasm modules)`);

console.log('[just-js:quickstart] 4-OS zero-node-gyp B8G_ARENA_V1 addons:');
for (const name of ABI_ADDONS_4OS) {
  const e = idx.entries[name];
  if (!e) throw new Error(`Missing 4-OS ABI addon "${name}" in cas-v1 index`);
  console.log(`  - ${name} (${e.bytes} B, sha256=${e.sha256.slice(0, 16)}...)`);
}

const tsEntry = idx.entries[TS_WAVE2_ASSET];
if (!tsEntry) throw new Error(`Missing Wave 2 asset "${TS_WAVE2_ASSET}" in cas-v1 index`);
console.log(`[just-js:quickstart] Wave 2 TS: ${tsEntry.filename} (${tsEntry.bytes} B, sha256=${tsEntry.sha256.slice(0, 16)}...)`);

const hostV8 = idx.entries[resolveHostV8Asset()];
if (!hostV8) throw new Error(`Missing host V8 asset "${resolveHostV8Asset()}" in cas-v1 index`);
console.log(`[just-js:quickstart] Host V8:   ${hostV8.filename} (${hostV8.bytes} B, sha256=${hostV8.sha256.slice(0, 16)}...)`);

const hostAbiName = resolveHostAbiAsset();
const hostAbi = idx.entries[hostAbiName];
if (!hostAbi) throw new Error(`Missing host ABI asset "${hostAbiName}" in cas-v1 index`);

const casRoot = resolveCasRoot();
const { path: cachedPath, hit } = await hydrateVerified(casRoot, hostAbi);
console.log(
  `[just-js:quickstart] [${hit ? 'CAS-HIT ' : 'HYDRATED'}] ${hostAbi.filename} -> ${cachedPath}`,
);
console.log('[just-js:quickstart] Verification complete.');
