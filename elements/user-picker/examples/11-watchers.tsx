import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Button from '@atlaskit/button/standard-button';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import React, { FC, useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import { OptionData, Value } from '../src';
import UserPicker from '../src';
import { isTeam, isUser } from '../src/components/utils';

type UserValueProps = {
  user: OptionData;
  onRemove: (user: OptionData) => void;
};

const UserValueContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 350px;
  align-items: center;
`;

const UserValue: FC<UserValueProps> = ({ onRemove, user }) => {
  const handleRemoveClick = useCallback(() => {
    onRemove(user);
  }, [onRemove, user]);

  return (
    <UserValueContainer>
      <AvatarItem
        avatar={
          <Avatar
            src={isUser(user) || isTeam(user) ? user.avatarUrl : undefined}
          />
        }
        primaryText={user.name}
      />
      <Button
        iconBefore={<SelectClearIcon label="clear" />}
        onClick={handleRemoveClick}
      />
    </UserValueContainer>
  );
};

const Example = () => {
  const [value, setValue] = useState<Array<Value>>([]);

  const handleOnChange = useCallback(
    (user: Value) => {
      if (!Array.isArray(user) && user && isUser(user)) {
        if (value.indexOf(user) === -1) {
          setValue([...value, user]);
        }
      }
    },
    [value],
  );

  const handleRemoveUser = useCallback((toRemove: OptionData) => {
    setValue((value) => value.filter((user) => user !== toRemove));
  }, []);

  return (
    <ExampleWrapper>
      {({ options, onInputChange }) => (
        <div>
          {value.map((user) => (
            <UserValue
              key={(user as OptionData).id}
              user={user as OptionData}
              onRemove={handleRemoveUser}
            />
          ))}
          <UserPicker
            fieldId="example"
            options={options.filter((user) => value.indexOf(user) === -1)}
            value={null}
            onChange={handleOnChange}
            onInputChange={onInputChange}
            onSelection={(value, sessionId, baseUserPicker) =>
              requestAnimationFrame(() => baseUserPicker?.focus())
            }
          />
        </div>
      )}
    </ExampleWrapper>
  );
};

export default Example;
