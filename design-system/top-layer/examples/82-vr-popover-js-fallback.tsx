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

function VrPopupFallback({ placement }: { placement: TPlacementOptions }) {
	const label = placementLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement,
		forceFallbackPositioning: true,
	});

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
					label={`JS fallback ${label}`}
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
				>
					<PopoverSurface>
						<Box padding="space.200">
							<Text>{label} (JS fallback)</Text>
						</Box>
					</PopoverSurface>
				</Popover>
			</Fragment>
		</div>
	);
}

export function VrJsFallbackBlockEnd(): ReactNode {
	return <VrPopupFallback placement={{ edge: 'end' }} />;
}

export function VrJsFallbackInlineEnd(): ReactNode {
	return <VrPopupFallback placement={{ axis: 'inline', edge: 'end' }} />;
}

export function VrJsFallbackBlockStart(): ReactNode {
	return <VrPopupFallback placement={{ edge: 'start' }} />;
}

export function VrJsFallbackInlineStart(): ReactNode {
	return <VrPopupFallback placement={{ axis: 'inline', edge: 'start' }} />;
}

export function VrJsFallbackBlockEndAlignStart(): ReactNode {
	return <VrPopupFallback placement={{ axis: 'block', edge: 'end', align: 'start' }} />;
}

export function VrJsFallbackBlockEndAlignEnd(): ReactNode {
	return <VrPopupFallback placement={{ axis: 'block', edge: 'end', align: 'end' }} />;
}

export function VrJsFallbackInlineEndAlignStart(): ReactNode {
	return <VrPopupFallback placement={{ axis: 'inline', edge: 'end', align: 'start' }} />;
}

export function VrJsFallbackInlineEndAlignEnd(): ReactNode {
	return <VrPopupFallback placement={{ axis: 'inline', edge: 'end', align: 'end' }} />;
}

export function VrJsFallbackBlockStartAlignStart(): ReactNode {
	return <VrPopupFallback placement={{ axis: 'block', edge: 'start', align: 'start' }} />;
}

export function VrJsFallbackBlockStartAlignEnd(): ReactNode {
	return <VrPopupFallback placement={{ axis: 'block', edge: 'start', align: 'end' }} />;
}

export function VrJsFallbackInlineStartAlignStart(): ReactNode {
	return <VrPopupFallback placement={{ axis: 'inline', edge: 'start', align: 'start' }} />;
}

export function VrJsFallbackInlineStartAlignEnd(): ReactNode {
	return <VrPopupFallback placement={{ axis: 'inline', edge: 'start', align: 'end' }} />;
}

export default function VrPopupJsFallback(): ReactNode {
	return <VrJsFallbackBlockEnd />;
}
