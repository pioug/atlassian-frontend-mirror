import React from 'react';
import { exampleOptions } from '../example-helpers';
import UserPicker from '../src';

const Example = () => {
  return (
    <UserPicker
      fieldId="example"
      options={exampleOptions}
      isDisabled={true}
      value={exampleOptions[0]}
    />
  );
};
export default Example;
