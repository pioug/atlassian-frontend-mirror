import React from 'react';
import { code, md, Props } from '@atlaskit/docs';

export default md`

<a name="field-reference"></a>

## Field [#](#field-reference)

Each Field component is an entry in the form state. Passes down props to be spread
onto the inner component as well as information about the field state.

${code`
import { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';

const UsernameField = () => (
  <Field name="username" defaultValue="" isRequired>
    {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
  </Field>
);
`}

### Field props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/Field')}
      heading=""
    />
  )}

<a name="checkboxfield-reference"></a>

## CheckboxField [#](#checkboxfield-reference)

Checkbox fields are different enough to warrent this variation of Field.
By default the value of a CheckboxField will be true or false. When the
component is rendered with a \`value\` prop the form value will be an array.
The array will contain \`value\` depending on whether the field is checked.

${code`
import { CheckboxField } from '@atlaskit/form';
import { Checkbox } from '@atlaskit/checkbox';

const RememberMeField = () => (
  <CheckboxField name="remember" defaultIsChecked>
    {({ fieldProps }) => (
      <Checkbox {...fieldProps} label="Remember me" />
    )}
  </CheckboxField>
);
`}

### CheckboxField props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/CheckboxField')}
      heading=""
    />
  )}

## Fieldset [#](#fieldset-reference)

The \`Fieldset\` component is used to group a number of fields together. When multiple
\`CheckboxField\`s share the same name, a \`Fieldset\` component can be used to group
them together. Using a fieldset in this situation makes the form a lot more accessible.

${code`
import { CheckboxField, Fieldset } from '@atlaskit/form';
import { Checkbox } from '@atlaskit/checkbox';

const ProductField = () => (
  <Fieldset legend="Products">
    <CheckboxField name="product" value="jira">
      {({ fieldProps }) => <Checkbox {...fieldProps} label="Jira" />}
    </CheckboxField>
    <CheckboxField name="product" value="confluence">
      {({ fieldProps }) => (
        <Checkbox {...fieldProps} label="Confluence" />
      )}
    </CheckboxField>
    <CheckboxField name="product" value="bitbucket">
      {({ fieldProps }) => (
        <Checkbox {...fieldProps} label="Bitbucket" />
      )}
    </CheckboxField>
  </Fieldset>
);
`}

### Fieldset props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/Fieldset')}
      heading=""
    />
  )}
`;
