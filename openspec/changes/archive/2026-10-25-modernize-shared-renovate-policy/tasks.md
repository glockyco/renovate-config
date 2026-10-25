## 1. Reconcile the policy contract

- [x] 1.1 Confirm the existing spec-driven project and completed artifacts with `openspec status`, and recover the repository's update and archive workflow instructions from the commit before they moved to the plugin.
- [x] 1.2 Reconcile proposal, design, delta specification, and project context with generic defaults, no rebase override, routine grouping, upstream release coupling, and local precedence.
- [x] 1.3 Preserve all existing generic settings and confirm that the removed all-non-major preset and rebase override remain absent.
- [x] 1.4 Keep project-specific managers, version restrictions, labels, release age, security handling, and toolchain updaters out of the shared preset.

## 2. Verify consumers and upstream coupling

- [x] 2.1 Inventory accessible repositories through code search and the GitHub API. Record all eleven consumers and their local policy in the design audit.
- [x] 2.2 Inspect open Renovate PRs and branch names to confirm shared grouping and consumer-local group boundaries. Record consumers without open PR evidence explicitly.
- [x] 2.3 Inspect local rebase and group overrides. Confirm the obsolete erenshor-data-mining routine group and Monday schedule were already removed by 43842d0. No further consumer migration is required.
- [x] 2.4 Confirm consumer toolchain ownership, compatibility groups, version restrictions, and security handling remain local.
- [x] 2.5 Verify adapter peer requirements and source repository using npm metadata. Check Renovate's documented rule order and default major/minor separation.
- [x] 2.6 Add the SvelteKit source group after the routine group without an explicit major/minor separation override.

## 3. Verify and accept

- [x] 3.1 Add behavioral regression coverage using Renovate's actual package-rule engine and wire it into the existing flake check. Confirm nine cases fail without the new source group and all thirteen pass with it.
- [x] 3.2 Run strict Renovate configuration validation. Local validation passes with 44.181.6. The existing CI validates and tests with its Nix-pinned engine.
- [x] 3.3 Update README guidance and links to the accepted policy. Confirm no alias, fallback preset, or secondary lock file was introduced.
- [x] 3.4 Validate the revised change with `CI=1 OPENSPEC_TELEMETRY=0 openspec validate modernize-shared-renovate-policy --strict --no-interactive`.
- [x] 3.5 Sync the delta into the accepted specification and archive the completed change, then strictly validate all OpenSpec artifacts.

## Evidence boundary

The original preset changes are already published. No consumer preview or forced Renovate run was performed. Open PR evidence covers live behavior, while regression tests cover the new source rule before publication. Its scheduled regrouping is not claimed as already observed. The PR's CI result records the Nix-pinned checks before merge.
