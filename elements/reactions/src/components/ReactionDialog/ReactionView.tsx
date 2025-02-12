/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { type EmojiProvider } from '@atlaskit/emoji/resource';
import Avatar from '@atlaskit/avatar/Avatar';
import Spinner from '@atlaskit/spinner';
import { TabPanel } from '@atlaskit/tabs';
import { Box, Flex, xcss } from '@atlaskit/primitives';
import { type ReactionSummary, type ProfileCardWrapper } from '../../types';

import { userListStyle, userStyle } from './styles';

const userDescriptionStyle = xcss({
	marginLeft: 'space.150',
});

const profileWrapperStyle = xcss({
	marginLeft: 'space.0',
});

const reactionViewStyle = xcss({
	marginTop: 'space.150',
	minHeight: '300px',
	minWidth: '550px',
});

const centerSpinnerStyle = xcss({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '100%',
	marginTop: 'space.300',
});

export interface ReactionViewProps {
	/**
	 * Selected reaction to get user data from
	 */
	reaction: ReactionSummary;
	/**
	 * Current emoji selected in the reactions dialog
	 */
	selectedEmojiId: string;
	/**
	 * Provider for loading emojis
	 */
	emojiProvider: Promise<EmojiProvider>;
	ProfileCardWrapper?: ProfileCardWrapper;
}

export const ReactionView = ({
	selectedEmojiId,
	emojiProvider,
	reaction,
	ProfileCardWrapper,
}: ReactionViewProps) => {
	const alphabeticalNames = useMemo(() => {
		const reactionObj = reaction;

		return reactionObj.users?.sort((a, b) => a.displayName.localeCompare(b.displayName)) || [];
	}, [reaction]);

	return (
		<TabPanel>
			<Flex direction="column" xcss={reactionViewStyle}>
				{alphabeticalNames.length === 0 ? (
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					<Box xcss={centerSpinnerStyle}>
						<Spinner size="large" />
					</Box>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					<ul css={userListStyle}>
						{alphabeticalNames.map((user) => {
							const profile = user.profilePicture?.path;
							return (
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								<li css={userStyle} key={user.id}>
									{ProfileCardWrapper && user.accountId ? (
										<Box xcss={profileWrapperStyle}>
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
									<Flex xcss={userDescriptionStyle}>
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
