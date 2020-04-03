import React from 'react';
import { code, md, Props } from '@atlaskit/docs';

export default md`

## FormHeader, FormSection & FormFooter

These components are can be used to help layout your form. They provide
padding and styling for form headings and subheadings.

${code`
import Form, { FormHeader, FormSection, FormFooter } from '@atlaskit/form';
import Button from '@atlaskit/button';

const MyForm = () => (
  <Form onSubmit={data => console.log('form data', data)}>
    {({ formProps }) => (
      <form {...formProps}>
        <FormHeader title="Register for axe throwing" />
        <FormSection title="Contact Information">
          {/* fields */}
        </FormSection>
        <FormFooter>
          {/* buttons */}
        </FormFooter>
      </form>
    )}
  </Form>
);
`}

### FormHeader props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FormHeader')}
      heading=""
    />
  )}

### FormSection props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FormSection')}
      heading=""
    />
  )}

### FormFooter props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FormFooter')}
      heading=""
    />
  )}
`;
