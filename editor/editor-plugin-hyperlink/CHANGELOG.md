# @atlaskit/editor-plugin-hyperlink

## 0.2.2

### Patch Changes

- [`d8c1bcdc71a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8c1bcdc71a) - ED-19217 decoupled lists related util functions from editor-core
- Updated dependencies

## 0.2.1

### Patch Changes

- [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) - [ED-19233] Import prosemirror libraries from internal facade package

## 0.2.0

### Minor Changes

- [`8e084d87da5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e084d87da5) - Remove deprecated hyperlink commands and plugin key including:

  - isTextAtPos
  - isLinkAtPos
  - insertLink
  - insertLinkWithAnalyticsMobileNative
  - insertLinkWithAnalytics
  - updateLink
  - hyperlinkStateKey

  If you require `isTextAtPos` or `isLinkAtPos` these can be accessed via `editor-common`:

  ```ts
  import { isTextAtPos, isLinkAtPos } from '@atlaskit/editor-common/link`;
  ```

  If you require `insertLink`, `updateLink`, or `hyperlinkStateKey` you can access these via the new composable editor using a custom plugin. Here is an example:

  ```ts
  import { Editor } from '@atlaskit/editor-core/composable-editor';
  import { EditorProps } from '@atlaskit/editor-core';
  import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
  import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
  import type { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';

  const customPlugin: NextEditorPlugin<'custom', {
      dependencies: [typeof hyperlinkPlugin]
  }> = (_, api) => {
      // Can access insertLink and updateLink here
      api?.dependencies.hyperlink.actions.insertLink( ... )
      api?.dependencies.hyperlink.actions.updateLink( ... )


      // Rather than using the `hyperlinkStateKey` you can access via `sharedState`
      api?.dependencies.hyperlink.sharedState.onChange(({ nextSharedState }) => {
          // subscribe to changes
      })
      // OR for current value
      api?.dependencies.hyperlink.sharedState.currentState()

      return {
          name: 'custom'
      }
  }

  // This function is the equivalent of `Editor` from `editor-core`
  function EditorWrapped(props: EditorProps) {
      const preset = useUniversalPreset(props).add(customPlugin)
      return <Editor preset={preset} ... />
  }
  ```

  Note: By default `insertLink` via this interface is `insertLinkWithAnalytics`, however if you want to disable analytics disable them via the `EditorProps` and if you want to run `insertLinkWithAnalyticsMobileNative` pass `cardsAvailable` parameter as `false` (default).
