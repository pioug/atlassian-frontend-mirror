import { type ButtonSpacing, type IconProp, type IconSize } from '../types';

export type CommonDefaultButtonProps = {
	/**
	 * Text content to be rendered in the button. Required so that screen readers always have an accessible label provided for the button.
	 */
	children: React.ReactNode;
	/**
	 * Places an icon within the button, after the button's text.
	 */
	iconAfter?: IconProp;
	/**
	 * @deprecated Prefer `iconAfter` render prop for icon customizations.
	 *
	 * Set the size of the icon after. `medium` is default, so it does not need to be specified.
	 * This is UNSAFE as it will be removed in future in favor of a 100% bounded API
	 */
	UNSAFE_iconAfter_size?: IconSize;
	/**
	 * Places an icon within the button, before the button's text.
	 */
	iconBefore?: IconProp;
	/**
	 * @deprecated Prefer `iconBefore` render prop for icon customizations.
	 *
	 * Set the size of the icon before. `medium` is default, so it does not need to be specified.
	 * This is UNSAFE as it will be removed in future in favor of a 100% bounded API
	 */
	UNSAFE_iconBefore_size?: IconSize;
	/**
	 * Option to fit button width to its parent width.
	 */
	shouldFitContainer?: boolean;
	/**
	 * Controls the amount of padding in the button.
	 */
	spacing?: ButtonSpacing;
};
