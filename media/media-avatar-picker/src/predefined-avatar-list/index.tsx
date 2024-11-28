/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

import { AvatarList, type Avatar } from '../avatar-list';
import EditorMoreIcon from '@atlaskit/icon/core/migration/show-more-horizontal--editor-more';
import Button from '@atlaskit/button/standard-button';
import { useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';

const predefinedAvatarsWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
});

const showMoreButtonStyles = css({
	width: '40px',
	height: '40px',
	borderRadius: token('border.radius.circle', '50%'),
	alignItems: 'center',
	justifyContent: 'center',
	margin: 0,
	padding: 0,
});

export interface PredefinedAvatarListProps {
	avatars: Array<Avatar>;
	selectedAvatar?: Avatar;
	onShowMore?: () => void;
	onAvatarSelected: (avatar: Avatar) => void;
	selectAvatarLabel?: string;
	showMoreAvatarsButtonLabel?: string;
}

export const PredefinedAvatarList = ({
	avatars = [],
	selectedAvatar,
	onShowMore,
	onAvatarSelected,
	selectAvatarLabel,
	showMoreAvatarsButtonLabel,
}: PredefinedAvatarListProps) => {
	const intl = useIntl();

	return (
		<div css={predefinedAvatarsWrapperStyles} id="predefined-avatar-wrapper">
			<AvatarList
				avatars={avatars}
				selectedAvatar={selectedAvatar}
				onItemClick={onAvatarSelected}
				selectAvatarLabel={selectAvatarLabel}
			/>
			<Button
				aria-label={
					showMoreAvatarsButtonLabel || intl.formatMessage(messages.show_more_avatars_btn_label)
				}
				appearance="subtle"
				iconAfter={<EditorMoreIcon label="" LEGACY_size="large" color="currentColor" />}
				onClick={onShowMore}
				css={showMoreButtonStyles}
			/>
		</div>
	);
};
