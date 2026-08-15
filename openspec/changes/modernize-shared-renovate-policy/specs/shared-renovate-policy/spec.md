## Purpose

Defines the reusable Renovate behavior that Oh My Pi repositories inherit from the shared preset. The preset owns generic safety, scheduling, dashboard, concurrency, manual merge, and lock file maintenance only.

## ADDED Requirements

### Requirement: Shared policy keeps generic defaults

The shared preset MUST extend `config:recommended` and MUST preserve its existing generic timezone, schedule, dashboard, concurrency, manual merge, and lock file maintenance settings.

#### Scenario: Consumer loads the shared preset

- **WHEN** a consuming repository extends the shared preset
- **THEN** Renovate applies `config:recommended`
- **AND** routine updates use the shared timezone and schedule
- **AND** the dependency dashboard is enabled
- **AND** pull request concurrency remains limited to 5 concurrent and 2 hourly requests
- **AND** automerge remains disabled
- **AND** lock file maintenance remains enabled on the shared schedule

### Requirement: Shared policy does not group unrelated updates

The shared preset MUST NOT configure `group:allNonMajor` or another repository-wide rule that groups unrelated dependency updates across ecosystems.

#### Scenario: Unrelated updates are available

- **WHEN** unrelated dependencies have available non-major updates
- **THEN** the shared preset does not combine them into one broad pull request
- **AND** any compatibility group comes from the consuming repository's local policy

### Requirement: Shared policy does not force conflict-only rebasing

The shared preset MUST NOT set `rebaseWhen` to `conflicted` or to another explicit rebase mode.

#### Scenario: A consumer updates a branch

- **WHEN** Renovate evaluates a dependency branch in a consuming repository
- **THEN** the shared preset provides no explicit `rebaseWhen` override
- **AND** Renovate applies its normal behavior for that repository's branch state and protection settings

### Requirement: Consuming repositories own project policy

The shared preset MUST NOT define project-specific package managers, Nix updater rules, compatibility groups, labels, release age, or security-update handling.

#### Scenario: A consumer needs project-specific grouping

- **WHEN** a consuming repository needs a compatibility group or ecosystem-specific update rule
- **THEN** that repository defines the rule in its own Renovate configuration
- **AND** the shared preset remains unchanged

#### Scenario: Toolchain state changes

- **WHEN** a consuming repository updates toolchain state outside Renovate's project dependency boundary
- **THEN** the consuming repository's local workflow or updater owns the change
- **AND** the shared preset does not create a competing toolchain rule

### Requirement: Shared policy changes preserve the clean ownership boundary

A shared policy update MUST remove obsolete broad behavior without adding aliases, fallback presets, or secondary lock files.

#### Scenario: Shared preset migration is published

- **WHEN** the shared preset is migrated to this policy
- **THEN** `default.json` extends `config:recommended` without broad dependency grouping
- **AND** `default.json` does not set `rebaseWhen`
- **AND** all other current generic defaults remain present
- **AND** current consumers are audited for local rules before publication
