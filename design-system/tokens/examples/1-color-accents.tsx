/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import type { NewCoreIconProps } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';

import { useVrGlobalTheme } from './utils/use-vr-global-theme';

const variantStyles = {
	red: {
		subtlest: {
			color: token('color.text.accent.red'),
			backgroundColor: token('color.background.accent.red.subtlest'),
			border: `1px solid ${token('color.border.accent.red')}`,
			iconColor: token('color.icon.accent.red'),
		},
		subtler: {
			color: token('color.text.accent.red'),
			backgroundColor: token('color.background.accent.red.subtler'),
			border: `1px solid ${token('color.border.accent.red')}`,
			iconColor: token('color.icon.accent.red'),
		},
		subtle: {
			color: token('color.text.accent.red.bolder'),
			backgroundColor: token('color.background.accent.red.subtle'),
			border: `1px solid ${token('color.border.accent.red')}`,
			iconColor: 'transparent',
		},
		bolder: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.accent.red.bolder'),
			border: `1px solid ${token('color.border.accent.red')}`,
			iconColor: token('color.icon.inverse'),
		},
	},
	orange: {
		subtlest: {
			color: token('color.text.accent.orange'),
			backgroundColor: token('color.background.accent.orange.subtlest'),
			border: `1px solid ${token('color.border.accent.orange')}`,
			iconColor: token('color.icon.accent.orange'),
		},
		subtler: {
			color: token('color.text.accent.orange'),
			backgroundColor: token('color.background.accent.orange.subtler'),
			border: `1px solid ${token('color.border.accent.orange')}`,
			iconColor: token('color.icon.accent.orange'),
		},
		subtle: {
			color: token('color.text.accent.orange.bolder'),
			backgroundColor: token('color.background.accent.orange.subtle'),
			border: `1px solid ${token('color.border.accent.orange')}`,
			iconColor: 'transparent',
		},
		bolder: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.accent.orange.bolder'),
			border: `1px solid ${token('color.border.accent.orange')}`,
			iconColor: token('color.icon.inverse'),
		},
	},
	yellow: {
		subtlest: {
			color: token('color.text.accent.yellow'),
			backgroundColor: token('color.background.accent.yellow.subtlest'),
			border: `1px solid ${token('color.border.accent.yellow')}`,
			iconColor: token('color.icon.accent.yellow'),
		},
		subtler: {
			color: token('color.text.accent.yellow'),
			backgroundColor: token('color.background.accent.yellow.subtler'),
			border: `1px solid ${token('color.border.accent.yellow')}`,
			iconColor: token('color.icon.accent.yellow'),
		},
		subtle: {
			color: token('color.text.accent.yellow.bolder'),
			backgroundColor: token('color.background.accent.yellow.subtle'),
			border: `1px solid ${token('color.border.accent.yellow')}`,
			iconColor: 'transparent',
		},
		bolder: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.accent.yellow.bolder'),
			border: `1px solid ${token('color.border.accent.yellow')}`,
			iconColor: token('color.icon.inverse'),
		},
	},
	lime: {
		subtlest: {
			color: token('color.text.accent.lime'),
			backgroundColor: token('color.background.accent.lime.subtlest'),
			border: `1px solid ${token('color.border.accent.lime')}`,
			iconColor: token('color.icon.accent.lime'),
		},
		subtler: {
			color: token('color.text.accent.lime'),
			backgroundColor: token('color.background.accent.lime.subtler'),
			border: `1px solid ${token('color.border.accent.lime')}`,
			iconColor: token('color.icon.accent.lime'),
		},
		subtle: {
			color: token('color.text.accent.lime.bolder'),
			backgroundColor: token('color.background.accent.lime.subtle'),
			border: `1px solid ${token('color.border.accent.lime')}`,
			iconColor: 'transparent',
		},
		bolder: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.accent.lime.bolder'),
			border: `1px solid ${token('color.border.accent.lime')}`,
			iconColor: token('color.icon.inverse'),
		},
	},
	green: {
		subtlest: {
			color: token('color.text.accent.green'),
			backgroundColor: token('color.background.accent.green.subtlest'),
			border: `1px solid ${token('color.border.accent.green')}`,
			iconColor: token('color.icon.accent.green'),
		},
		subtler: {
			color: token('color.text.accent.green'),
			backgroundColor: token('color.background.accent.green.subtler'),
			border: `1px solid ${token('color.border.accent.green')}`,
			iconColor: token('color.icon.accent.green'),
		},
		subtle: {
			color: token('color.text.accent.green.bolder'),
			backgroundColor: token('color.background.accent.green.subtle'),
			border: `1px solid ${token('color.border.accent.green')}`,
			iconColor: 'transparent',
		},
		bolder: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.accent.green.bolder'),
			border: `1px solid ${token('color.border.accent.green')}`,
			iconColor: token('color.icon.inverse'),
		},
	},
	teal: {
		subtlest: {
			color: token('color.text.accent.teal'),
			backgroundColor: token('color.background.accent.teal.subtlest'),
			border: `1px solid ${token('color.border.accent.teal')}`,
			iconColor: token('color.icon.accent.teal'),
		},
		subtler: {
			color: token('color.text.accent.teal'),
			backgroundColor: token('color.background.accent.teal.subtler'),
			border: `1px solid ${token('color.border.accent.teal')}`,
			iconColor: token('color.icon.accent.teal'),
		},
		subtle: {
			color: token('color.text.accent.teal.bolder'),
			backgroundColor: token('color.background.accent.teal.subtle'),
			border: `1px solid ${token('color.border.accent.teal')}`,
			iconColor: 'transparent',
		},
		bolder: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.accent.teal.bolder'),
			border: `1px solid ${token('color.border.accent.teal')}`,
			iconColor: token('color.icon.inverse'),
		},
	},
	blue: {
		subtlest: {
			color: token('color.text.accent.blue'),
			backgroundColor: token('color.background.accent.blue.subtlest'),
			border: `1px solid ${token('color.border.accent.blue')}`,
			iconColor: token('color.icon.accent.blue'),
		},
		subtler: {
			color: token('color.text.accent.blue'),
			backgroundColor: token('color.background.accent.blue.subtler'),
			border: `1px solid ${token('color.border.accent.blue')}`,
			iconColor: token('color.icon.accent.blue'),
		},
		subtle: {
			color: token('color.text.accent.blue.bolder'),
			backgroundColor: token('color.background.accent.blue.subtle'),
			border: `1px solid ${token('color.border.accent.blue')}`,
			iconColor: 'transparent',
		},
		bolder: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.accent.blue.bolder'),
			border: `1px solid ${token('color.border.accent.blue')}`,
			iconColor: token('color.icon.inverse'),
		},
	},
	purple: {
		subtlest: {
			color: token('color.text.accent.purple'),
			backgroundColor: token('color.background.accent.purple.subtlest'),
			border: `1px solid ${token('color.border.accent.purple')}`,
			iconColor: token('color.icon.accent.purple'),
		},
		subtler: {
			color: token('color.text.accent.purple'),
			backgroundColor: token('color.background.accent.purple.subtler'),
			border: `1px solid ${token('color.border.accent.purple')}`,
			iconColor: token('color.icon.accent.purple'),
		},
		subtle: {
			color: token('color.text.accent.purple.bolder'),
			backgroundColor: token('color.background.accent.purple.subtle'),
			border: `1px solid ${token('color.border.accent.purple')}`,
			iconColor: 'transparent',
		},
		bolder: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.accent.purple.bolder'),
			border: `1px solid ${token('color.border.accent.purple')}`,
			iconColor: token('color.icon.inverse'),
		},
	},
	magenta: {
		subtlest: {
			color: token('color.text.accent.magenta'),
			backgroundColor: token('color.background.accent.magenta.subtlest'),
			border: `1px solid ${token('color.border.accent.magenta')}`,
			iconColor: token('color.icon.accent.magenta'),
		},
		subtler: {
			color: token('color.text.accent.magenta'),
			backgroundColor: token('color.background.accent.magenta.subtler'),
			border: `1px solid ${token('color.border.accent.magenta')}`,
			iconColor: token('color.icon.accent.magenta'),
		},
		subtle: {
			color: token('color.text.accent.magenta.bolder'),
			backgroundColor: token('color.background.accent.magenta.subtle'),
			border: `1px solid ${token('color.border.accent.magenta')}`,
			iconColor: 'transparent',
		},
		bolder: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.accent.magenta.bolder'),
			border: `1px solid ${token('color.border.accent.magenta')}`,
			iconColor: token('color.icon.inverse'),
		},
	},
	gray: {
		subtlest: {
			color: token('color.text.accent.gray'),
			backgroundColor: token('color.background.accent.gray.subtlest'),
			border: `1px solid ${token('color.border.accent.gray')}`,
			iconColor: token('color.icon.accent.gray'),
		},
		subtler: {
			color: token('color.text.accent.gray'),
			backgroundColor: token('color.background.accent.gray.subtler'),
			border: `1px solid ${token('color.border.accent.gray')}`,
			iconColor: token('color.icon.accent.gray'),
		},
		subtle: {
			color: token('color.text.accent.gray.bolder'),
			backgroundColor: token('color.background.accent.gray.subtle'),
			border: `1px solid ${token('color.border.accent.gray')}`,
			iconColor: 'transparent',
		},
		bolder: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.accent.gray.bolder'),
			border: `1px solid ${token('color.border.accent.gray')}`,
			iconColor: token('color.icon.inverse'),
		},
	},
};

