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

function VrPopupFallback({ placement }: { placement: TPlacementOptions }) {
	const label = placementLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);

	// Auto-open the popup on mount so the VR snapshot captures the
	// positioned popover rather than just the closed trigger button.
	useEffect(() => {
		triggerRef.current?.click();
	}, []);

	return (
		<div css={styles.center}>
			<Popup placement={placement} onClose={() => {}} forceFallbackPositioning>
				<Popup.Trigger>
					<button ref={triggerRef} type="button">
						{label}
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label={`JS fallback ${label}`}>
					<PopupSurface>
						<Box padding="space.200">
							<Text>{label} (JS fallback)</Text>
						</Box>
					</PopupSurface>
				</Popup.Content>
			</Popup>
		</div>
	);
}

export function VrJsFallbackBlockEnd() {
	return <VrPopupFallback placement={{ edge: 'end' }} />;
}

export function VrJsFallbackInlineEnd() {
	return <VrPopupFallback placement={{ axis: 'inline', edge: 'end' }} />;
}

export function VrJsFallbackBlockStart() {
	return <VrPopupFallback placement={{ edge: 'start' }} />;
}

export function VrJsFallbackInlineStart() {
	return <VrPopupFallback placement={{ axis: 'inline', edge: 'start' }} />;
}

export function VrJsFallbackBlockEndAlignStart() {
	return <VrPopupFallback placement={{ axis: 'block', edge: 'end', align: 'start' }} />;
}

export function VrJsFallbackBlockEndAlignEnd() {
	return <VrPopupFallback placement={{ axis: 'block', edge: 'end', align: 'end' }} />;
}

export function VrJsFallbackInlineEndAlignStart() {
	return <VrPopupFallback placement={{ axis: 'inline', edge: 'end', align: 'start' }} />;
}

export function VrJsFallbackInlineEndAlignEnd() {
	return <VrPopupFallback placement={{ axis: 'inline', edge: 'end', align: 'end' }} />;
}

export default function VrPopupJsFallback() {
	return <VrJsFallbackBlockEnd />;
}
