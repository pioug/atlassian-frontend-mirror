# @atlaskit/adf-schema-generator

## 2.4.0

### Minor Changes

- [`192cdfa42f9d3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/192cdfa42f9d3) -
  Autofix: add explicit package exports (barrel removal)

## 2.3.0

### Minor Changes

- [`584f9732ebcb6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/584f9732ebcb6) -
  Add `ADFNode#addContent(child)` to allow node content to be extended after `define()`. Appending
  into the existing `$one+($or(...))` or `$zero+($or(...))` clause from a downstream "wiring" module
  lets node files be declared in isolation, which breaks the module-import cycles that previously
  caused the generator to crash with `Cannot read properties of undefined (reading 'members')` when
  nodes cross-referenced each other (e.g. `panel` ↔ `table`).

## 2.2.1

### Patch Changes

- [`cd228df49c18b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd228df49c18b) -
  Add stage-0 `valign` support for table cells and layout columns, with shared valign utilities and
  standardised `data-valign` HTML attribute.

  Allow stage0 schema generation using `node.stage0` attribute.

## 2.2.0

### Minor Changes

- [`8b781b3b3f9ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8b781b3b3f9ca) -
  Add setSmallText and setSmallTextWithAnalytics commands, modify setNormalText to remove fontSize
  mark, add FORMAT_SMALL_TEXT analytics enum.

  Add support to the renderer to render 'small text'.

  Add 'fontSize' to stage0 default schema.

## 2.1.2

### Patch Changes

- [`cac3d6228356a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cac3d6228356a) -
  adf-schema doc updates
- Updated dependencies
