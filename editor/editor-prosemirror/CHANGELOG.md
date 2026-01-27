# @atlaskit/editor-prosemirror

## 7.2.3

### Patch Changes

- [`fafd3de4c5880`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fafd3de4c5880) -
  Update tests to account for version bump

## 7.2.2

### Patch Changes

- [`6aa3d234b547c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6aa3d234b547c) -
  clean up unused scripts

## 7.2.1

### Patch Changes

- [`cac3d6228356a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cac3d6228356a) -
  adf-schema doc updates

## 7.2.0

### Minor Changes

- f3f87bb: Deprecate history entry-point

## 7.1.3

### Patch Changes

- 522c857: Unpin version of @babel/runtime to allow minor version variance

## 7.1.2

### Patch Changes

- ea57056: Remove fg for metadata in steps

## 7.1.1

### Patch Changes

- 25dfcfe: bumping @babel/runtime to 7.26.10

## 7.1.0

### Minor Changes

- f04a9d3: update Step Metadata type - add new attribute for tagging unconfirmed steps after
  recovery

## 7.0.0

### Major Changes

- e50cdcc: Bumped prosemirror-commands to 1.6.2, prosemirror-markdown to 1.13.1, prosemirror-model
  to 1.24.1, prosemirror-transform to 1.10.2, prosemirror-view to 1.37.1

## 6.3.0

### Minor Changes

- 0977017: Add metadata as separate type exported from editor-transform

## 6.2.1

### Patch Changes

- 3b567d4: Use new FF that targets NCS and AFE

## 6.2.0

### Minor Changes

- 5b63e77: Add platform feature flag override for step type to metadata step type

## 6.1.2

### Patch Changes

- faee55a: Additional tests for metadata monkey patch

## 6.1.1

### Patch Changes

- f27b371: Add unused override for editor-transform to preserve step metadata during JSON transforms

## 6.1.0

### Minor Changes

- cb04de2: bump typescript to v5

## 6.0.0

### Major Changes

- 93a6bd0: Remove "default" export from "/commands" entry-point as it was wrongly exported.

## 5.1.0

### Minor Changes

- e823ddf: bumped prosemirror-view version to resolve issue with korean text input

## 5.0.3

### Patch Changes

- 52585b6: Resync prosemirror commands

## 5.0.2

### Patch Changes

- cde789c: Updated dependencies

## 5.0.1

### Patch Changes

- f2806e9: Update prosemirror-model to fix vulnerability to DOMSerializer

## 5.0.0

### Major Changes

- 5288c99: update prosemirror dependencies

## 4.0.1

### Patch Changes

- b6ab270: [HOT-108999] We had an incident where the cursor jumps back a character for any language
  triggering composition on an empty line when a mark is applied. This was fixed in a patch bump of
  prosemirror-view. <https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5>

## 4.0.0

### Major Changes

- a7b41f7: prosemirror-view bumped to 1.33.4, prosemirror-transform to 1.8.0, prosemirror-model to
  1.20.0, prosemirror-history to 1.4.0

## 3.0.0

### Major Changes

- 24ac11d: [ED-21836] Bump ProseMirror libraries

  prosemirror-commands 1.5.0 (old) => 1.5.2 (new) prosemirror-dropcursor 1.7.0 (old) => 1.8.1 (new)
  prosemirror-keymap 1.2.1 (old) => 1.2.2 (new) prosemirror-markdown 1.11.1 (old) => 1.12.0 (new)
  prosemirror-model 1.19.3 (old) => 1.19.4 (new) prosemirror-transform 1.7.1 (old) => 1.8.0 (new)
  prosemirror-utils 1.2.0 (old) => 1.2.1-0 (new) prosemirror-view 1.31.6 (old) => 1.32.7 (new)

## 2.0.3

### Patch Changes

- 169dab9: Update readme

## 2.0.2

### Patch Changes

- 55e4416: Clean up tsconfigs

## 2.0.1

### Patch Changes

- 8b3c47b: Remove api report

## 2.0.0

### Major Changes

- 1731496: Remove unused vars

## 1.1.7

### Patch Changes

- fb8dcc0: Loosen eslint rules and change comments

## 1.1.6

### Patch Changes

- e2d45b8: ADFEXP-555: editor prosemirror cleanup: remove both old and new dist directories and
  remove dist exception in gitignore. also remove temporary diffing scripts

## 1.1.5

### Patch Changes

- 371af2e: ADFEXP-553: fix type errors and enable type transpilation

## 1.1.4

### Patch Changes

- 740d30f: ADFEXP-556: add test run script, add test run in pipeline and restructure test to conform
  with rest of monorepo

## 1.1.3

### Patch Changes

- 6d51a84: ADFEXP-521: transpile editor-prosemirror, move original dist to af-dist for easy diffing.

## 1.1.2

### Patch Changes

- b5210fb: ADFEXP-547: AF config cleanup

## 1.1.1

### Patch Changes

- 4db39c3: ADFEXP-547: Remove af config from editor-prosemirror package.json

## 1.1.0

### Minor Changes

- [`d327371e811`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d327371e811) -
  [ED-13910] Bump ProseMirror libraries to match prosemirror-view@1.31.6 dependencies

## 1.0.2

### Patch Changes

- [`b99702674dd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b99702674dd) -
  [ED-19229] Fix keymap entry point

## 1.0.1

### Patch Changes

- [`ae2f49aa32a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae2f49aa32a) -
  [ED-19229] Re-export Safe types from prosemirror-state
