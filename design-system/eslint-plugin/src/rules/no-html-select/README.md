Don't use native HTML selects. The Atlassian Design System provides a ready-made select component
that has event tracking, ensures accessible implementations, and provides access to ADS styling
features like design tokens.

Use one of the Atlassian Design System [Select](/components/select/) components when suitable.

## Examples

This rule marks code as violations when it finds native HTML select elements.

### Incorrect

```jsx
<select name="cities" id="city-select">
	<option value="adelaide">Adelaide</option>
	<option value="brisbane">Brisbane</option>
	<option value="canberra">Canberra</option>
	<option value="darwin">Darwin</option>
	<option value="hobart">Hobart</option>
	<option value="melbourne">Melbourne</option>
	<option value="perth">Perth</option>
	<option value="sydney">Sydney</option>
</select>
```

### Correct

```jsx
import Select from '@atlaskit/select';

export const cities: OptionsType = [
	{ label: 'Adelaide', value: 'adelaide', extra: 'extra' },
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Canberra', value: 'canberra' },
	{ label: 'Darwin', value: 'darwin' },
	{ label: 'Hobart', value: 'hobart' },
	{ label: 'Melbourne', value: 'melbourne' },
	{ label: 'Perth', value: 'perth' },
	{ label: 'Sydney', value: 'sydney' },
];

<Select inputId="city-select" options={cities} />
```
