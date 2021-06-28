import React, { ChangeEvent, Fragment, useCallback, useState } from 'react';

import Button from '@atlaskit/button';
import Form, { CheckboxField, FormFooter } from '@atlaskit/form';

import { Checkbox } from '../../src';

const CheckboxRequiredExample = () => {
  const [isChecked, setIsChecked] = useState(false);

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked((current) => !current);
  }, []);

  return (
    <Form onSubmit={(formData) => console.log('form data', formData)}>
      {({ formProps }) => (
        <form {...formProps}>
          <CheckboxField name="checkbox-required" isRequired>
            {({ fieldProps }) => (
              <Fragment>
                <Checkbox
                  {...fieldProps}
                  isChecked={isChecked}
                  onChange={onChange}
                  label="By checking this box you agree to the terms and conditions"
                  value="By checking this box you agree to the terms and conditions"
                  name="checkbox-required"
                />
              </Fragment>
            )}
          </CheckboxField>
          <FormFooter>
            <Button type="submit" isDisabled={!isChecked}>
              Submit
            </Button>
          </FormFooter>
        </form>
      )}
    </Form>
  );
};

export default CheckboxRequiredExample;
