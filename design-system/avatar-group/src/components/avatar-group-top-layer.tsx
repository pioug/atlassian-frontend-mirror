import React, { type MouseEventHandler, useCallback, useEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { KEY_DOWN } from '@atlaskit/ds-lib/keycodes';
import useFocus from '@atlaskit/ds-lib/use-focus-event';
import { MenuGroup, Section } from '@atlaskit/menu';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map';
import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover';
import { Popup } from '@atlaskit/top-layer/popup';
import { useArrowNavigation } from '@atlaskit/top-layer/use-arrow-navigation';

import AvatarGroupItem from './avatar-group-item';
import {
	type AvatarGroupOverrides,
	type AvatarProps,
	type DeepRequired,
	type onAvatarClickHandler,
} from './types';

const animation = slideAndFade();

const topLayerPlacement = fromLegacyPlacement({ legacy: 'bottom-end' });

function getOverrides(overrides?: AvatarGroupOverrides): DeepRequired<AvatarGroupOverrides> {
	return {
		AvatarGroupItem: {
			render: (Component, props, index) => <Component key={index} {...props} />,
			...overrides?.AvatarGroupItem,
		},
		Avatar: {
			render: (Component, props, index) => <Component key={index} {...props} />,
			...overrides?.Avatar,
		},
		MoreIndicator: {
			render: (Component, props) => <Component {...props} />,
			...overrides?.MoreIndicator,
		},
	};
}

type TMoreDropdownTopLayerProps = {
	isOpen: boolean;
	onClose: () => void;
	isTriggeredUsingKeyboard: boolean;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Array<AvatarProps>;
	max: number;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	overrides?: AvatarGroupOverrides;
	onAvatarClick?: onAvatarClickHandler;
	testId?: string;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	labelId: string;
	renderMoreButton: (props: {
		'aria-controls'?: string;
		'aria-expanded'?: boolean;
		'aria-haspopup'?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
		onClick: MouseEventHandler;
		ref?: React.Ref<HTMLElement>;
	}) => React.ReactNode;
	handleTriggerClicked: (event: React.MouseEvent | KeyboardEvent) => void;
	bindFocus: {
		onFocus: (event: React.FocusEvent) => void;
		onBlur: (event: React.FocusEvent) => void;
	};
};

/**
 * Top-layer implementation of the avatar group overflow dropdown.
 *
 * Replaces the legacy `@atlaskit/popup` rendering pipeline
 * (Popper.js + Portal + focus-trap + @atlaskit/layering)
 * with the native Popover API + CSS Anchor Positioning via `@atlaskit/top-layer`.
 *
 * Uses `role="menu"` with arrow key navigation for correct menu semantics.
 *
 * Gated behind the `platform-dst-top-layer` feature flag.
 *
 * Legacy props that are no-ops in the top-layer path (not accepted here):
 * - zIndex: stacking managed by browser top layer
 * - shouldRenderToParent: always renders in top layer
 * - boundary / rootBoundary: viewport is the natural boundary
 * - shouldFlip: CSS Anchor Positioning handles flipping
 */
export function MoreDropdownTopLayer({
	isOpen,
	onClose,
	isTriggeredUsingKeyboard: _isTriggeredUsingKeyboard,
	data,
	max,
	overrides,
	onAvatarClick,
	testId,
	labelId,
	renderMoreButton,
	handleTriggerClicked,
	bindFocus: _bindFocus,
}: TMoreDropdownTopLayerProps): React.JSX.Element {
	const handleOnClose = useCallback(
		({ reason: _reason }: { reason: TPopoverCloseReason }) => {
			onClose();
		},
		[onClose],
	);

	const menuRef = useRef<HTMLDivElement>(null);
	const overflowMenuTestId = testId ? `${testId}--overflow-menu` : undefined;

	// Arrow key navigation inside the open menu
	useArrowNavigation({
		containerRef: menuRef,
		onClose,
		isEnabled: isOpen,
	});

	// ArrowDown-to-open: when the trigger is focused and the menu is closed,
	// pressing ArrowDown opens the menu (WAI-ARIA menu button pattern).
	// We track focus on the trigger wrapper to avoid threading onFocus/onBlur
	// through the renderMoreButton/MoreIndicator prop plumbing.
	const triggerWrapperRef = useRef<HTMLSpanElement>(null);
	const { isFocused, bindFocus: triggerFocusBind } = useFocus();
	useEffect(() => {
		if (!isFocused || isOpen) {
			return;
		}

		return bind(window, {
			type: 'keydown',
			listener: function openOnArrowDown(e: KeyboardEvent) {
				if (e.key === KEY_DOWN) {
					// Prevent page scroll when opening the menu via ArrowDown.
					e.preventDefault();
					handleTriggerClicked(e);
				}
			},
		});
	}, [isFocused, isOpen, handleTriggerClicked]);

	return (
		<Popup placement={topLayerPlacement} onClose={handleOnClose} testId={overflowMenuTestId}>
			<Popup.TriggerFunction>
				{({ ref, ariaAttributes }) => (
					// Workaround: wrapping span to track trigger focus for ArrowDown-to-open.
					//
					// The `useFocus` hook needs onFocus/onBlur on the trigger element,
					// but we cannot thread those through the renderMoreButton → MoreIndicator
					// prop plumbing without changing those APIs (onFocus/onBlur would need
					// to go into MoreIndicator's `buttonProps`, but renderMoreButton does not
					// expose that).
					//
					// Using `display: contents` so the span does not affect layout — the
					// button renders as if the span were not there. Focus events from the
					// button bubble up to this span, allowing useFocus to track state.
					//
					// If MoreIndicator's API is refactored to accept focus handlers via
					// buttonProps, this wrapper can be removed.
					<span
						ref={triggerWrapperRef}
						onFocus={triggerFocusBind.onFocus}
						onBlur={triggerFocusBind.onBlur}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- display: contents is a layout-neutral wrapper; it cannot affect visual output.
						style={{ display: 'contents' }}
					>
						{renderMoreButton({
							ref,
							'aria-controls': isOpen ? ariaAttributes['aria-controls'] : undefined,
							'aria-expanded': isOpen,
							'aria-haspopup': true,
							onClick: handleTriggerClicked,
						})}
					</span>
				)}
			</Popup.TriggerFunction>
			<Popup.Content
				role="menu"
				label="avatar group"
				isOpen={isOpen}
				animate={animation}
				testId={overflowMenuTestId ? `${overflowMenuTestId}--content` : undefined}
			>
				<Popup.Surface>
					<div ref={menuRef}>
						<MenuGroup minWidth={250} maxHeight={300}>
							<Section titleId={labelId} testId={testId ? `${testId}--section` : undefined}>
								{data.slice(max).map((avatar, index) =>
									getOverrides(overrides).AvatarGroupItem.render(
										AvatarGroupItem,
										{
											avatar,
											onAvatarClick,
											testId: testId ? `${testId}--avatar-group-item-${index + max}` : undefined,
											index: index + max,
											role: 'menuitem',
										},
										index + max,
									),
								)}
							</Section>
						</MenuGroup>
					</div>
				</Popup.Surface>
			</Popup.Content>
		</Popup>
	);
}
