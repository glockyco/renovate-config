## Context

The preset behavior from 97843c4 and 699509a is already live. The original change prohibited broad grouping and was never accepted. See the proposal for the reconciliation boundary.

## Goals and Non-goals

Accept the live generic defaults and routine group. Add upstream SvelteKit release coupling without taking ownership of consumer compatibility policy. Do not alter consumer files or trigger dependency updates outside their normal schedule.

## Decisions

### Retain generic defaults without a rebase override

`default.json` is the source for the recommended baseline, timezone, schedule, dashboard, manual merge policy, request limits, and lock maintenance settings. Preserve those settings. Do not restore `group:allNonMajor` or an explicit `rebaseWhen`, so Renovate retains its branch-protection-aware behavior.

### Keep the routine group below more specific groups

The first package rule collects minor and patch updates into one routine group. It does not match majors. Renovate's vulnerability-alert behavior remains unchanged. Later upstream-source and consumer rules establish distinct review boundaries. Consumers' own package rules follow resolved preset rules, so their group names win for matching updates.

This accepts 699509a's notification-volume trade-off. A single Saturday run had produced multiple threads per repository. The previous proposal's blanket ban would silently reverse that decision.

### Group the upstream SvelteKit release family

A second shared rule matches the normalized source URL of the SvelteKit repository rather than a package-name list. Adapter majors require the matching Kit major. Renovate's built-in monorepo data does not include this source repository. This is upstream release coupling like Renovate's existing monorepo groups, not a consumer's project-specific compatibility group.

Leave `separateMajorMinor` at Renovate's default of true. Its documented precedence over package groups keeps SvelteKit major updates on a separate branch from SvelteKit minor and patch updates. The source rule follows the routine rule, and consumer-local groups still follow both. In particular, erenshor-data-mining's broader SvelteKit and Vite boundary remains authoritative.

References: [package rule ordering](https://docs.renovatebot.com/configuration-options/#packagerules), [major separation](https://docs.renovatebot.com/configuration-options/#separatemajorminor), and [preset resolution](https://docs.renovatebot.com/config-presets/).

### Keep project policy local

Managers, Nix and language toolchain updaters, compatibility groups, labels, release-age restrictions, version bounds, and security handling remain in consumers. No alias, fallback preset, or secondary lock file is needed.

## Consumer audit

On 2026-10-25, `gh search code 'glockyco/renovate-config' --limit 100` returned only two configuration files because its index was incomplete. A GitHub API inventory inspected all 77 accessible repositories' default-branch root trees and their Renovate configuration locations. Eleven consumers were found. All currently use `local>glockyco/renovate-config`, the GitHub-platform equivalent of the historical `github>` reference.

| Consumer | Local policy and observed Renovate evidence |
| --- | --- |
| ancient-kingdoms-mods | Local deck.gl group and TypeScript bound. [#118](https://github.com/glockyco/ancient-kingdoms-mods/pull/118) is separate from the routine [#117](https://github.com/glockyco/ancient-kingdoms-mods/pull/117). SvelteKit [#120](https://github.com/glockyco/ancient-kingdoms-mods/pull/120) and [#121](https://github.com/glockyco/ancient-kingdoms-mods/pull/121) demonstrate the upstream grouping gap. |
| nix-config | Nix disabled locally. GitHub Actions group [#70](https://github.com/glockyco/nix-config/pull/70) is separate from routine [#113](https://github.com/glockyco/nix-config/pull/113) and major Actions [#114](https://github.com/glockyco/nix-config/pull/114). |
| erenshor-data-mining | Local SvelteKit and Vite, ESLint, deck.gl, .NET test tooling, and Actions groups. Local Nix and package-manager exclusions, version bounds, labels, release age, major approval, and security handling. Routine [#314](https://github.com/glockyco/erenshor-data-mining/pull/314), security Vite [#316](https://github.com/glockyco/erenshor-data-mining/pull/316), and lock maintenance [#315](https://github.com/glockyco/erenshor-data-mining/pull/315) are separate. [#312](https://github.com/glockyco/erenshor-data-mining/pull/312) uses `renovate/eslint` and [#313](https://github.com/glockyco/erenshor-data-mining/pull/313) uses `renovate/github-actions`, demonstrating local groups even though each currently has only one update. |
| creator-dashboard | Local TypeScript bound, no local groups. Routine [#17](https://github.com/glockyco/creator-dashboard/pull/17). SvelteKit [#18](https://github.com/glockyco/creator-dashboard/pull/18) and [#19](https://github.com/glockyco/creator-dashboard/pull/19) are separate today. |
| personal-website | No local overrides. Routine [#16](https://github.com/glockyco/personal-website/pull/16). SvelteKit [#17](https://github.com/glockyco/personal-website/pull/17) and [#18](https://github.com/glockyco/personal-website/pull/18) are separate today. |
| ardenfall-compendium | Local TypeScript bound, no local groups. Routine [#17](https://github.com/glockyco/ardenfall-compendium/pull/17). Adapter major [#18](https://github.com/glockyco/ardenfall-compendium/pull/18) will enter the SvelteKit group. |
| HotRepl | Local TypeScript, Node declarations, Roslyn, ILRepack, and NJsonSchema version bounds. No local group. Routine [#38](https://github.com/glockyco/HotRepl/pull/38) remains separate from majors. |
| compendiums.org | No local overrides. Single-package Bun [#8](https://github.com/glockyco/compendiums.org/pull/8) and lock maintenance [#6](https://github.com/glockyco/compendiums.org/pull/6) are open. A single-package PR alone does not demonstrate multi-package grouping. |
| omp-agent-setup | Local Bun, OpenSpec, Python, types, Biome, commitlint, and Actions groups. Local custom managers and Nix updater ownership. [#69](https://github.com/glockyco/omp-agent-setup/pull/69) combines npm and GitHub-tag Bun updates in the dedicated native toolchain group. |
| dependency-automation | Local Actions group. No open Renovate PRs at audit time. Precedence is established by configuration and documented rule resolution, not observed output. |
| obsidian-workbench | Local Bun, types, Biome, commitlint, and Actions groups plus custom Bun extraction. No open Renovate PRs at audit time. Precedence is established by configuration and documented rule resolution, not observed output. |

No consumer sets a local rebase override or disables the shared group with `groupName: null`. The obsolete local routine grouping rule in erenshor-data-mining was already removed by commit 43842d0. It had overridden the shared Saturday schedule with a Monday schedule. No remaining obsolete workaround was found. Local compatibility groups and version bounds remain intentional. Repeated local `automerge: false` declarations are explicit safety policy, not grouping workarounds to remove.

## Risks and verification boundary

Open PRs prove the already-live routine grouping and several local boundaries. They cannot prove the future SvelteKit rule's scheduled output. The new source match is checked against npm repository metadata and strict Renovate configuration validation. `npm view @sveltejs/adapter-cloudflare@8 peerDependencies repository --json` and the equivalent adapter-static command show the SvelteKit source and the Kit 3 peer requirement.

The CI Renovate check also runs `tests/policy.mjs` against its pinned Renovate engine. The tests apply real package rules for routine updates, unrelated majors, Kit and both adapters at all three update types, and a consumer override. Without the new source rule, nine upstream-group cases fail. With it, all thirteen cases pass locally against Renovate 44.181.6. The exact Nix-pinned version is verified by CI because that version is not available from the local npm registry.

On the next scheduled run, the new rule should regroup the listed adapter and Kit majors. Existing local groups retain precedence. Do not claim a preview was run for consumers without access to their Renovate execution environment. CI validates the preset and all OpenSpec artifacts before publication.
