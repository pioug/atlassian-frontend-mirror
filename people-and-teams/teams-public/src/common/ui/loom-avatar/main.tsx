/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { getAvatarText, pickContainerColor, pickTextColor } from './utils';

const boxStyle = css({
	borderRadius: token('border.radius.100', '4px'),
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: token('color.border'),
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const smallBoxStyle = css({
	height: '24px',
	width: '24px',
	font: token('font.heading.xsmall'),
});

const largeBoxStyle = css({
	height: '32px',
	width: '32px',
	font: token('font.heading.medium'),
});

export function LoomSpaceAvatar({
	spaceName = '',
	size = 'small',
}: {
	spaceName: string;
	size?: 'small' | 'large';
	isDisabled?: boolean;
}): JSX.Element {
	const avatarText = getAvatarText(spaceName);
	const containerColor = pickContainerColor(spaceName);
	const textColor = pickTextColor(spaceName);

	return (
		<div
			css={[boxStyle, size === 'small' ? smallBoxStyle : largeBoxStyle]}
			style={{
				backgroundColor: containerColor,
				color: textColor,
			}}
		>
			{avatarText}
		</div>
	);
}
