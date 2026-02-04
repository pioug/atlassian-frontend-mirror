import React from 'react';

import { token } from '@atlaskit/tokens';

import Card from './token-card-base';

const TokenInformationCodeBlock = `// bold styles
color: token('color.text.inverse'),
backgroundColor: token('color.background.information.bold'),
border: \`1px solid \${token('color.border.information')}\`,
hoverBackgroundColor: token('color.background.information.bold.hovered'),
activeBackgroundColor: token('color.background.information.bold.pressed'),
iconColor: token('color.icon.inverse'),

// default styles
color: token('color.text'),
backgroundColor: token('color.background.information'),
border: \`1px solid \${token('color.border.information')}\`,
hoverBackgroundColor: token('color.background.information.hovered'),
activeBackgroundColor: token('color.background.information.pressed'),
iconColor: token('color.icon.information'),
`;

const informationStyles = {
	bold: {
		color: token('color.text.inverse'),
		backgroundColor: token('color.background.information.bold'),
		border: `1px solid ${token('color.border.information')}`,
		hoverBackgroundColor: token('color.background.information.bold.hovered'),
		activeBackgroundColor: token('color.background.information.bold.pressed'),
		iconColor: token('color.icon.inverse'),
	},
	default: {
		color: token('color.text'),
		backgroundColor: token('color.background.information'),
		border: `1px solid ${token('color.border.information')}`,
		hoverBackgroundColor: token('color.background.information.hovered'),
		activeBackgroundColor: token('color.background.information.pressed'),
		iconColor: token('color.icon.information'),
	},
};

const TokenInformation = (): React.JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ display: 'flex', columnGap: '24px' }}>
			{Object.entries(informationStyles).map(([key, subStyle]) => (
				<Card key={key} tokenSet={subStyle} />
			))}
		</div>
	);
};

const _default_1: {
    example: () => React.JSX.Element;
    code: string;
} = { example: TokenInformation, code: TokenInformationCodeBlock };
export default _default_1;
