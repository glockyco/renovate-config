# renovate-config

Shared Renovate dependency update policy for glockyco repositories. Use it in a repository where Renovate is enabled to inherit the common update policy without copying it.

## Use the preset

Add the preset to the repository's Renovate configuration:

```json
{
  "extends": ["local>glockyco/renovate-config"]
}
```

Renovate resolves this preset to [default.json](default.json). That file defines scheduling, grouping, lock file maintenance and pull request limits. Automatic merging is disabled. Add repository-specific rules after the preset to keep local exceptions with the project they affect.

The preset does not install or enable Renovate. Once Renovate is enabled, it uses the inherited policy to open dependency update pull requests. Changes to this shared preset affect every repository that references it.

## Development

Edit [default.json](default.json) to change the shared policy. [CI](.github/workflows/ci.yml) validates the preset with Renovate's own validator and checks the repository's [OpenSpec artifacts](openspec/changes). With Nix on a platform supported by [flake.nix](flake.nix), run both checks locally with:

```sh
nix flake check
```
