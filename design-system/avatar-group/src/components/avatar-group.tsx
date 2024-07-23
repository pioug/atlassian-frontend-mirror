/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ElementType, type MouseEventHandler, useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { bind, type UnbindFn } from 'bind-event-listener';

import Avatar, { type SizeType } from '@atlaskit/avatar';
import { KEY_DOWN } from '@atlaskit/ds-lib/keycodes';
import noop from '@atlaskit/ds-lib/noop';
import useFocus from '@atlaskit/ds-lib/use-focus-event';
import { Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { layers } from '@atlaskit/theme/constants';
import Tooltip, { type PositionType } from '@atlaskit/tooltip';

import AvatarGroupItem from './avatar-group-item';
import Grid from './grid';
import FocusManager from './internal/components/focus-manager';
import PopupAvatarGroup from './internal/components/popup-avatar-group';
import MoreIndicator from './more-indicator';
import Stack from './stack';
import {
	type AvatarGroupOverrides,
	type AvatarProps,
	type DeepRequired,
	type onAvatarClickHandler,
} from './types';
import { composeUniqueKey } from './utils';

const MAX_COUNT = {
	grid: 11,
	stack: 5,
};

export interface AvatarGroupProps {
	/**
	 * Indicates the layout of the avatar group.
	 * Avatars will either be overlapped in a stack, or
	 * laid out in an even grid formation.
	 * Defaults to "stack".
	 */
	appearance?: 'grid' | 'stack';

	/**
	 * Component used to render each avatar.
	 */
	avatar?: typeof Avatar | ElementType<AvatarProps>;

	/**
	 * The maximum number of avatars allowed in the list.
	 * Defaults to 5 when displayed as a stack,
	 * and 11 when displayed as a grid.
	 */
	maxCount?: number;

	/**
	 * Defines the size of the avatar.
	 * Defaults to "medium".
	 */
	size?: SizeType;

	/**
	 * Typically the background color that the avatar is presented on.
	 * Accepts any color argument that the CSS border-color property accepts.
	 */
	borderColor?: string;

	/**
	 * An array of avatar prop data, that are spread onto each `avatar` component.
	 *
	 * For further usage information on AvatarPropTypes, the supported props for `avatar`, refer to [Avatar's prop documentation](https://atlassian.design/components/avatar/code).
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Array<AvatarProps>;

	/**
	 * Handle the click event on the avatar item.
	 * Note that if an onClick prop is provided as part of avatar data, it will take precedence over onAvatarClick.
	 */
	onAvatarClick?: onAvatarClickHandler;

	/**
	 * Take control of the click event on the more indicator.
	 * This will cancel the default dropdown behavior.
	 */
	onMoreClick?: MouseEventHandler;

	/**
	 * Provide additional props to the MoreButton.
	 * Example use cases: altering tab order by providing tabIndex;
	 * adding onClick behaviour without losing the default dropdown
	 */
	showMoreButtonProps?: Partial<React.HTMLAttributes<HTMLElement>>;

	/**
	 * Element the overflow popup should be attached to.
	 * Defaults to "viewport".
	 */
	boundariesElement?: 'viewport' | 'window' | 'scrollParent';

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	//

	/**
	 * Will set these elements when defined:
	 * - Container element - `{testId}--avatar-group`
	 * - Avatar items - `{testId}--avatar-{index}`
	 * - Overflow menu button - `{testId}--overflow-menu--trigger`
	 * - Overflow menu content - `{testId}--overflow-menu--content`
	 */
	testId?: string;

	/**
	 * Custom overrides for the composed components.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	overrides?: AvatarGroupOverrides;

	/**
	 *
	 * Where the tooltip should appear relative to its target.
	 * Defaults to tooltip position "bottom".
	 */
	tooltipPosition?: Extract<PositionType, 'bottom' | 'top'>;

	/**
	 * Disables tooltips.
	 */
	isTooltipDisabled?: boolean;

	/**
	 * Text to be used as aria-label for the list of avatars.
	 * Screen reader announcement with default label, which is `avatar group`, is `list, avatar group, X items`.
	 *
	 * The label should describe the `AvatarGroup`'s entities, for instance:
	 * - `label="team members"`, screen reader announcement would be `list team members, X items`
	 * - `label="reviewers"` screen reader announcement would be `list reviewers, X items`
	 *
	 * When there are several AvatarGroups on the page you should use a unique label to let users distinguish different lists.
	 */
	label?: string;

	/**
	 * Determines whether the 'show more' popup has `shouldRenderToParent` applied.
	 */
	shouldPopupRenderToParent?: boolean;
}

function getOverrides(overrides?: AvatarGroupOverrides): DeepRequired<AvatarGroupOverrides> {
	return {
		AvatarGroupItem: {
			render: (Component, props, index) => (
				<Component {...props} key={composeUniqueKey(props.avatar, index)} />
			),
			...(overrides && overrides.AvatarGroupItem),
		},
		Avatar: {
			render: (Component, props, index) => (
				<Component {...props} key={composeUniqueKey(props, index)} />
			),
			...(overrides && overrides.Avatar),
		},
	};
}

/**
 * __Avatar group__
 *
 * An avatar group displays a number of avatars grouped together in a stack or grid.
 *
 * - [Examples](https://atlassian.design/components/avatar-group/examples)
 * - [Code](https://atlassian.design/components/avatar-group/code)
 * - [Usage](https://atlassian.design/components/avatar-group/usage)
 */
const AvatarGroup = ({
	appearance = 'stack',
	avatar = Avatar,
	borderColor,
	boundariesElement,
	data,
	isTooltipDisabled,
	maxCount,
	onAvatarClick,
	onMoreClick,
	overrides,
	showMoreButtonProps = {},
	size = 'medium',
	testId,
	label = 'avatar group',
	tooltipPosition = 'bottom',
	shouldPopupRenderToParent = false,
}: AvatarGroupProps) => {
	const [isTriggeredUsingKeyboard, setTriggeredUsingKeyboard] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const onClose = useCallback(() => setIsOpen(false), []);

	const handleTriggerClicked = useCallback((event: React.MouseEvent | KeyboardEvent) => {
		const { clientX, clientY, type } = event as React.MouseEvent;
		// Hitting enter/space is registered as a click with both clientX and clientY === 0
		if (type === 'keydown' || clientX === 0 || clientY === 0) {
			setTriggeredUsingKeyboard(true);
		}
		setIsOpen((isOpen) => !isOpen);
	}, []);

	const { isFocused, bindFocus } = useFocus();

	// When a trigger is focused, we want to open the popup
	// the user presses the DownArrow
	useEffect(() => {
		// Set initial value if popup is closed
		if (!isOpen) {
			setTriggeredUsingKeyboard(false);
		}

		// Only need to listen for keydown when focused
		if (!isFocused) {
			return noop;
		}

		// Being safe: we don't want to open the popup if it is already open
		// Note: This shouldn't happen as the trigger should not be able to get focus
		if (isOpen) {
			return noop;
		}

		bind(window, {
			type: 'keydown',
			listener: function openOnKeyDown(e: KeyboardEvent) {
				if (e.key === KEY_DOWN) {
					// prevent page scroll
					e.preventDefault();
					handleTriggerClicked(e);
				}
			},
		});

		const unbind: UnbindFn = () => {
			bind(window, {
				type: 'keydown',
				listener: function openOnKeyDown(e: KeyboardEvent) {
					if (e.key === KEY_DOWN) {
						// prevent page scroll
						e.preventDefault();
						handleTriggerClicked(e);
					}
				},
			});
		};

		return unbind;
	}, [isFocused, isOpen, handleTriggerClicked]);

	function renderMoreDropdown(max: number, total: number) {
		if (total <= max) {
			return null;
		}

		const renderMoreButton = (
			props: {
				'aria-controls'?: string;
				'aria-expanded'?: boolean;
				'aria-haspopup'?: boolean;
			} & {
				onClick: MouseEventHandler;
			},
		) => (
			<MoreIndicator
				buttonProps={showMoreButtonProps}
				borderColor={borderColor}
				count={total - max}
				size={size}
				testId={testId && `${testId}--overflow-menu--trigger`}
				isActive={isOpen}
				{...(props as any)}
			/>
		);

		// bail if the consumer wants to handle onClick
		if (typeof onMoreClick === 'function') {
			return renderMoreButton({
				onClick: onMoreClick,
			});
		}

		// split boundariesElement into `boundary` and `rootBoundary` props for Popup
		const boundary = boundariesElement === 'scrollParent' ? 'clippingParents' : undefined;
		const rootBoundary = (() => {
			if (boundariesElement === 'scrollParent') {
				return undefined;
			}
			return boundariesElement === 'window' ? 'document' : 'viewport';
		})();

		return (
			<Popup
				isOpen={isOpen}
				onClose={onClose}
				placement="bottom-end"
				boundary={boundary}
				rootBoundary={rootBoundary}
				shouldFlip
				zIndex={layers.modal()}
				shouldRenderToParent={shouldPopupRenderToParent}
				content={({ setInitialFocusRef }) => (
					<FocusManager>
						<PopupAvatarGroup
							onClick={(e) => e.stopPropagation()}
							minWidth={250}
							maxHeight={300}
							setInitialFocusRef={isTriggeredUsingKeyboard ? setInitialFocusRef : undefined}
						>
							<Section>
								{data.slice(max).map((avatar, index) =>
									getOverrides(overrides).AvatarGroupItem.render(
										AvatarGroupItem,
										{
											avatar,
											onAvatarClick,
											testId: testId && `${testId}--avatar-group-item-${index + max}`,
											index: index + max,
										},
										// This index holds the true index,
										// adding up the index of non-overflowed avatars and overflowed avatars.
										index + max,
									),
								)}
							</Section>
						</PopupAvatarGroup>
					</FocusManager>
				)}
				trigger={(triggerProps) =>
					renderMoreButton({
						...triggerProps,
						...bindFocus,
						onClick: handleTriggerClicked,
					})
				}
				testId={testId && `${testId}--overflow-menu`}
			/>
		);
	}

	const max = maxCount === undefined || maxCount === 0 ? MAX_COUNT[appearance] : maxCount;
	const total = data.length;
	const maxAvatar = total > max ? max - 1 : max;
	const Group = appearance === 'stack' ? Stack : Grid;

	return (
		<Group testId={testId && `${testId}--avatar-group`} aria-label={label}>
			{data.slice(0, maxAvatar).map((avatarData, idx) => {
				const callback = avatarData.onClick || onAvatarClick;
				const finalAvatar = getOverrides(overrides).Avatar.render(
					avatar,
					{
						...avatarData,
						size,
						borderColor,
						testId: testId && `${testId}--avatar-${idx}`,
						onClick: callback
							? (event, analyticsEvent) => {
									callback(event, analyticsEvent, idx);
								}
							: undefined,
						stackIndex: max - idx,
					},
					idx,
				);

				return !isTooltipDisabled && !avatarData.isDisabled ? (
					<Tooltip
						key={composeUniqueKey(avatarData, idx)}
						content={avatarData.name}
						testId={testId && `${testId}--tooltip-${idx}`}
						position={tooltipPosition}
					>
						{finalAvatar}
					</Tooltip>
				) : (
					finalAvatar
				);
			})}
			{renderMoreDropdown(+maxAvatar, total)}
		</Group>
	);
};

export default AvatarGroup;
