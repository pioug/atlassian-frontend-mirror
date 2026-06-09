/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode, useEffect, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popover, type TPlacementOptions } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';

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

function placementLabel(placement: TPlacementOptions): string {
	const axis = placement.axis ?? 'block';
	const edge = placement.edge ?? 'end';
	const align = placement.align ?? 'center';
	return align === 'center' ? `${axis}-${edge}` : `${axis}-${edge} align-${align}`;
}

function VrPopover({ placement }: { placement: TPlacementOptions }) {
	const label = placementLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	useAnchorPosition({ anchorRef: triggerRef, popoverRef, placement });

	// Auto-open the popover on mount so the VR snapshot captures the
	// positioned popover rather than just the closed trigger button.
	useEffect(() => {
		setIsOpen(true);
	}, []);

	return (
		<div css={styles.center}>
			<Fragment>
				<button ref={triggerRef} type="button">
					{label}
				</button>
				<Popover
					ref={popoverRef}
					role="dialog"
					label={`Popover at ${label}`}
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
				>
					<PopoverSurface>
						<Box padding="space.200">
							<Text>{label}</Text>
						</Box>
					</PopoverSurface>
				</Popover>
			</Fragment>
		</div>
	);
}

// Single-axis placements
export function VrBlockStart(): ReactNode {
	return <VrPopover placement={{ axis: 'block', edge: 'start' }} />;
}
export function VrBlockEnd(): ReactNode {
	return <VrPopover placement={{ edge: 'end' }} />;
}
export function VrInlineStart(): ReactNode {
	return <VrPopover placement={{ axis: 'inline', edge: 'start' }} />;
}
export function VrInlineEnd(): ReactNode {
	return <VrPopover placement={{ axis: 'inline', edge: 'end' }} />;
}

// Compound placements
export function VrBlockStartInlineStart(): ReactNode {
	return <VrPopover placement={{ axis: 'block', edge: 'start', align: 'end' }} />;
}
export function VrBlockStartInlineEnd(): ReactNode {
	return <VrPopover placement={{ axis: 'block', edge: 'start', align: 'start' }} />;
}
export function VrBlockEndInlineStart(): ReactNode {
	return <VrPopover placement={{ axis: 'block', edge: 'end', align: 'end' }} />;
}
export function VrBlockEndInlineEnd(): ReactNode {
	return <VrPopover placement={{ axis: 'block', edge: 'end', align: 'start' }} />;
}
export function VrInlineStartBlockStart(): ReactNode {
	return <VrPopover placement={{ axis: 'inline', edge: 'start', align: 'end' }} />;
}
export function VrInlineStartBlockEnd(): ReactNode {
	return <VrPopover placement={{ axis: 'inline', edge: 'start', align: 'start' }} />;
}
export function VrInlineEndBlockStart(): ReactNode {
	return <VrPopover placement={{ axis: 'inline', edge: 'end', align: 'end' }} />;
}
export function VrInlineEndBlockEnd(): ReactNode {
	return <VrPopover placement={{ axis: 'inline', edge: 'end', align: 'start' }} />;
}

export default function VrPopoverPlacements(): ReactNode {
	return <VrBlockEnd />;
}
