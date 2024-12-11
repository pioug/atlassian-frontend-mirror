import React from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { placements } from '@atlaskit/popper';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const placementGridPositions = cssMap({
	'top-start': {
		gridColumn: 2,
		gridRow: 1,
	},
	top: {
		gridColumn: 3,
		gridRow: 1,
	},
	'top-end': {
		gridColumn: 4,
		gridRow: 1,
	},
	'bottom-start': {
		gridColumn: 2,
		gridRow: 5,
	},
	bottom: {
		gridColumn: 3,
		gridRow: 5,
	},
	'bottom-end': {
		gridColumn: 4,
		gridRow: 5,
	},
	'right-start': {
		gridColumn: 5,
		gridRow: 2,
	},
	right: {
		gridColumn: 5,
		gridRow: 3,
	},
	'right-end': {
		gridColumn: 5,
		gridRow: 4,
	},
	'left-start': {
		gridColumn: 1,
		gridRow: 2,
	},
	left: {
		gridColumn: 1,
		gridRow: 3,
	},
	'left-end': {
		gridColumn: 1,
		gridRow: 4,
	},
	'auto-start': {
		gridColumn: 3,
		gridRow: 2,
	},
	auto: {
		gridColumn: 3,
		gridRow: 3,
	},
	'auto-end': {
		gridColumn: 3,
		gridRow: 4,
	},
});

const buttonGridStyles = cssMap({
	root: {
		display: 'grid',
		gap: token('space.100'),
		gridTemplate: 'repeat(5, 1fr) / repeat(5, 1fr)',
		justifyItems: 'stretch',
	},
});

const PositionExample = () => {
	return (
		<Box xcss={buttonGridStyles.root}>
			{placements.map((placement) => (
				<Box key={placement} xcss={placementGridPositions[placement]}>
					<Tooltip position={placement} content={placement}>
						{(tooltipProps) => (
							<Button {...tooltipProps} shouldFitContainer>
								{placement}
							</Button>
						)}
					</Tooltip>
				</Box>
			))}
		</Box>
	);
};

export default PositionExample;
