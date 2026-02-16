# Use cases

- **Padding** - Internal spacing within components
- **Margin** - External spacing between components
- **Gap** - Spacing between flex/grid items
- **Width/Height** - Component dimensions

# Understanding token values

- **space.0** - 0px (no spacing)
- **space.025** - 2px (very tight)
- **space.050** - 4px (tight)
- **space.100** - 8px (small)
- **space.150** - 12px (medium-small)
- **space.200** - 16px (default)
- **space.250** - 20px (medium)
- **space.300** - 24px (large)
- **space.400** - 32px (very large)
- **space.500** - 40px (extra large)
- **space.600** - 48px (huge)
- **space.800** - 64px (massive)
- **space.1000** - 80px (extreme)

These token values may be the 16-base rem equivalents; pixel values are used for reference.

# Translation from Tailwind

## To convert

1. Find Tailwind classes that have token equivalents in tables below
2. Replace with `token()` using inline styles
3. Keep remaining Tailwind classes for layout/utilities without tokens

## Requirements

- **NEVER** assume tailwind number equals the token number
- **Instead** use the conversion table below
- **Fallback** to hardcoded values **ONLY IF** an applicable tokene xists

## Examples

- `p-6` = `token('space.300')` (NOT `space.600`)
- `m-4` = `margin: token('space.200')` (NOT `space.400`)
- `gap-8` = `gap: token('space.400')` (NOT `space.800`)

## Margin and padding

| Tailwind Class | Pixel Value | Design Token | Pixel Value |
| -------------- | ----------- | ------------ | ----------- |
| m-0            | 0px         | space.0      | 0px         |
| p-0            | 0px         | space.0      | 0px         |
| m-0.5          | 2px         | space.025    | 2px         |
| p-0.5          | 2px         | space.025    | 2px         |
| m-1            | 4px         | space.050    | 4px         |
| p-1            | 4px         | space.050    | 4px         |
| m-1.5          | 6px         | space.075    | 6px         |
| p-1.5          | 6px         | space.075    | 6px         |
| m-2            | 8px         | space.100    | 8px         |
| p-2            | 8px         | space.100    | 8px         |
| m-3            | 12px        | space.150    | 12px        |
| p-3            | 12px        | space.150    | 12px        |
| m-4            | 16px        | space.200    | 16px        |
| p-4            | 16px        | space.200    | 16px        |
| m-5            | 20px        | space.250    | 20px        |
| p-5            | 20px        | space.250    | 20px        |
| m-6            | 24px        | space.300    | 24px        |
| p-6            | 24px        | space.300    | 24px        |
| m-8            | 32px        | space.400    | 32px        |
| p-8            | 32px        | space.400    | 32px        |
| m-10           | 40px        | space.500    | 40px        |
| p-10           | 40px        | space.500    | 40px        |
| m-12           | 48px        | space.600    | 48px        |
| p-12           | 48px        | space.600    | 48px        |
| m-16           | 64px        | space.800    | 64px        |
| p-16           | 64px        | space.800    | 64px        |
| m-20           | 80px        | space.1000   | 80px        |
| p-20           | 80px        | space.1000   | 80px        |

## Gap values

| Tailwind Class | Pixel Value | Design Token | Pixel Value |
| -------------- | ----------- | ------------ | ----------- |
| gap-0          | 0px         | space.0      | 0px         |
| gap-0.5        | 2px         | space.025    | 2px         |
| gap-1          | 4px         | space.050    | 4px         |
| gap-1.5        | 6px         | space.075    | 6px         |
| gap-2          | 8px         | space.100    | 8px         |
| gap-3          | 12px        | space.150    | 12px        |
| gap-4          | 16px        | space.200    | 16px        |
| gap-5          | 20px        | space.250    | 20px        |
| gap-6          | 24px        | space.300    | 24px        |
| gap-8          | 32px        | space.400    | 32px        |
| gap-10         | 40px        | space.500    | 40px        |
| gap-12         | 48px        | space.600    | 48px        |
| gap-16         | 64px        | space.800    | 64px        |
| gap-20         | 80px        | space.1000   | 80px        |

## Example tailwind migration

```diff
+/** @jsx jsx */
+import { token } from '@atlaskit/tokens';
+import { cssMap, jsx } from '@atlaskit/css';
+const styles = cssMap({
+  root: {
+		 padding: token('space.200'),
+		 margin: token('space.100'),
+		 gap: token('space.150'),
+  },
+});

-<div className="p-4 m-2 gap-3">Content</div>
+<div css={styles.root}>Content</div>
```
