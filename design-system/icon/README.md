# Icon

A React package that contains icons.

## Installation

```sh
yarn add @atlaskit/icon
```

## Usage

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/core/icon).

## BEFORE YOU CHANGE ICONS

!!IMPORTANT

The icons package has a custom build process, as it generates its both stripped
svgs and glyphs that are committed to the repo, so that they can be accessed as
paths when published.

You will manually need to run `yarn update:icons` from the root repository, or
`yarn build` from inside the icon folder whenever you make changes to icon.

New Icons should be added to `/icon/svgs_raw/` and metadata about the icon added to `/icon/src/metadata.ts`, followed by the build step. The name of the icon will also need to be added to the `expected` array in `/icon/src/components/__tests__/unit/indexSpec.tsx`.

**NOTE:** The `reduced-ui-pack` package should contain all the icons we include
in this package. Make sure to rebuild the `reduced-ui-pack` sprite as outlined in
the README.md file included within that package.

If your icon is used only in a specific context or product, place it in
`/icon/src/icons/subfolder` and it will be namespaced appropriately.
