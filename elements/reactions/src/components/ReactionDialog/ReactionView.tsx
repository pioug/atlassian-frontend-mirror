/** @jsx   jsx */
import { useEffect, useState, useMemo } from 'react';
import { useIntl } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { ResourcedEmoji } from '@atlaskit/emoji/element';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import Avatar from '@atlaskit/avatar/Avatar';
import Spinner from '@atlaskit/spinner';
import { useTabPanel } from '@atlaskit/tabs';

import { messages } from '../../shared/i18n';
import { type ReactionSummary } from '../../types';

import { reactionViewStyle, userListStyle, userStyle, centerSpinner } from './styles';

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
}

export const ReactionView = ({ selectedEmojiId, emojiProvider, reaction }: ReactionViewProps) => {
	const intl = useIntl();
	const [emojiName, setEmojiName] = useState<string>('');

	useEffect(() => {
		(async () => {
			const provider = await emojiProvider;
			const emoji = await provider.findByEmojiId({
				shortName: '',
				id: selectedEmojiId,
			});
			if (emoji && emoji.name) {
				setEmojiName(emoji.name);
			}
		})();
	}, [emojiProvider, selectedEmojiId]);

	const alphabeticalNames = useMemo(() => {
		const reactionObj = reaction;

		return reactionObj.users?.sort((a, b) => a.displayName.localeCompare(b.displayName)) || [];
	}, [reaction]);

	const tabPanelAttributes = useTabPanel();

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={reactionViewStyle} {...tabPanelAttributes}>
			<p>
				<ResourcedEmoji
					emojiProvider={emojiProvider}
					emojiId={{ id: selectedEmojiId, shortName: '' }}
					fitToHeight={24}
				/>
				{intl.formatMessage(messages.emojiName, { emojiName })}
			</p>
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
								<Avatar size="large" src={profile} />
								<span>{user.displayName}</span>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};
