import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import SelectClearIcon from '@atlaskit/icon/core/migration/cross-circle--select-clear';
import React, { type FC, useCallback, useState } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import { type OptionData, type Value } from '../src';
import UserPicker from '../src';
import { isTeam, isUser } from '../src/components/utils';

type UserValueProps = {
	user: OptionData;
	onRemove: (user: OptionData) => void;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const UserValueContainer = styled.div({
	display: 'flex',
	justifyContent: 'space-between',
	maxWidth: '350px',
	alignItems: 'center',
});

const UserValue: FC<UserValueProps> = ({ onRemove, user }) => {
	const handleRemoveClick = useCallback(() => {
		onRemove(user);
	}, [onRemove, user]);

	return (
		<UserValueContainer>
			<AvatarItem
				avatar={<Avatar src={isUser(user) || isTeam(user) ? user.avatarUrl : undefined} />}
				primaryText={user.name}
			/>
			<IconButton icon={SelectClearIcon} onClick={handleRemoveClick} label="clear" />
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
