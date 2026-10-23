# Filter button

FilterButton is a default-appearance Button with an optional trailing count. Import it from
`@atlaskit/button/filter-button`.

```tsx
import FilterButton from '@atlaskit/button/filter-button';

<FilterButton trailingMetric={8} isSelected={hasActiveFilters} aria-pressed={hasActiveFilters}>
	Filter
</FilterButton>;
```

- Supports default and compact spacing, icons, loading, disabled, refs, and standard Button events.
- Accepts a number or a formatted string such as `"99+"`. Zero is displayed; omit the prop to hide
  the count. It does not abbreviate counts automatically.
- Uses neutral count colors when unselected, regardless of `platform-dst-tokens-finesse`.
  Selected counts use information blue with the gate off and stronger neutral with it on.
  Unselected counts also use the stronger neutral background on hover and press.
- Matches Badge/new's 24px minimum width, 4px inline padding, small text, and xsmall radius, without
  importing Badge.
- Count appearance and button appearance are fixed. For arbitrary badge appearances or non-filter
  patterns, compose the appropriate components instead.
- Do not nest FilterButton in SplitButton; it is a standalone default-appearance filter control.

## Dropdown menu

Use DropdownMenu's existing custom trigger API; no new DropdownMenu props are needed.

```tsx
<DropdownMenu
	trigger={({ triggerRef, ...triggerProps }) => (
		<FilterButton
			{...triggerProps}
			ref={triggerRef}
			trailingMetric={8}
			isSelected={hasActiveFilters || triggerProps.isSelected}
		>
			Filter
		</FilterButton>
	)}
>
	<DropdownItemGroup>
		<DropdownItem>Status</DropdownItem>
		<DropdownItem>Assignee</DropdownItem>
	</DropdownItemGroup>
</DropdownMenu>
```

Keep the trigger props and ref so DropdownMenu retains keyboard, focus, and expanded-state behavior.
A count is included in the natural accessible name; when overriding `aria-label` or
`aria-labelledby`, include any count information that is important to the task.
