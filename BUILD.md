# Building & Hydrating `awesome-os/just-js`

`awesome-os/just-js` replaces legacy static V8 monoliths (`libv8_monolith.a`) and upstream `just-js/libs` source builds with $O(1)$ SHA-256-verified hydration from **`awesome-os/b8g-ghost @ cas-v1`** (`149+` verified entries).

## 1. Hydrate Dynamic V8 & Native Components (Recommended)

Requires Node.js 22+ (direct erasable `.mts` execution, zero build step):

```bash
# Hydrate dynamic shared V8 + native components (brotli, sqlite3, webp) into Machine CAS
node ghost-hydrate.mts

# Run the Ghost CAS quickstart (verifies 149+ cas-v1 entries, 4-OS b8g-ghost-abi.node,
# Wave 2 typescript-6.0.3-programmable.tar.gz, and hydrates the host B8G_ARENA_V1 addon)
node examples/ghost-cas-quickstart.mts
```

On Windows inside the `awesome-os` workspace:

```powershell
.\bin\node.ps1 ghost-hydrate.mts
.\bin\node.ps1 examples/ghost-cas-quickstart.mts
```

## 2. Containerized Linux Environment

```bash
docker pull ghcr.io/awesome-os/t2linux:latest
```

## 3. Makefile Targets

```bash
# Hydrate Ghost CAS dynamic V8 + native components
make ghost-hydrate

# Run the Ghost CAS quickstart verification
make quickstart

# Clean local object files
make clean
```

## 4. Upstream `just` Config Reference

The root `config.js` and `debugger.js` remain available for upstream `just` runtime configuration:

```bash
./just build config.js --dump
./just build config.js --clean
./just build --clean --config debugger.js
```
