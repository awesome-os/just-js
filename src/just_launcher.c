/*
 * src/just_launcher.c — Tiny zero-dependency 4-OS C11 native launcher for awesome-os/just-js
 * Handles --version / --help and delegates to examples/ghost-cas-quickstart.mts (cas-v1),
 * ghost-hydrate.mts, or any user script via Node.js 22+ erasable TypeScript execution.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
#include <process.h>
#else
#include <unistd.h>
#endif

#define JUST_LAUNCHER_VERSION "0.1.0"
#define JUST_CAS_TAG "awesome-os/b8g-ghost @ cas-v1"

static void print_version(void) {
  printf("just %s (awesome-os/just-js; %s; 4-OS C11 launcher)\n",
         JUST_LAUNCHER_VERSION, JUST_CAS_TAG);
}

static void print_help(void) {
  printf(
      "awesome-os/just-js %s — Zero-Dependency 4-OS C11 Launcher\n"
      "\n"
      "Usage:\n"
      "  just                         Run Ghost CAS quickstart (examples/ghost-cas-quickstart.mts)\n"
      "  just quickstart              Run Ghost CAS quickstart (examples/ghost-cas-quickstart.mts)\n"
      "  just hydrate                 Hydrate dynamic V8 + native libs (ghost-hydrate.mts)\n"
      "  just <script> [args...]      Execute a .mts/.js script directly via Node.js 22+\n"
      "  just --version | -v          Print launcher version and CAS target\n"
      "  just --help    | -h          Show this help message\n"
      "\n"
      "Environment:\n"
      "  JUST_NODE                    Override Node.js executable (default: node)\n"
      "  B8G_CAS_DIR                  Override local Machine CAS directory\n"
      "\n"
      "Canonical CAS: %s\n",
      JUST_LAUNCHER_VERSION, JUST_CAS_TAG);
}

static int delegate_node(int extra_argc, char **extra_argv) {
  const char *node_bin = getenv("JUST_NODE");
  if (!node_bin || node_bin[0] == '\0') {
    node_bin = "node";
  }

  char **child_argv = (char **)calloc((size_t)extra_argc + 2U, sizeof(char *));
  if (!child_argv) {
    fprintf(stderr, "[just] out of memory\n");
    return 1;
  }

  child_argv[0] = (char *)node_bin;
  for (int i = 0; i < extra_argc; i++) {
    child_argv[i + 1] = extra_argv[i];
  }
  child_argv[extra_argc + 1] = NULL;

#ifdef _WIN32
  int rc = (int)_spawnvp(_P_WAIT, node_bin, (const char *const *)child_argv);
  free(child_argv);
  if (rc < 0) {
    fprintf(stderr, "[just] failed to spawn '%s' (ensure Node.js 22+ is on PATH or set JUST_NODE)\n",
            node_bin);
    return 127;
  }
  return rc;
#else
  execvp(node_bin, child_argv);
  fprintf(stderr, "[just] failed to exec '%s' (ensure Node.js 22+ is on PATH or set JUST_NODE)\n",
          node_bin);
  free(child_argv);
  return 127;
#endif
}

int main(int argc, char **argv) {
  if (argc >= 2) {
    if (strcmp(argv[1], "--version") == 0 || strcmp(argv[1], "-v") == 0) {
      print_version();
      return 0;
    }
    if (strcmp(argv[1], "--help") == 0 || strcmp(argv[1], "-h") == 0) {
      print_help();
      return 0;
    }
    if (strcmp(argv[1], "hydrate") == 0) {
      char *args[1] = { "ghost-hydrate.mts" };
      return delegate_node(1, args);
    }
    if (strcmp(argv[1], "quickstart") == 0) {
      char *args[1] = { "examples/ghost-cas-quickstart.mts" };
      return delegate_node(1, args);
    }
    return delegate_node(argc - 1, argv + 1);
  }

  char *default_args[1] = { "examples/ghost-cas-quickstart.mts" };
  return delegate_node(1, default_args);
}
