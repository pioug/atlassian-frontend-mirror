Suggests using `CharacterCounterField` from `@atlaskit/form` when `Textfield` or `Textarea`
components are used with `maxLength` or `minLength` props within a Form context.

## Why is this important?

When using character limits on text inputs, it's important to provide real-time feedback to users
about:

- How many characters they can still enter
- Whether they've met a minimum character requirement
- Whether they're approaching or exceeding a maximum character limit

The `CharacterCounterField` component provides this accessibility benefit out of the box with:

- Visual character count display
- Screen reader announcements for character count changes
- Clear indication of when limits are approaching or exceeded
- Proper ARIA attributes for assistive technologies

## Examples

### Incorrect ❌

```tsx
import Form, { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

<Form onSubmit={handleSubmit}>
	<Field name="name" label="Name">
		{({ fieldProps }) => <Textfield {...fieldProps} maxLength={50} />}
	</Field>
</Form>;
```

```tsx
import Form, { Field } from '@atlaskit/form';
import Textarea from '@atlaskit/textarea';

<Form onSubmit={handleSubmit}>
	<Field name="description" label="Description">
		{({ fieldProps }) => <Textarea {...fieldProps} minLength={50} maxLength={200} />}
	</Field>
</Form>;
```

### Correct ✅

```tsx
import Form, { CharacterCounterField } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

<Form onSubmit={handleSubmit}>
	<CharacterCounterField name="name" label="Name" maxCharacters={50}>
		{({ fieldProps }) => <Textfield {...fieldProps} />}
	</CharacterCounterField>
</Form>;
```

```tsx
import Form, { CharacterCounterField } from '@atlaskit/form';
import Textarea from '@atlaskit/textarea';

<Form onSubmit={handleSubmit}>
	<CharacterCounterField
		name="description"
		label="Description"
		minCharacters={50}
		maxCharacters={200}
	>
		{({ fieldProps }) => <Textarea {...fieldProps} />}
	</CharacterCounterField>
</Form>;
```

## Options

This rule has no options.

## When Not To Use It

- If you're not using character limits on your text inputs, this rule won't apply.
- If your Textfield or Textarea is **not** used within a Form context, this rule doesn't apply as
  `CharacterCounterField` requires Form context to function.

However, if you are using character limits within a Form, it's strongly recommended to use
`CharacterCounterField` for better accessibility.

## Related Rules

- [use-correct-field](../use-correct-field/README.md)
