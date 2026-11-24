#!/bin/sh
set -eu

# Hydrate awesome-os/just-js from main and verify canonical O(1) Ghost CAS (cas-v1)
REPO_URL="${JUST_REPO_URL:-https://github.com/awesome-os/just-js/archive/refs/heads/main.tar.gz}"
TARGET_DIR="${JUST_DIR:-just-js}"

curl -fsSL -o just-js.tar.gz "$REPO_URL"
mkdir -p "$TARGET_DIR"
tar -zxf just-js.tar.gz -C "$TARGET_DIR" --strip-components 1
rm -f just-js.tar.gz

cd "$TARGET_DIR"
node ghost-hydrate.mts
node examples/ghost-cas-quickstart.mts
