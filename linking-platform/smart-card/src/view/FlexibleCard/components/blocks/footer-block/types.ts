import { type ActionItem, type BlockProps } from '../types';
import { type OnActionMenuOpenChangeOptions } from '../types';

export type FooterBlockProps = {
	/**
	 * An array of actions to be displayed on the right.
	 * Adding more than three actions will result in the second and following
	 * actions being hidden inside of a dropdown
	 * @see ActionItem
	 */
	actions?: ActionItem[];

	/**
	 * Function to be called when footer action dropdown open state is changed.
	 */
	onActionMenuOpenChange?: (options: OnActionMenuOpenChangeOptions) => void;
	/**
	 * Allows hiding of the resources provider
	 */
	hideProvider?: boolean;
	/**
	 * Allows rendering of the footer regardless of whether the block has resolved
	 */
	alwaysShow?: boolean;
} & BlockProps;
