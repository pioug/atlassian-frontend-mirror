/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { DatePicker } from '@atlaskit/datetime-picker';
import type { DateRangeField, DateRangeResult } from '@atlaskit/editor-common/extensions';
import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import TextField from '@atlaskit/textfield';

import FieldMessages from '../FieldMessages';
import type { OnFieldChange } from '../types';
import { validate, validateRequired } from '../utils';

const horizontalFieldsStyles = css({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
});

const horizontalFieldWrapperStyles = css({
	flexBasis: '47%',
});

const hiddenStyles = css({
	display: 'none',
});

const getFromDefaultValue = (
	field: DateRangeField,
	attribute: keyof DateRangeResult,
): string | undefined => {
	if (field.defaultValue) {
		return field.defaultValue[attribute];
	}
};

const DateField = ({
	parentField,
	scope,
	fieldName,
	onFieldChange,
	intl,
	isRequired,
	isDisabled,
}: {
	parentField: DateRangeField;
	scope: string;
	fieldName: 'from' | 'to';
	onFieldChange: OnFieldChange;
	isRequired?: boolean;
	isDisabled?: boolean;
} & WrappedComponentProps) => (
	<div css={horizontalFieldWrapperStyles} key={fieldName}>
		<Field
			name={`${scope}.${fieldName}`}
			label={intl.formatMessage(messages[fieldName])}
			defaultValue={getFromDefaultValue(parentField, fieldName as keyof DateRangeResult)}
			isRequired={isRequired}
			validate={(value?: string) => {
				return validateRequired<string | undefined>({ isRequired }, value);
			}}
			isDisabled={isDisabled}
		>
			{({ fieldProps, error }) => (
				<Fragment>
					<DatePicker
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...fieldProps}
						onChange={(date: string) => {
							fieldProps.onChange(date);
							onFieldChange(parentField.name, true);
						}}
						locale={intl.locale}
						shouldShowCalendarButton
						inputLabel={intl.formatMessage(messages[fieldName])}
					/>
					<FieldMessages error={error} />
				</Fragment>
			)}
		</Field>
	</div>
);

const DateRange = function ({
	name,
	field,
	onFieldChange,
	intl,
}: {
	name: string;
	field: DateRangeField;
	onFieldChange: OnFieldChange;
	autoFocus?: boolean;
	placeholder?: string;
} & WrappedComponentProps) {
	const items = useMemo(() => {
		return [
			...(field.items || []),
			{
				label: intl.formatMessage(messages.custom),
				value: 'custom',
			},
		].map((option) => ({
			...option,
			name,
		}));
	}, [field.items, name, intl]);

	const [currentValue, setCurrentValue] = useState(
		getFromDefaultValue(field, 'value') || items[0].value,
	);

	useEffect(() => {
		// calling onBlur here based on the currentValue changing will ensure that we
		// get the most up to date value after the form has been rendered
		onFieldChange(name, true);
	}, [currentValue, onFieldChange, name]);

	const element = (
		<Fragment>
			<div css={hiddenStyles}>
				<Field name={`${name}.type`} defaultValue={'date-range'}>
					{({ fieldProps }) => (
						<TextField
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...fieldProps}
							type="hidden"
						/>
					)}
				</Field>
			</div>
			<Field
				name={`${name}.value`}
				label={field.label}
				defaultValue={currentValue}
				isRequired={field.isRequired}
				validate={(value?: string) => validate<string>(field, value || '')}
				testId={`config-panel-date-range-${name}`}
				isDisabled={field.isDisabled}
			>
				{({ fieldProps, error }) => (
					<Fragment>
						<RadioGroup
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...fieldProps}
							options={items}
							onChange={(event) => {
								fieldProps.onChange(event.target.value);
								setCurrentValue(event.target.value);
							}}
						/>
						<FieldMessages error={error} />
					</Fragment>
				)}
			</Field>
			{currentValue !== 'custom' ? (
				<div css={hiddenStyles}>
					{/** this is a hidden field that will copy the selected value to a field of name 'from'
					 *  when a option that is NOT 'custom' is selected. This is to comply with the atlaskit
					 * form component that relies on final-form */}
					<Field name={`${name}.from`} defaultValue={currentValue}>
						{({ fieldProps }) => (
							<TextField
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...fieldProps}
								type="hidden"
							/>
						)}
					</Field>
				</div>
			) : (
				<div css={horizontalFieldsStyles}>
					<DateField
						scope={name}
						parentField={field}
						fieldName="from"
						onFieldChange={onFieldChange}
						intl={intl}
						isRequired={field.isRequired}
						isDisabled={field.isDisabled}
					/>
					<DateField
						scope={name}
						parentField={field}
						fieldName="to"
						onFieldChange={onFieldChange}
						intl={intl}
						isRequired={field.isRequired}
						isDisabled={field.isDisabled}
					/>
				</div>
			)}

			<FieldMessages description={field.description} />
		</Fragment>
	);

	return element;
};

export default injectIntl(DateRange);
