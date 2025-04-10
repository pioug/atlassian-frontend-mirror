/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';
import { css, cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N500 } from '@atlaskit/theme/colors';
import Avatar from '@atlaskit/avatar/Avatar';
import Spinner from '@atlaskit/spinner';
import { TabPanel } from '@atlaskit/tabs';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { type ReactionSummary, type ProfileCardWrapper } from '../types';

const userListStyle = css({
	listStyle: 'none',
	marginTop: token('space.200', '16px'),
	padding: 0,
	textAlign: 'left',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	li: {
		color: `${token('color.text', N500)}`,
		font: token('font.body'),
	},
});

const userStyle = css({
	display: 'flex',
	alignItems: 'center',
	paddingTop: token('space.050', '4px'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: 0,
	paddingRight: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		marginLeft: token('space.200', '16px'),
	},
});

const styles = cssMap({
	userDescriptionStyle: {
		marginLeft: token('space.150'),
	},

	profileWrapperStyle: {
		marginLeft: token('space.0'),
	},

	reactionViewStyle: {
		marginTop: token('space.150'),
		minHeight: '300px',
		minWidth: '550px',
	},

	centerSpinnerStyle: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		marginTop: token('space.300'),
	},
});

export interface ReactionViewProps {
	/**
	 * Selected reaction to get user data from
	 */
	reaction: ReactionSummary;
	/**
	 * Optional ProfileWrapper component to show profile card on hover
	 */
	ProfileCardWrapper?: ProfileCardWrapper;
}

export const ReactionView = ({ reaction, ProfileCardWrapper }: ReactionViewProps) => {
	const alphabeticalNames = useMemo(() => {
		const reactionObj = reaction;

		return reactionObj.users?.sort((a, b) => a.displayName.localeCompare(b.displayName)) || [];
	}, [reaction]);

	return (
		<TabPanel>
			<Flex direction="column" xcss={styles.reactionViewStyle}>
				{alphabeticalNames.length === 0 ? (
					<Box xcss={styles.centerSpinnerStyle}>
						<Spinner size="large" interactionName="reactions-spinner" />
					</Box>
				) : (
					<ul css={userListStyle}>
						{alphabeticalNames.map((user) => {
							const profile = user.profilePicture?.path;
							return (
								<li css={userStyle} key={user.id}>
									{ProfileCardWrapper && user.accountId ? (
										<Box xcss={styles.profileWrapperStyle}>
											<ProfileCardWrapper
												userId={user.accountId}
												isAnonymous={false}
												canViewProfile
												position="left-start"
											>
												<Avatar size="medium" src={profile} testId="profile" />
											</ProfileCardWrapper>
										</Box>
									) : (
										<Avatar size="medium" src={profile} testId="profile" />
									)}
									<Flex xcss={styles.userDescriptionStyle}>
										<div>{user.displayName}</div>
									</Flex>
								</li>
							);
						})}
					</ul>
				)}
			</Flex>
		</TabPanel>
	);
};
