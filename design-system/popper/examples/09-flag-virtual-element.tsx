/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { type VirtualElement } from '@popperjs/core';

import { Popper } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

/**
 * FF-on virtual-element example. Drives the `useAnchorPositionAtPoint`
 * branch of `popper-top-layer.tsx`. The button mutates a stable
 * `VirtualElement` instance (so the prop identity does not change), and
 * the latched `getPoint` must re-read the current rect on the next
 * animation frame.
 */
const styles = cssMap({
	root: {
		position: 'relative',
		inlineSize: '480px',
		blockSize: '320px',
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
	},
	surface: {
		backgroundColor: token('color.background.neutral.bold'),
		color: token('color.text.inverse'),
		paddingBlock: token('space.075'),
		paddingInline: token('space.150'),
		borderRadius: token('radius.small'),
		font: token('font.body.small'),
	},
	button: {
		marginBlockStart: token('space.200'),
	},
});

type TRect = { top: number; left: number; width: number; height: number };

function createVirtualElement(getRect: () => TRect): VirtualElement {
	return {
		getBoundingClientRect(): DOMRect {
			const rect = getRect();
			return {
				top: rect.top,
				left: rect.left,
				right: rect.left + rect.width,
				bottom: rect.top + rect.height,
				width: rect.width,
				height: rect.height,
				x: rect.left,
				y: rect.top,
				toJSON() {
					return rect;
				},
			};
		},
	};
}

export default function FlagVirtualElement(): React.JSX.Element {
	// Anchor coordinates the consumer updates over time.
	const [rect, setRect] = useState<TRect>({ top: 40, left: 40, width: 80, height: 24 });

	// Stable VirtualElement identity. Reads the latest rect at call time
	// via a ref so the popper sees the new position without the prop
	// changing identity.
	const rectRef = React.useRef(rect);
	rectRef.current = rect;
	const [virtual] = useState<VirtualElement>(() => createVirtualElement(() => rectRef.current));

	// Force the popper to remeasure when consumer state changes. In a
	// real consumer this would be a `requestAnimationFrame` tick or
	// `ResizeObserver`; we just dispatch a resize so listeners re-run.
	useEffect(() => {
		window.dispatchEvent(new Event('resize'));
	}, [rect]);

	return (
		<div data-testid="root" css={styles.root}>
			<Popper referenceElement={virtual} placement="bottom-start">
				{({ ref, style }) => (
					<div ref={ref} data-testid="popper" css={styles.surface} style={style}>
						virtual-anchored popover
					</div>
				)}
			</Popper>
			<button
				type="button"
				data-testid="move"
				css={styles.button}
				onClick={() => setRect({ top: 200, left: 280, width: 80, height: 24 })}
			>
				move anchor
			</button>
		</div>
	);
}
