Inputs should almost always be interactive. Disabled and read-only inputs can usually be replaced by
a more user-friendly design pattern. Before using them, consider these alternatives:

- Instead of disabling an input, consider removing it altogether, as it cannot be used anyway. Use a
  well labeled and described input with clear error, valid, and/or helper messages.
- Instead of making an input read-only, consider making it normal text. Read-only inputs do the same
  thing as normal text but appear as interactive elements and add themselves to the tab-order, which
  can be confusing for users.

There are instances where these attributes are contextually appropriate, like disabling inputs
during loading or asynchronous validation. Consult your accessibility team if you want to know how
you can improve your experience and keep it accessible.

## Examples

This rule will find violations for when an input has a disabled or read-only attribute.

### Incorrect

```jsx
<input
  id="name"
  name="username"
  type="text"
  value="Jane Doe"
  disabled
  ^^^^^^^^ Input should not be disabled.
/>

<input
  id="name"
  name="username"
  type="text"
  value="Jane Doe"
  readonly
  ^^^^^^^^ Input should not be read-only.
/>
```

```jsx
import Textfield from '@atlaskit/textfield';

<Textfield defaultValue="Jane Doe" isDisabled />
                                   ^^^^^^^^^^ Input should not be disabled.
<Textfield defaultValue="Jane Doe" isReadOnly />
                                   ^^^^^^^^^^ Input should not be read-only.
```

```jsx
import Form, { Field, FormFooter } from '@atlaskit/form';
import Textarea from '@atlaskit/textarea';

export default function Example(): React.JSX.Element {
  return (
    <Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
      <Field
        label="Comments"
        name="comments"
        component={({ fieldProps }) => (
          <Textarea
            defaultValue="I love this restaurant."
            isDisabled
            ^^^^^^^^^^ Input should not be disabled.
            {...fieldProps}
          />
        )}
      />
      <FormFooter>
        <Button type="submit" appearance="primary">
          Submit
        </Button>
      </FormFooter>
    </Form>
  );
}
```

```jsx
import Form, { Field, FormFooter } from '@atlaskit/form';
import Textarea from '@atlaskit/textarea';

export default function Example(): React.JSX.Element {
  return (
    <Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
      <Field
        label="Comments"
        name="comments"
        component={({ fieldProps }) => (
          <Textarea
            defaultValue="I love this restaurant."
            isReadOnly
            ^^^^^^^^^^ Input should not be read-only.
            {...fieldProps}
          />
        )}
      />
      <FormFooter>
        <Button type="submit" appearance="primary">
          Submit
        </Button>
      </FormFooter>
    </Form>
  );
}
```

### Correct

```jsx
<input id="name" name="username" type="text" value="Jane Doe" />

<p>The current user's username is Jane Doe.</p>
```

```jsx
import Textfield from '@atlaskit/textfield';
import { Text } from '@atlaskit/primitives';

<Textfield value="Jane Doe" />

<Text>The current user's username is Jane Doe.</Text>
```

```jsx
import Form, { Field, FormFooter } from '@atlaskit/form';
import Textarea from '@atlaskit/textarea';

export default function Example(): React.JSX.Element {
  return (
    <Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
      <Field
        label="Comments"
        name="comments"
        defaultValue="I love this restaurant."
        component={({ fieldProps }) => <Textarea {...fieldProps} />}
      />
      <FormFooter>
        <Button type="submit" appearance="primary">
          Submit
        </Button>
      </FormFooter>
    </Form>
  );
}
```
