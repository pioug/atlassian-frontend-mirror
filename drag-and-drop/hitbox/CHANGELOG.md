# @atlaskit/drag-and-drop-hitbox

## 0.8.1

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 0.8.0

### Minor Changes

- [`a7dc73c0a57`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7dc73c0a57) - Internal refactor: implemented a cheaper mechanism to enable memoization of tree item data

## 0.7.0

### Minor Changes

- [`00434d087d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00434d087d7) - Tree item hitbox data is now memoized. This is helpful to reduce work for consumers who may take actions based on object reference changes.

  If you are using `react` and putting tree item hitbox instructions into state, react will now only re-render when the content of the instruction changes.

## 0.6.3

### Patch Changes

- Updated dependencies

## 0.6.2

### Patch Changes

- Updated dependencies

## 0.6.1

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [`179d953be18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/179d953be18) - [ux] Tweaking the hitbox of "expanded" tree items to improve the experience when expanding tree items during a drag. Note: our tree item hitbox is still _experimental_

## 0.5.0

### Minor Changes

- [`90901f5bbe0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90901f5bbe0) - Replace default entry point of `undefined` with `{}`.

  > **NOTE:** Importing from the default entry point isn't supported.
  > _Please use individual entry points in order to always obtain minimum kbs._

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [`fe6772a3719`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe6772a3719) - Dramatic update to **experimental** tree-item outputs. These outputs should only be used right now by Confluence Page Tree. Changes are being communicated face to face with Confluence team members

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [`f004dadb4fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f004dadb4fc) - `reorderWithEdge` has changed API in order to more accurately reflect the values that are being passed in

  ```diff
  function reorderWithEdge<Value>(args: {
      list: Value[];
  -   edge: Edge | null;
  +   // the reorder operation is based on what the closest edge of the target is
  +   closestEdgeOfTarget: Edge | null;
      startIndex: number;
  -   finalIndex: number
  +   // we are reordering relative to the target
  +   indexOfTarget: number;
      axis: 'vertical' | 'horizontal';
  }): Value[];
  ```

  Adding new utility: `getReorderDestinationIndex`

  When you are rendering _drop indicators_ (eg lines) between items in a list, it can be difficult to know what the `index` the dropped item should go into. The final `index` will depend on what the closest `Edge` is. `getReorderDestinationIndex` can give you the final `index` for a reordering operation, taking into account which `Edge` is closest

  ```ts
  import { getReorderDestinationIndex } from '@atlaskit/drag-and-drop-hitbox/util/get-reorder-destination-index';

  // Dragging A on the left of B
  // A should stay in the same spot
  expect(
    getReorderDestinationIndex({
      // list: ['A', 'B', 'C'],
      // move A to left of B
      startIndex: 0,
      indexOfTarget: 1,
      closestEdgeOfTarget: 'left',
      axis: 'horizontal',
    }),
    // results in no change: ['A', 'B', 'C']
  ).toEqual(0);

  // Dragging A on the right of B
  // A should go after B
  expect(
    getReorderDestinationIndex({
      // list: ['A', 'B', 'C'],
      // move A to right of B
      startIndex: 0,
      indexOfTarget: 1,
      closestEdgeOfTarget: 'right',
      axis: 'horizontal',
    }),
    // A moved forward ['B', 'A', 'C']
  ).toEqual(1);
  ```

## 0.2.7

### Patch Changes

- Updated dependencies

## 0.2.6

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.2.5

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`dcebdf9404e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dcebdf9404e) - We have improved our naming consistency across our drag and drop packages.

  - `@atlaskit/drag-and-drop-hitbox/closest-edge` has been renamed to `@atlaskit/drag-and-drop-hitbox/addon/closest-edge`
  - `@atlaskit/drag-and-drop-hitbox/reorder-with-edge` has been renamed to `@atlaskit/drag-and-drop-hitbox/util/reorder-with-edge`

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`73427c38077`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73427c38077) - Initial release of `@atlaskit/drag-and-drop` packages 🎉

### Patch Changes

- Updated dependencies

## 0.0.1

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.
- Updated dependencies
