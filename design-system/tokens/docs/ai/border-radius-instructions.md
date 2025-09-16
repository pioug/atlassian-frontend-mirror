# Use cases

- **Small radius** - Subtle rounding for inputs and buttons
- **Medium radius** - Standard rounding for cards and panels
- **Large radius** - Prominent rounding for modals and overlays
- **Circle radius** - Perfect circles for avatars and icons

# Understanding token values

- **border.radius.050** - 2px (subtle rounding)
- **border.radius.200** - 4px (standard rounding)
- **border.radius.300** - 8px (prominent rounding)
- **border.radius.400** - 12px (large rounding)
- **border.radius.circle** - 9999px (perfect circle)

# Translation from Tailwind

## To convert

1. Find Tailwind classes that have token equivalents in tables below
2. Replace with `token()` using inline styles
3. Keep remaining Tailwind classes for layout/utilities without tokens

## Requirements

- **NEVER** assume tailwind number equals the token number
- **Instead** use the conversion table below
- **Fallback** to hardcoded values **ONLY IF** no applicable token exists

## Examples

- `rounded-lg` = `token('border.radius.300')` (NOT `border.radius.800`)
- `rounded-sm` = `token('border.radius.050')` (NOT `border.radius.100`)
- `rounded-full` = `token('border.radius.circle')`

## Border radius values

| Tailwind Class | Pixel Value | Design Token         | Pixel Value |
| -------------- | ----------- | -------------------- | ----------- |
| rounded-sm     | 2px         | border.radius.050    | 2px         |
| rounded        | 4px         | border.radius.200    | 4px         |
| rounded-lg     | 8px         | border.radius.300    | 8px         |
| rounded-xl     | 12px        | border.radius.400    | 12px        |
| rounded-full   | 9999px      | border.radius.circle | 9999px      |

## Example migration from Tailwind classes to ADS radius tokens

```tsx
+import { token } from '@atlaskit/tokens';
-<div className="rounded-lg">Card content</div>
+<div style={{ borderRadius: token('border.radius.300') }}>Card content</div>

-<img className="rounded-full" src="…" />
+<img style={{ borderRadius: token('border.radius.circle') }} src="…" />
```
