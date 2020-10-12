import React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

export default class Example extends React.Component<{}> {
  render() {
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
  }
}
