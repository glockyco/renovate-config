{
  description = "Shared Renovate configuration, and its OpenSpec artifact verification";

  # This flake exists only to verify the OpenSpec artifacts. The Renovate preset
  # is consumed as JSON over HTTPS and needs no build.

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
      });
    };
}
