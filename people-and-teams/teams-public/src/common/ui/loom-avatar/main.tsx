/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import Tile from '@atlaskit/tile/tile';
import { token } from '@atlaskit/tokens';

import { getAvatarText } from './getAvatarText';
import { pickContainerColor } from './pickContainerColor';
import { pickTextColor } from './pickTextColor';

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
