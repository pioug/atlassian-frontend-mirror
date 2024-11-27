import React from 'react';

import { token } from '@atlaskit/tokens';

import Card from './token-card-base';

export const TokenWarningCodeBlock = `// bold styles
color: token('color.text.warning.inverse'),
backgroundColor: token('color.background.warning.bold'),
border: \`1px solid \${token('color.border.warning')}\`,
hoverBackgroundColor: token('color.background.warning.bold.hovered'),
activeBackgroundColor: token('color.background.warning.bold.pressed'),
iconColor: token('color.icon.warning.inverse'),

// default styles
color: token('color.text'),
backgroundColor: token('color.background.warning'),
border: \`1px solid \${token('color.border.warning')}\`,
hoverBackgroundColor: token('color.background.warning.hovered'),
activeBackgroundColor: token('color.background.warning.pressed'),
iconColor: token('color.icon.warning'),
`;

const warningStyles = {
	bold: {
		color: token('color.text.warning.inverse'),
		backgroundColor: token('color.background.warning.bold'),
		border: `1px solid ${token('color.border.warning')}`,
		hoverBackgroundColor: token('color.background.warning.bold.hovered'),
		activeBackgroundColor: token('color.background.warning.bold.pressed'),
		iconColor: token('color.icon.warning.inverse'),
	},
	default: {
		color: token('color.text'),
		backgroundColor: token('color.background.warning'),
		border: `1px solid ${token('color.border.warning')}`,
		hoverBackgroundColor: token('color.background.warning.hovered'),
		activeBackgroundColor: token('color.background.warning.pressed'),
		iconColor: token('color.icon.warning'),
	},
};

export const TokenWarning = () => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ display: 'flex', columnGap: '24px' }}>
			{Object.entries(warningStyles).map(([key, subStyle]) => (
				<Card key={key} tokenSet={subStyle} />
			))}
		</div>
	);
};

export default { example: TokenWarning, code: TokenWarningCodeBlock };
