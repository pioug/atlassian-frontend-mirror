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
import { useTabPanel } from '@atlaskit/tabs';
import { Text, Flex, xcss } from '@atlaskit/primitives';

import { messages } from '../../shared/i18n';
import { type ReactionSummary, type ProfileCardWrapper } from '../../types';

import { reactionViewStyle, userListStyle, userStyle, centerSpinner } from './styles';

const userDescriptionStyle = xcss({
	marginLeft: 'space.200',
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
	const [emojiShortName, setEmojiShortName] = useState<string>('');

	useEffect(() => {
		(async () => {
			const provider = await emojiProvider;
			const emoji = await provider.findByEmojiId({
				shortName: '',
				id: selectedEmojiId,
			});
			if (emoji?.shortName) {
				setEmojiShortName(emoji.shortName);
			}
		})();
	}, [emojiProvider, selectedEmojiId, reaction]);

	const alphabeticalNames = useMemo(() => {
		const reactionObj = reaction;

		return reactionObj.users?.sort((a, b) => a.displayName.localeCompare(b.displayName)) || [];
	}, [reaction]);

	const tabPanelAttributes = useTabPanel();

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={reactionViewStyle} {...tabPanelAttributes}>
			<Text as="p">
				<FormattedMessage
					{...messages.peopleWhoReactedSubheading}
					values={{
						emojiShortName,
					}}
				/>
				<ResourcedEmoji
					emojiProvider={emojiProvider}
					emojiId={{ id: selectedEmojiId, shortName: '' }}
					fitToHeight={24}
				/>
			</Text>
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
									<ProfileCardWrapper
										userId={user.accountId}
										isAnonymous={false}
										canViewProfile
										position="left-start"
									>
										<Avatar size="large" src={profile} testId="profile" />
									</ProfileCardWrapper>
								) : (
									<Avatar size="large" src={profile} testId="profile" />
								)}
								<Flex xcss={userDescriptionStyle}>
									<div>{user.displayName}</div>
								</Flex>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};
