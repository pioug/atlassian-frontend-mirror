/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { cx } from '@atlaskit/css';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { type CSSToken, token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingBlockStart: token('space.200'),
	},
	baseBox: {
		backgroundColor: token('elevation.surface.raised'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		width: '2.5rem',
		height: '2.5rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
	radiusBox: {
		borderWidth: token('border.width.selected'),
	},
	widthBox: {
		backgroundColor: token('elevation.surface.raised'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		width: '2.5rem',
		height: '2.5rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

const RadiusBox = ({ radius }: { radius: CSSToken }) => (
	<Box xcss={cx(styles.baseBox, styles.radiusBox)} style={{ borderRadius: radius }} />
);

const WidthBox = ({ borderWidth }: { borderWidth: CSSToken }) => (
	<Box xcss={cx(styles.baseBox, styles.widthBox)} style={{ borderWidth: borderWidth }} />
);

export default (): JSX.Element => {
	return (
		<div data-testid="shape">
			<h1>Shape scale</h1>
			<Stack space="space.200" xcss={styles.container}>
				<Inline space="space.100" alignBlock="center">
					<Text weight="bold">Border radius</Text>
					<RadiusBox radius={token('radius.xsmall')} />
					<RadiusBox radius={token('radius.small')} />
					<RadiusBox radius={token('radius.medium')} />
					<RadiusBox radius={token('radius.large')} />
					<RadiusBox radius={token('radius.xlarge')} />
					<RadiusBox radius={token('radius.xxlarge')} />
					<RadiusBox radius={token('radius.full')} />
					<RadiusBox radius={token('radius.tile')} />
				</Inline>
				<Inline space="space.100" alignBlock="center">
					<Text weight="bold">Border width</Text>
					<WidthBox borderWidth={token('border.width')} />
					<WidthBox borderWidth={token('border.width.selected')} />
					<WidthBox borderWidth={token('border.width.focused')} />
				</Inline>
			</Stack>
		</div>
	);
};
