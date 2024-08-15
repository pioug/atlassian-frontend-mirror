import {
	type ComponentType,
	type CSSProperties,
	type Dispatch,
	type PropsWithChildren,
	type default as React,
	type ReactNode,
	type Ref,
	type SetStateAction,
} from 'react';

import { type Modifier, type Placement, type PopperChildrenProps } from '@atlaskit/popper';

export interface TriggerProps {
	ref: Ref<any>;
	'aria-controls'?: string;
	'aria-expanded': boolean;
	'aria-haspopup': boolean | 'dialog';
}

export type PopupRef = HTMLDivElement | null;
export type TriggerRef = HTMLElement | HTMLButtonElement | null;

export interface ContentProps {
	/**
	 * This will reposition the popup if any of the content has changed.
	 * This is useful when positions change, and the popup wasn't aware.
	 */
	update: PopperChildrenProps['update'];

	/**
	 * Passed through from the parent popup.
	 */
	isOpen: boolean;

	/**
	 * Passed through from the parent popup.
	 */
	onClose?: BaseProps['onClose'];

	/**
	 * Escape hatch to set the initial focus for a specific element, when the popup is opened.
	 */
	setInitialFocusRef: Dispatch<SetStateAction<HTMLElement | null>>;
}

export interface PopupComponentProps {
	/**
	 * Children passed through by the parent popup.
	 */
	children: ReactNode;

	/**
	 * Placement passed through by the parent popup.
	 */
	'data-placement': Placement;

	/**
	 * Test ID passed through by the parent popup.
	 */
	'data-testid'?: string;

	/**
	 * ID passed through by the parent popup.
	 */
	id?: string;

	/**
	 * Ref that should be assigned to the root element.
	 */
	ref: Ref<HTMLDivElement>;

	/**
	 * Style that should be assigned to the root element.
	 */
	style: CSSProperties;

	/**
	 * Tab index passed through by the parent popup.
	 */
	tabIndex: number | undefined;

	/**
	 * The root element where the popup should be rendered.
	 * The default is `false`.
	 */
	shouldRenderToParent?: boolean;

	/**
	 * This fits the popup width to its parent's width.
	 * When set to `true`, the trigger and popup elements will be wrapped in a `div` with `position: relative`.
	 * The popup will be rendered as a sibling to the trigger element, and will be full width.
	 * The default is `false`.
	 */
	shouldFitContainer?: boolean;

	/**
	 * Use this to set the accessibility role for the popup.
	 * We strongly recommend using only `menu` or `dialog`.
	 */
	role?: string;
}

interface BaseProps {
	/**
	 * Use this to either show or hide the popup.
	 * When set to `false` the popup will not render anything to the DOM.
	 */
	isOpen: boolean;

	/**
	 * Render props for content that is displayed inside the popup.
	 */
	content: (props: ContentProps) => React.ReactNode;

	/**
	 * ID that is assigned to the popup container element.
	 */
	id?: string;

	/**
	 * The distance the popup should be offset from the reference in the format of [along, away] (units in px).
	 * The default is `[0, 8]`, which means the popup will be `8px` away from the edge of the reference specified
	 * by the `placement` prop.
	 */
	offset?: [number, number];

	/**
	 * Placement of where the popup should be displayed relative to the trigger element.
	 * The default is `"auto"`.
	 */
	placement?: Placement;

	/**
	 * This is a list of backup placements for the popup to try.
	 * When the preferred placement doesn't have enough space,
	 * the modifier will test the ones provided in the list, and use the first suitable one.
	 * If no fallback placements are suitable, it reverts back to the original placement.
	 */
	fallbackPlacements?: Placement[];

	/**
	 * The boundary element that the popup will check for overflow.
	 * The default is `"clippingParents"` which are parent scroll containers,
	 * but can be set to any element.
	 */
	boundary?: 'clippingParents' | HTMLElement;

	/**
	 * The root boundary that the popup will check for overflow.
	 * The default is `"viewport"` but it can be set to `"document"`.
	 */
	rootBoundary?: 'viewport' | 'document';

