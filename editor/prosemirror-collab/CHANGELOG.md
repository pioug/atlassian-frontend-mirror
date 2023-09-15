# @atlaskit/prosemirror-collab

## 1.3.0 (2022-05-30)

## 0.2.9

### Patch Changes

- [`aeb5c9a01e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeb5c9a01e8) - Delete adf-schema from AFE and rely on npm package for adf-schema
- [`4b4dcfe0bba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b4dcfe0bba) - Delete adf-schema, use published version

## 0.2.8

### Patch Changes

- [`33cb07de05f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33cb07de05f) - change adf-schema to fixed versioning

## 0.2.7

### Patch Changes

- Updated dependencies

## 0.2.6

### Patch Changes

- [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) - [ED-19233] Import prosemirror libraries from internal facade package

## 0.2.5

### Patch Changes

- [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) - [ED-13910] Fix prosemirror types

## 0.2.4

### Patch Changes

- [`73b5128036b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73b5128036b) - [ED-17082] Mark package as a singleton one

## 0.2.3

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 0.2.2

### Patch Changes

- [`a142ba1aa28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a142ba1aa28) - [ED17172] Bump prosemirror-model to 1.16.0 and prosemirror-view to 1.23.7 and removed work-arounds for fixed issues

## 0.2.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.2.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 0.1.4

### Patch Changes

- [`0ffb55018c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ffb55018c9) - Revert "[ED-17172] Bumped prosemirror-view from 1.23.2 to 1.23.7 and removed work-around for fixed issues"

## 0.1.3

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 0.1.2

### Patch Changes

- [`96a7517a28f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96a7517a28f) - Reverted filtering out analytics steps as they would break undo behaviour

## 0.1.1

### Patch Changes

- [`59e998e408f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/59e998e408f) - [ESS-2914] Switch to the forked prosemirror-collab library (based on version 1.3.0) to filter out analytics steps

## 0.1.0

### Minor Changes

- [`883590cbe7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/883590cbe7d) - [ESS-2914] Forked the prosemirror-collab library to create a version that filters out analytics steps

### Patch Changes

- Updated dependencies

### New features

Include TypeScript type declarations.

## 1.2.2 (2019-11-20)

### Bug fixes

Rename ES module files to use a .js extension, since Webpack gets confused by .mjs

## 1.2.1 (2019-11-19)

### Bug fixes

The file referred to in the package's `module` field now is compiled down to ES5.

## 1.2.0 (2019-11-08)

### New features

Add a `module` field to package json file.

## 1.1.2 (2019-05-29)

### Bug fixes

Fix an issue where in `mapSelectionBackward` mode, the plugin flipped the head and anchor of the selection, leading to selection glitches during collaborative editing.

## 1.1.1 (2018-10-09)

### Bug fixes

Fix issue where `mapSelectionBackward` didn't work because of a typo.

## 1.1.0 (2018-08-21)

### New features

[`receiveTransaction`](https://prosemirror.net/docs/ref/#collab.receiveTransaction) now supports a `mapSelectionBackward` option that makes it so that text selections are mapped to stay in place when remote changes insert content at their position.

## 0.19.0 (2017-03-16)

### New features

You can now use strings (as well as numbers) as client IDs (this already worked, but now the documentation reflects this).

## 0.18.0 (2017-02-24)

### New features

[`sendableSteps`](https://prosemirror.net/docs/ref/version/0.18.0.html#collab.sendableSteps) now also returns information about the original transactions that produced the steps.

## 0.11.0 (2016-09-21)

### Breaking changes

Moved into a separate module.

Interface [adjusted](https://prosemirror.net/docs/ref/version/0.11.0.html#collab) to work with the new
[plugin](https://prosemirror.net/docs/ref/version/0.11.0.html#state.Plugin) system.

### New features

When receiving changes, the module now
[generates](https://prosemirror.net/docs/ref/version/0.11.0.html#collab.receiveAction) a regular
[transform action](https://prosemirror.net/docs/ref/version/0.11.0.html#state.TransformAction) instead of hard-setting
the editor's document. This solves problematic corner cases for code
keeping track of the document by listening to transform actions.
