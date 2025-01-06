/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { FormattedMessage, useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';
import { type Avatar } from '../avatar-list';

import ArrowLeftIcon from '@atlaskit/icon/core/migration/arrow-left';
import Button from '@atlaskit/button/standard-button';

import { B200, B100 } from '@atlaskit/theme/colors';
import { useState } from 'react';

export interface PredefinedAvatarViewProps {
	avatars: Array<Avatar>;
	onGoBack?: () => void;
	onAvatarSelected: (avatar: Avatar) => void;
	selectedAvatar?: Avatar;
	predefinedAvatarsText?: string;
	selectAvatarLabel?: string;
}

const largeAvatarImageStyles = css({
	borderRadius: token('border.radius.100', '3px'),
	cursor: 'pointer',
	width: '72px',
	height: '72px',
});

const largeAvatarImageCheckedStyles = css({
	boxShadow: `0px 0px 0px 1px ${token(
		'color.border.inverse',
		'white',
	)}, 0px 0px 0px 3px ${token('color.border.selected', B200)}`,
});

const largeAvatarImageFocusedStyles = css({
	boxShadow: `0px 0px 0px 1px ${token(
		'color.border.inverse',
		'white',
	)}, 0px 0px 0px 3px ${token('color.border.focused', B100)}`,
});

const bodyStyles = css({
	display: 'flex',
	flexFlow: 'row wrap',
	width: '353px',
	maxHeight: '294px',
	overflowY: 'auto',
	padding: `${token('space.100', '8px')} 0 0`,
	margin: 0,
});

const inputStyles = css({
	width: '1px',
	height: '1px',
	padding: 0,
	position: 'fixed',
	border: 0,
	clip: 'rect(1px, 1px, 1px, 1px)',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
});

const labelStyles = css({
	paddingRight: token('space.050', '4px'),
	paddingLeft: token('space.050', '4px'),
	paddingBottom: token('space.100', '8px'),
	display: 'inline-flex',
});

const headerStyles = css({
	display: 'flex',
	alignItems: 'center',
	paddingTop: token('space.050', '4px'),
	paddingBottom: token('space.100', '8px'),
});

const descriptionStyles = css({
	paddingLeft: token('space.100', '8px'),
	margin: 0,
	font: token('font.body'),
});

const backButtonStyles = css({
	width: '32px',
	height: '32px',
	borderRadius: token('border.radius.400', '16px'),
	alignItems: 'center',
	justifyContent: 'center',
	margin: 0,
	padding: 0,
});

export const PredefinedAvatarView = ({
	avatars = [],
	onAvatarSelected,
	selectedAvatar,
	onGoBack,
	predefinedAvatarsText,
	selectAvatarLabel,
}: PredefinedAvatarViewProps) => {
	const intl = useIntl();

	const [isFocused, setIsFocused] = useState(
		Object.fromEntries(avatars.map((avatar) => [avatar.dataURI, false])),
	);

	const createOnItemClickHandler = (avatar: Avatar) => {
		return () => {
			if (onAvatarSelected) {
				onAvatarSelected(avatar);
			}
		};
	};

	const cards = avatars.map((avatar, idx) => {
		const elementKey = `predefined-avatar-${idx}`;
		return (
			<label key={elementKey} css={labelStyles}>
				<input
					type="radio"
					name="avatar"
					value={avatar.dataURI}
					aria-label={avatar.name || undefined}
					checked={avatar === selectedAvatar}
					onChange={createOnItemClickHandler(avatar)}
					css={inputStyles}
					onFocus={() => setIsFocused({ ...isFocused, [avatar.dataURI]: true })}
					onBlur={() => setIsFocused({ ...isFocused, [avatar.dataURI]: false })}
				/>
				{/**
				 * The alt is intentionally empty to avoid double announement of screen reader
				 * see: https://www.loom.com/share/1c19ca856478460b9ab1b75cc599b122
				 */}
				<img
					css={[
						largeAvatarImageStyles,
						avatar === selectedAvatar && largeAvatarImageCheckedStyles,
						isFocused[avatar.dataURI] && largeAvatarImageFocusedStyles,
					]}
					src={avatar.dataURI}
					alt=""
				/>
			</label>
		);
	});

	return (
		<div id="predefined-avatar-view-wrapper">
			<div css={headerStyles}>
				<Button
					aria-label={intl.formatMessage(messages.avatar_picker_back_btn_label)}
					iconAfter={<ArrowLeftIcon color="currentColor" label="" />}
					onClick={onGoBack}
					css={backButtonStyles}
				/>
				{/* eslint-disable-next-line @atlaskit/design-system/use-heading */}
				<h2 css={descriptionStyles}>
					{predefinedAvatarsText || <FormattedMessage {...messages.default_avatars} />}
				</h2>
			</div>
			<div
				role="radiogroup"
				aria-label={selectAvatarLabel || intl.formatMessage(messages.select_an_avatar)}
				css={bodyStyles}
			>
				{cards}
			</div>
		</div>
	);
};
