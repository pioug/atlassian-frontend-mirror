/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { Box, Inline } from '@atlaskit/primitives/compiled';
import { type CSSToken, token } from '@atlaskit/tokens';

const styles = cssMap({
	radiusBox: {
		borderWidth: token('border.width', '1px'),
		borderColor: token('color.border', '#091e4221'),
		borderStyle: 'solid',
		width: '2.5rem',
		height: '2.5rem',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

const RadiusBox = ({ radius }: { radius: CSSToken }) => (
	<Box xcss={styles.radiusBox} style={{ borderRadius: radius }} />
);

export default () => {
	return (
		<div data-testid="shape">
			<h1>Shape scale</h1>
			<Inline space="space.100" alignBlock="end">
				<RadiusBox radius={token('border.radius.050', '2px')} />
				<RadiusBox radius={token('border.radius.100', '4px')} />
				<RadiusBox radius={token('border.radius.200', '8px')} />
				<RadiusBox radius={token('border.radius.300', '12px')} />
				<RadiusBox radius={token('border.radius.400', '16px')} />
				<RadiusBox radius={token('border.radius.circle', '100rem')} />
			</Inline>
		</div>
	);
};
