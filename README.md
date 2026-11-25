# awesome-os/just-js

> **Debloated Just.js Runtime wired to Canonical $O(1)$ Ghost CAS (`awesome-os/b8g-ghost @ cas-v1`)**

`awesome-os/just-js` is the modernized, debloated fork of [just-js/just](https://github.com/just-js/just). Instead of vendoring legacy 250 MB `libv8_monolith.a` archives or rebuilding `just-js/libs` from source, all native V8, ABI, and component dependencies hydrate on demand from the canonical **`awesome-os/b8g-ghost @ cas-v1`** content-addressed store (CAS).

## Quick Install & Usage

### Install via `pnpm` (or release tarball)

```powershell
pnpm add github:awesome-os/just-js
```

Or download the latest SHA-256 verified archive from [`Releases`](https://github.com/awesome-os/just-js/releases/latest).

### Usage & Verification

```powershell
# Run the live Ghost CAS quickstart (Node.js 22+)
node examples/ghost-cas-quickstart.mts

# Hydrate dynamic shared V8 + native C shards into Machine CAS
node ghost-hydrate.mts
```

## Live Ghost CAS (`awesome-os/b8g-ghost @ cas-v1`)

| Capability | Live State |
| :--- | :--- |
| **Canonical Index** | [`manifests/index.json`](https://raw.githubusercontent.com/awesome-os/b8g-ghost/main/manifests/index.json) — **`149+` verified SHA-256 entries** |
| **Zero-`node-gyp` Native ABI** | `b8g-ghost-abi.node` — **4-OS `B8G_ARENA_V1`** prebuilt N-API addons (`win64`, `linux-x64`, `linux-arm64`, `macos-arm64`) |
| **Native & WASI Shards** | **`35/35` 5-OS C/Wasm shards** (`win64`, `linux-x64`, `linux-arm64`, `macos-arm64`, `wasm32-wasi`) |
| **Wave 2 Toolchain** | `typescript-6.0.3-programmable.tar.gz` — programmable TypeScript 6.0.3 distribution |
| **Container Runtime** | `ghcr.io/awesome-os/t2linux:latest` |
| **Release Retention** | **Keep-Last-5** automated retention policy on `cas-v1` |

## Quickstart (Direct Erasable TypeScript)

Requires Node.js 22+ (direct `.mts` execution, `erasableSyntaxOnly: true`, zero build step).

### 1. Run the Ghost CAS Quickstart Example

Queries the live `cas-v1` manifest, verifies `149+` entries, inspects the 4-OS `b8g-ghost-abi.node` (`B8G_ARENA_V1`) addons, `v8-shared`, and `typescript-6.0.3-programmable.tar.gz`, and atomically hydrates + SHA-256 verifies your host `b8g-ghost-abi` addon into the local Machine CAS:

```bash
node examples/ghost-cas-quickstart.mts
```

On Windows inside the `awesome-os` workspace:

```powershell
.\bin\node.ps1 examples/ghost-cas-quickstart.mts
```

### 2. Hydrate Dynamic V8 + Native Component Libraries

Hydrates dynamic shared V8 (`v8-shared-*`) plus `libbrotli`, `libsqlite3`, and `libwebp` directly into your local Machine CAS (`$B8G_CAS_DIR`, `%LOCALAPPDATA%\AwesomeOS\cas` on Windows, or `~/.local/share/awesome-os/cas` on Linux/macOS):

```bash
node ghost-hydrate.mts
```

### 3. Zero-Dependency 4-OS C11 Native Launcher (`src/just_launcher.c`)

Prebuilt `v0.1.0` binaries (`just.exe`, `just-linux-x64`, `just-linux-arm64`, `just-macos-arm64`) are published on [GitHub Releases](https://github.com/awesome-os/just-js/releases/tag/v0.1.0) and can be cross-compiled locally with Zig C11 (`zig cc -std=c11 -Os -s`):

```bash
just --version       # Print launcher version and cas-v1 target
just --help          # Print usage
just                 # Run examples/ghost-cas-quickstart.mts
just hydrate         # Run ghost-hydrate.mts
```

### 4. Containerized Linux Environment

```bash
docker pull ghcr.io/awesome-os/t2linux:latest
```

---

## Upstream Just.js Reference

> **Upstream Note (17 Nov 2023):** Original [just-js/just](https://github.com/just-js/just) moved upstream experimentation to [just-js/lo](https://github.com/just-js/lo). `awesome-os/just-js` maintains this minimal V8 systems runtime wired to `awesome-os/b8g-ghost @ cas-v1`.

### Command Line Options

```bash
# Run a Just shell / REPL
just

# Pipe a script to stdin
cat hello.js | just --

# Eval JavaScript passed as an argument
just eval "just.print(just.memoryUsage().rss)"

# Run a script
just hello.js

# Initialise and build a project
just init hello
cd hello
just build hello.js --clean --static
./hello

# Clean a built project
just clean
```

### Philosophy / Goals

- Small, secure, robust, and performant JS runtime with minimal C/C++ surface (`< 5k` LOC)
- Thin layer over system calls, dynamic V8, and standard C libraries
- Favour return codes over exceptions; allocate as little as possible on the V8 heap
- Zero-`node-gyp` native interop via 64-byte-aligned `B8G_ARENA_V1` (`b8g-ghost-abi.node`) and $O(1)$ Ghost CAS hydration

## Quick Install & Run (Windows / Linux / macOS)

```sh
# Install / hydrate from v11 CAS via holo-pm
holo-pm install repository://github.com/awesome-os/just-js@main

# Or project & run directly via holo-project (0-byte hardlink)
holo-project "project://cpp/just-js?from=repository://github.com/awesome-os/just-js@main"
```
