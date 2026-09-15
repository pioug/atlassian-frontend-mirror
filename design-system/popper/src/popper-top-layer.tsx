import React, { type CSSProperties, type ReactNode, useMemo, useRef, useState } from 'react';

import type { VirtualElement } from '@popperjs/core';
import type { PopperChildrenProps } from 'react-popper';

import noop from '@atlaskit/ds-lib/noop';
import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map/index';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { useAnchoredPopoverAtPoint } from '@atlaskit/top-layer/use-anchored-popover-at-point';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import { isPageRtl } from './internal/is-page-rtl';
import { rectPointForPlacement } from './internal/rect-point-for-placement';
import { toLegacyPlacement } from './internal/to-legacy-placement';
import { useManagerAnchor } from './internal/use-manager-anchor';
import { useReferenceVisibility } from './internal/use-reference-visibility';
import type { CustomPopperProps } from './popper';

/**
 * Inert render-prop values. The browser owns positioning under CSS Anchor
 * Positioning, so `style` / `ref` / `arrowProps` / `update` / `forceUpdate`
 * are no-ops that consumers can safely spread. Module scope keeps identities
 * stable for effect dep arrays.
 */
const noopStyle: CSSProperties = {};
const noopSetRef: React.Ref<HTMLElement> = noop;
const noopUpdate: PopperChildrenProps['update'] = () => Promise.resolve(null);
const noopForceUpdate: PopperChildrenProps['forceUpdate'] = () => ({});

/**
 * `react-popper` stamps `data-popper-arrow` on the arrow element at runtime
 * but does not declare it on `arrowProps`. Widen the type so consumers that
 * rely on the attribute (CSS selectors, snapshots, tests) keep working.
 */
type TArrowPropsInert = PopperChildrenProps['arrowProps'] & { 'data-popper-arrow': true };

const noopArrowProps: TArrowPropsInert = {
	ref: noopSetRef,
	style: noopStyle,
	'data-popper-arrow': true,
};

/**
 * Normalises popper's `[along, away]` offset (which may include `null` or
 * `undefined` entries) into the `[along, away]` number tuple
 * `fromLegacyPlacement` expects.
 */
function popperToTopLayerOffset(
	offset: CustomPopperProps<unknown>['offset'],
): [along: number, away: number] | undefined {
	if (!offset) {
		return undefined;
	}
	const [along, away] = offset;
	if (along == null && away == null) {
		return undefined;
	}
	return [along ?? 0, away ?? 0];
}

/**
 * FF-on implementation of `@atlaskit/popper`'s `<Popper>` primitive.
 *
 * Renders the consumer's render-prop output into a `<Popover>` from
 * `@atlaskit/top-layer`, which lifts the element into the browser top
 * layer and positions it via CSS Anchor Positioning. The render-prop
 * contract (`PopperChildrenProps`) is preserved at the type level;
 * `style` and `arrowProps.style` are inert at runtime because the
 * browser owns positioning.
 *
 * Gated behind the `platform-dst-top-layer` feature flag from
 * `popper.tsx`.
 */
