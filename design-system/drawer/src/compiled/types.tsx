import {
	type ComponentType,
	type ReactElement,
	type ReactNode,
	type RefObject,
	type SyntheticEvent,
} from 'react';

import { type StrictXCSSProp } from '@atlaskit/css';
import { type Direction } from '@atlaskit/motion';

export type DrawerWidth = 'extended' | 'full' | 'medium' | 'narrow' | 'wide';

export interface BaseProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * The content of the drawer.
	 */
	children?: ReactNode;
	/**
	 * Sets the width of the drawer.
	 */
	width?: DrawerWidth;
	/**
	 * Sets the direction the draw enters from. The default is "left".
	 */
	enterFrom?: Direction;
	/**
	 * Controls if the drawer is open or closed.
	 */
	isOpen: boolean;
	/**
	 * A callback function that will be called when the drawer has finished its opening transition.
	 */
	onOpenComplete?: (node: HTMLElement | null) => void;
	/**
	 * A callback function that will be called when the drawer has finished its close transition.
	 */
	onCloseComplete?: (node: HTMLElement | null) => void;
}

export interface DrawerLabel {
	/**
	 * This is an `aria-label` attribute. It sets an accessible name for the drawer wrapper, for people who use assistive technology.
	 * Usage of either this, or the `titleId` attribute is strongly recommended.
	 */
	label?: string;
	/**
	 * This is an ID referenced by the drawer wrapper's `aria-labelledby` attribute. This ID should be assigned to the drawer `title` element.
	 * Usage of either this, or the `label` attribute is strongly recommended.
	 */
	titleId?: string;
}

export interface DrawerSidebarProps {
	/**
	 * The content of the sidebar.
	 */
	children?: ReactNode;
	xcss?: StrictXCSSProp<
		| 'padding'
		| 'paddingTop'
		| 'paddingBottom'
		| 'paddingLeft'
		| 'paddingRight'
		| 'backgroundColor'
		| 'width',
		never
	>;
}

export interface DrawerContentProps {
	/**
	 * The content of the drawer.
	 */
	children?: ReactNode;
	/**
	 * When the content is scrollable, this is the accessible name for the the drawer region. The default is "Scrollable content".
	 */
	scrollContentLabel?: string;
	xcss?: StrictXCSSProp<
		| 'padding'
		| 'paddingTop'
		| 'paddingBottom'
		| 'paddingLeft'
		| 'paddingRight'
		| 'marginTop'
		| 'backgroundColor',
		never
	>;
}

export interface DrawerCloseButtonProps {
	/**
	 * Use this to render an icon for the drawer close/back control, if it's available.
	 */
	icon?: ComponentType<any>;
	/**
	 * This is the accessible name for the close/back control of the drawer. The default is "Close drawer".
	 */
	label?: string;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

export interface DrawerPanelProps extends BaseProps, FocusLockSettings, DrawerLabel {
	onClose: (event: SyntheticEvent<HTMLElement>) => void;
}

export type DrawerProps = BaseProps &
	FocusLockSettings &
	DrawerLabel & {
		/**
		 * Callback function called while the drawer is displayed and `keydown` event is triggered.
		 */
		onKeyDown?: (event: SyntheticEvent) => void;
		/**
		 * Callback function called when the drawer is closed.
		 */
		onClose?: (event: SyntheticEvent<HTMLElement>, analyticsEvent?: any) => void;
		/**
		 * Z-index that the popup should be displayed in.
		 * This is passed to the portal component.
		 * Defaults to `unset`.
		 */
		zIndex?: number | 'unset';
	};

export interface FocusLockSettings {
	/**
	 * Controls whether to focus the first tabbable element inside the focus lock. Set to `true` by default.
	 */
	autoFocusFirstElem?: boolean;
	/**
	 * Enable this to keep focus inside the component until it’s closed. This is strongly recommended, as it prevents people who use assistive technology from accidentally navigating out of the drawer using the tab key.
	 */
	isFocusLockEnabled?: boolean;
	/**
	 * ReturnFocus controls what happens when the user exits focus lock mode.
	 * If true, focus returns to the trigger element . If false, focus remains where it was when the FocusLock was deactivated.
	 * If ref is passed, focus returns to that specific ref element.
	 */
	shouldReturnFocus?: boolean | RefObject<HTMLElement>;
}

export interface FocusLockProps extends FocusLockSettings {
	/**
	 * Content inside the focus lock.
	 * Must strictly be a ReactElement and it *must* be implemented to take a `ref` passed from `react-scrollock` to enable Touch Scrolling.
	 */
	children?: ReactElement;
}

/**
 * Type of keyboard event that triggers which key will should close the drawer.
 */
export type CloseTrigger = 'backButton' | 'blanket' | 'escKey';
