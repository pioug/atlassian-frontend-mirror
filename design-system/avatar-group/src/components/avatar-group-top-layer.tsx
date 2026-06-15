import React, { type MouseEventHandler, useCallback, useEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { KEY_DOWN } from '@atlaskit/ds-lib/keycodes';
import { MenuGroup, Section } from '@atlaskit/menu';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map';
import { Popover, type TPopoverCloseReason } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { useArrowNavigation } from '@atlaskit/top-layer/use-arrow-navigation';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

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

	const triggerRef = useRef<HTMLElement | null>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const overflowMenuTestId = testId ? `${testId}--overflow-menu` : undefined;

	const popoverId = usePopoverId();

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: topLayerPlacement,
		isOpen,
	});

	// Arrow key navigation inside the open menu
	useArrowNavigation({
		containerRef: menuRef,
		onClose,
		isEnabled: isOpen,
	});

	// ArrowDown-to-open: when the trigger is focused and the menu is closed,
	// pressing ArrowDown opens the menu (WAI-ARIA menu button pattern).
	//
	// Bind the keydown listener directly to the trigger element via its ref so
	// that opening the menu does not trigger a focus-driven re-render of the
	// host component, which would unmount and remount the menu items and drop
	// menuitem focus.
	useEffect(() => {
		const trigger = triggerRef.current;
		if (!trigger || isOpen) {
			return;
		}

		return bind(trigger, {
			type: 'keydown',
			listener: function openOnArrowDown(event: KeyboardEvent) {
				if (event.key === KEY_DOWN) {
					// Prevent page scroll when opening the menu via ArrowDown.
					event.preventDefault();
					handleTriggerClicked(event);
				}
			},
		});
	}, [isOpen, handleTriggerClicked]);

	const triggerAria = getAriaForTrigger({ role: 'menu', isOpen, popoverId });

	const setTriggerRef = useCallback((node: HTMLElement | null) => {
		triggerRef.current = node;
	}, []);

	return (
		<>
			{renderMoreButton({
				ref: setTriggerRef,
				...triggerAria,
				onClick: handleTriggerClicked,
			})}
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="menu"
				label="avatar group"
				isOpen={isOpen}
				onClose={handleOnClose}
				animate={animation}
				placement={topLayerPlacement}
				testId={overflowMenuTestId ? `${overflowMenuTestId}--content` : undefined}
			>
				<PopoverSurface>
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
				</PopoverSurface>
			</Popover>
		</>
	);
}
