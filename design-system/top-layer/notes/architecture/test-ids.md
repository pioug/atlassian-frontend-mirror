# Test IDs and `data-testid`

**`testId`** is a React prop; the DOM uses **`data-testid`**. Do not spread Tooltip’s render-prop
object (which includes **`testId`**) onto a native **`<div>`** — map to **`data-testid`** or use a
primitive that accepts **`testId`** (e.g. Pressable, Box).

**`@atlaskit/top-layer`:** **`Popover`** and **`Dialog`** set **`data-testid`** on their root to the
string you pass — **no suffixing**. **`Popup.Content`** forwards **`testId`** to **`Popover`** the
same way.

**`@atlaskit/popup`** (top-layer path): popover root gets **`${testId}--container`**; default
content wrapper or custom `popupComponent` keeps the **base** `testId`, matching the legacy content
container. See **[popup-migration.md](../migrations/popup-migration.md)**.

**`@atlaskit/tooltip`** (top-layer path), when **`testId`** is set:

| Surface                  | `data-testid` / prop                                                        |
| ------------------------ | --------------------------------------------------------------------------- |
| SR-only hidden label     | `${testId}-hidden`                                                          |
| Trigger                  | `${testId}--container` (render prop passes **`testId`**, not `data-testid`) |
| Popover root             | `${testId}--popover`                                                        |
| Tooltip body (primitive) | `${testId}--wrapper` (outer), base `testId` on inner (or `--unresolved`)    |

See **[tooltip-migration.md](../migrations/tooltip-migration.md)**. Prefer **role + name** in tests
when practical.

## Migration pitfalls

- **Popup:** Tests or selectors that targeted the **popover shell** with the **base** `testId` will
  fail — the shell is **`${testId}--container`**. The **base** id remains on the **inner** content
  container; know which node your assertion cares about.
- **Tooltip:** Wrappers that **`{...renderPropProps}`** onto **`<div>`** forward invalid
  **`testId`** → React warnings; strict test runners may fail on **`console.error`**.
- **Primitives vs composed DS:** **`Popover`** / **`Dialog`** use your string **verbatim** on the
  root. **`@atlaskit/popup`** and **`@atlaskit/tooltip`** add **suffixes** — do not assume one
  pattern everywhere.
- **Snapshots / VR:** Extra wrapper nodes (e.g. native **`popover=`** layer) can change trees and
  baselines even when visible UI looks the same.

**Related:** **[implementation-guide.md](./implementation-guide.md)** §17.
