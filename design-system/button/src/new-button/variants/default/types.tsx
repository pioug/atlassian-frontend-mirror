import { type ButtonSpacing, type IconProp } from '../types';

export type CommonDefaultButtonProps = {
	/**
	 * Text content to be rendered in the button.
	 */
	children: React.ReactNode;
	/**
	 * Places an icon within the button, after the button's text.
	 */
	iconAfter?: IconProp;
	/**
	 * Places an icon within the button, before the button's text.
	 */
	iconBefore?: IconProp;
	/**
	 * Option to fit button width to its parent width.
	 */
	shouldFitContainer?: boolean;
	/**
	 * Controls the amount of padding in the button.
	 */
	spacing?: ButtonSpacing;
};
