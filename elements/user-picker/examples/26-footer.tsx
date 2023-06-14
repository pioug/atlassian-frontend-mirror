import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const Example = () => {
  return (
    <IntlProvider locale="en">
      <ExampleWrapper>
        {({ options, onInputChange }) => (
          <UserPicker
            fieldId="example"
            isMulti
            onInputChange={onInputChange}
            options={options}
            placeholder={'Options with a footer'}
            footer={
              <div>
                <button>Have a nice day!</button>
              </div>
            }
          />
        )}
      </ExampleWrapper>
      <br />
      <ExampleWrapper>
        {({ options, onInputChange }) => (
          <UserPicker
            fieldId="example"
            isMulti
            onInputChange={onInputChange}
            placeholder={'No option with a footer'}
            footer={
              <div>
                <button>Have a nice day!</button>
              </div>
            }
          />
        )}
      </ExampleWrapper>
    </IntlProvider>
  );
};
export default Example;
