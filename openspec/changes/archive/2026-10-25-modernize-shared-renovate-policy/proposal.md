## Why

The open change describes a grouping prohibition that no longer matches the live preset. Commit 97843c4 removed the inherited all-non-major preset and conflict-only rebase override. Commit 699509a then deliberately grouped minor and patch updates because one Saturday run created several notification threads per repository.

## What Changes

- Accept the existing generic defaults and routine group in `default.json`.
- Preserve the recommended baseline and generic safety, scheduling, dashboard, concurrency, manual merge, and lock file maintenance defaults.
- Specify one shared minor and patch group, with consumer-defined groups taking precedence for matching dependencies.
- Keep majors and vulnerability alerts outside the shared routine grouping policy.
- Add a source-repository group for the upstream SvelteKit release family so adapter majors travel with the required Kit major, while major and minor branches remain separate.
- Keep the shared preset free of an explicit rebase override and project-specific rules.
- Audit live consumers and reconcile the project context, change artifacts, and accepted specification before archiving.

### Goals

Reduce routine review noise while preserving each consumer's compatibility boundaries and updater ownership. Establish a testable accepted contract for the already published policy.

### Non-goals

Do not enable automerge, alter branch protection, or introduce project-specific managers, labels, release-age rules, security handling, compatibility presets, or fallback lock files.

### Migration Boundary

This change revises this repository's policy records, documentation, and upstream release grouping. Consumer configurations remain unchanged. Live Renovate pull requests provide evidence for the published defaults and the SvelteKit grouping gap. The new source group takes effect on consumers' next scheduled runs.

## Capabilities

### New Capabilities

- `shared-renovate-policy`: Generic inherited defaults, routine grouping with local precedence, and consumer ownership of project policy.

## Impact

Consumers keep their generic defaults and local overrides. SvelteKit and adapter updates gain an upstream release group. The accepted specification and future change context will no longer contradict the preset. Consumer inventory and obsolete-workaround findings are recorded in the design and tasks rather than copied into permanent usage documentation.
