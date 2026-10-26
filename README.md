# renovate-config

Shared Renovate dependency update policy for glockyco repositories. Use it in a repository where Renovate is enabled to inherit the common update policy without copying it.

## Use the preset

Add the preset to the repository's Renovate configuration:

```json
{
  "extends": ["local>glockyco/renovate-config"]
}
```

Renovate resolves this preset to [default.json](default.json), the source for scheduling, grouping, lock file maintenance and pull request limits. The shared rules collect routine updates and preserve upstream release families. Add repository-specific package rules in your own configuration to override shared groups where your project needs a different review boundary.

The preset does not install or enable Renovate. Once Renovate is enabled, it uses the inherited policy to open dependency update pull requests. Changes to this shared preset affect every repository that references it.

## Release age

Configure a release-age gate in each package manager used for lock file maintenance because Renovate cannot enforce its age checks on those updates. The preset clears Renovate's age setting only for lock file maintenance. Ordinary dependency updates retain the repository's Renovate age policy. See [Renovate's release-age guidance](https://docs.renovatebot.com/key-concepts/minimum-release-age/).

If a manager cannot enforce the repository's release-age policy, disable lock file maintenance for that manager in a local package rule and explain why in its description:

```json
{
  "packageRules": [
    {
      "description": "This manager has no release-age gate, so lock file maintenance cannot enforce the repository's release-age policy.",
      "matchManagers": ["composer"],
      "matchUpdateTypes": ["lockFileMaintenance"],
      "enabled": false
    }
  ]
}
```

Replace the example manager with the affected manager. Keep supported managers enabled so their package-manager age gates can govern maintenance.

## Development

Edit [default.json](default.json) to change the shared policy. [CI](.github/workflows/ci.yml) validates the preset with Renovate's own validator and checks the repository's [accepted policy](openspec/specs/shared-renovate-policy/spec.md) and [OpenSpec changes](openspec/changes). With Nix on a platform supported by [flake.nix](flake.nix), run both checks locally with:

```sh
nix flake check
```
