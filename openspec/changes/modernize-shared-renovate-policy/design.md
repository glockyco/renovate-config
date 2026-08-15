## Context

`default.json` is the shared Renovate preset for Oh My Pi repositories. It is consumed by repositories with different languages, package managers, release cycles, and validation boundaries. A rule that groups every non-major update therefore crosses boundaries that the shared repository cannot verify.

The current preset already contains useful defaults:

- `config:recommended` supplies Renovate's recommended baseline.
- `timezone` and `schedule` limit routine update activity.
- `dependencyDashboard` gives maintainers one review queue.
- `automerge: false` keeps merge decisions manual.
- `prConcurrentLimit` and `prHourlyLimit` bound pull request volume.
- `lockFileMaintenance` keeps lock maintenance enabled on the existing schedule.

The current `group:allNonMajor` and `rebaseWhen: conflicted` settings do not belong in this shared boundary. Each consuming repository owns its toolchain and updater choices; this preset does not manage language toolchains or Nix inputs.

## Goals and Non-goals

**Goals:**

- Keep reusable safety and scheduling behavior in one preset.
- Keep routine update volume bounded and reviewable.
- Keep lock file maintenance enabled without grouping unrelated package updates.
- Let consuming repositories own compatibility and ecosystem policy.

**Non-goals:**

- Configure any consuming repository's package managers or Nix updater.
- Define compatibility groups, labels, release age, or security rules for a project.
- Enable automerge, alter branch protection, or add fallback lock files.

## Decisions

### 1. Keep the recommended baseline and existing generic defaults

Retain every current property except the broad group and explicit rebase override. The resulting preset keeps:

| Concern | Shared setting |
| --- | --- |
| Baseline safety | `extends: ["config:recommended"]` |
| Routine timing | Existing `timezone` and `schedule` |
| Review queue | `dependencyDashboard: true` |
| Manual merge | `automerge: false` |
| Pull request concurrency | `prConcurrentLimit: 5`, `prHourlyLimit: 2` |
| Lock maintenance | `lockFileMaintenance.enabled: true` with the existing schedule |

This preserves current behavior where it is generic and removes only behavior that crosses project boundaries.

### 2. Do not define a repository-wide dependency group

Remove `group:allNonMajor`. The preset must not add a broad `packageRules` group or an equivalent grouping extension. Renovate can use its standard monorepo behavior, while a consuming repository can define a compatibility group only when it owns and validates that boundary.

### 3. Do not define rebase behavior

Remove `rebaseWhen: conflicted`. The absence of this property lets Renovate use its normal behavior for the consumer's branch-protection and update state. The shared preset must not force every consumer into conflict-only rebasing.

### 4. Keep project policy in consumers

A consuming repository adds its own manager enablement, toolchain exclusions, compatibility groups, labels, release age, security handling, and other project rules. Those rules remain next to the manifests and validation commands that establish their correctness. The shared preset provides no Erenshor-specific policy.

### 5. Publish as a clean cutover

Update the shared preset and its OpenSpec change together. Audit current consumers before publication. If a consumer relied on the removed broad group or rebase override, replace that behavior with an explicit local rule or accept the generic Renovate behavior. Do not keep compatibility aliases or a second fallback preset.

## Risks and Mitigations

- **A consumer receives more pull requests.** The bounded concurrency and hourly limits remain. A consumer can add a narrow, documented compatibility group locally.
- **A consumer loses an intended rebase override.** Renovate's normal behavior applies. The consumer can declare a deliberate local setting after review.
- **A broad group was hiding update coupling.** Consumer-specific groups expose the compatibility boundary beside the code and checks that validate it.
- **A consumer was not audited.** Review every current preset consumer before publication and record required local migrations.

## Migration Plan

1. Initialize the OpenSpec project files for Oh My Pi.
2. Create this proposal, design, behavior specification, and implementation task list.
3. Remove `group:allNonMajor` and `rebaseWhen: conflicted` from `default.json` while preserving all other defaults.
4. Inspect each current consumer and identify any required local grouping or rebase rule.
5. Add consumer-local rules before relying on the narrower shared preset.
6. Run the repository's changed-path validation and the consumer configuration checks before publication.
7. Publish the shared preset and then remove obsolete consumer workarounds.

Rollback uses a revert of the complete shared-preset change. Do not restore parallel presets, fallback lock files, or hidden compatibility aliases.