export function PopperTopLayer<CustomModifiers>({
	children,
	offset,
	placement = 'bottom-start',
	referenceElement,
	shouldFitViewport = false,
}: CustomPopperProps<CustomModifiers>): React.JSX.Element | null {
	// `modifiers` and `strategy` are accepted for source compatibility but have
	// no runtime effect; CSS Anchor Positioning + top-layer rendering replaces
	// them. See `top-layer/notes/migrations/popper-migration.md`.

	// Anchor resolution: `referenceElement` prop, then `<Manager>` context.
	const managerAnchor = useManagerAnchor();
	const effectiveReference: HTMLElement | VirtualElement | undefined =
		referenceElement ?? managerAnchor ?? undefined;

	// Real DOM nodes are anchored by `useAnchoredPopover`; popper
	// `VirtualElement`s go to `useAnchoredPopoverAtPoint`, which owns a synthetic
	// anchor element in `document.body`.
	const htmlAnchor: HTMLElement | null =
		effectiveReference instanceof HTMLElement ? effectiveReference : null;
	const virtualReference: VirtualElement | null =
		effectiveReference != null && !(effectiveReference instanceof HTMLElement)
			? effectiveReference
			: null;

	const htmlAnchorRef = useRef<HTMLElement | null>(htmlAnchor);
	htmlAnchorRef.current = htmlAnchor;

	const popoverRef = useRef<HTMLDivElement | null>(null);
	const popoverId = usePopoverId();

	// Track the resolved DOM anchor in state so the visibility hook re-runs when
	// its identity changes. Virtual anchors do not feed that hook, because their
	// probe is outside the consumer's DOM.
	//
	// Adjust state during render by comparing against the state itself: the
	// conditional guard means `setResolvedAnchor` is skipped once they match,
	// so it converges in one extra render. This is the React-documented pattern
	// and is side-effect-free — no ref mutation during render.
	const [resolvedAnchor, setResolvedAnchor] = useState<HTMLElement | null>(htmlAnchor);
	if (resolvedAnchor !== htmlAnchor) {
		setResolvedAnchor(htmlAnchor);
	}

	const topLayerPlacement = useMemo(() => {
		return fromLegacyPlacement({
			legacy: toLegacyPlacement(placement),
			offset: popperToTopLayerOffset(offset),
		});
	}, [placement, offset]);

	const isOpen = effectiveReference != null;

	// Refs, because `getPoint` is LATCHED: called once per activation, so a
	// closed-over value would go stale if either prop changed while it stayed open.
	const virtualReferenceRef = useRef<VirtualElement | null>(virtualReference);
	virtualReferenceRef.current = virtualReference;
	const topLayerPlacementRef = useRef(topLayerPlacement);
	topLayerPlacementRef.current = topLayerPlacement;

	// Two positioning hooks, at most one enabled: `htmlAnchor` and
	// `virtualReference` both derive from `effectiveReference`, so they are never
	// both set, and when neither is the popover is closed.
	const isElementAnchored = htmlAnchor !== null;
	const isPointAnchored = virtualReference !== null;

	// Passed as one object so the element and point calls cannot drift.
	const sharedPositioning = {
		popoverRef,
		placement: topLayerPlacement,
		isOpen,
		inlineSize: shouldFitViewport ? ('max-available' as const) : ('content' as const),
		blockSize: shouldFitViewport ? ('max-available' as const) : ('content' as const),
	};

	useAnchoredPopover({
		...sharedPositioning,
		anchorRef: htmlAnchorRef,
		isEnabled: isElementAnchored,
	});

	useAnchoredPopoverAtPoint({
		...sharedPositioning,
		isEnabled: isPointAnchored,
		getPoint: () => {
			const current = virtualReferenceRef.current;
			if (!current) {
				return null;
			}
			return rectPointForPlacement({
				rect: current.getBoundingClientRect(),
				placement: topLayerPlacementRef.current,
				isRtl: isPageRtl(),
			});
		},
	});

	const { isReferenceHidden, hasPopperEscaped } = useReferenceVisibility({
		anchor: resolvedAnchor,
		popoverRef,
	});

	const renderChildren = children;
	if (typeof renderChildren !== 'function') {
		return null;
	}

	const renderPropArg: PopperChildrenProps = {
		ref: noopSetRef,
		style: noopStyle,
		placement,
		isReferenceHidden,
		hasPopperEscaped,
		update: noopUpdate,
		forceUpdate: noopForceUpdate,
		arrowProps: noopArrowProps,
	};

	const content: ReactNode = renderChildren(renderPropArg);

	// Rendered directly into the `<Popover>` host, which supplies the flex
	// formatting context the size caps need — so the render prop must return ONE
	// element. See `children` in `@atlaskit/top-layer`'s `popover/types.tsx`.
	return (
		<Popover ref={popoverRef} id={popoverId} isOpen={isOpen} mode="manual" shouldAnimate={false}>
			{content}
		</Popover>
	);
}
