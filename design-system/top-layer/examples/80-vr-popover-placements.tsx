/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popup, type TPlacementOptions } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

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
});

function placementLabel(p: TPlacementOptions): string {
	const axis = p.axis ?? 'block';
	const edge = p.edge ?? 'end';
	const align = p.align ?? 'center';
	return align === 'center' ? `${axis}-${edge}` : `${axis}-${edge} align-${align}`;
}

function VrPopover({ placement }: { placement: TPlacementOptions }) {
	const label = placementLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);

	// Auto-open the popup on mount so the VR snapshot captures the
	// positioned popover rather than just the closed trigger button.
	useEffect(() => {
		triggerRef.current?.click();
	}, []);

	return (
		<div css={styles.center}>
			<Popup placement={placement} onClose={() => {}}>
				<Popup.Trigger>
					<button ref={triggerRef} type="button">{label}</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label={`Popup at ${label}`}>
					<PopupSurface>
						<Box padding="space.200">
							<Text>{label}</Text>
						</Box>
					</PopupSurface>
				</Popup.Content>
			</Popup>
		</div>
	);
}

// Single-axis placements
export function VrBlockStart() {
	return <VrPopover placement={{ axis: 'block', edge: 'start' }} />;
}
export function VrBlockEnd() {
	return <VrPopover placement={{ edge: 'end' }} />;
}
export function VrInlineStart() {
	return <VrPopover placement={{ axis: 'inline', edge: 'start' }} />;
}
export function VrInlineEnd() {
	return <VrPopover placement={{ axis: 'inline', edge: 'end' }} />;
}

// Compound placements
// Note: Function names preserved for VR snapshot references.
// Old string names used CSS span-direction; new objects use visual alignment.
export function VrBlockStartInlineStart() {
	return <VrPopover placement={{ axis: 'block', edge: 'start', align: 'end' }} />;
}
export function VrBlockStartInlineEnd() {
	return <VrPopover placement={{ axis: 'block', edge: 'start', align: 'start' }} />;
}
export function VrBlockEndInlineStart() {
	return <VrPopover placement={{ axis: 'block', edge: 'end', align: 'end' }} />;
}
export function VrBlockEndInlineEnd() {
	return <VrPopover placement={{ axis: 'block', edge: 'end', align: 'start' }} />;
}
export function VrInlineStartBlockStart() {
	return <VrPopover placement={{ axis: 'inline', edge: 'start', align: 'end' }} />;
}
export function VrInlineStartBlockEnd() {
	return <VrPopover placement={{ axis: 'inline', edge: 'start', align: 'start' }} />;
}
export function VrInlineEndBlockStart() {
	return <VrPopover placement={{ axis: 'inline', edge: 'end', align: 'end' }} />;
}
export function VrInlineEndBlockEnd() {
	return <VrPopover placement={{ axis: 'inline', edge: 'end', align: 'start' }} />;
}

export default function VrPopoverPlacements() {
	return <VrBlockEnd />;
}
