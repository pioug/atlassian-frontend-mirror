import { type ActionItem, type BlockProps, type OnActionMenuOpenChangeOptions } from '../types';

export type FooterBlockProps = {
	/**
	 * An array of actions to be displayed on the right.
	 * Adding more than three actions will result in the second and following
	 * actions being hidden inside of a dropdown
	 * @see ActionItem
	 */
	actions?: ActionItem[];

	/**
	 * Allows rendering of the footer regardless of whether the block has resolved
	 */
	alwaysShow?: boolean;
	/**
	 * Allows hiding of the resources provider
	 */
	hideProvider?: boolean;
	/**
	 * Used with RovoActions to determine if the preview block is visible or not
	 */
	isPreviewBlockErrored?: boolean;
	/**
	 * Function to be called when footer action dropdown open state is changed.
	 */
	onActionMenuOpenChange?: (options: OnActionMenuOpenChangeOptions) => void;
} & BlockProps;
