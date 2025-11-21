import React, { type ChangeEvent, type SyntheticEvent, useCallback, useState } from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import { useId } from '@atlaskit/ds-lib/use-id';

import Radio from './radio';
import { type OptionPropType, type OptionsPropType, type RadioValue } from './types';

export interface RadioGroupProps {
	id?: string;
	/**
	 * Once set, controls the selected value on the `RadioGroup`.
	 */
	value?: RadioValue | null;
	/**
	 * Sets the initial selected value on the `RadioGroup`.
	 */
	defaultValue?: RadioValue | null;
	/**
	 * Sets the disabled state of all `Radio` elements in the group. Overrides the `isDisabled` setting of all child `Radio` items.
	 */
	isDisabled?: boolean;
	/**
	 * Sets the required state of all `Radio` elements in the group.
	 */
	isRequired?: boolean;
	/**
	 * Sets the invalid state of all `Radio` elements in the group.
	 */
	isInvalid?: boolean;
	/**
	 * An array of objects, each object is mapped onto a `Radio` element within the group. Name must be unique to the group.
	 */
	options: OptionsPropType;
	/**
	 * Function that gets fired after each invalid event.
	 */
	onInvalid?: (event: SyntheticEvent<any>) => void;
	/**
	 * Function that gets after each change event.
	 */
	onChange?: (e: React.ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * Sets the `name` prop on each of the `Radio` elements in the group.
	 */
	name?: string;
	/**
	 * Additional information to be included in the `context` of analytics events that come from radio.
	 */
	analyticsContext?: Record<string, any>;
	/**
	 * The id of the element that links to this radio group.
	 *
	 * @deprecated Use the `labelId` prop instead.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	'aria-labelledby'?: string;
	/**
	 * This sets the `aria-labelledby` attribute. It sets an accessible name for
	 * the radio, for people who use assistive technology. Use of a visible label
	 * is highly recommended for greater accessibility support.
	 */
	// TODO: Make `aria-labelledby` a `never` in TS. See https://product-fabric.atlassian.net/browse/DSP-23009
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	labelId?: string;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 * The specified `testId` is applied to the root element of `RadioGroup`. If no `testId` is supplied in the `options` prop, then the one supplied to `RadioGroup` will also be propagated to
	 * the `Radio` children. Otherwise, the `testId` supplied in the `options` prop will be used.
	 *
	 * See [here](/components/radio/code#testId) for details about how `testId` is used on `Radio`.
	 */
	testId?: string;
}

const noOptions: OptionsPropType = [];

export default function RadioGroup(props: RadioGroupProps): React.JSX.Element {
	const {
		onChange,
		options = noOptions,
		value: propValue,
		defaultValue,
		id,
		isDisabled,
		isRequired,
		isInvalid,
		labelId,
		onInvalid = noop,
		name,
		analyticsContext,
		['aria-labelledby']: ariaLabelledBy,
		testId,
	} = props;

	const uid = useId();
	const [selectedValue, setSelectedValue] = useState<RadioValue | undefined | null>(
		propValue !== undefined ? propValue : defaultValue,
	);

	const onRadioChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => {
			setSelectedValue(e.currentTarget.value);
			if (onChange) {
				onChange(e, analyticsEvent);
			}
		},
		[onChange],
	);

	// If propValue is provided than act as a controlled component
	// If not then act as an uncontrolled component using the value from state
	const value = typeof propValue !== 'undefined' ? propValue : selectedValue;
	return (
		<div
			role="radiogroup"
			// TODO: Make `aria-labelledby` a `never` in TS. See https://product-fabric.atlassian.net/browse/DSP-23009
			aria-labelledby={labelId || ariaLabelledBy}
			data-testid={testId}
			aria-describedby={isInvalid ? `${id || uid}-error` : undefined}
			id={id || uid}
		>
			{options.map(({ ...optionProps }: OptionPropType, index: number) => {
				if (typeof isDisabled !== 'undefined') {
					optionProps.isDisabled = isDisabled;
				}
				const isChecked = value !== null && optionProps.value === value;
				return (
					<Radio
						{...optionProps}
						name={name || optionProps.name}
						key={index}
						onChange={onRadioChange}
						onInvalid={onInvalid}
						isInvalid={isChecked && isInvalid}
						isChecked={isChecked}
						testId={optionProps.testId || testId}
						isRequired={isRequired}
						analyticsContext={analyticsContext}
					/>
				);
			})}
		</div>
	);
}
