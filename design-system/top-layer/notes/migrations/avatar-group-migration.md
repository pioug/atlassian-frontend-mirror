# Avatar group migration

> What changed when migrating the **overflow (“more”) menu** in `@atlaskit/avatar-group` to use
> `@atlaskit/top-layer`, behind the `platform-dst-top-layer` feature flag.

Only the **dropdown that lists extra avatars** is migrated. The rest of avatar group (stack/grid,
tooltips, non-overflow UI) keeps existing behavior.

---

## What was done

When `fg('platform-dst-top-layer')` is true, `renderMoreDropdown` renders **`MoreDropdownTopLayer`**
(`avatar-group-top-layer.tsx`) instead of **`@atlaskit/popup`** + Popper for the overflow menu.

The parent **`useEffect`** that bound **ArrowDown-to-open** on the window is **skipped** on the
top-layer path; **`MoreDropdownTopLayer`** owns ArrowDown-to-open and **`useArrowNavigation`** for
the open menu (same division of responsibility as `@atlaskit/dropdown-menu`).

| Legacy mechanism                  | Top-layer replacement                       |
| --------------------------------- | ------------------------------------------- |
| `@atlaskit/popup` + Popper        | `Popup` from `@atlaskit/top-layer/popup`    |
| Focus manager / layering for menu | Native popover focus + `useArrowNavigation` |

### Top-layer entry points used

- `@atlaskit/top-layer/popup` — `Popup`, `Popup.TriggerFunction`, `Popup.Content`, `Popup.Surface`
- `@atlaskit/top-layer/animations` — `slideAndFade()`
- `@atlaskit/top-layer/placement-map` — `fromLegacyPlacement({ legacy: 'bottom-end' })`
- `@atlaskit/top-layer/use-arrow-navigation` — menu arrow keys + close

### Semantics

- `Popup.Content` **`role="menu"`** with accessible name **`"avatar group"`**.
- Overflow items use **`role="menuitem"`** via `AvatarGroupItem`.

### Trigger wrapper

A **`display: contents`** `<span>` wraps the render-prop trigger so **`useFocus`** can observe focus
for ArrowDown-to-open without threading `onFocus`/`onBlur` through `MoreIndicator` /
`renderMoreButton` (plumbing limitation documented in source).

---

## No-op / legacy-only props

On the top-layer path, props such as **`zIndex`**, **`shouldRenderToParent`**, **`boundary`** /
**`rootBoundary`**, **`shouldFlip`** are not used (see JSDoc on `MoreDropdownTopLayer`).

---

## Test coverage

| Kind             | Location                                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| Playwright       | `avatar-group/src/components/__tests__/playwright/ff-testing/platform-dst-top-layer/avatar-group.spec.tsx` |
| Informational VR | `avatar-group/src/components/__tests__/informational-vr-tests/avatar-group-top-layer.vr.tsx`               |

---

## Source files

| File                                                     | Role                                                     |
| -------------------------------------------------------- | -------------------------------------------------------- |
| `avatar-group/src/components/avatar-group.tsx`           | FF branch + skips legacy ArrowDown effect when top-layer |
| `avatar-group/src/components/avatar-group-top-layer.tsx` | Top-layer overflow menu                                  |
