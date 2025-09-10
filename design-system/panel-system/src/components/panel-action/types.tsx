import type { ComponentType, MouseEvent, ReactNode } from 'react';

export interface PanelActionProps {
	/**
	 * The content of the action button.
	 */
	children?: ReactNode;
	/**
	 * Click handler for button actions.
	 */
	onClick?: (event: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLAnchorElement>) => void;
	/**
	 * URL for link actions.
	 */
	href?: string;
	/**
	 * Unique string that appears as a data attribute `data-testid` in the rendered code,
	 * often used for automated tests
	 */
	testId?: string;
	/**
	 * Target attribute for links (e.g., "_blank").
	 */
	target?: string;
	/**
	 * Rel attribute for links (e.g., "noopener noreferrer").
	 */
	rel?: string;
	/**
	 * Aria-label for accessibility.
	 */
	'aria-label'?: string;
	/**
	 * Aria-haspopup for accessibility.
	 */
	'aria-haspopup'?: boolean | 'true' | 'false';
	/**
	 * Icon component for icon-only buttons.
	 */
	icon?: ComponentType<any>;
	/**
	 * Label for icon buttons (used for accessibility).
	 */
	label?: string;
}
