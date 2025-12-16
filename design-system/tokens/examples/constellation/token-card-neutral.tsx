import React from 'react';

import { token } from '@atlaskit/tokens';

import Card from './token-card-base';

export const TokenNeutralCodeBlock = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.neutral.bold'),
border: \`1px solid \${token('color.border')}\`,
hoverBackgroundColor: token('color.background.neutral.bold.hovered'),
activeBackgroundColor: token('color.background.neutral.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text'),
backgroundColor: token('color.background.neutral'),
border: \`1px solid \${token('color.border')}\`,
hoverBackgroundColor: token('color.background.neutral.hovered'),
activeBackgroundColor: token('color.background.neutral.pressed'),
iconColor: token('color.icon'),

// subtle styles
color: token('color.text'),
backgroundColor: token('color.background.neutral.subtle'),
border: \`1px solid \${token('color.border')}\`,
hoverBackgroundColor: token('color.background.neutral.subtle.hovered'),
activeBackgroundColor: token('color.background.neutral.subtle.pressed'),
iconColor: token('color.icon'),
`;

const neutralStyles = {
	bold: {
		color: token('color.text.inverse'),
		backgroundColor: token('color.background.neutral.bold'),
		border: `1px solid ${token('color.border')}`,
		hoverBackgroundColor: token('color.background.neutral.bold.hovered'),
		activeBackgroundColor: token('color.background.neutral.bold.pressed'),
		iconColor: token('color.icon.inverse'),
	},
	default: {
		color: token('color.text'),
		backgroundColor: token('color.background.neutral'),
		border: `1px solid ${token('color.border')}`,
		hoverBackgroundColor: token('color.background.neutral.hovered'),
		activeBackgroundColor: token('color.background.neutral.pressed'),
		iconColor: token('color.icon'),
	},
	subtle: {
		color: token('color.text'),
		backgroundColor: token('color.background.neutral.subtle'),
		border: `1px solid ${token('color.border')}`,
		hoverBackgroundColor: token('color.background.neutral.subtle.hovered'),
		activeBackgroundColor: token('color.background.neutral.subtle.pressed'),
		iconColor: token('color.icon'),
	},
};

export const TokenNeutral = (): React.JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ display: 'flex', columnGap: '24px' }}>
			{Object.entries(neutralStyles).map(([key, subStyle]) => (
				<Card key={key} tokenSet={subStyle} />
			))}
		</div>
	);
};

export default { example: TokenNeutral, code: TokenNeutralCodeBlock };
