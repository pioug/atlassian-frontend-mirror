/* eslint-disable @atlaskit/design-system/use-visually-hidden */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, Fragment, useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@compiled/react';

import { durations, easeInOut } from '@atlaskit/motion';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

export type RatingRender = (props: { isChecked: boolean }) => React.ReactNode;

export interface RatingProps {
	/**
	 * Label for the rating item.
	 * This will be read by screen readers as well as used in the tooltip when hovering over the item.
	 */
	label: string;

	/**
   * This is passed to the radio button input.

   * When using this with the `<Rating />` component this is handled for you.
   */
	name?: string;

	/**
   * Sets checked state on the rating item.

   * When using this with the `<Rating />` component this is handled for you.
   */
	isChecked?: boolean;

	/**
   A `testId` prop is provided for specified elements,
   which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   serving as a hook for automated tests.

   Will set two elements:

   * The label as `"{testId}--label"`
   * The radio button as `"{testId}--input"`
   * The unchecked icon container `"{testId}--icon-container"`
   * The checked icon container `"{testId}--icon-checked-container"`

   When using this with the `<Rating />` component this will inherit its `testId` as `"{testId}--{index}--{element}"`,
   for example label would be `"{testId}--{index}--label"`.
   */
	testId?: string;

	/**
	 * Value of the rating item.
	 * This will be passed back in the `onChange()` handler when checked.
	 */
	value: string;

	/**
   * Id that is passed to both the label and the radio button element.
   * This is needed to declare their relationship.

   * When using this with the `<Rating />` component this is handled for you.
   */
	id?: string;

	/**
   * Handler that is called back whenever the radio button element changes its checked state.
   * When checked will be passed the `value` -
   * when unchecked will be passed `undefined`.

   * When using this with the `<Rating />` component this is handled for you.
   */
	onChange?: (value?: string) => void;
}

export interface InternalRatingProps extends RatingProps {
	/**
	 * Render callback that should return a ReactNode.
	 * Is passed an argument which is an object with one property `isChecked`.
	 */
	render: RatingRender;
}

const Rating = forwardRef<HTMLLabelElement, InternalRatingProps>(
	({ isChecked, name, testId, label, id, value, onChange, render, ...props }, ref) => {
		const onChangeHandler = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				onChange && onChange(e.target.checked ? value : undefined);
			},
			[onChange, value],
		);

		return (
			<Fragment>
				{/* eslint-disable-next-line jsx-a11y/label-has-for */}
				<label
					{...props}
					ref={ref}
					htmlFor={id}
					data-testid={testId && `${testId}--label`}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						transition: `transform ${durations.small}ms ${easeInOut}`,
						transform: isChecked ? 'scale(1.2)' : undefined,
					}}
				>
					<Tooltip testId={testId && `${testId}--tooltip`} content={label} delay={10}>
						{/* When tooltip doesn't render markup move it above <label /> */}
						<div>
							<VisuallyHidden>{label}</VisuallyHidden>
							{/* We render two slots for the two states of the radio button so we don't need to use react state. */}
							<span
								aria-hidden="true"
								data-rating-icon
								data-testid={testId && `${testId}--icon-container`}
							>
								{render({ isChecked: false })}
							</span>
							<span
								aria-hidden="true"
								data-rating-icon-checked
								data-testid={testId && `${testId}--icon-checked-container`}
							>
								{render({ isChecked: true })}
							</span>
						</div>
					</Tooltip>
				</label>

				{/* When tooltip doesn't render markup add another to the input so when it gains focus the tooltip is displayed */}
				<VisuallyHidden testId={`input-container${!!isChecked ? '-checked' : ''}`}>
					{/* eslint-disable-next-line @atlaskit/design-system/no-html-radio */}
					<input
						id={id}
						onChange={onChangeHandler}
						checked={!!isChecked}
						value={value}
						name={name}
						data-testid={testId && `${testId}--input`}
						type="radio"
					/>
				</VisuallyHidden>
			</Fragment>
		);
	},
);

export default Rating;
