# Use cases

- **Background colors** (`bg-` in Tailwind) - Most common background colors have corresponding
  `color.background.*` tokens
- **Surface colors** (`bg-` in Tailwind) - Body, cards and modals have corresponding
  `elevation.surface.*` tokens
- **Text colors** (`text-` in Tailwind) - Most text colors have corresponding `color.text.*` tokens
- **Border colors** - Use `color.border.*` tokens when available
- **Icon colors** - Use `color.icon.*` tokens for icon styling

# Understanding token values

- Always prefer design tokens over hardcoded values
- Use semantic color names (success, warning, danger)
- Maintain consistent color usage across components
- Test color contrast for accessibility

# Translation from Tailwind

## To convert

1. Find Tailwind classes that have token equivalents in tables below
2. Replace with `token()` using inline styles
3. Keep remaining Tailwind classes for layout/utilities without tokens

## Requirements

- **NEVER** assume tailwind color equals the token color
- **Instead** use the conversion table below
- **Fallback** to hardcoded values **ONLY IF** no applicable token exists

## Examples

- `bg-blue-100` = `token('color.background.accent.blue.subtlest')`
- `text-gray-600` = `token('color.text.accent.gray')`
- `border-gray-200` = `token('color.border')`

# Popular colors

## Background colors (`bg-`)

| Tailwind Class | Tailwind Hex | Design Token                            | Token Hex |
| -------------- | ------------ | --------------------------------------- | --------- |
| bg-blue-50     | #EFF6FF      | color.background.accent.blue.subtlest   | #E9F2FF   |
| bg-blue-100    | #DBEAFE      | color.background.accent.blue.subtlest   | #E9F2FF   |
| bg-gray-100    | #F3F4F6      | elevation.surface.sunken                | #F1F2F4   |
| bg-gray-200    | #E5E7EB      | color.background.accent.gray.subtlest   | #F1F2F4   |
| bg-gray-800    | #1F2937      | color.background.brand.boldest          | #1C2B41   |
| bg-green-100   | #DCFCE7      | color.background.accent.green.subtlest  | #DCFFF1   |
| bg-green-700   | #15803D      | color.background.accent.green.bolder    | #1F845A   |
| bg-red-50      | #FEF2F2      | color.background.accent.red.subtlest    | #FFECEB   |
| bg-red-100     | #FEE2E2      | color.background.accent.red.subtlest    | #FFECEB   |
| bg-yellow-50   | #FEFCE8      | color.background.accent.yellow.subtlest | #FFF7D6   |
| bg-yellow-100  | #FEF9C3      | color.background.accent.yellow.subtlest | #FFF7D6   |
| bg-white       | #FFFFFF      | elevation.surface                       | #FFFFFF   |
| bg-white       | #FFFFFF      | elevation.surface.raised                | #FFFFFF   |

## Text colors (`text-`)

| Tailwind Class  | Tailwind Hex | Design Token                    | Token Hex |
| --------------- | ------------ | ------------------------------- | --------- |
| text-black      | #000000      | color.text                      | #172B4D   |
| text-white      | #FFFFFF      | color.text.inverse              | #FFFFFF   |
| text-gray-500   | #6B7280      | color.text.subtlest             | #626F86   |
| text-gray-600   | #4B5563      | color.text.accent.gray          | #44546F   |
| text-gray-900   | #111827      | color.text                      | #172B4D   |
| text-gray-950   | #030712      | color.text.accent.gray.bolder   | #091E42   |
| text-blue-600   | #2563EB      | color.text.selected             | #0C66E4   |
| text-blue-800   | #1E40AF      | color.text.accent.blue          | #0055CC   |
| text-blue-900   | #0C4A6E      | color.text.accent.blue.bolder   | #09326C   |
| text-green-800  | #166534      | color.text.accent.green.bolder  | #164B35   |
| text-red-600    | #DC2626      | color.text.accent.red           | #AE2E24   |
| text-red-900    | #7F1D1D      | color.text.accent.red.bolder    | #5D1F1A   |
| text-orange-800 | #9A3412      | color.text.accent.orange        | #A54800   |
| text-orange-900 | #702E00      | color.text.accent.orange.bolder | #702E00   |
| text-purple-700 | #7E22CE      | color.text.accent.purple        | #5E4DB2   |
| text-purple-900 | #581C87      | color.text.accent.purple.bolder | #352C63   |