const styles = cssMap({
	container: {
		margin: '2em',
	},
	row: {
		display: 'flex',
		gap: '1em',
	},
	box: {
		display: 'flex',
		boxSizing: 'border-box',
		width: '100%',
		maxWidth: '200px',
		minHeight: '100px',
		padding: '1em',
		alignItems: 'center',
		borderRadius: token('radius.small'),
		marginBlockStart: '1em',
		textAlign: 'left',
		'&:hover': {
			cursor: 'pointer',
		},
	},
});

const Box = ({ text, style }: { text: string; style: Record<string, string> }) => (
	<button
		type="button"
		css={styles.box}
		style={{
			backgroundColor: style.backgroundColor,
			border: style.border,
			color: style.color,
		}}
	>
		<StarStarredIcon
			label="Star icon"
			color={style.iconColor as NewCoreIconProps['color']}
			spacing="spacious"
		/>
		{text}
	</button>
);

export default () => {
	useVrGlobalTheme();

	return (
		<div css={styles.container}>
			<h2>Accent tokens</h2>
			<p>
				For use with user-generated colors, graphs/charts and when there is no meaning tied to the
				color.
			</p>
			{Object.entries(variantStyles).map(([key, subVariantStyles]) => (
				<div key={key} css={styles.row}>
					{Object.entries(subVariantStyles).map(([subKey, styles]) => (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						<Box key={key + subKey} style={styles} text={`${key}.${subKey}`} />
					))}
				</div>
			))}
		</div>
	);
};
