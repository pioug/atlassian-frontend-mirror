/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import { type PositionTypeBase } from '@atlaskit/tooltip/types';

/**
 * All valid `mousePosition` placements for `position="mouse"` tooltips.
 */
const mousePositions: PositionTypeBase[] = [
	'right-start',
	'right',
	'right-end',
	'left-start',
	'left',
	'left-end',
	'top-start',
	'top',
	'top-end',
	'bottom-start',
	'bottom',
	'bottom-end',
];

const layoutStyles = css({
	display: 'flex',
	alignItems: 'center',
	gap: token('space.300'),
	flexDirection: 'column',
	paddingBlock: token('space.600'),
	paddingInline: token('space.600'),
});

export default function VrPositionMouseAllExample(): React.JSX.Element {
	return (
		<div css={layoutStyles}>
			{mousePositions.map((mousePosition) => (
				<Tooltip
					key={mousePosition}
					content={`Tooltip at mouse position: ${mousePosition}`}
					position="mouse"
					mousePosition={mousePosition}
					testId={`tooltip-mouse-${mousePosition}`}
				>
					<Button testId={`trigger-mouse-${mousePosition}`}>Hover me ({mousePosition})</Button>
				</Tooltip>
			))}
		</div>
	);
}
