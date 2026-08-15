## 1. OpenSpec and Policy Contract

- [ ] 1.1 Initialize OpenSpec with the `spec-driven` schema and Oh My Pi commands and skills.
- [ ] 1.2 Record the shared-policy boundary in `openspec/config.yaml`: generic safety, scheduling, dashboard, concurrency, manual merge, and lock file maintenance only.
- [ ] 1.3 Review the proposal, design, behavior specification, and this task list for a complete migration contract.

## 2. Shared Preset Cutover

- [ ] 2.1 Preserve `config:recommended` and every existing generic default in `default.json`.
- [ ] 2.2 Remove `group:allNonMajor` from `default.json`.
- [ ] 2.3 Remove the explicit `rebaseWhen: conflicted` setting from `default.json`.
- [ ] 2.4 Confirm that `default.json` contains no Erenshor-specific managers, groups, labels, release-age rules, security rules, or Nix updater configuration.

## 3. Consumer Migration

- [ ] 3.1 Inventory every current repository that extends the shared preset.
- [ ] 3.2 Identify consumers that relied on broad non-major grouping or the explicit rebase override.
- [ ] 3.3 Add required compatibility groups and other project-specific behavior to each consumer's local Renovate configuration.
- [ ] 3.4 Remove obsolete consumer workarounds only after equivalent local policy is present.
- [ ] 3.5 Confirm that toolchain and updater ownership remains local to each consuming repository.

## 4. Verification and Publication

- [x] 4.1 Check the shared JSON configuration for the required baseline, generic defaults, and removed keys.
- [ ] 4.2 Check each audited consumer for valid inheritance and intentional local policy.
- [ ] 4.3 Confirm that no broad grouping, fallback preset, compatibility alias, or secondary lock file was added.
- [ ] 4.4 Publish the shared preset after consumer policy is ready.
- [ ] 4.5 Re-run consumer update previews and confirm that unrelated updates are not grouped repository-wide.
- [ ] 4.6 Archive this OpenSpec change only after the shared preset and consumers match every requirement.
