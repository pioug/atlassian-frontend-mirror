/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { FormattedMessage } from 'react-intl-next';

import Avatar, { type SizeType } from '@atlaskit/avatar';
import AvatarGroup, { type AvatarProps } from '@atlaskit/avatar-group';
import { type User } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import { WidthObserver } from '@atlaskit/width-detector';

import { fieldTextFontSize } from '../../styled';

import { userTypeMessages } from './messages';

const userWrapperStyles = xcss({
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: `${fieldTextFontSize}px`,
});

const avatarWrapperStyles = xcss({
	marginRight: 'space.100',
});

const widthObserverWrapperStyles = xcss({
	position: 'relative',
});

const labelWrapperStyles = css({
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const AvatarGroupWrapperStyles = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	ul: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		paddingLeft: '0px !important',
	},
});

export interface UserProps extends User {
	children?: React.ReactElement;
	testId?: string;
	avatarSize?: SizeType;
}

const getMaxUserCount = (userCount: number, availableWidth: number) => {
	if (availableWidth <= 28) {
		// If width is less than or equal to 28px, we should only display the user count
		return 1;
	}

	const defaultMaxCount = 5;
	const usersNumFitToAvailableWidth = Math.ceil((availableWidth - 28) / 20);

	return usersNumFitToAvailableWidth > defaultMaxCount
		? defaultMaxCount
		: usersNumFitToAvailableWidth;
};

export const USER_TYPE_TEST_ID = 'link-datasource-render-type--user';

const UserType = ({ users }: { users: UserProps[] }) => {
	const [width, setWidth] = useState<number | null>(null);

	let multipleUsers = false;
	if (fg('platform-datasources-enable-two-way-sync-assignee')) {
		multipleUsers = users.length === 1;
	} else {
		multipleUsers = users.length <= 1;
	}

	if (multipleUsers) {
		const {
			avatarSource,
			avatarSize = 'small',
			displayName,
			testId = USER_TYPE_TEST_ID,
			children,
		} = users[0] || {};
		return (
			<Box xcss={userWrapperStyles} testId={testId}>
				<Box xcss={avatarWrapperStyles}>
					<Avatar
						appearance="circle"
						size={avatarSize || 'small'}
						src={avatarSource}
						testId={`${testId}--avatar`}
					/>
				</Box>
				<span css={labelWrapperStyles}>
					{children || displayName || (
						<FormattedMessage {...userTypeMessages.userDefaultdisplayNameValue} />
					)}
				</span>
			</Box>
		);
	} else {
		const maxCount = width !== null ? getMaxUserCount(users.length, width) : 5;

		type UserPropsWithDisplayName = Omit<UserProps, 'displayName'> &
			Required<Pick<UserProps, 'displayName'>>;

		const data: AvatarProps[] = users
			.filter((user: UserProps): user is UserPropsWithDisplayName => !!user.displayName)
			.map(({ atlassianUserId, displayName, avatarSource, testId }) => ({
				key: atlassianUserId,
				name: displayName,
				src: avatarSource,
				testId: `${testId}--avatar`,
			}));

		return (
			<AvatarGroupWrapperStyles>
				<Box xcss={widthObserverWrapperStyles}>
					<WidthObserver setWidth={setWidth} />
				</Box>
				<AvatarGroup
					data={data}
					maxCount={maxCount}
					size="small"
					isTooltipDisabled={true}
					testId={USER_TYPE_TEST_ID}
				></AvatarGroup>
			</AvatarGroupWrapperStyles>
		);
	}
};

export default UserType;
