/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { arrow } from '@atlaskit/top-layer/arrow';
import { Popup, type TPlacementOptions } from '@atlaskit/top-layer/popup';

const styles = cssMap({
	grid: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: token('space.100'),
	},
});

function placementLabel(p: TPlacementOptions): string {
	const axis = p.axis ?? 'block';
	const edge = p.edge ?? 'end';
	const align = p.align ?? 'center';
	return align === 'center' ? `${axis}-${edge}` : `${axis}-${edge} align-${align}`;
}

const placements: TPlacementOptions[] = [
	{ axis: 'block', edge: 'start' },
	{ axis: 'block', edge: 'end' },
	{ axis: 'inline', edge: 'start' },
	{ axis: 'inline', edge: 'end' },
	{ axis: 'block', edge: 'start', align: 'start' },
	{ axis: 'block', edge: 'start', align: 'end' },
	{ axis: 'block', edge: 'end', align: 'start' },
	{ axis: 'block', edge: 'end', align: 'end' },
];

const popoverArrow = arrow();

/**
 * Popup with a CSS arrow that auto-flips when the popup flips.
 *
 * Uses the `clip-path: inset() margin-box` technique via the `arrow()` preset.
 * Arrow pseudo-elements inherit their background from the popup element.
 */
function ArrowDemo({ placement }: { placement: TPlacementOptions }) {
	const label = placementLabel(placement);
	return (
		<Popup placement={placement} onClose={() => {}}>
			<Popup.Trigger>
				<Button>{label}</Button>
			</Popup.Trigger>
			<Popup.Content role="dialog" label={`Arrow popup at ${label}`} arrow={popoverArrow}>
				<Box padding="space.200">
					<Text size="small" weight="medium">
						{label}
					</Text>
				</Box>
			</Popup.Content>
		</Popup>
	);
}

export default function PopoverWithArrowExample() {
	return (
		<Box padding="space.600">
			<div css={styles.grid}>
				{placements.map((p, i) => (
					<ArrowDemo key={i} placement={p} />
				))}
			</div>
		</Box>
	);
}
