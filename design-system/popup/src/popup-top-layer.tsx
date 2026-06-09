/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	type FC,
	type ForwardRefExoticComponent,
	Fragment,
	memo,
	type PropsWithoutRef,
	type RefAttributes,
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react';

import { cssMap, jsx } from '@compiled/react';

import noop from '@atlaskit/ds-lib/noop';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { createPopoverCloseEvent } from '@atlaskit/top-layer/create-close-event';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { fromLegacyPlacement, type TLegacyPlacement } from '@atlaskit/top-layer/placement-map';
import { Popover, type TPopoverCloseReason } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
import { useWidthFromAnchor } from '@atlaskit/top-layer/use-width-from-anchor';

import { useRoleProps } from './internal/top-layer-bridge';
import {
	type ContentProps,
	type PopupComponentProps,
	type PopupProps,
	type TriggerProps,
} from './types';

const contentOverflowStyles = cssMap({
	fitViewport: { overflow: 'auto' },
	default: {},
});

const animation = slideAndFade();

// Top-layer positioning is handled by CSS Anchor Positioning, not inline styles.
const EMPTY_STYLE: CSSProperties = {};

/**
 * Top-layer implementation of Popup.
 *
 * Replaces the legacy @atlaskit/popup rendering pipeline
 * (Popper.js + Portal + focus-trap + @atlaskit/layering)
 * with the native Popover API + CSS Anchor Positioning via @atlaskit/top-layer.
 *
 * Gated behind the `platform-dst-top-layer` feature flag.
 */