	/**
	 * Allows the popup to be placed on the opposite side of its trigger if it doesn't fit in the viewport.
	 * The default is `true`.
	 */
	shouldFlip?: boolean;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * Handler that is called when the popup wants to close itself.
	 * This happens either when clicking away from the popup or pressing the escape key.
	 * You'll want to use this to set open state accordingly, and then pump it back into the `isOpen` prop.
	 */
	onClose?(event: Event | React.MouseEvent | React.KeyboardEvent): void;

	/**
	 * The element that is shown when `isOpen` prop is `true`.
	 * The result of the `content` prop will be placed as children here.
	 * The default is an element with an elevation of `e200` with _no padding_.
	 */
	popupComponent?: ComponentType<PopupComponentProps>;

	/**
	 * This controls whether the popup takes focus when opening.
	 * This changes the `popupComponent` component tabIndex to `null`.
	 * The default is `true`.
	 */
	autoFocus?: boolean;

	/**
	 * This controls if the event which handles clicks outside the popup is be bound with
	 *  `capture: true`.
	 */
	shouldUseCaptureOnOutsideClick?: boolean;

	/**
	 * The root element where the popup should be rendered.
	 * Defaults to `false`.
	 */
	shouldRenderToParent?: boolean;

	/**
	 * This fits the popup width to its parent's width.
	 * When set to `true`, the trigger and popup elements will be wrapped in a `div` with `position: relative`.
	 * The popup will be rendered as a sibling to the trigger element, and will be full width.
	 * The default is `false`.
	 */
	shouldFitContainer?: boolean;

	/**
	 * This makes the popup close on Tab key press. It will only work when `shouldRenderToParent` is `true`.
	 * The default is `false`.
	 */
	shouldDisableFocusLock?: boolean;

	/**
	 * This controls the positioning strategy to use. Can vary between `absolute` and `fixed`.
	 * The default is `fixed`.
	 */
	strategy?: 'absolute' | 'fixed';

	/**
	 * Use this to set the accessibility role for the popup.
	 * We strongly recommend using only `menu` or `dialog`.
	 * Must be used along with `label` or `titleId`.
	 */
	role?: string;

	/**
	 * Refers to an `aria-label` attribute. Sets an accessible name for the popup to announce it to users of assistive technology.
	 * Usage of either this, or the `titleId` attribute is strongly recommended.
	 */
	label?: string;

	/**
	 * Id referenced by the popup `aria-labelledby` attribute.
	 * Usage of either this, or the `label` attribute is strongly recommended.
	 */
	titleId?: string;

	/**
	 * Additional modifiers and modifier overwrites.
	 * for more details - https://popper.js.org/docs/v1/#modifiers
	 */
	modifiers?: Partial<Modifier<string, object>>[];
}

interface InternalPopupProps extends BaseProps {
	/**
	 * Render props used to anchor the popup to your content.
	 * Make this an interactive element,
	 * such as an `@atlaskit/button` component.
	 */
	trigger: (props: TriggerProps) => React.ReactNode;

	/**
	 * Z-index that the popup should be displayed in.
	 * This is passed to the portal component.
	 * The default is `layers.layer()` from `@atlaskit/theme`.
	 */
	zIndex?: number;
}

type StandardPopupProps = InternalPopupProps & {
	shouldFitContainer?: false;
};

type ShouldFitContainerPopupProps = InternalPopupProps & {
	shouldFitContainer: true;
	shouldRenderToParent?: true;
	strategy?: 'absolute';
};

export type PopupProps = StandardPopupProps | ShouldFitContainerPopupProps;

export interface PopperWrapperProps extends BaseProps {
	triggerRef: TriggerRef;
}

export type CloseManagerHook = Pick<PopupProps, 'isOpen' | 'onClose'> & {
	popupRef: PopupRef;
	triggerRef: TriggerRef;
	shouldUseCaptureOnOutsideClick?: boolean;
	shouldCloseOnTab?: boolean;
	shouldDisableFocusTrap: boolean;
	shouldRenderToParent?: boolean;
	autoFocus: boolean;
};

export type FocusManagerHook = {
	initialFocusRef: HTMLElement | null;
	popupRef: PopupRef;
	shouldCloseOnTab?: boolean;
	triggerRef: TriggerRef;
	autoFocus: boolean;
	shouldDisableFocusTrap: boolean;
};

export type RepositionOnUpdateProps = PropsWithChildren<{
	update: PopperChildrenProps['update'];
}>;
