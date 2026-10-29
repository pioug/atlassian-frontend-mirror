Use Form's plain JSX children when the render function only spreads `formProps` onto an HTML form.
Apply the **Convert form to simple form** editor suggestion when offered; ESLint's `--fix` does not
apply suggestions.

The suggestion preserves string, expression and boolean HTML attributes. It is withheld for custom
spreads, references to the removed `formProps` binding, conflicting outer props, and native
handlers, refs or styling/naming props whose meaning differs on Form. The diagnostic still requires
review: move safe attributes to Form's supported props or `formProps` object and preserve custom
behavior before removing the render function. Consult
`platform/packages/design-system/form/src/form.tsx` for the current API.

## Incorrect

```jsx
import Form from '@atlaskit/form';

<Form onSubmit={submit}>
	{({ formProps }) => (
		<form {...formProps} name="profile" data-owner={owner}>
			<p>Profile settings</p>
		</form>
	)}
</Form>;
```

## Correct

```jsx
import Form from '@atlaskit/form';

<Form onSubmit={submit} name="profile" formProps={{ 'data-owner': owner }}>
	<p>Profile settings</p>
</Form>;
```
