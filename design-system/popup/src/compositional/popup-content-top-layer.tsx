/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	type Dispatch,
	type ForwardRefExoticComponent,
	type PropsWithoutRef,
	type ReactNode,
	type RefAttributes,
	type SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from 'react';

import { css, jsx } from '@compiled/react';
import { ax } from '@compiled/react/runtime';

import noop from '@atlaskit/ds-lib/noop';
import { popupMotion } from '@atlaskit/top-layer/animations';
import { fromLegacyPlacement, type TLegacyPlacement } from '@atlaskit/top-layer/placement-map';
import {
	createPopoverCloseEvent,
	Popover,
	type TPopoverCloseReason,
} from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { useWidthFromAnchor } from '@atlaskit/top-layer/use-width-from-anchor';

import { useRoleProps } from '../internal/top-layer-bridge';
import { type ContentProps, type PopupComponentProps, type PopupProps } from '../types';

import { TriggerRefObjectContext } from './trigger-ref-object-context';

const overflowAutoStyles = css({ overflow: 'auto' });

const animation = popupMotion();

// Top-layer positioning is handled by CSS Anchor Positioning, not inline styles.
const EMPTY_STYLE: CSSProperties = {};

/**
 * Top-layer implementation of the compositional PopupContent.
 *
 * Reads isOpen, id, triggerRef from the legacy compositional Popup context,
 * then renders via @atlaskit/top-layer's Popup compound.
 *
 * Gated behind the `platform-dst-top-layer` feature flag.
 */
