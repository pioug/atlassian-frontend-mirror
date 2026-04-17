/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, cssMap, cx, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile';
import { token } from '@atlaskit/tokens';

import { getAvatarText, pickContainerColor, pickTextColor } from './utils';

const typographyByAvatarSize = cssMap({
	small: {
		font: token('font.heading.xsmall'),
	},
	medium: {
		font: token('font.heading.medium'),
	},
});

const styles = cssMap({
	loomAvatar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		boxSizing: 'border-box',
		width: '100%',
		height: '100%',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.tile'),
	},
});

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
	marginTop: token('space.025'),
	marginRight: token('space.025'),
	marginBottom: token('space.025'),
	marginLeft: token('space.025'),
	font: token('font.heading.xsmall'),
});

const largeBoxStyle = css({
	height: '32px',
	width: '32px',
	font: token('font.heading.medium'),
	paddingInline: token('space.025'),
});

export function LoomSpaceAvatar({
	spaceName = '',
	size = 'small',
	testId = '',
}: {
	spaceName: string;
	size?: 'small' | 'medium';
	isDisabled?: boolean;
	testId?: string;
}): JSX.Element {
	const avatarText = getAvatarText(spaceName);
	const containerColor = pickContainerColor(spaceName);
	const textColor = pickTextColor(spaceName);

	if (fg('enable_teams_t26_design_drop_core_experiences')) {
		return (
			<Tile size={size} label="" isInset={false} testId={testId}>
				<Box
					xcss={cx(styles.loomAvatar, typographyByAvatarSize[size])}
					style={{
						backgroundColor: containerColor,
						color: textColor,
					}}
				>
					{avatarText}
				</Box>
			</Tile>
		);
	}

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
