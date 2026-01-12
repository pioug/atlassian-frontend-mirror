import { type ComponentType, type ReactNode } from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type Placement } from '@atlaskit/popper';

import { type TooltipPrimitiveProps } from './tooltip-primitive';

export type PositionTypeBase = Placement;
// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type PositionType = PositionTypeBase | 'mouse' | 'mouse-y' | 'mouse-x';

export interface TriggerProps {
	onMouseOver: (event: React.MouseEvent<HTMLElement>) => void;
	onMouseOut: (event: React.MouseEvent<HTMLElement>) => void;
	onMouseMove: ((event: React.MouseEvent<HTMLElement>) => void) | undefined;
	onMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
	onFocus: (event: React.FocusEvent<HTMLElement>) => void;
	onBlur: (event: React.FocusEvent<HTMLElement>) => void;
	ref: (node: HTMLElement | null) => void;
	// We can make this required once the wrapped children approach is deprecated
	'aria-describedby'?: string | undefined;
}

export interface TooltipProps {
	/**
	 * The content of the tooltip. It can be either a:
	 * 1. `ReactNode`
	 * 2. Function which returns a `ReactNode`
	 * The benefit of the second approach is that it allows you to consume the `update` render prop.
	 * This `update` function can be called to manually recalculate the position of the tooltip.
	 *
	 * This content will be rendered into two places:
	 * 1. Into the tooltip
	 * 2. Into a hidden element for screen readers (unless `isScreenReaderAnnouncementDisabled` is set to `true`)
	 *
	 */
	content: ReactNode | (({ update }: { update?: () => void }) => ReactNode);

	/**
	 * Extend `TooltipPrimitive` to create your own tooltip and pass it as component.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	component?:
		| ComponentType<TooltipPrimitiveProps>
		| React.ForwardRefExoticComponent<
				React.PropsWithoutRef<TooltipPrimitiveProps> & React.RefAttributes<HTMLDivElement>
		  >;

	/**
	 * Time in milliseconds to wait before showing and hiding the tooltip. Defaults to 300.
	 */
	delay?: number;

	/**
	 * Adds `pointer-events: none` to the tooltip itself. Setting this to true will also prevent the tooltip from persisting when hovered.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	ignoreTooltipPointerEvents?: boolean;

	/**
	 * Hide the tooltip when the click event is triggered. Use this when the tooltip should be hidden if `onClick` react synthetic event
	 * is triggered, which happens after `onMouseDown` event.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	hideTooltipOnClick?: boolean;

	/**
	 * Hide the tooltip when the mousedown event is triggered. This should be
	 * used when tooltip should be hidden if `onMouseDown` react synthetic event
	 * is triggered, which happens before `onClick` event.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	hideTooltipOnMouseDown?: boolean;

	/**
	 * Where the tooltip should appear relative to the mouse pointer.
	 * Only use this when the `position` prop is set to `"mouse"`, `"mouse-y"`, or `"mouse-x"`.
	 * When interacting with the target element using a keyboard, it will use this position against the target element instead.
	 */
	mousePosition?: PositionTypeBase;

	/**
	 * Whether or not the tooltip can be displayed. Once a tooltip
	 * is scheduled to be displayed, or is already displayed, it will
	 * continue to be shown.
	 *
	 * @description
	 *
	 * `canAppear()` is called in response to user events, and
	 * not during the rendering of components.
	 *
	 */
	canAppear?: () => boolean;

	/**
	 * By default tooltip content will be duplicated into a hidden element so
	 * it can be read out by a screen reader. Sometimes this is not ideal as
	 * it can result in the same content be announced twice. For those situations,
	 * you can leverage this prop to disable the duplicate hidden text.
	 */
	isScreenReaderAnnouncementDisabled?: boolean;

	/**
	 * Function to be called when the tooltip will be shown. It's called when the
	 * tooltip begins to animate in.
	 */
	onShow?: (analyticsEvent: UIAnalyticsEvent) => void;

	/**
	 * Function to be called when the tooltip will be hidden. It's called after the
	 * delay, when the tooltip begins to animate out.
	 */
	onHide?: (analyticsEvent: UIAnalyticsEvent) => void;

	/**
	 * Where the tooltip should appear relative to its target.
	 * If set to `"mouse"`, the tooltip will display next to the mouse pointer instead.
	 * If set to `"mouse-y"`, the tooltip will use the mouse Y coordinate but the target X coordinate.
	 * If set to `"mouse-x"`, the tooltip will use the mouse X coordinate but the target Y coordinate.
	 * Make sure to utilize the `mousePosition` if you want to customize where the tooltip will show in relation to the mouse.
	 */
	position?: PositionType;

	/**
	 * Replace the wrapping element. This accepts the name of a html tag which will
	 * be used to wrap the element.
	 * If you provide a component, it needs to support a ref prop which is used by popper for positioning.
	 */
	tag?:
		| keyof JSX.IntrinsicElements
		| React.ComponentType<React.AllHTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement> }>
		| React.ForwardRefExoticComponent<
				React.PropsWithoutRef<React.AllHTMLAttributes<HTMLElement>> &
					React.RefAttributes<HTMLElement>
		  >;

	/**
	 * Use this to show only one line of text, and truncate the text when it's too long.
	 *
	 * We no longer support truncating text in the tooltip as it's inaccessible, and this prop will be removed in a future release.
	 *
	 * @deprecated
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	truncate?: boolean;

	/**
	 * Elements to be wrapped by the tooltip.
	 * It can be either a:
	 * 1. `ReactNode`
	 * 2. Function which returns a `ReactNode`
	 */
	children: ReactNode | ((props: TriggerProps) => ReactNode);

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * Analytics context metadata.
	 */
	analyticsContext?: Record<string, any>;

	/**
	 * Use this to define the strategy of popper.
	 */
	strategy?: 'absolute' | 'fixed' | undefined;

	/**
	 * Display a keyboard shortcut in the tooltip.
	 *
	 * Keys will be displayed as individual keyboard key segments after the tooltip content.
	 */
	shortcut?: string[];

	/**
	 * When set to true, the tooltip will always use the fade-in animation
	 * and never use the show-immediate behavior, even when another tooltip
	 * is already visible.
	 */
	UNSAFE_shouldAlwaysFadeIn?: boolean;
}
