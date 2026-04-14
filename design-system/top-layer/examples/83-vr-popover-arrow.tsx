/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { arrow } from '@atlaskit/top-layer/arrow';
import { Popup, type TPlacementOptions } from '@atlaskit/top-layer/popup';

const styles = cssMap({
	center: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '200px',
		paddingBlockStart: token('space.1000'),
		paddingInlineEnd: token('space.1000'),
		paddingBlockEnd: token('space.1000'),
		paddingInlineStart: token('space.1000'),
	},
	surface: {
		backgroundColor: token('color.background.neutral.bold'),
	},
});

function placementLabel(placement: TPlacementOptions): string {
	const axis = placement.axis ?? 'block';
	const edge = placement.edge ?? 'end';
	const align = placement.align ?? 'center';
	return align === 'center' ? `${axis}-${edge}` : `${axis}-${edge} align-${align}`;
}

const popoverArrow = arrow();

function VrArrowPopover({ placement }: { placement: TPlacementOptions }) {
	const label = placementLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);

	// Auto-open the popup on mount so the VR snapshot captures the
	// positioned popover with arrow rather than just the closed trigger.
	useEffect(() => {
		triggerRef.current?.click();
	}, []);

	return (
		<div css={styles.center}>
			<Popup placement={placement} onClose={() => {}}>
				<Popup.Trigger>
					<button ref={triggerRef} type="button">
						{label}
					</button>
				</Popup.Trigger>
				<Popup.Content
					role="dialog"
					label={`Arrow popup at ${label}`}
					arrow={popoverArrow}
					xcss={styles.surface}
				>
					<Box padding="space.200">
						<Text size="small" weight="medium" color="color.text.inverse">
							{label}
						</Text>
					</Box>
				</Popup.Content>
			</Popup>
		</div>
	);
}

// Single-axis placements
export function VrArrowBlockStart(): JSX.Element {
	return <VrArrowPopover placement={{ axis: 'block', edge: 'start' }} />;
}
export function VrArrowBlockEnd(): JSX.Element {
	return <VrArrowPopover placement={{ edge: 'end' }} />;
}
export function VrArrowInlineStart(): JSX.Element {
	return <VrArrowPopover placement={{ axis: 'inline', edge: 'start' }} />;
}
export function VrArrowInlineEnd(): JSX.Element {
	return <VrArrowPopover placement={{ axis: 'inline', edge: 'end' }} />;
}

// Compound placements
export function VrArrowBlockEndAlignStart(): JSX.Element {
	return <VrArrowPopover placement={{ axis: 'block', edge: 'end', align: 'start' }} />;
}
export function VrArrowBlockEndAlignEnd(): JSX.Element {
	return <VrArrowPopover placement={{ axis: 'block', edge: 'end', align: 'end' }} />;
}
export function VrArrowBlockStartAlignStart(): JSX.Element {
	return <VrArrowPopover placement={{ axis: 'block', edge: 'start', align: 'start' }} />;
}
export function VrArrowBlockStartAlignEnd(): JSX.Element {
	return <VrArrowPopover placement={{ axis: 'block', edge: 'start', align: 'end' }} />;
}
export function VrArrowInlineEndAlignStart(): JSX.Element {
	return <VrArrowPopover placement={{ axis: 'inline', edge: 'end', align: 'start' }} />;
}
export function VrArrowInlineEndAlignEnd(): JSX.Element {
	return <VrArrowPopover placement={{ axis: 'inline', edge: 'end', align: 'end' }} />;
}
export function VrArrowInlineStartAlignStart(): JSX.Element {
	return <VrArrowPopover placement={{ axis: 'inline', edge: 'start', align: 'start' }} />;
}
export function VrArrowInlineStartAlignEnd(): JSX.Element {
	return <VrArrowPopover placement={{ axis: 'inline', edge: 'start', align: 'end' }} />;
}

export default function VrPopoverArrow(): JSX.Element {
	return <VrArrowBlockEnd />;
}
