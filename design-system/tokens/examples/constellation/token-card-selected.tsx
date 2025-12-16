import React from 'react';

import { token } from '@atlaskit/tokens';

import Card from './token-card-base';

export const TokenSelectedCodeBlock = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.selected.bold'),
border: \`1px solid \${token('color.border.selected')}\`,
hoverBackgroundColor: token('color.background.selected.bold.hovered'),
activeBackgroundColor: token('color.background.selected.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text'),
backgroundColor: token('color.background.selected'),
border: \`1px solid \${token('color.border.selected')}\`,
hoverBackgroundColor: token('color.background.selected.hovered'),
activeBackgroundColor: token('color.background.selected.pressed'),
iconColor: token('color.icon.selected'),
`;

const selectedStyles = {
	bold: {
		color: token('color.text.inverse'),
		backgroundColor: token('color.background.selected.bold'),
		border: `1px solid ${token('color.border.selected')}`,
		hoverBackgroundColor: token('color.background.selected.bold.hovered'),
		activeBackgroundColor: token('color.background.selected.bold.pressed'),
		iconColor: token('color.icon.inverse'),
	},
	default: {
		color: token('color.text'),
		backgroundColor: token('color.background.selected'),
		border: `1px solid ${token('color.border.selected')}`,
		hoverBackgroundColor: token('color.background.selected.hovered'),
		activeBackgroundColor: token('color.background.selected.pressed'),
		iconColor: token('color.icon.selected'),
	},
};

export const TokenSelected = (): React.JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ display: 'flex', columnGap: '24px' }}>
			{Object.entries(selectedStyles).map(([key, subStyle]) => (
				<Card key={key} tokenSet={subStyle} />
			))}
		</div>
	);
};

export default { example: TokenSelected, code: TokenSelectedCodeBlock };
