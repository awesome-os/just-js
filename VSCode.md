# Developing `awesome-os/just-js` in VS Code

## Prerequisites

- **Node.js 22+** (for direct erasable `.mts` execution)
- **VS Code** (or compatible IDE)
- Optional: Docker / OCI runtime for `ghcr.io/awesome-os/t2linux:latest`

## 1. Clone & Hydrate

```bash
git clone https://github.com/awesome-os/just-js.git
cd just-js
node ghost-hydrate.mts
node examples/ghost-cas-quickstart.mts
```

Hydrated artifacts are cached content-addressed by SHA-256 in your Machine CAS:

- **Windows:** `%LOCALAPPDATA%\AwesomeOS\cas` (or `$env:B8G_CAS_DIR`)
- **Linux / macOS:** `~/.local/share/awesome-os/cas` (or `$B8G_CAS_DIR`)

## 2. Debugging Scripts

Attach VS Code to a Node.js 22+ or Just inspector session on `127.0.0.1:9222`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Ghost CAS Quickstart",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/examples/ghost-cas-quickstart.mts",
      "console": "integratedTerminal"
    },
    {
      "name": "Attach to Inspector",
      "type": "node",
      "request": "attach",
      "address": "127.0.0.1",
      "port": 9222,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## 3. Containerized Linux Development

If you want a pre-configured Linux environment, run against the canonical Awesome-OS container image:

```bash
docker run --rm -it -v "$(pwd):/workspace" -w /workspace ghcr.io/awesome-os/t2linux:latest
```
