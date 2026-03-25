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
	container: {
		position: 'relative',
		width: '100%',
		height: '100vh',
	},
	inner: {
		position: 'absolute',
	},
	flipBlock: {
		insetBlockEnd: token('space.200'),
		insetInlineStart: '50%',
	},
	flipInline: {
		insetInlineEnd: token('space.200'),
		insetBlockStart: '50%',
	},
	flipBoth: {
		insetBlockEnd: token('space.200'),
		insetInlineEnd: token('space.200'),
	},
});

function placementLabel(p: TPlacementOptions): string {
	const axis = p.axis ?? 'block';
	const edge = p.edge ?? 'end';
	const align = p.align ?? 'center';
	return align === 'center' ? `${axis}-${edge}` : `${axis}-${edge} align-${align}`;
}

function PopupAtEdge({ placement }: { placement: TPlacementOptions; children?: React.ReactNode }) {
	const label = placementLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);

	// Auto-open the popup on mount so the VR snapshot captures the
	// positioned popover rather than just the closed trigger button.
	useEffect(() => {
		triggerRef.current?.click();
	}, []);

	return (
		<Popup placement={placement} onClose={() => {}}>
			<Popup.Trigger>
				<button ref={triggerRef} type="button">{label}</button>
			</Popup.Trigger>
			<Popup.Content role="dialog" label={`Fallback ${label}`}>
				<PopupSurface>
					<Box padding="space.200">
						<Text>Flipped popover</Text>
					</Box>
				</PopupSurface>
			</Popup.Content>
		</Popup>
	);
}

/**
 * Trigger near bottom edge with block-end placement.
 * Expected: position-try-fallbacks flip-block activates,
 * popover appears above the trigger instead of below.
 */
export function VrFlipBlock() {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBlock]}>
				<PopupAtEdge placement={{ edge: 'end' }} />
			</div>
		</div>
	);
}

/**
 * Trigger near right edge with inline-end placement.
 * Expected: position-try-fallbacks flip-inline activates,
 * popover appears to the left of the trigger instead of right.
 */
export function VrFlipInline() {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipInline]}>
				<PopupAtEdge placement={{ axis: 'inline', edge: 'end' }} />
			</div>
		</div>
	);
}

/**
 * Trigger in bottom-right corner with compound placement.
 * Expected: position-try-fallbacks flip-block flip-inline activates,
 * popover flips on both axes.
 */
export function VrFlipBoth() {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBoth]}>
				<PopupAtEdge placement={{ axis: 'block', edge: 'end', align: 'start' }} />
			</div>
		</div>
	);
}

export default function VrPopupCssFallbacks() {
	return <VrFlipBlock />;
}
