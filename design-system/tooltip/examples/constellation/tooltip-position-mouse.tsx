import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

import { type PositionType } from '../../src/types';

const VALID_POSITIONS: PositionType[] = ['mouse', 'top', 'right', 'bottom', 'left'];

const PositionMouseExample = () => {
	const [position, setPosition] = useState(0);
	const positionText = VALID_POSITIONS[position];

	return (
		<Tooltip content={positionText} position={positionText}>
			{(tooltipProps) => (
				<Button
					{...tooltipProps}
					appearance="primary"
					onClick={() => {
						setPosition((position + 1) % VALID_POSITIONS.length);
					}}
				>
					Hover over me
				</Button>
			)}
		</Tooltip>
	);
};

export default PositionMouseExample;
