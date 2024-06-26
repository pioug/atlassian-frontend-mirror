export type PresetSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export type Size = PresetSize | number;
export type Appearance = 'inherit' | 'invert';

export type SpinnerProps = {
	/**
	 * You can use this to invert the current theme.
	 * This is useful when you are displaying a spinner on a background that is not the same background color scheme as the main content.
	 */
	appearance?: Appearance;

	/**
	 * Delay the intro animation of `Spinner`.
	 * This is not to be used to avoid quick flickering of `Spinner`.
	 * `Spinner` will automatically fade in and takes ~200ms to become partially visible.
	 * This prop can be helpful for **long delays** such as `500-1000ms` for when you want to not
	 * show a `Spinner` until some longer period of time has elapsed.
	 */
	delay?: number;

	/**
	 * An optional `interactionName` used to identify when this component is holding an interaction.
	 */
	interactionName?: string;

	/**
	 * Describes what the spinner is doing for assistive technologies. For example, "loading", "submitting", or "processing".
	 */
	label?: string;

	/**
	 * Size of the spinner. The available sizes are `xsmall`, `small`, `medium`, `large`, and `xlarge`. For most use cases, we recommend `medium`.
	 */
	size?: Size;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
};
