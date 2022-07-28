import React, { useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker, { OptionData, Value } from '../src';

const Example = () => {
  const [selectedUser, setSelectedUser] = useState<Value>();
  const [selectedUsers, setSelectedUsers] = useState<Value[]>([]);

  return (
    <IntlProvider locale="en">
      <ExampleWrapper>
        {({ options, onInputChange }) => (
          <UserPicker
            disableInput={!!selectedUser}
            fieldId="example"
            onChange={(value) => {
              setSelectedUser(value);
            }}
            onInputChange={onInputChange}
            options={options}
            placeholder={'Disable input on user select'}
          />
        )}
      </ExampleWrapper>
      <ExampleWrapper>
        {({ options, onInputChange }) => (
          <UserPicker
            disableInput={selectedUsers?.length > 2}
            fieldId="example"
            isMulti
            onChange={(value) => {
              setSelectedUsers(value as OptionData[]);
            }}
            onInputChange={onInputChange}
            options={options}
            placeholder={'Disable input on the third user selected'}
          />
        )}
      </ExampleWrapper>
    </IntlProvider>
  );
};
export default Example;
