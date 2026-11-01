## ADDED Requirements

### Requirement: Routine updates merge themselves

The shared preset MUST set a three-day `minimumReleaseAge` for ordinary updates and MUST automerge minor, patch and lock file maintenance updates. Major updates MUST NOT automerge. A consumer package rule that sets `automerge` to false MUST take precedence.

#### Scenario: A patch update passes its checks

- **WHEN** a patch release is three days old and the pull request's required checks pass
- **THEN** the update merges without a person

#### Scenario: A major update is proposed

- **WHEN** Renovate proposes a major update
- **THEN** it waits for review

#### Scenario: A repository keeps updates review-only

- **WHEN** a consumer rule sets `automerge` to false for routine updates
- **THEN** those updates wait for review

## MODIFIED Requirements

### Requirement: Shared policy keeps generic defaults

The shared preset MUST extend `config:recommended` and MUST preserve its generic timezone, routine schedule, dashboard, concurrency and lock file maintenance settings.

#### Scenario: Consumer loads the shared preset

- **WHEN** a repository extends the shared preset
- **THEN** Renovate applies its recommended baseline and the preset's timezone and schedule
- **AND** the dependency dashboard and scheduled lock file maintenance are enabled
- **AND** pull requests are limited to 5 concurrent and 2 hourly requests

### Requirement: Consumers own project policy

The shared preset MUST NOT define project-specific managers, toolchain updaters, compatibility groups, labels, version restrictions, or security handling. Consumer package rules MUST retain precedence over shared group assignments.

#### Scenario: A consumer defines a dedicated group

- **WHEN** a local package rule assigns matching dependencies a group name
- **THEN** those dependencies use the local group rather than the shared routine or upstream group
- **AND** dependencies outside that local match keep their otherwise applicable policy

#### Scenario: A consumer reserves toolchain updates

- **WHEN** a consumer disables a manager or dependency because a dedicated updater owns it
- **THEN** the shared preset does not add a competing updater rule
