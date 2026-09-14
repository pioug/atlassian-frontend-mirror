/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useLayoutEffect, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { createPopper, type Instance } from '@atlaskit/popper/unsafe-imperative';
import { token } from '@atlaskit/tokens';

/**
 * FF-on examples for the imperative `createPopper` escape hatch.
 *
 * Both fixtures put the popper element inside a narrow
 * `position: relative; overflow: hidden` clipping ancestor, so the flag-off
 * Popper.js engine renders it clipped while the flag-on top-layer adapter
 * paints it in the browser top layer.
 *
 * - `FlagImperativeCreatePopper` hands the adapter a plain `<div>`, which it
 *   promotes to `popover="manual"`. The buttons drive `setOptions` (placement
 *   change) and `destroy`.
 * - `ImperativeCallerOwnedPopover` mirrors editor's `VanillaTooltip`: the
 *   caller owns `popover="hint"` and visibility, and the adapter only
 *   positions. The tooltip is a DOM child of its own trigger, as it is there.
 */
const styles = cssMap({
	clipper: {
		inlineSize: '160px',
		blockSize: '120px',
		overflow: 'hidden',
		// `position: relative` makes the clipper the containing block for the
		// flag-off (Popper.js `strategy: 'absolute'`) popper, so `overflow:
		// hidden` really clips it. Without this the absolutely-positioned
		// element resolves against the initial containing block and escapes
		// anyway, and the fixture would not distinguish the two flag states.
		position: 'relative',
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
	},
	trigger: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.100'),
		backgroundColor: token('color.background.neutral'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderRadius: token('radius.small'),
	},
	surface: {
		backgroundColor: token('color.background.neutral.bold'),
		color: token('color.text.inverse'),
		paddingBlock: token('space.075'),
		paddingInline: token('space.150'),
		borderRadius: token('radius.small'),
		font: token('font.body.small'),
		inlineSize: '200px',
	},
	controls: {
		display: 'flex',
		gap: token('space.100'),
		marginBlockStart: token('space.200'),
	},
});

type TPlacement = 'right' | 'bottom';

export default function FlagImperativeCreatePopper(): React.JSX.Element {
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const popperRef = useRef<HTMLDivElement | null>(null);
	const instanceRef = useRef<Instance | null>(null);
	const [placement, setPlacement] = useState<TPlacement>('right');
	const [isDestroyed, setIsDestroyed] = useState(false);

	// `placement` is deliberately not a dep: the instance is created once and
	// re-configured through `setOptions` below, which is the lifecycle real
	// imperative callers use.
	const initialPlacementRef = useRef<TPlacement>(placement);

	useLayoutEffect(() => {
		const anchor = anchorRef.current;
		const popper = popperRef.current;
		if (!anchor || !popper || isDestroyed) {
			return;
		}

		const instance = createPopper(anchor, popper, {
			placement: initialPlacementRef.current,
			modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
		});
		instanceRef.current = instance;

		return function cleanup() {
			instance.destroy();
			instanceRef.current = null;
		};
	}, [isDestroyed]);

	useLayoutEffect(() => {
		instanceRef.current?.setOptions((options) => ({ ...options, placement }));
	}, [placement]);

	return (
		<div>
			<div data-testid="clipper" css={styles.clipper}>
				<button type="button" ref={anchorRef} data-testid="trigger" css={styles.trigger}>
					trigger
				</button>
				<div ref={popperRef} data-testid="popper" css={styles.surface}>
					imperative popper
				</div>
			</div>
			<div css={styles.controls}>
				<button
					type="button"
					data-testid="set-bottom"
					css={styles.trigger}
					onClick={() => setPlacement('bottom')}
				>
					place bottom
				</button>
				<button
					type="button"
					data-testid="destroy"
					css={styles.trigger}
					onClick={() => setIsDestroyed(true)}
				>
					destroy
				</button>
			</div>
		</div>
	);
}

export function ImperativeCallerOwnedPopover(): React.JSX.Element {
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const tooltipRef = useRef<HTMLSpanElement | null>(null);

	useLayoutEffect(() => {
		const anchor = anchorRef.current;
		const tooltip = tooltipRef.current;
		if (!anchor || !tooltip) {
			return;
		}

		// The caller owns the popover attribute and its visibility; the adapter
		// must leave both alone and only position.
		tooltip.showPopover();
		const instance = createPopper(anchor, tooltip, {
			placement: 'right',
			modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
		});

		return function cleanup() {
			instance.destroy();
			tooltip.hidePopover();
		};
	}, []);

	return (
		<div data-testid="clipper" css={styles.clipper}>
			<button
				type="button"
				ref={anchorRef}
				data-testid="trigger"
				aria-describedby="imperative-caller-owned-tooltip"
				css={styles.trigger}
			>
				trigger
				<span
					ref={tooltipRef}
					id="imperative-caller-owned-tooltip"
					role="tooltip"
					data-testid="popper"
					// @ts-expect-error -- popover attribute not yet in React types
					// eslint-disable-next-line react/no-unknown-property -- popover attribute not yet in React types
					popover="hint"
					css={styles.surface}
				>
					caller-owned popover
				</span>
			</button>
		</div>
	);
}
