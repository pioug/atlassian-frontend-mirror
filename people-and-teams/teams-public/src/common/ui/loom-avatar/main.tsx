/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { getAvatarText, pickContainerColor, pickTextColor } from './utils';

const boxStyle = css({
	borderRadius: token('radius.small', '4px'),
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: token('color.border'),
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const smallBoxStyle = css({
	height: '22px',
	minWidth: '22px',
	marginTop: token('space.025', '2px'),
	marginRight: token('space.025', '2px'),
	marginBottom: token('space.025', '2px'),
	marginLeft: token('space.025', '2px'),
	font: token('font.heading.xsmall'),
});

const largeBoxStyle = css({
	height: '32px',
	width: '32px',
	font: token('font.heading.medium'),
	paddingInline: token('space.025', '2px'),
});

export function LoomSpaceAvatar({
	spaceName = '',
	size = 'small',
	testId = '',
}: {
	spaceName: string;
	size?: 'small' | 'large';
	isDisabled?: boolean;
	testId?: string;
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
			data-testid={testId}
		>
			{avatarText}
		</div>
	);
}
