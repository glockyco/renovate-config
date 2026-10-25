{
  description = "Shared Renovate configuration and its verification";

  # This flake exists only to verify the repository: the Renovate preset and the
  # OpenSpec artifacts. The preset is consumed as JSON over HTTPS and needs no build.

  inputs = {
    # Same nixpkgs release the workstation pins, so the check evaluates against
    # one package set and one binary cache across every repository.
    nixpkgs.url = "https://flakehub.com/f/NixOS/nixpkgs/0.2605";

    # Defines the OpenSpec artifact check every repository on this workstation
    # runs, so the commands and the pinned CLI live in one place.
    fleet = {
      url = "github:glockyco/omp-agent-setup";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      nixpkgs,
      fleet,
      ...
    }:
    let
      systems = [
        "aarch64-darwin"
        "x86_64-linux"
      ];

      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      checks = forAllSystems (pkgs: {
        openspec = fleet.lib.openspecCheck { inherit pkgs; src = ./.; };

        # Renovate reads default.json as a preset, so its own validator checks it.
        # --no-global validates it as repository configuration rather than as a
        # self-hosted global file, and --strict also fails on migrated options.
        renovate = pkgs.runCommand "renovate-preset" { nativeBuildInputs = [ pkgs.renovate ]; } ''
          export HOME="$TMPDIR"
          renovate-config-validator --strict --no-global ${./default.json}
          ${pkgs.nodejs_24}/bin/node ${./tests/policy.mjs} \
            ${pkgs.renovate}/lib/node_modules/renovate ${./default.json}
          touch "$out"
        '';
      });
    };
}
