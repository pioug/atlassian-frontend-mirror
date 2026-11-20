/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { css, cssMap, jsx, styled } from '@compiled/react';
import { FormattedMessage } from 'react-intl';

import AvatarGroup from '@atlaskit/avatar-group/avatar-group';
import type { AvatarProps } from '@atlaskit/avatar-group/types';
import Avatar from '@atlaskit/avatar/avatar';
import type { SizeType } from '@atlaskit/avatar/types';
import type { User } from '@atlaskit/linking-types/datasource';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
import { WidthObserver } from '@atlaskit/width-detector/width-observer';

import { userTypeMessages } from './messages';

const styles = cssMap({
	userWrapperStyles: {
		display: 'flex',
		alignItems: 'center',
		font: token('font.body'),
		minWidth: '0px',
	},
	usersListStyles: {
		display: 'flex',
		flexWrap: 'wrap',
		alignItems: 'center',
		gap: token('space.100'),
		minWidth: '0px',
	},
	avatarWrapperStyles: {
		marginRight: token('space.100'),
	},
	widthObserverWrapperStyles: {
		position: 'relative',
	},
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
	avatarSize?: SizeType;
	children?: React.ReactElement;
	testId?: string;
}

const getMaxUserCount = (_userCount: number, availableWidth: number) => {
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

const UserChip = ({ user }: { user?: UserProps }): JSX.Element => {
	const {
		avatarSource,
		avatarSize = 'small',
		displayName,
		testId = USER_TYPE_TEST_ID,
		children,
	} = user || {};

	return (
		<Box xcss={styles.userWrapperStyles} testId={testId}>
			<Box xcss={styles.avatarWrapperStyles}>
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
};

const UserType = ({ users }: { users: UserProps[] }): JSX.Element => {
	const [width, setWidth] = useState<number | null>(null);
	const showNamedChips = users.length === 1 || fg('assets_tempeh_lol_people_user');

	if (showNamedChips && users.length > 0) {
		if (users.length === 1) {
			return <UserChip user={users[0] || {}} />;
		}

		return (
			<Box xcss={styles.usersListStyles} testId={USER_TYPE_TEST_ID}>
				{users.map((user, index) => (
					<UserChip
						key={user?.atlassianUserId || user?.displayName || index}
						user={{
							...user,
							testId: `${USER_TYPE_TEST_ID}-${index}`,
						}}
					/>
				))}
			</Box>
		);
	}

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
			<Box xcss={styles.widthObserverWrapperStyles}>
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
};

export default UserType;
