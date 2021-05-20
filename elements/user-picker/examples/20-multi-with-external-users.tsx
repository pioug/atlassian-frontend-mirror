import React from 'react';
import { exampleOptions } from '../example-helpers';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import { isExternalUser } from '../src/components/utils';

const Example = () => {
  return (
    <ExampleWrapper>
      {({ onInputChange }) => (
        <UserPicker
          fieldId="example"
          options={exampleOptions.filter((o) => isExternalUser(o))}
          onChange={console.log}
          onInputChange={onInputChange}
          noOptionsMessage={() => null}
          isMulti
        />
      )}
    </ExampleWrapper>
  );
};
export default Example;
