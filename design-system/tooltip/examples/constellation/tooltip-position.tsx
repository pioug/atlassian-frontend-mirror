import React from 'react';

import Button from '@atlaskit/button/new';
import { type Placement, placements } from '@atlaskit/popper';
import { Box, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

const placementGridPositions: {
	[placement in Placement]: ReturnType<typeof xcss>;
} = {
	'top-start': xcss({
		gridColumn: 2,
		gridRow: 1,
	}),
	top: xcss({
		gridColumn: 3,
		gridRow: 1,
	}),
	'top-end': xcss({
		gridColumn: 4,
		gridRow: 1,
	}),
	'bottom-start': xcss({
		gridColumn: 2,
		gridRow: 5,
	}),
	bottom: xcss({
		gridColumn: 3,
		gridRow: 5,
	}),
	'bottom-end': xcss({
		gridColumn: 4,
		gridRow: 5,
	}),
	'right-start': xcss({
		gridColumn: 5,
		gridRow: 2,
	}),
	right: xcss({
		gridColumn: 5,
		gridRow: 3,
	}),
	'right-end': xcss({
		gridColumn: 5,
		gridRow: 4,
	}),
	'left-start': xcss({
		gridColumn: 1,
		gridRow: 2,
	}),
	left: xcss({
		gridColumn: 1,
		gridRow: 3,
	}),
	'left-end': xcss({
		gridColumn: 1,
		gridRow: 4,
	}),
	'auto-start': xcss({
		gridColumn: 3,
		gridRow: 2,
	}),
	auto: xcss({
		gridColumn: 3,
		gridRow: 3,
	}),
	'auto-end': xcss({
		gridColumn: 3,
		gridRow: 4,
	}),
};

const buttonGridStyles = xcss({
	display: 'grid',
	gap: 'space.100',
	gridTemplate: 'repeat(5, 1fr) / repeat(5, 1fr)',
	justifyItems: 'stretch',
});

const PositionExample = () => {
	return (
		<Box xcss={buttonGridStyles}>
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
