# DateLabel

A Date label is a non-interactive label that displays a date and optionally, visually communicates
its status.

## Installation

```sh
yarn add @atlaskit/date-label
```

## Usage

### DateLabel

```tsx
import DateLabel from '@atlaskit/date-label';
// or via entry-point:
import DateLabel from '@atlaskit/date-label/date-label';

// Neutral (default)
<DateLabel label="29 Jul 2026" />

// Warning — for upcoming/near-due dates
<DateLabel label="29 Jul 2026" appearance="warning" />

// Danger — for overdue dates
<DateLabel label="29 Jul 2026" appearance="danger" />

// Without icon
<DateLabel label="29 Jul 2026" hasIconBefore={false} />

// Spacious — 32px height, body font size
<DateLabel label="29 Jul 2026" isSpacious />

// Custom max width
<DateLabel label="29 Jul 2026" maxWidth={120} />
```

### DateLabelDropdownTrigger

Date label dropdown trigger is an interactive date label that opens a menu for date selection.

```tsx
import { DateLabelDropdownTrigger } from '@atlaskit/date-label';
// or via entry-point:
import { DateLabelDropdownTrigger } from '@atlaskit/date-label/date-label-dropdown-trigger';

<DateLabelDropdownTrigger
  label="29 Jul 2026"
  appearance="neutral"
  onClick={() => setOpen(true)}
  aria-expanded={isOpen}
  aria-haspopup="dialog"
/>

// Spacious variant
<DateLabelDropdownTrigger label="29 Jul 2026" isSpacious />
```

### Importing types

```tsx
import type { DateLabelProps, DateLabelAppearance } from '@atlaskit/date-label';
import type {
	DateLabelDropdownTriggerProps,
	DateLabelDropdownTriggerAppearance,
} from '@atlaskit/date-label';

// or via the types entry-point:
import type {
	DateLabelAppearance,
	DateLabelDropdownTriggerAppearance,
} from '@atlaskit/date-label/types';
```

## Appearances

| Appearance | Border colour                     | Text colour          | Icon               |
| ---------- | --------------------------------- | -------------------- | ------------------ |
| `neutral`  | `color.border.accent.gray.subtle` | `color.text`         | CalendarIcon       |
| `warning`  | `color.border.warning.subtle`     | `color.text.warning` | ClockIcon          |
| `danger`   | `color.border.danger.subtle`      | `color.text.danger`  | WarningOutlineIcon |

## Entry-points

| Entry-point                                        | Exports                                                                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `@atlaskit/date-label`                             | `DateLabel` (default), `DateLabelDropdownTrigger`, all types                                                |
| `@atlaskit/date-label/date-label`                  | `DateLabel` (default), `DateLabelProps`, `DateLabelAppearance`                                              |
| `@atlaskit/date-label/date-label-dropdown-trigger` | `DateLabelDropdownTrigger` (default), `DateLabelDropdownTriggerProps`, `DateLabelDropdownTriggerAppearance` |
| `@atlaskit/date-label/types`                       | All exported types                                                                                          |

## Props

### DateLabel

| Prop            | Type                  | Default     | Description                                                                                                                |
| --------------- | --------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `label`         | `string`              | required    | The text to display                                                                                                        |
| `appearance`    | `DateLabelAppearance` | `'neutral'` | Controls border, text, and icon colour                                                                                     |
| `hasIconBefore` | `boolean`             | `true`      | Shows a contextual icon before the label                                                                                   |
| `iconLabel`     | `string`              | —           | Accessible label for the icon. Defaults to `'Date'`, `'Warning'`, `'Danger'` per appearance. Pass `''` to make decorative. |
| `isSpacious`    | `boolean`             | `false`     | Increases height to 32px and uses body font                                                                                |
| `maxWidth`      | `number \| string`    | `180`       | Max width in px (number) or any CSS value (string)                                                                         |
| `testId`        | `string`              | —           | `data-testid` for automated tests                                                                                          |

### DateLabelDropdownTrigger

| Prop            | Type                                   | Default     | Description                                                                                                                |
| --------------- | -------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `label`         | `string`                               | required    | The text to display                                                                                                        |
| `appearance`    | `DateLabelDropdownTriggerAppearance`   | `'neutral'` | Controls border, text, and icon colour                                                                                     |
| `hasIconBefore` | `boolean`                              | `true`      | Shows a contextual icon before the label                                                                                   |
| `iconLabel`     | `string`                               | —           | Accessible label for the icon. Defaults to `'Date'`, `'Warning'`, `'Danger'` per appearance. Pass `''` to make decorative. |
| `isLoading`     | `boolean`                              | `false`     | Shows a loading spinner overlay and disables interaction                                                                   |
| `isSelected`    | `boolean`                              | `false`     | Applies selected background and text colour                                                                                |
| `isSpacious`    | `boolean`                              | `false`     | Increases height to 32px and uses body font                                                                                |
| `maxWidth`      | `number \| string`                     | `200`       | Max width in px (number) or any CSS value (string)                                                                         |
| `onClick`       | `MouseEventHandler<HTMLButtonElement>` | —           | Click handler                                                                                                              |
| `aria-controls` | `string`                               | —           | ID of the controlled popup element                                                                                         |
| `aria-expanded` | `boolean`                              | —           | Whether the popup is open                                                                                                  |
| `aria-haspopup` | `boolean \| 'dialog'`                  | —           | Type of popup this triggers                                                                                                |
| `aria-label`    | `string`                               | —           | Accessible label (falls back to `label` text)                                                                              |
| `testId`        | `string`                               | —           | `data-testid` for automated tests                                                                                          |

Detailed docs and example usage can be found
[here](https://atlaskit.atlassian.com/packages/design-system/date-label).
