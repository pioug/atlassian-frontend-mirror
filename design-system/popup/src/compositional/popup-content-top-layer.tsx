/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	type ForwardRefExoticComponent,
	type PropsWithoutRef,
	type ReactNode,
	type RefAttributes,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';

import { css, jsx } from '@compiled/react';
import { ax } from '@compiled/react/runtime';

import noop from '@atlaskit/ds-lib/noop';
import { slideAndFade } from '@atlaskit/top-layer/animations';
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

const animation = slideAndFade();

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
	const [, setInitialFocusRef] = useState<HTMLElement | null>(null);

	// ── Placement conversion ──
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
		[isOpen, onClose],
	);

	// ── Role mapping ──
	const roleProps = useRoleProps({ role, label, titleId });

	const popoverRef = useRef<HTMLDivElement>(null);
	const anchorRef = useContext(TriggerRefObjectContext);

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
