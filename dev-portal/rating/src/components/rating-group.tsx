/* eslint-disable @atlaskit/design-system/use-visually-hidden */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, cloneElement, Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { cssMap, jsx } from '@compiled/react';

import VisuallyHidden from '@atlaskit/visually-hidden';

const styles = cssMap({
	container: {
		display: 'inline-flex',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '0',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'[data-rating-icon-checked]': {
			display: 'inline-block',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'[data-rating-icon]': {
			display: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"label:hover ~ label [data-rating-icon-checked][data-rating-icon-checked], [data-testid='input-container-checked'] ~ label [data-rating-icon-checked]":
			{
				display: 'none',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"label:hover ~ label [data-rating-icon][data-rating-icon], [data-testid='input-container-checked'] ~ label [data-rating-icon]":
			{
				display: 'inline-block',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:hover [data-rating-icon-checked][data-rating-icon-checked]': {
			display: 'inline-block',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:hover [data-rating-icon][data-rating-icon]': {
			display: 'none',
		},
	},
});

export interface RatingGroupProps {
	/**
	 * Callback that is called everytime the rating changes.
	 * Use this in conjunction with `value` for [controlled behaviour](https://reactjs.org/docs/forms.html#controlled-components).
	 */
	onChange?: (value?: string) => void;

	/**
   * Group name for all of the child rating items.
   * If you have **multiple ratings on the same page make sure to have a unique name** for each group.

   * Defaults to `"ak--rating-group"`.
   */
	groupName?: string;

	/**
   * Will set the default checked value for a child radio rating item.
   * Use when wanting to use this in an [uncontrolled way](https://reactjs.org/docs/uncontrolled-components.html).

   * Do not use with `value`.
   */
	defaultValue?: string;

	/**
   * Value that is used to check a child rating item.
   * Use when wanting to use this in a [controlled way](https://reactjs.org/docs/forms.html#controlled-components).

   * Do not use with `defaultValue`.
   */
	value?: string;

	/**
   A `testId` prop is provided for specified elements,
   which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   serving as a hook for automated tests.

   Will set these elements:

   * The root container `"{testId}--root"`
   * The empty input `"{testId}--input-empty"` which is used to signify "nothing is selected yet".
   */
	testId?: string;

	/**
   * Pass in child rating items.
   * This component expects the markup to be defined in a particular way,
   * so if you pass extra wrapping markup expect undefined behaviour.

   * You can have any amount of child rating items.
   */
	children: JSX.Element | JSX.Element[];
}

export default function RatingGroup({
	groupName = 'ak--rating-group',
	onChange,
	defaultValue,
	value,
	testId,
	children,
}: RatingGroupProps) {
	const [currentValue, setValue] = useState(value || defaultValue);
	const [firstSelectionMade, setFirstSelectionMade] = useState(!!currentValue);
	const actualValue = value || currentValue;

	const onChangeHandler = (value: string) => {
		onChange && onChange(value);
		setValue(value);

		if (!firstSelectionMade) {
			setFirstSelectionMade(true);
		}
	};

	if (process.env.NODE_ENV !== 'production' && defaultValue && value) {
		// eslint-disable-next-line no-console
		console.error(`@atlaskit/rating
Don't use "defaultValue" with "value" you're trying to mix uncontrolled and controlled modes.
Use "defaultValue" or "value" happy days :-).
`);
	}

	return (
		<div
			data-testid={testId && `${testId}--root`}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={styles.container}
		>
			{!firstSelectionMade && (
				<Fragment>
					{/* eslint-disable-next-line, jsx-a11y/label-has-for */}
					<label htmlFor={`${groupName}--empty`}>Star Rating</label>
					<VisuallyHidden testId={`input-container${actualValue === undefined ? '-checked' : ''}`}>
						<input
							id={`${groupName}--empty`}
							data-testid={testId && `${testId}--input-empty`}
							type="radio"
							name={groupName}
							checked={actualValue === undefined}
							onChange={() => setValue(undefined)}
							value={undefined}
						/>
					</VisuallyHidden>
				</Fragment>
			)}

			{Children.map(children, (child, index) =>
				cloneElement(child, {
					onChange: onChangeHandler,
					name: groupName,
					id: `${groupName}--${index}`,
					isChecked: actualValue === child.props.value,
					testId: testId && `${testId}--${index}`,
				}),
			)}
		</div>
	);
}
