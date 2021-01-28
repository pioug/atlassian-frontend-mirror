import React from 'react';
import { exampleOptions } from '../example-helpers';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const Example = () => {
  return (
    <ExampleWrapper>
      {({ options, onInputChange }) => (
        <UserPicker
          fieldId="example"
          options={options}
          onChange={console.log}
          onInputChange={onInputChange}
          isMulti
          defaultValue={[exampleOptions[0], exampleOptions[1]]}
        />
      )}
    </ExampleWrapper>
  );
};
export default Example;