export function PopupContentTopLayer({
	xcss,
	children,
	offset: offsetProp,
	onClose,
	testId,
	placement = 'auto',
	fallbackPlacements: _fallbackPlacements,
	popupComponent: PopupContainer,
	autoFocus = true,
	shouldFitContainer,
	shouldFitViewport,
	role,
	label,
	titleId,
	isOpen,
	id: providedId,

	// ── No-op props ──
	// top-layer: stacking managed by browser top layer. zIndex is a no-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	zIndex: _zIndex,
	// top-layer: always renders in top layer. shouldRenderToParent is a no-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	shouldRenderToParent: _shouldRenderToParent,
	// top-layer: CSS Anchor Positioning replaces Popper strategy. No-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	strategy: _strategy,
	// top-layer: viewport is the natural boundary. No-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	boundary: _boundary,
	// top-layer: viewport is the natural boundary. No-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	rootBoundary: _rootBoundary,
	// top-layer: native light dismiss replaces capture-phase click handler.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	shouldUseCaptureOnOutsideClick: _shouldUseCaptureOnOutsideClick,
	// top-layer: focus trapping is role-based. shouldDisableFocusLock is a no-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	shouldDisableFocusLock: _shouldDisableFocusLock,
	// top-layer: shouldFlip handled by CSS position-try fallbacks.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	shouldFlip: _shouldFlip,
	// top-layer: appearance is accepted but UNSAFE_modal-below-sm is not yet implemented.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	appearance: _appearance,
	// top-layer: GPU acceleration is not applicable.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	shouldDisableGpuAcceleration: _shouldDisableGpuAcceleration,
}: Omit<PopupProps, 'content' | 'trigger'> & {
	// `PopupContent` uses a `children` render prop where legacy `Popup` used `content`.
	children: (props: ContentProps) => ReactNode;
	// Legacy popup used Popper-only knob; here it is accepted as a no-op.
	shouldDisableGpuAcceleration?: boolean;
	isOpen: boolean;
	id: string | undefined;
}): ReactNode {
	/**
	 * Escape hatch for consumer-chosen initial focus target.
	 *
	 * The legacy compositional `PopupContent` surfaced
	 * `setInitialFocusRef` on the content children render prop with a
	 * `Dispatch<SetStateAction<HTMLElement | null>>` signature so it
	 * could be passed as a React `ref` callback. We keep the same shape
	 * for API compatibility, but store the value in a ref rather than
	 * component state. Flipping state on every open caused a needless
	 * re-render and, more importantly, raced the initial-focus effect
	 * below. The ref is read in the open-side effect to override the
	 * role-based default focus chosen by `useInitialFocus` inside the
	 * underlying `Popover`.
	 */
	const consumerInitialFocusRef = useRef<HTMLElement | null>(null);
	const setInitialFocusRef = useCallback<Dispatch<SetStateAction<HTMLElement | null>>>(
		(value) => {
			consumerInitialFocusRef.current =
				typeof value === 'function' ? value(consumerInitialFocusRef.current) : value;
		},
		[],
	);

	// Placement conversion
	// Legacy `offset` is the popper `[along, away]` tuple; `fromLegacyPlacement`
	// folds it into the new `placement.offset` shape.
	const topLayerPlacement = useMemo(
		() => fromLegacyPlacement({ legacy: placement as TLegacyPlacement, offset: offsetProp }),
		[placement, offsetProp],
	);

	// ── onClose bridge ──
	const handleOnClose = useCallback(
		({ reason }: { reason: TPopoverCloseReason }) => {
			if (!onClose) {
				return;
			}

			onClose(createPopoverCloseEvent({ reason }));
		},
		[onClose],
	);

	// ── Content render-prop bridge ──
	const contentProps: ContentProps = useMemo(
		() => ({
			isOpen,
			update: noop as ContentProps['update'],
			onClose,
			setInitialFocusRef,
		}),
		[isOpen, onClose, setInitialFocusRef],
	);

	// ── Role mapping ──
	const roleProps = useRoleProps({ role, label, titleId });

	const popoverRef = useRef<HTMLDivElement>(null);
	const anchorRef = useContext(TriggerRefObjectContext);

	/**
	 * Override the role-based initial focus chosen by the underlying
	 * `Popover` (its internal `useInitialFocus`).
	 *
	 * React flushes child effects before parent effects, so by the time
	 * this effect runs the role-based default focus has already moved.
	 * We then apply the legacy `Popup` contract:
	 *
	 * 1. If the consumer wired `setInitialFocusRef`, focus that element
	 *    (escape hatch wins).
	 * 2. Otherwise, if `autoFocus={false}`, return focus to the trigger.
	 *    The `autoFocus` prop on `Popup` opts out of any initial-focus
	 *    movement, even for roles like `dialog`.
	 *
	 * When neither applies the role-based default from the underlying
	 * `Popover` stays in place.
	 */
	useEffect(() => {
		if (!isOpen) {
			/**
			 * Clear the consumer-supplied focus target on close so a
			 * subsequent open does not silently inherit a stale ref from
			 * the previous open cycle. The next open will re-collect a
			 * target only if the content render prop re-wires
			 * `setInitialFocusRef`.
			 */
			consumerInitialFocusRef.current = null;
			return;
		}
		const consumerTarget = consumerInitialFocusRef.current;
		if (consumerTarget && consumerTarget.isConnected) {
			consumerTarget.focus();
			return;
		}
		if (!autoFocus) {
			const trigger = anchorRef?.current ?? null;
			if (trigger && trigger.isConnected) {
				trigger.focus();
			}
		}
	}, [isOpen, autoFocus, anchorRef]);

	// `isOpen` is included so the anchor positioning effect re-runs when
	// the Popover host element is unmounted/remounted across open cycles.
	useAnchorPosition({
		anchorRef,
		popoverRef,
		placement: topLayerPlacement,
		isOpen,
	});

	useWidthFromAnchor({
		mode: shouldFitContainer ? 'match-anchor' : 'none',
		popoverRef,
		anchorRef,
		isOpen,
	});

	// Narrow to ForwardRefExoticComponent so JSX accepts the ref prop.
	// All popupComponent implementations use forwardRef per the PopupComponentProps contract.
	const Container = PopupContainer as
		| ForwardRefExoticComponent<
				PropsWithoutRef<PopupComponentProps> & RefAttributes<HTMLDivElement>
		  >
		| undefined;

	return (
		<Popover
			ref={popoverRef}
			{...roleProps}
			isOpen={isOpen}
			animate={animation}
			placement={topLayerPlacement}
			onClose={handleOnClose}
			testId={testId && `${testId}--content`}
		>
			{Container ? (
				<Container
					style={EMPTY_STYLE}
					id={providedId}
					data-placement={placement}
					data-testid={testId}
					tabIndex={autoFocus ? -1 : undefined}
					xcss={xcss as PopupComponentProps['xcss']}
				>
					{children(contentProps)}
				</Container>
			) : (
				<PopoverSurface>
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
						className={ax([xcss as string])}
						css={[shouldFitViewport && overflowAutoStyles]}
					>
						{children(contentProps)}
					</div>
				</PopoverSurface>
			)}
		</Popover>
	);
}
