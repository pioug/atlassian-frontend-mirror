import React from 'react';

import { token } from '@atlaskit/tokens';

import Card from './token-card-base';

const TokenDiscoveryCodeBlock = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.discovery.bold'),
border: \`1px solid \${token('color.border.discovery')}\`,
hoverBackgroundColor: token('color.background.discovery.bold.hovered'),
activeBackgroundColor: token('color.background.discovery.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text'),
backgroundColor: token('color.background.discovery'),
border: \`1px solid \${token('color.border.discovery')}\`,
hoverBackgroundColor: token('color.background.discovery.hovered'),
activeBackgroundColor: token('color.background.discovery.pressed'),
iconColor: token('color.icon.discovery'),
`;

const discoveryStyles = {
	bold: {
		color: token('color.text.inverse'),
		backgroundColor: token('color.background.discovery.bold'),
		border: `1px solid ${token('color.border.discovery')}`,
		hoverBackgroundColor: token('color.background.discovery.bold.hovered'),
		activeBackgroundColor: token('color.background.discovery.bold.pressed'),
		iconColor: token('color.icon.inverse'),
	},
	default: {
		color: token('color.text'),
		backgroundColor: token('color.background.discovery'),
		border: `1px solid ${token('color.border.discovery')}`,
		hoverBackgroundColor: token('color.background.discovery.hovered'),
		activeBackgroundColor: token('color.background.discovery.pressed'),
		iconColor: token('color.icon.discovery'),
	},
};

const TokenDiscovery = (): React.JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ display: 'flex', columnGap: '24px' }}>
			{Object.entries(discoveryStyles).map(([key, subStyle]) => (
				<Card key={key} tokenSet={subStyle} />
			))}
		</div>
	);
};

export default { example: TokenDiscovery, code: TokenDiscoveryCodeBlock };
