import { type ComponentType, type MouseEvent, type ReactNode, type Ref } from 'react';

import { type CustomThemeButtonProps } from '@atlaskit/button/types';

interface Action extends Omit<CustomThemeButtonProps, 'children'> {
	key?: string;
	text?: ReactNode;
}

export type Actions = Action[];
export type ScrollLogicalPosition = 'start' | 'center' | 'end' | 'nearest';

export interface SpotlightProps {
	/**
	 * Buttons to render in the footer.
	 */
	actions?: Actions;
	/**
	 * An optional node to be rendered beside the footer actions.
	 */
	actionsBeforeElement?: ReactNode;
	/**
	 * The elements rendered in the modal.
	 */
	children?: ReactNode;
	/**
	 * Where the dialog should appear, relative to the contents of the children.
	 */
	dialogPlacement?:
		| 'top left'
		| 'top center'
		| 'top right'
		| 'right top'
		| 'right middle'
		| 'right bottom'
		| 'bottom left'
		| 'bottom center'
		| 'bottom right'
		| 'left top'
		| 'left middle'
		| 'left bottom';
	/**
	 * The width of the dialog in pixels. The minimum possible width is 160px and the maximum width is 600px.
	 */
	dialogWidth?: number;
	/**
	 * Optional element rendered below the body.
	 */
	footer?: ComponentType<any>;
	/**
	 * Optional element rendered above the body.
	 */
	header?: ComponentType<any>;
	/**
	 * Heading text rendered above the body.
	 */
	heading?: string;
	/**
	 * An optional element rendered to the right of the heading.
	 */
	headingAfterElement?: ReactNode;
	/**
	 * Path to the image.
	 */
	image?: string;
	/**
	 * Whether or not to display a pulse animation around the spotlighted element.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	pulse?: boolean;
	/**
	 * Whether the spotlight should check for changes to the spotlighted element or its position.
	 * This prop may negatively affect performance and should be used only if layout shifts are causing the spotlight to be positioned incorrectly.
	 */
	shouldWatchTarget?: boolean;
	/**
	 * The name of the SpotlightTarget.
	 */
	target?: string;
	/**
	 * The spotlight target node.
	 */
	targetNode?: HTMLElement;
	/**
	 * The background color of the element being highlighted.
	 */
	targetBgColor?: string;
	/**
	 * Function to fire when a person clicks on the cloned target.
	 */
	targetOnClick?: (eventData: { event: MouseEvent<HTMLElement>; target?: string }) => void;
	/**
	 * The border radius of the element being highlighted.
	 */
	targetRadius?: number | string;
	/**
	 * Alternative element to render than the wrapped target.
	 */
	targetReplacement?: ComponentType<any>;
	/**
	 * This prop is a unique string that appears as an attribute `data-testid` in the rendered HTML output serving as a hook for automated tests.
	 * Defaults to `"spotlight"`.
	 * As this component is composed of multiple components we use this `testId` as a prefix:
	 * - `"${testId}--dialog"` to identify the spotlight dialog
	 * - `"${testId}--target"` to identify the spotlight target clone
	 */
	testId?: string;
	/**
	 * Used set the 'block' attribute on scrollIntoView, which determines the vertical alignment of the target node to the nearest scrollable ancestor.
	 */
	scrollPositionBlock?: ScrollLogicalPosition;
	/**
	 * Refers to an `aria-label` attribute. Sets an accessible name for the spotlight dialog wrapper to announce it to users of assistive technology.
	 * Usage of either this, or the `titleId` prop is strongly recommended to improve accessibility.
	 */
	label?: string;
	/**
	 * Refers to a value of an `aria-labelledby` attribute. References an element to define accessible name for the spotlight dialog.
	 * Usage of either this, or the `label` prop is strongly recommended to improve accessibility.
	 */
	titleId?: string;
}

export interface SpotlightCardProps {
	/**
	 * Buttons to render in the footer.
	 */
	actions?: Actions;
	/**
	 * An optional element rendered to the left of the footer actions.
	 */
	actionsBeforeElement?: ReactNode;
	/**
	 * The content of the card.
	 */
	children?: ReactNode;
	/**
	 * The container elements rendered by the component.
	 */
	components?: {
		Header?: ComponentType<any>;
		Footer?: ComponentType<any>;
	};
	/**
	 * The heading to be rendered above the body content.
	 */
	heading?: ReactNode;
	/**
	 * Specifies the heading level in the document structure.
	 * If not specified, level 4 will be applied by default.
	 */
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
	/**
	 * An optional element rendered to the right of the heading, usually used to number steps in a multi-step flow.
	 */
	headingAfterElement?: ReactNode;
	/**
	 * The image src to render above the heading.
	 */
	image?: string | ReactNode;
	/**
	 * Removes elevation styles if set.
	 */
	isFlat?: boolean;

	/**
	 * Specifies the width of the card component. Accepts either a number or the string '100%'.
	 * When a number is provided, the width is set in pixels. When '100%' is provided, the width
	 * is set to occupy 100% of the parent container's width. Regardless of whether `width` is set,
	 * the width is constrained to a minimum width of 160px and a maximum width of 600px.
	 */
	width?: number | '100%';
	/**
	 * @deprecated
	 * Use `ref` instead.
	 */
	innerRef?: Ref<HTMLDivElement> | null;
	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * The ID of heading.
	 */
	headingId?: string;
}