export const PopupTopLayer: FC<PopupProps> = memo(function PopupTopLayer({
	xcss,
	isOpen,
	id: providedId,
	offset: offsetProp,
	testId,
	trigger,
	content,
	onClose,
	placement = 'auto',
	fallbackPlacements: _fallbackPlacements,
	shouldFlip: _shouldFlip = true,
	popupComponent: PopupContainer,
	autoFocus = true,
	shouldFitContainer = false,
	// top-layer: focus restoration is handled natively by the Popover API. No-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	shouldReturnFocus: _shouldReturnFocus = true,
	role,
	label,
	titleId,

	// No-op props.
	// These props are accepted for API compatibility but have no effect
	// in the top-layer path. Each is documented with why it is unnecessary.

	// top-layer: stacking managed by browser top layer. zIndex is a no-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	zIndex: _zIndex,
	// top-layer: always renders in top layer. shouldRenderToParent is a no-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	shouldRenderToParent: _shouldRenderToParent,
	// top-layer: CSS Anchor Positioning replaces Popper strategy. No-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	strategy: _strategy,
	// top-layer: Popper.js modifiers not applicable. No-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	modifiers: _modifiers,
	// top-layer: viewport is the natural boundary. No-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	boundary: _boundary,
	// top-layer: viewport is the natural boundary. No-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	rootBoundary: _rootBoundary,
	// top-layer: native light dismiss replaces capture-phase click handler.
	// Could add mousedown drag guard later if needed.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	shouldUseCaptureOnOutsideClick: _shouldUseCaptureOnOutsideClick,
	// top-layer: focus trapping is role-based. shouldDisableFocusLock is a no-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	shouldDisableFocusLock: _shouldDisableFocusLock,
	// top-layer: shouldFitViewport is handled via overflow on content wrapper.
	shouldFitViewport,
	// top-layer: appearance is accepted but UNSAFE_modal-below-sm is not yet implemented.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	appearance: _appearance,
}: PopupProps) {
	const triggerRef = useRef<HTMLElement | null>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popupContainerRef = useRef<HTMLDivElement>(null);
	const [, setInitialFocusRef] = useState<HTMLElement | null>(null);

	const popoverId = usePopoverId();

	// Placement conversion.
	// Legacy `offset` is the popper `[along, away]` tuple; `fromLegacyPlacement`
	// folds it into the new `placement.offset` shape so it travels with placement.
	const topLayerPlacement = useMemo(
		() => fromLegacyPlacement({ legacy: placement as TLegacyPlacement, offset: offsetProp }),
		[placement, offsetProp],
	);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: topLayerPlacement,
	});

	useWidthFromAnchor({
		mode: shouldFitContainer ? 'match-anchor' : 'none',
		popoverRef,
		anchorRef: triggerRef,
	});

	// onClose bridge.
	// Translates top-layer's { reason: TPopoverCloseReason } into legacy
	// onClose(event, currentLevel?) by synthesizing DOM events.
	//
	// Focus restoration is handled natively by the Popover API:
	//   - Escape: browser restores focus to the trigger automatically
	//   - Click-outside: browser does NOT restore (correct behavior)
	// No manual triggerRef.current?.focus() is needed.
	const handleOnClose = useCallback(
		({ reason }: { reason: TPopoverCloseReason }) => {
			if (!onClose) {
				return;
			}

			onClose(createPopoverCloseEvent({ reason }));
		},
		[onClose],
	);

	// Content render-prop bridge.
	// Legacy content() receives { isOpen, update, setInitialFocusRef, onClose }.
	// update is a no-op because CSS Anchor Positioning self-updates.
	const contentProps: ContentProps = useMemo(
		() => ({
			isOpen: isOpen,
			update: noop as ContentProps['update'],
			onClose,
			setInitialFocusRef,
		}),
		[isOpen, onClose],
	);

	// Role mapping.
	// Build the role/label props for Popover.
	// Roles requiring accessible names must have label or labelledBy.
	const roleProps = useRoleProps({ role, label, titleId });

	const ariaAttributes = getAriaForTrigger({
		role: (roleProps.role ?? 'dialog') as Parameters<typeof getAriaForTrigger>[0]['role'],
		isOpen,
		popoverId,
	});

	// Narrow to ForwardRefExoticComponent so JSX accepts the ref prop.
	// All popupComponent implementations use forwardRef per the PopupComponentProps contract.
	const Container = PopupContainer as
		| ForwardRefExoticComponent<
				PropsWithoutRef<PopupComponentProps> & RefAttributes<HTMLDivElement>
		  >
		| undefined;

	// Map to legacy TriggerProps.
	const triggerProps: TriggerProps = {
		ref: (node: HTMLElement | null) => {
			triggerRef.current = node;
		},
		'aria-controls': providedId ?? popoverId,
		// `aria-expanded` reflects current open state.
		'aria-expanded': ariaAttributes['aria-expanded'],
		// FUDGE(top-layer-api): cast to the narrow public TriggerProps['aria-haspopup'] union.
		// `getAriaForTrigger` derives `aria-haspopup` from the content's role and types it
		// as the wider WAI-ARIA union (boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid').
		// We keep the public popup TriggerProps narrow (boolean | 'dialog') because the
		// top-layer API surface is not yet settled. Widening adopter types now would commit
		// us to a public surface we may revisit. The runtime value is unchanged; only the
		// TypeScript-visible type is narrowed at this boundary.
		'aria-haspopup': ariaAttributes['aria-haspopup'] as TriggerProps['aria-haspopup'],
	};

	return (
		<Fragment>
			{trigger(triggerProps)}
			<Popover
				ref={popoverRef}
				id={providedId ?? popoverId}
				{...roleProps}
				isOpen={isOpen}
				onClose={handleOnClose}
				animate={animation}
				placement={topLayerPlacement}
				testId={testId && `${testId}--content`}
			>
				{Container ? (
					<Container
						ref={popupContainerRef}
						style={EMPTY_STYLE}
						id={providedId}
						data-placement={placement}
						data-testid={testId}
						tabIndex={autoFocus ? -1 : undefined}
						xcss={xcss as PopupComponentProps['xcss']}
					>
						{content(contentProps)}
					</Container>
				) : (
					<PopoverSurface>
						<div css={contentOverflowStyles[shouldFitViewport ? 'fitViewport' : 'default']}>
							{content(contentProps)}
						</div>
					</PopoverSurface>
				)}
			</Popover>
		</Fragment>
	);
});
