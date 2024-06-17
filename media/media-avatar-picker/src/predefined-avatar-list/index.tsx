/**@jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { AvatarList, type Avatar } from '../avatar-list';

import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import Button from '@atlaskit/button/standard-button';
import { predefinedAvatarsWrapperStyles } from './styles';
import { useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';

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
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="show-more-button"
				appearance="subtle"
				iconAfter={<EditorMoreIcon label="" size="large" />}
				onClick={onShowMore}
			/>
		</div>
	);
};
