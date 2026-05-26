/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	type FC,
	type ForwardRefExoticComponent,
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
import { fromLegacyPlacement, type TLegacyPlacement } from '@atlaskit/top-layer/placement-map';
import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover';
import { Popup } from '@atlaskit/top-layer/popup';

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

	// ── No-op props ──
	// These props are accepted for API compatibility but have no effect
	// in the top-layer path. Each is documented with why it's unnecessary.

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
	const popupContainerRef = useRef<HTMLDivElement>(null);
	const [, setInitialFocusRef] = useState<HTMLElement | null>(null);

	// ── Placement conversion ──
	// Legacy `offset` is the popper `[along, away]` tuple; `fromLegacyPlacement`
	// folds it into the new `placement.offset` shape so it travels with placement.
	const topLayerPlacement = useMemo(
		() => fromLegacyPlacement({ legacy: placement as TLegacyPlacement, offset: offsetProp }),
		[placement, offsetProp],
	);

	// ── onClose bridge ──
	// Translates top-layer's { reason: TPopoverCloseReason } into legacy
	// onClose(event, currentLevel?) by synthesizing DOM events.
	//
	// Focus restoration is handled natively by the Popover API:
	//   - Escape → browser restores focus to the trigger automatically
	//   - Click-outside → browser does NOT restore (correct behavior)
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

	// ── Content render-prop bridge ──
	// Legacy content() receives { isOpen, update, setInitialFocusRef, onClose }.
	// update is a no-op — CSS Anchor Positioning self-updates.
	const contentProps: ContentProps = useMemo(
		() => ({
			isOpen: isOpen,
			update: noop as ContentProps['update'],
			onClose,
			setInitialFocusRef,
		}),
		[isOpen, onClose],
	);

	// ── Role mapping ──
	// Build the role/label props for PopupContent.
	// Roles requiring accessible names must have label or labelledBy.
	const roleProps = useRoleProps({ role, label, titleId });

	// Narrow to ForwardRefExoticComponent so JSX accepts the ref prop.
	// All popupComponent implementations use forwardRef per the PopupComponentProps contract.
	const Container = PopupContainer as
		| ForwardRefExoticComponent<
				PropsWithoutRef<PopupComponentProps> & RefAttributes<HTMLDivElement>
		  >
		| undefined;

	return (
		<Popup placement={topLayerPlacement} onClose={handleOnClose} testId={testId}>
			<Popup.TriggerFunction>
				{({ ref, toggle: _toggle, ariaAttributes, popoverId }) => {
					// Map to legacy TriggerProps
					const triggerProps: TriggerProps = {
						ref: (node: HTMLElement | null) => {
							triggerRef.current = node;
							if (typeof ref === 'function') {
								ref(node);
							}
						},
						'aria-controls': isOpen ? (providedId ?? popoverId) : undefined,
						// Use ariaAttributes['aria-expanded'] (which comes from `@atlaskit/top-layer`), rather than
						// `isOpen` directly. `@atlaskit/top-layer` tracks the full animation lifecycle via
						// TPopupState and only goes false after the exit animation completes, so:
						//   - Screen readers don't announce the popup as closed while it is still visible.
						//   - Consumers relying on aria-expanded to show/hide trigger UI don't lose the
						//     trigger (popup anchor) before the animation finishes.
						'aria-expanded': ariaAttributes['aria-expanded'],
						// FUDGE(top-layer-api): cast to the narrow public TriggerProps['aria-haspopup'] union.
						// `@atlaskit/top-layer` derives `aria-haspopup` from the content's role and types it
						// as the wider WAI-ARIA union (boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid').
						// We keep the public popup TriggerProps narrow (boolean | 'dialog') because the
						// top-layer API surface is not yet settled. Widening adopter types now would commit
						// us to a public surface we may revisit. The runtime value is unchanged; only the
						// TypeScript-visible type is narrowed at this boundary.
						// REMOVE WHEN: the top-layer public API is committed (see
						// packages/design-system/top-layer/notes/decisions/migration-roadmap.md "Open API
						// decisions deferred to a follow-up PR") and a follow-up `minor` PR widens
						// `TriggerProps['aria-haspopup']` to match.
						'aria-haspopup': ariaAttributes['aria-haspopup'] as TriggerProps['aria-haspopup'],
					};

					return trigger(triggerProps);
				}}
			</Popup.TriggerFunction>
			<Popup.Content
				{...roleProps}
				isOpen={isOpen}
				animate={animation}
				testId={testId && `${testId}--content`}
				widthFromAnchor={shouldFitContainer ? 'match-anchor' : 'none'}
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
					<Popup.Surface>
						<div css={contentOverflowStyles[shouldFitViewport ? 'fitViewport' : 'default']}>
							{content(contentProps)}
						</div>
					</Popup.Surface>
				)}
			</Popup.Content>
		</Popup>
	);
});