## Icon colors (`fill-`)

| Tailwind Class  | Tailwind Hex | Design Token              | Token Hex |
| --------------- | ------------ | ------------------------- | --------- |
| fill-blue-500   | #3B82F6      | color.icon.accent.blue    | #579DFF   |
| fill-green-500  | #22C55E      | color.icon.accent.green   | #22A06B   |
| fill-red-500    | #EF4444      | color.icon.accent.red     | #C9372C   |
| fill-orange-500 | #F97316      | color.icon.accent.orange  | #E56910   |
| fill-yellow-500 | #EAB308      | color.icon.accent.yellow  | #E2B203   |
| fill-purple-500 | #A855F7      | color.icon.accent.purple  | #8F7EE7   |
| fill-teal-500   | #14B8A6      | color.icon.accent.teal    | #2898BD   |
| fill-lime-500   | #84CC16      | color.icon.accent.lime    | #6A9A23   |
| fill-pink-600   | #DB2777      | color.icon.accent.magenta | #CD519D   |

## Border colors (`border-`)

| Tailwind Class    | Tailwind Hex | Design Token               | Token Hex |
| ----------------- | ------------ | -------------------------- | --------- |
| border-gray-200   | #E5E7EB      | color.border               | #DFE1E6   |
| border-gray-300   | #D1D5DB      | color.border               | #DFE1E6   |
| border-gray-400   | #9CA3AF      | color.border.input         | #8590A2   |
| border-blue-500   | #3B82F6      | color.border.focused       | #388BFF   |
| border-red-600    | #DC2626      | color.border.accent.red    | #E2483D   |
| border-green-500  | #22C55E      | color.border.accent.green  | #4BCE97   |
| border-yellow-400 | #FACC15      | color.border.accent.yellow | #E2B203   |

## Secondary colors

