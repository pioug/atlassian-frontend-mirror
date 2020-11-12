import React from 'react';
import { exampleOptions } from '../example-helpers';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import { isExternalUser } from '../src/components/utils';

export default class Example extends React.Component<{}> {
  render() {
    return (
      <ExampleWrapper>
        {({ onInputChange }) => (
          <UserPicker
            fieldId="example"
            options={exampleOptions.filter(o => isExternalUser(o))}
            onChange={console.log}
            onInputChange={onInputChange}
            noOptionsMessage={() => null}
            isMulti
            allowEmail
          />
        )}
      </ExampleWrapper>
    );
  }
}
