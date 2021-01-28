import React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const Example = () => {
  return (
    <ExampleWrapper>
      {({ loadUsers }) => (
        <UserPicker
          fieldId="example"
          onChange={console.log}
          loadOptions={loadUsers}
        />
      )}
    </ExampleWrapper>
  );
};
export default Example;
