# Forge React Types

This package exposes a public npm package (`@atlaskit/forge-react-types`) that contains all
necessary types for UIKit2 codegen components.

The types are code generated from the `@atlassian/forge-ui` package and are guaranteed to be in sync
with the source component implementation in the `@atlassian/forge-ui` package.

Additionally, the package syncs ADS component related dependencies from `@atlassian/forge-ui`
package, to ensure that the types are in sync with the source component implementation. This allows
@forge/react package to have the consistent ADS component dependencies to the AFM platform, instead
of being bounded by other dependencies in the Forge mono-repo.

## Usage

To generate / update all types, run the following command:

```bash
yarn workspace @atlaskit/forge-react-types codegen
```

During development, the codegen command can be run for a specific component:

```bash
yarn workspace @atlaskit/forge-react-types codegen <component-name>
```

e.g.

```bash
yarn workspace @atlaskit/forge-react-types codegen Button
```

NOTE: Make sure any new component prop types are being exported from
`packages/forge/forge-react-types/src/components/__generated__/index.ts`
