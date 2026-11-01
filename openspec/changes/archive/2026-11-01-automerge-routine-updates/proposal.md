# Proposal

## Why

Every dependency update waited for someone to merge it, so 35 pull requests piled up across 10 repositories, four of them since August. Working through them took hours of serial CI. Repositories also set their own release age, or none, so four repositories proposed releases the day they came out.

## What Changes

- The preset sets a three-day release age for ordinary updates.
- Minor, patch and lock file maintenance updates merge themselves once required checks pass. Majors still wait for review.
- A repository can keep its updates review-only with a local rule.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared-renovate-policy`: the preset sets the release age and automerges routine updates.

## Impact

Every repository extending the preset inherits both on Renovate's next run. Repositories need "Allow auto-merge" turned on, which all current consumers have. nix-config keeps its updates review-only, because its Windows changes need acceptance on Korolev before merging.
