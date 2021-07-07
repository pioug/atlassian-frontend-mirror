import React from 'react';

import Button from '@atlaskit/button/standard-button';
import Form, { FormFooter, HelperMessage, RangeField } from '@atlaskit/form';

import Range from '../../src';

export default function TextFieldFormExample() {
  return (
    <Form
      onSubmit={(formState: unknown) =>
        console.log('form submitted', formState)
      }
    >
      {({ formProps }: any) => (
        <form {...formProps}>
          <RangeField label="Field label" name="example-text" defaultValue={50}>
            {({ fieldProps }) => (
              <>
                <Range {...fieldProps} />
                <HelperMessage>
                  Help or instruction text goes here
                </HelperMessage>
              </>
            )}
          </RangeField>
          <FormFooter>
            <Button type="submit" appearance="primary">
              Submit
            </Button>
          </FormFooter>
        </form>
      )}
    </Form>
  );
}
