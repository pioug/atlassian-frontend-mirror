/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';
import Tooltip, { type PositionType } from '@atlaskit/tooltip';

const positions: PositionType[] = ['top', 'right', 'bottom', 'left'];

const layoutStyles = css({
	display: 'flex',
	alignItems: 'center',
	gap: token('space.800', '64px'),
	flexDirection: 'column',
	paddingBlockEnd: token('space.800', '64px'),
	paddingBlockStart: token('space.800', '64px'),
	paddingInlineEnd: token('space.800', '64px'),
	paddingInlineStart: token('space.800', '64px'),
});

export default function VrPositionAllExample(): React.JSX.Element {
	return (
		<div css={layoutStyles}>
			{positions.map((position) => (
				<Tooltip
					key={position}
					content={`Tooltip on ${position}`}
					position={position}
					testId={`tooltip-${position}`}
				>
					{(tooltipProps) => (
						<Button {...tooltipProps} testId={`trigger-${position}`}>
							{position}
						</Button>
					)}
				</Tooltip>
			))}
		</div>
	);
}