| Tailwind Class | Pixel Value | Design Token                                     | Pixel Value |
| -------------- | ----------- | ------------------------------------------------ | ----------- |
| bg-emerald-50  | #ECFDF5     | color.background.accent.green.subtlest           | #DCFFF1     |
| bg-emerald-600 | #059669     | color.background.accent.green.bolder             | #1F845A     |
| bg-emerald-700 | #047857     | color.background.accent.green.bolder             | #1F845A     |
| bg-fuchsia-100 | #FAE8FF     | color.background.accent.magenta.subtlest         | #FFECF8     |
| bg-fuchsia-50  | #FDF4FF     | color.background.accent.magenta.subtlest         | #FFECF8     |
| bg-gray-100    | #F3F4F6     | color.background.accent.gray.subtlest            | #F1F2F4     |
| bg-gray-200    | #E5E7EB     | color.background.accent.gray.subtlest            | #F1F2F4     |
| bg-gray-50     | #F9FAFB     | color.background.input.hovered                   | #F7F8F9     |
| bg-gray-800    | #1F2937     | color.background.brand.boldest                   | #1C2B41     |
| bg-gray-900    | #111827     | color.background.brand.boldest                   | #1C2B41     |
| bg-green-100   | #DCFCE7     | color.background.accent.green.subtlest           | #DCFFF1     |
| bg-green-200   | #BBF7D0     | color.background.accent.green.subtlest.hovered   | #BAF3DB     |
| bg-green-300   | #86EFAC     | color.background.accent.green.subtlest.pressed   | #7EE2B8     |
| bg-green-400   | #4ADE80     | color.background.accent.green.subtler.pressed    | #4BCE97     |
| bg-green-50    | #F0FDF4     | color.background.accent.green.subtlest.hovered   | #BAF3DB     |
| bg-green-700   | #15803D     | color.background.accent.green.bolder             | #1F845A     |
| bg-green-800   | #166534     | color.background.accent.green.bolder             | #1F845A     |
| bg-indigo-100  | #E0E7FF     | color.background.accent.blue.subtlest            | #E9F2FF     |
| bg-indigo-200  | #C7D2FE     | color.background.accent.blue.subtlest.hovered    | #CCE0FF     |
| bg-indigo-300  | #A5B4FC     | color.background.accent.blue.subtlest.hovered    | #CCE0FF     |
| bg-indigo-400  | #818CF8     | color.background.accent.purple.subtler.pressed   | #9F8FEF     |
| bg-indigo-50   | #EEF2FF     | color.background.accent.blue.subtlest            | #E9F2FF     |
| bg-indigo-700  | #4338CA     | color.background.accent.purple.bolder            | #6E5DC6     |
| bg-lime-100    | #ECFCCB     | color.background.accent.lime.subtlest            | #EFFFD6     |
| bg-lime-200    | #D9F99D     | color.background.accent.lime.subtlest.hovered    | #D3F1A7     |
| bg-lime-300    | #BEF264     | color.background.accent.lime.subtlest.pressed    | #B3DF72     |
| bg-lime-400    | #A3E635     | color.background.accent.lime.subtler.pressed     | #94C748     |
| bg-lime-50     | #F7FEE7     | color.background.accent.lime.subtlest            | #EFFFD6     |
| bg-orange-100  | #FFEDD5     | color.background.accent.orange.subtlest          | #FFF3EB     |
| bg-orange-200  | #FED7AA     | color.background.accent.orange.subtlest.pressed  | #FEC195     |
| bg-orange-300  | #FDBA74     | color.background.accent.orange.subtler.pressed   | #FEA362     |
| bg-orange-400  | #FB923C     | color.background.accent.orange.subtler.pressed   | #FEA362     |
| bg-orange-50   | #FFF7ED     | color.background.accent.orange.subtlest          | #FFF3EB     |
| bg-pink-100    | #FCE7F3     | color.background.accent.magenta.subtlest.hovered | #FDD0EC     |
| bg-pink-200    | #FBCFE8     | color.background.accent.magenta.subtlest.hovered | #FDD0EC     |
| bg-pink-300    | #F9A8D4     | color.background.accent.magenta.subtlest.pressed | #F797D2     |
| bg-pink-400    | #F472B6     | color.background.accent.magenta.subtlest.pressed | #F797D2     |
| bg-pink-50     | #FDF2F8     | color.background.accent.magenta.subtlest.hovered | #FDD0EC     |
| bg-purple-100  | #F3E8FF     | color.background.accent.purple.subtlest          | #F3F0FF     |
| bg-purple-200  | #E9D5FF     | color.background.accent.purple.subtlest          | #F3F0FF     |
| bg-purple-300  | #D8B4FE     | color.background.accent.purple.subtlest.hovered  | #DFD8FD     |
| bg-purple-400  | #C084FC     | color.background.accent.purple.subtler.pressed   | #9F8FEF     |
| bg-purple-50   | #FAF5FF     | color.background.accent.purple.subtlest          | #F3F0FF     |
| bg-red-100     | #FEE2E2     | color.background.accent.red.subtlest             | #FFECEB     |
| bg-red-200     | #FECACA     | color.background.accent.red.subtlest.hovered     | #FFD5D2     |
| bg-red-300     | #FCA5A5     | color.background.accent.red.subtlest.pressed     | #FD9891     |
| bg-red-400     | #F87171     | color.background.accent.red.subtler.pressed      | #F87168     |
| bg-red-50      | #FEF2F2     | color.background.accent.red.subtlest             | #FFECEB     |
| bg-rose-100    | #FFE4E6     | color.background.accent.red.subtlest             | #FFECEB     |
| bg-rose-200    | #FECDD3     | color.background.accent.red.subtlest.hovered     | #FFD5D2     |
| bg-rose-300    | #FDA4AF     | color.background.accent.red.subtlest.pressed     | #FD9891     |
| bg-rose-400    | #FB7185     | color.background.accent.red.subtler.pressed      | #F87168     |
| bg-rose-50     | #FFF1F2     | color.background.accent.red.subtlest             | #FFECEB     |
| bg-sky-100     | #E0F2FE     | color.background.accent.teal.subtlest            | #E7F9FF     |
| bg-sky-200     | #BAE6FD     | color.background.accent.teal.subtlest.hovered    | #C6EDFB     |
| bg-sky-300     | #7DD3FC     | color.background.accent.teal.subtlest.hovered    | #C6EDFB     |
| bg-sky-400     | #38BDF8     | color.background.accent.teal.subtler.pressed     | #6CC3E0     |
| bg-sky-50      | #F0F9FF     | color.background.accent.teal.subtlest            | #E7F9FF     |
| bg-slate-100   | #F1F5F9     | color.background.input.hovered                   | #F7F8F9     |
| bg-slate-200   | #E2E8F0     | color.background.accent.gray.subtlest.hovered    | #DCDFE4     |
| bg-slate-300   | #CBD5E1     | color.background.accent.gray.subtlest.hovered    | #DCDFE4     |
| bg-slate-50    | #F8FAFC     | color.background.input.hovered                   | #F7F8F9     |
| bg-stone-100   | #F5F5F4     | color.background.accent.yellow.subtlest          | #FFF7D6     |
| bg-stone-50    | #FAFAF9     | color.background.accent.yellow.subtlest          | #FFF7D6     |
| bg-teal-100    | #CCFBF1     | color.background.accent.green.subtlest           | #DCFFF1     |
| bg-teal-200    | #99F6E4     | color.background.accent.green.subtlest.hovered   | #BAF3DB     |
| bg-teal-300    | #5EEAD4     | color.background.accent.green.subtlest.pressed   | #7EE2B8     |
| bg-teal-400    | #2DD4BF     | color.background.accent.green.subtler.pressed    | #4BCE97     |
| bg-teal-50     | #F0FDFA     | color.background.accent.green.subtlest.hovered   | #BAF3DB     |
| bg-teal-600    | #0D9488     | color.background.accent.green.bolder             | #1F845A     |
| bg-teal-700    | #0F766E     | color.background.accent.green.bolder             | #1F845A     |
| bg-violet-100  | #EDE9FE     | color.background.accent.purple.subtlest.hovered  | #DFD8FD     |
| bg-violet-200  | #DDD6FE     | color.background.accent.purple.subtlest.hovered  | #DFD8FD     |
| bg-violet-300  | #C4B5FD     | color.background.accent.purple.subtlest.hovered  | #DFD8FD     |
| bg-violet-400  | #A78BFA     | color.background.accent.purple.subtler.pressed   | #9F8FEF     |
| bg-violet-50   | #F5F3FF     | color.background.accent.purple.subtlest          | #F3F0FF     |
| bg-yellow-100  | #FEF9C3     | color.background.accent.yellow.subtlest          | #FFF7D6     |
| bg-yellow-200  | #FEF08A     | color.background.accent.yellow.subtlest.hovered  | #F8E6A0     |
| bg-yellow-300  | #FDE047     | color.background.accent.yellow.subtlest.pressed  | #F5CD47     |
| bg-yellow-400  | #FACC15     | color.background.accent.yellow.subtler.pressed   | #E2B203     |
| bg-yellow-50   | #FEFCE8     | color.background.accent.yellow.subtlest          | #FFF7D6     |
| bg-yellow-500  | #EAB308     | color.background.accent.yellow.subtler.pressed   | #E2B203     |
| bg-yellow-600  | #CA8A04     | color.background.accent.yellow.subtle.pressed    | #CF9F02     |
| bg-zinc-100    | #F4F4F5     | color.background.accent.gray.subtlest            | #F1F2F4     |
| bg-zinc-200    | #E4E4E7     | color.background.accent.gray.subtlest            | #F1F2F4     |
| bg-zinc-300    | #D4D4D8     | color.background.accent.gray.subtlest.hovered    | #DCDFE4     |
| bg-zinc-400    | #A1A1AA     | color.background.accent.gray.subtlest.pressed    | #B3B9C4     |

# Translating from Tailwind

```diff
+/** @jsx jsx */
+import { token } from '@atlaskit/tokens';
+import { cssMap, jsx } from '@atlaskit/css';
+const styles = cssMap({
+  content: {
+    backgroundColor: token('elevation.surface.sunken'),
+    color: token('color.text.accent.gray'),
+    borderColor: token('color.border')
+  },
+  success: {
+    color: token('color.text.accent.green.bolder'),
+    backgroundColor: token('color.background.accent.green.subtlest')
+  }
+});

-<div className="bg-gray-100 text-gray-700 border border-gray-300">Content</div>
+<div css={styles.content}>Content</div>

-<span className="text-green-600 bg-green-100">Success</span>
+<span css={styles.success}}>Success</span>
```
