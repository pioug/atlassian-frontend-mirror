# @atlaskit/editor-plugin-block-type

## 3.0.4

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417) [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971 Upgrade adf-schema package to ^34.0.0

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379) [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763 Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#42090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42090) [`dfea93d39c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfea93d39c9) - Replacing setBlockType action on `editor-plugin-block-type` with setTextLevel
  command.

  WHAT/WHY?: setBlockType is only for headings/text so the naming is not clear,
  it is also an action which makes it difficult to use by external consumers.

  This replacement can be easily used by external consumers (ie. for custom toolbars)
  and also has more type safety (for setBlockType the name parameter is any string but
  setTextLevel only accepts valid values including "normal", "heading1",
  "heading2" etc.)

  HOW?: This API at this stage should be unused by consumers to the best of our
  knowledge. However if you are using it you should change as so:

  Before:

  ```ts
  api?.blockType.actions.setBlockType(blockType, inputMethod)(state, dispatch);
  ```

  ```ts
  api?.core.actions.execute(
    api?.blockType.commands.setTextLevel(blockType, inputMethod),
  );
  ```

## 2.0.0

### Major Changes

- [#40850](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40850) [`e7cead0f099`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7cead0f099) - Move shared messages to editor-common

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749) [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect yarn changeset to packages, upgrade adf-schema

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies
