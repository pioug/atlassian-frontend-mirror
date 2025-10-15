# Use cases

- **Small radius** - Subtle rounding for inputs and buttons
- **Medium radius** - Standard rounding for cards and panels
- **Large radius** - Prominent rounding for modals and overlays
- **Circle radius** - Perfect circles for avatars and icons

# Understanding token values

- **radius.xsmall** - 2px (subtle rounding)
- **radius.small** - 4px (standard rounding)
- **radius.medium** - 6px (medium rounding)
- **radius.large** - 8px (prominent rounding)
- **radius.xlarge** - 12px (large rounding)
- **radius.full** - 9999px (perfect circle, or pill shape for non-square elements)

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

- `rounded-lg` = `token('radius.xlarge')` (NOT `border.radius.800`)
- `rounded-sm` = `token('radius.xsmall')` (NOT `border.radius.100`)
- `rounded-full` = `token('radius.full')`

## Border radius values

| Tailwind Class | Pixel Value | Design Token  | Pixel Value |
| -------------- | ----------- | ------------- | ----------- |
| rounded-sm     | 2px         | radius.xsmall | 2px         |
| rounded        | 4px         | radius.small  | 4px         |
| rounded-lg     | 8px         | radius.large  | 8px         |
| rounded-xl     | 12px        | radius.xlarge | 12px        |
| rounded-full   | 9999px      | radius.full   | 9999px      |

## Example migration from Tailwind classes to ADS radius tokens

```tsx
+import { token } from '@atlaskit/tokens';
-<div className="rounded-lg">Card content</div>
+<div style={{ borderRadius: token('radius.large') }}>Card content</div>

-<img className="rounded-full" src="…" />
+<img style={{ borderRadius: token('radius.full') }} src="…" />
```
