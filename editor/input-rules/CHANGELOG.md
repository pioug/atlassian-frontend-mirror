# @atlaskit/prosemirror-input-rules

## 2.1.5

### Patch Changes

- Updated dependencies

## 2.1.4

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [`4e6fbaf5898`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6fbaf5898) - ED-14117 Change EditorState.apply type to receive readonly transaction

  Transactions should not be mutated after being dispatched as it can lead to
  unexpected behaviour. This change patches the relevant types declared in
  prosemirror-state as a compile-time safeguard.

- Updated dependencies

## 2.1.1

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - ED-13025 Bump prosemirror-view 1.23.1 -> 1.23.2

## 2.1.0

### Minor Changes

- [`b230f366971`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b230f366971) - [ED-14008] Bump prosemirror-view from 1.20.2 to 1.23.1

### Patch Changes

- [`c6feed82071`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6feed82071) - ED-11632: Bump prosemirror packages;

  - prosmirror-commands 1.1.4 -> 1.1.11,
  - prosemirror-model 1.11.0 -> 1.14.3,
  - prosemirror-state 1.3.3 -> 1.3.4,
  - prosemirror-transform 1.2.8 -> 1.3.2,
  - prosemirror-view 1.15.4 + 1.18.8 -> 1.20.2.

## 2.0.1

### Patch Changes

- [`312a2810b0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/312a2810b0b) - [ux] ED-12931 Fix input rules replacing text outside of matched word in a long paragraph

## 2.0.0

### Major Changes

- [`d989a24dd88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d989a24dd88) - [ED-11915] New package to manage auto formatting rules without a undoInputRules

### Minor Changes

- [`54ec986ebff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54ec986ebff) - [ED-11915] Export editor/input-rules OnHandlerApply type
