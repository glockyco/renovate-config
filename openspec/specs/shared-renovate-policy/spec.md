# shared-renovate-policy Specification

## Purpose
Defines inherited Renovate defaults that reduce routine review noise while preserving upstream release coupling and consumer-owned project policy.

## Requirements

### Requirement: Shared policy keeps generic defaults

The shared preset MUST extend `config:recommended` and MUST preserve its generic timezone, routine schedule, dashboard, concurrency, manual merge, and lock file maintenance settings.

#### Scenario: Consumer loads the shared preset

- **WHEN** a repository extends the shared preset
- **THEN** Renovate applies its recommended baseline and the preset's timezone and schedule
- **AND** the dependency dashboard and scheduled lock file maintenance are enabled
- **AND** pull requests are limited to 5 concurrent and 2 hourly requests
- **AND** automerge is disabled

### Requirement: Shared policy groups routine updates

The shared preset MUST group minor and patch updates under `non-major dependencies` unless a more specific group overrides it. It MUST NOT restore `group:allNonMajor`.

#### Scenario: Unrelated routine updates are available

- **WHEN** multiple dependencies have minor or patch updates and no later rule assigns another group
- **THEN** their updates share one routine pull request per Renovate run

#### Scenario: A major update is available

- **WHEN** a dependency has a major update
- **THEN** the shared minor and patch rule does not put it in the routine group

#### Scenario: A vulnerability alert is available

- **WHEN** Renovate processes a vulnerability alert
- **THEN** the shared routine grouping policy does not replace Renovate's vulnerability-alert handling
- **AND** consumer-defined security policy remains applicable

### Requirement: Shared policy preserves upstream release coupling

The shared preset MUST group packages whose source URL is `https://github.com/sveltejs/kit` under `SvelteKit` after the routine rule. This upstream release family MUST remain distinct from consumer-owned compatibility groups. The preset MUST NOT disable Renovate's default major and minor separation.

#### Scenario: SvelteKit and adapter majors are available

- **WHEN** Kit and adapter updates from the SvelteKit source repository are major updates
- **THEN** the shared source rule assigns them the SvelteKit group rather than separate package groups
- **AND** SvelteKit minor and patch updates remain on a separate branch from those majors

#### Scenario: A consumer defines a broader SvelteKit compatibility boundary

- **WHEN** a consumer's later package rule assigns SvelteKit packages and Vite to its own group
- **THEN** that local group overrides both shared group names for matching dependencies
- **AND** the shared preset does not add Vite to its upstream SvelteKit source group

### Requirement: Shared policy does not force rebasing

The shared preset MUST NOT set an explicit `rebaseWhen` mode.

#### Scenario: A consumer updates a branch

- **WHEN** Renovate evaluates a dependency branch
- **THEN** the shared preset supplies no rebase override
- **AND** Renovate applies its normal behavior for the repository's branch state and protection settings

### Requirement: Consumers own project policy

The shared preset MUST NOT define project-specific managers, toolchain updaters, compatibility groups, labels, ordinary dependency release age, version restrictions, or security handling. Consumer package rules MUST retain precedence over shared group assignments.

#### Scenario: A consumer defines a dedicated group

- **WHEN** a local package rule assigns matching dependencies a group name
- **THEN** those dependencies use the local group rather than the shared routine or upstream group
- **AND** dependencies outside that local match keep their otherwise applicable policy

#### Scenario: A consumer reserves toolchain updates

- **WHEN** a consumer disables a manager or dependency because a dedicated updater owns it
- **THEN** the shared preset does not add a competing updater rule

### Requirement: Package managers enforce maintenance release age

The shared preset MUST clear `minimumReleaseAge` only for `lockFileMaintenance` with a package rule whose description explains that package managers enforce release age. Renovate cannot enforce release age for this update type. Consumers MUST configure their package managers to enforce their release-age policy or disable maintenance only for unsupported managers with a documented local package rule.

#### Scenario: A consumer configures a release-age policy

- **WHEN** Renovate applies the shared rules to lock file maintenance with an inherited minimum release age
- **THEN** the maintenance update has `minimumReleaseAge` set to null
- **AND** ordinary dependency updates retain the consumer's minimum release age
- **AND** the shared preset keeps scheduled lock file maintenance enabled

#### Scenario: A consumer uses a manager without an age gate

- **WHEN** a consumer disables lock file maintenance with a local rule matching only an unsupported manager and that update type
- **THEN** maintenance for supported managers remains enabled
- **AND** ordinary updates for the unsupported manager remain enabled


### Requirement: Shared policy has one canonical preset

The shared policy MUST use the canonical preset without compatibility aliases, fallback presets, or secondary lock files.

#### Scenario: A consumer inherits policy

- **WHEN** a consumer resolves the canonical shared preset
- **THEN** it receives the generic defaults and ordered grouping rules without choosing a compatibility preset
