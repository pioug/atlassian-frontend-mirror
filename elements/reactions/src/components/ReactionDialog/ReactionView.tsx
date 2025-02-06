/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { ResourcedEmoji } from '@atlaskit/emoji/element';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import Avatar from '@atlaskit/avatar/Avatar';
import Spinner from '@atlaskit/spinner';
import { TabPanel } from '@atlaskit/tabs';
import { Box, Flex, xcss, Inline } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';

import { messages } from '../../shared/i18n';
import { type ReactionSummary, type ProfileCardWrapper } from '../../types';

import { userListStyle, userStyle, centerSpinner } from './styles';

const userDescriptionStyle = xcss({
	marginLeft: 'space.150',
});

const profileWrapperStyle = xcss({
	marginLeft: 'space.0',
});

const reactionViewStyle = xcss({
	marginTop: 'space.300',
});

const headerStyle = xcss({ alignItems: 'flex-end' });
const emojiSpacingStlye = xcss({ marginLeft: 'space.100' });

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
	const [emojiShortName, setEmojiShortName] = useState<string>('');

	useEffect(() => {
		(async () => {
			const provider = await emojiProvider;
			const emoji = await provider.findByEmojiId({
				shortName: '',
				id: selectedEmojiId,
			});
			if (emoji?.shortName) {
				const shortNameWithoutColons = emoji.shortName.replace(/:/g, '');
				setEmojiShortName(shortNameWithoutColons);
			}
		})();
	}, [emojiProvider, selectedEmojiId, reaction]);

	const alphabeticalNames = useMemo(() => {
		const reactionObj = reaction;

		return reactionObj.users?.sort((a, b) => a.displayName.localeCompare(b.displayName)) || [];
	}, [reaction]);

	return (
		<TabPanel>
			<Flex direction="column" xcss={reactionViewStyle}>
				<Inline xcss={headerStyle}>
					<Heading size="xsmall">
						<FormattedMessage
							{...messages.peopleWhoReactedSubheading}
							values={{
								emojiShortName,
							}}
						/>
					</Heading>
					<Box as="span" xcss={emojiSpacingStlye}>
						<ResourcedEmoji
							emojiProvider={emojiProvider}
							emojiId={{ id: selectedEmojiId, shortName: '' }}
							fitToHeight={24}
						/>
					</Box>
				</Inline>

				{alphabeticalNames.length === 0 ? (
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					<div css={centerSpinner}>
						<Spinner size="large" />
					</div>
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
