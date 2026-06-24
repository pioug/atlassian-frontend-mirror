/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type CSSProperties, type ReactNode, useMemo, useRef, useState } from 'react';

import { jsx } from '@compiled/react';
import type { Placement, VirtualElement } from '@popperjs/core';
import type { PopperChildrenProps } from 'react-popper';

import { getDocument } from '@atlaskit/browser-apis';
import noop from '@atlaskit/ds-lib/noop';
import { token } from '@atlaskit/tokens';
import { fromLegacyPlacement, type TLegacyPlacement } from '@atlaskit/top-layer/placement-map';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { useAnchorPositionAtPoint } from '@atlaskit/top-layer/use-anchor-position-at-point';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
import { useWidthFromAnchor } from '@atlaskit/top-layer/use-width-from-anchor';

import { rectPointForPlacement } from './internal/rect-point-for-placement';
import { useFitViewportMaxSize } from './internal/use-fit-viewport-max-size';
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
 * Returns whether the current page is laid out right-to-left.
 */
function isPageRtl(): boolean {
	const document = getDocument();
	if (!document) {
		return false;
	}
	return (
		document.dir === 'rtl' || document.body.dir === 'rtl' || document.documentElement.dir === 'rtl'
	);
}

/**
 * `@popperjs/core`'s `Placement` union is a strict subset of
 * `TLegacyPlacement` (the placement-map adds `top-center` /
 * `bottom-center` on top of popper's enum), so every value popper hands
 * us is a valid legacy placement. The cast keeps the runtime path free
 * of an extra module-level lookup that bundlers can occasionally fail
 * to wire up (observed as `Cannot read properties of undefined (reading
 * 'includes')` in component-test bundles).
 */
function toLegacyPlacement(placement: Placement): TLegacyPlacement {
	return placement as TLegacyPlacement;
}

/**
 * Returns the primary axis (`top` / `bottom` / `left` / `right`) of a popper
 * placement, used to pick which axis `useFitViewportMaxSize` caps to the
 * anchor edge.
 */
function getPlacementAxis(placement: Placement): 'top' | 'bottom' | 'left' | 'right' {
	if (placement.startsWith('top')) {
		return 'top';
	}
	if (placement.startsWith('bottom')) {
		return 'bottom';
	}
	if (placement.startsWith('left')) {
		return 'left';
	}
	if (placement.startsWith('right')) {
		return 'right';
	}
	// `auto*` placements have no fixed axis. Default to `bottom` to match the
	// `auto -> block-end` mapping in `fromLegacyPlacement`.
	return 'bottom';
}

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

	// Real DOM nodes go to `useAnchorPosition`; popper `VirtualElement`s are
	// bridged through `useAnchorPositionAtPoint`, which owns its own synthetic
	// anchor.
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

	// Track the resolved DOM anchor in state so visibility / max-size hooks
	// re-run when its identity changes. Virtual anchors do not feed these
	// hooks because their probe is outside the consumer's DOM.
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

	// HTML-element path. No-op when the reference is virtual or absent.
	useAnchorPosition({
		anchorRef: htmlAnchorRef,
		popoverRef,
		placement: topLayerPlacement,
		isEnabled: htmlAnchor != null,
		isOpen,
	});

	// Virtual-element path. `useAnchorPositionAtPoint` owns a synthetic
	// anchor in `document.body` and latches `getPoint` once per
	// `isEnabled` activation. Reading the latest `virtualReference` and
	// `topLayerPlacement` via refs ensures the latched closure always
	// sees the current values rather than the ones captured at first
	// activation, which would otherwise go stale if either prop changes
	// while the popper stays open.
	const virtualReferenceRef = useRef<VirtualElement | null>(virtualReference);
	virtualReferenceRef.current = virtualReference;
	const topLayerPlacementRef = useRef(topLayerPlacement);
	topLayerPlacementRef.current = topLayerPlacement;
	const isVirtualEnabled = virtualReference != null;
	useAnchorPositionAtPoint({
		popoverRef,
		placement: topLayerPlacement,
		isEnabled: isVirtualEnabled,
		isOpen,
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

	// Restore legacy `react-popper`'s natural-width behaviour. Under CSS
	// Anchor Positioning the `position-area` grid cell becomes the popover
	// host's containing block, so an auto-width host shrinks to that cell.
	// When the anchor sits near a viewport edge the cell is narrow, so the
	// content wraps far more than it did under `react-popper` (which kept the
	// content's natural width and shifted/flipped to stay on screen).
	// `min-inline-size: max-content` (mode `'none'`) floors the host at its
	// content's intrinsic width, so a too-narrow span overflows the viewport
	// (driving `position-try-fallbacks`) instead of wrapping. This is safe
	// alongside `shouldFitViewport`: the fit caps clamp the host on both axes,
	// so the host never exceeds the viewport / anchor-edge cap.
	useWidthFromAnchor({ mode: 'none', popoverRef, anchorRef: htmlAnchorRef, isOpen });

	// `shouldFitViewport` caps are applied directly to the `position-area`
	// host, whose containing block is the cell between the anchor edge and the
	// viewport edge — so a pure-CSS `calc(100% - 5px - gap)` reproduces the
	// legacy per-placement anchor-edge cap with no measurement. The gap mirrors
	// `getPlacement`: an omitted offset resolves to `space.100`, otherwise the
	// consumer's `away` value.
	const resolvedOffset = popperToTopLayerOffset(offset);
	const fitGap = resolvedOffset ? `${resolvedOffset[1]}px` : token('space.100', '8px');
	const placementAxis = getPlacementAxis(placement);
	useFitViewportMaxSize({
		target: popoverRef,
		placementAxis,
		gap: fitGap,
		isEnabled: shouldFitViewport,
		isOpen,
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

	// The `shouldFitViewport` size caps live on the `<Popover>` host itself
	// (applied by `useFitViewportMaxSize` above), so the consumer's content is
	// rendered directly with no intermediate wrapper.
	return (
		<Popover ref={popoverRef} id={popoverId} isOpen={isOpen} mode="manual" animate={false}>
			{content}
		</Popover>
	);
}
