## Why

The shared Renovate preset currently applies `group:allNonMajor` to every consumer. This groups unrelated updates across ecosystems and repositories. The preset also sets `rebaseWhen: conflicted`, which overrides Renovate's normal branch-protection-aware behavior. Shared policy must provide safe defaults without deciding how one consuming project groups its dependencies.

## What Changes

- Keep `config:recommended` as the shared Renovate baseline.
- Keep generic safety, scheduling, dependency dashboard, pull request concurrency, manual merge, and lock file maintenance defaults.
- Remove `group:allNonMajor` from the shared preset.
- Remove the explicit `rebaseWhen: conflicted` setting.
- Keep project-specific managers, compatibility groups, labels, release age, security handling, and Nix updater rules in each consuming repository.
- Audit current consumers before publication so each repository adds any required local rules.

### Goals

- Make the shared preset reusable across Oh My Pi repositories.
- Prevent unrelated dependency updates from sharing one pull request by default.
- Preserve manual merge and bounded pull request behavior.
- Keep weekly scheduling and lock file maintenance consistent for all consumers.
- Let Renovate apply its normal rebase behavior when the shared preset does not specify one.
- Preserve each consuming repository's local ownership of toolchains and updater rules.

### Non-goals

- Add Erenshor-specific Renovate rules to this repository.
- Define package managers, compatibility groups, labels, release age, or security-update rules for a consuming project.
- Configure a Nix updater in the shared preset.
- Enable automerge or change branch-protection settings.
- Add another lock file or compatibility preset.

### Migration Boundary

The migration changes `default.json`, OpenSpec planning artifacts, and the local OpenSpec setup. It does not change dependency manifests, lock files, CI workflows, or application code in consuming repositories. Each consumer must review its inherited behavior and add project-specific rules in its own repository before it relies on the narrower shared preset.

## Impact

Consumers that extend this preset will stop inheriting the broad all-non-major group and the conflict-only rebase override. They will continue to inherit the recommended baseline, weekly schedule, dashboard, manual merge policy, pull request limits, and weekly lock file maintenance. Consumers that require compatibility grouping or other project policy must declare it locally.
