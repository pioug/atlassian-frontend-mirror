Simple field implementations should be used when extended features or complex implementations are
not needed.

## Examples

This rule marks code as a violation when it finds Design System field components that have:

- no render props or there’s only fieldProps
- no messaging components.

### Incorrect

```jsx
import { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';

<Field name="username" label="Username">
	{({ fieldProps }) => <TextField {...fieldProps} />}
</Field>;
```

### Correct

```jsx
import { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';

<Field
	name="username"
	label="Username"
	component={({ fieldProps }) => <TextField {...fieldProps} />}
/>;
```
