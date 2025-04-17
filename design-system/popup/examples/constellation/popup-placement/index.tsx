/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { type Placement, placements } from '@atlaskit/popper';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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

const contentStyles = css({
	maxWidth: '220px',
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const buttonGridStyles = css({
	display: 'grid',
	gap: token('space.100'),
	gridTemplate: 'repeat(5, 1fr) / repeat(5, 1fr)',
	justifyItems: 'stretch',
});

const PopupPlacementExample = () => {
	const [openPlacement, setOpenPlacement] = useState<Placement | null>(null);

	return (
		<div css={buttonGridStyles}>
			{placements.map((placement) => {
				const isOpen = openPlacement === placement;

				return (
					<Popup
						key={placement}
						placement={placement}
						isOpen={isOpen}
						onClose={() => {
							if (isOpen) {
								setOpenPlacement(null);
							}
						}}
						content={() => (
							<div css={contentStyles}>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquam massa ac risus
								scelerisque, in iaculis magna semper. Phasellus sagittis congue elit, non suscipit
								nulla rhoncus vitae.
							</div>
						)}
						trigger={(triggerProps) => (
							<Box xcss={placementGridPositions[placement]}>
								<Button
									{...triggerProps}
									shouldFitContainer
									isSelected={isOpen}
									onClick={() => setOpenPlacement(isOpen ? null : placement)}
								>
									{placement}
								</Button>
							</Box>
						)}
					/>
				);
			})}
		</div>
	);
};

export default PopupPlacementExample;
