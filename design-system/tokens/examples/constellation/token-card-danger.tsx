import React from 'react';

import { token } from '@atlaskit/tokens';

import Card from './token-card-base';

const TokenDangerCodeBlock = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.danger.bold'),
border: \`1px solid \${token('color.border.danger')}\`,
hoverBackgroundColor: token('color.background.danger.bold.hovered'),
activeBackgroundColor: token('color.background.danger.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text'),
backgroundColor: token('color.background.danger'),
border: \`1px solid \${token('color.border.danger')}\`,
hoverBackgroundColor: token('color.background.danger.hovered'),
activeBackgroundColor: token('color.background.danger.pressed'),
iconColor: token('color.icon.danger'),
`;

const dangerStyles = {
	bold: {
		color: token('color.text.inverse'),
		backgroundColor: token('color.background.danger.bold'),
		border: `1px solid ${token('color.border.danger')}`,
		hoverBackgroundColor: token('color.background.danger.bold.hovered'),
		activeBackgroundColor: token('color.background.danger.bold.pressed'),
		iconColor: token('color.icon.inverse'),
	},
	default: {
		color: token('color.text'),
		backgroundColor: token('color.background.danger'),
		border: `1px solid ${token('color.border.danger')}`,
		hoverBackgroundColor: token('color.background.danger.hovered'),
		activeBackgroundColor: token('color.background.danger.pressed'),
		iconColor: token('color.icon.danger'),
	},
};

const TokenDanger = (): React.JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ display: 'flex', columnGap: '24px' }}>
			{Object.entries(dangerStyles).map(([key, subStyle]) => (
				<Card key={key} tokenSet={subStyle} />
			))}
		</div>
	);
};

const _default_1: {
    example: () => React.JSX.Element;
    code: string;
} = { example: TokenDanger, code: TokenDangerCodeBlock };
export default _default_1;
