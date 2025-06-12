/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import { useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';
import { B200, B100 } from '@atlaskit/theme/colors';
import { useState } from 'react';

export interface Avatar {
	dataURI: string;
	name?: string;
}

export interface AvatarListProps {
	avatars: Array<Avatar>;
	onItemClick?: (avatar: Avatar) => void;
	selectedAvatar?: Avatar;
	selectAvatarLabel?: string;
}

const smallAvatarImageStyles = css({
	borderRadius: token('border.radius.100', '3px'),
	cursor: 'pointer',
	width: token('space.500', '40px'),
	height: token('space.500', '40px'),
});

const avatarListWrapperStyles = css({
	display: 'flex',
});

const labelStyles = css({
	paddingRight: token('space.050', '4px'),
	display: 'inline-flex',
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

const imageCheckedStyles = css({
	boxShadow: `0px 0px 0px 1px ${token(
		'color.border.inverse',
		'white',
	)}, 0px 0px 0px 3px ${token('color.border.selected', B200)}`,
});

const imageFocusedStyles = css({
	boxShadow: `0px 0px 0px 1px ${token(
		'color.border.inverse',
		'white',
	)}, 0px 0px 0px 3px ${token('color.border.focused', B100)}`,
});

export const AvatarList = ({
	avatars = [],
	selectedAvatar,
	onItemClick,
	selectAvatarLabel,
}: AvatarListProps) => {
	const intl = useIntl();

	const [isFocused, setIsFocused] = useState(
		Object.fromEntries(avatars.map((avatar) => [avatar.dataURI, false])),
	);

	const createOnItemClickHandler = (avatar: Avatar) => () => {
		if (onItemClick) {
			onItemClick(avatar);
		}
	};

	const cards = avatars.map((avatar, idx) => {
		const elementKey = `predefined-avatar-${idx}`;

		return (
			<label key={elementKey} css={labelStyles}>
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-radio */}
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
						smallAvatarImageStyles,
						avatar === selectedAvatar && imageCheckedStyles,
						isFocused[avatar.dataURI] && imageFocusedStyles,
					]}
					src={avatar.dataURI}
					alt=""
				/>
			</label>
		);
	});

	return (
		<div
			role="radiogroup"
			aria-label={selectAvatarLabel || intl.formatMessage(messages.select_an_avatar)}
			css={avatarListWrapperStyles}
		>
			{cards}
		</div>
	);
};
