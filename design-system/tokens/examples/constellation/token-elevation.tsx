import React from 'react';

import { token } from '@atlaskit/tokens';

import Card from './token-card-base';

export const TokenElevationCodeBlock = `// Sunken
label: 'Sunken',
backgroundColor: token('elevation.surface.sunken'),

// Default
label: 'Default',
backgroundColor: token('elevation.surface'),
border: \`1px solid \${token('color.border')}\`,

// Raised
backgroundColor: token('elevation.surface.raised'),
shadow: token('elevation.shadow.raised'),

// Overlay
backgroundColor: token('elevation.surface.overlay'),
shadow: token('elevation.shadow.overlay'),
`;

const elevationStyles = {
	sunken: {
		label: 'Sunken',
		backgroundColor: token('elevation.surface.sunken'),
		shadow: 'none',
	},
	default: {
		label: 'Default',
		border: `1px solid ${token('color.border')}`,
		backgroundColor: token('elevation.surface'),
		shadow: 'none',
	},
	raised: {
		label: 'Raised',
		backgroundColor: token('elevation.surface.raised'),
		shadow: token('elevation.shadow.raised'),
	},
	overlay: {
		label: 'Overlay',
		backgroundColor: token('elevation.surface.overlay'),
		shadow: token('elevation.shadow.overlay'),
	},
};

export const TokenElevation = (): React.JSX.Element => {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'flex',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				gap: '24px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				flexWrap: 'wrap',
			}}
		>
			{Object.entries(elevationStyles).map(([key, subStyle]) => (
				<Card key={key} tokenSet={subStyle} />
			))}
		</div>
	);
};

const _default_1: {
	example: () => React.JSX.Element;
	code: string;
} = { example: TokenElevation, code: TokenElevationCodeBlock };
export default _default_1;
