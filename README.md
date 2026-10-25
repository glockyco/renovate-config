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

## Development

Edit [default.json](default.json) to change the shared policy. [CI](.github/workflows/ci.yml) validates the preset with Renovate's own validator and checks the repository's [accepted policy](openspec/specs/shared-renovate-policy/spec.md) and [OpenSpec changes](openspec/changes). With Nix on a platform supported by [flake.nix](flake.nix), run both checks locally with:

```sh
nix flake check
```
