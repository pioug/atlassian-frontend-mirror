import React from 'react';
import { exampleOptions } from '../example-helpers';
import UserPicker from '../src';

export default class Example extends React.Component<{}> {
  render() {
    return (
      <UserPicker
        fieldId="example"
        options={exampleOptions}
        isDisabled={true}
        value={exampleOptions[0]}
      />
    );
  }
}
