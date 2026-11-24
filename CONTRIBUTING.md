# Contributing to `awesome-os/just-js`

## Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/awesome-os/just-js.git
   cd just-js
   ```

2. Verify live $O(1)$ Ghost CAS (`awesome-os/b8g-ghost @ cas-v1`) hydration using Node.js 22+ (direct erasable TypeScript, zero `npx`, zero downlevel build step):

   ```bash
   node ghost-hydrate.mts
   node examples/ghost-cas-quickstart.mts
   ```

3. For a containerized Linux environment, use `ghcr.io/awesome-os/t2linux:latest`.

## Guidelines

- Write TypeScript scripts in erasable syntax (`erasableSyntaxOnly: true`) using `.mts` so they execute directly on Node.js 22+.
- Hydrate native binaries, shared V8, `b8g-ghost-abi.node` (`B8G_ARENA_V1`), and Wave 2 toolchains from `awesome-os/b8g-ghost @ cas-v1` rather than vendoring static archives or calling legacy `just-js/libv8` / `just-js/libs` URLs.
- Keep CI green (`.github/workflows/ci.yml`).
