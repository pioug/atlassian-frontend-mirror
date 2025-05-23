Don't use native HTML radios. The Atlassian Design System provides a ready-made radio component that
includes event tracking, ensures accessible implementations, and provides access to ADS styling
features like design tokens.

Use the Atlassian Design System [Radio](https://atlassian.design/components/radio) and
[RadioGroup](https://atlassian.design/components/radio/radio-group/examples) components when
suitable.

## Examples

This rule marks code as violations when it finds native HTML radio elements.

### Incorrect

```jsx
<fieldset>
	<legend>Preferred contact method</legend>
	<input type="radio" id="contact-method--email" name="contact" value="email" />
	^^^^^ Using a native radio input
	<label for="contact-method--email">Email</label>
	<input type="radio" id="contact-method--phone" name="contact" value="phone" />
	^^^^^ Using a native radio input
	<label for="contact-method--phone">Phone</label>
</label>
```

### Correct

```jsx
import { ErrorMessage, Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import { type OptionsPropType } from '@atlaskit/radio/types';

const options: OptionsPropType = [
	{ name: 'contact', value: 'email', label: 'Email' },
	{ name: 'contact', value: 'phone', label: 'Phone' },
];

<Field label="Preferred contact method" name="contact" defaultValue="email">
	{({ fieldProps }) => <RadioGroup {...fieldProps} options={options} />}
</Field>
```
