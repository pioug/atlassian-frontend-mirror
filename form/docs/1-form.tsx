import React from 'react';
import { code, md, Props } from '@atlaskit/docs';

export default md`

<a name="form-reference"></a>
## Form

Responsible for managing the state of the form. Provides props to spread onto
a form element and others to check the form state.

${code`
import Form from '@atlaskit/form';
import Button from '@atlaskit/button';

const MyForm = () => (
  <Form onSubmit={data => console.log('form data', data)}>
    {({ formProps, dirty, submitting }) => (
      <form {...formProps}>
        {/* fields */}
        <Button
          type="submit"
          appearance="primary"
          isDisabled={!dirty || submitting}
        >
          Submit
        </Button>
      </form>
    )}
  </Form>
);
`}

### Form props
  
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/Form')}
      heading=""
    />
  )}

`;
