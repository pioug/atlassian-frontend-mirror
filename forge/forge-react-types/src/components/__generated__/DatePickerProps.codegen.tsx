/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - DatePickerProps
 *
 * @codegen <<SignedSource::14d82d10ae64e4333440817918f6e955>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/datepicker/__generated__/index.partial.tsx <<SignedSource::6bc5d63c14b9dda11b370e386ccf4955>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { DateTimePickerSelectProps } from '@atlaskit/datetime-picker';

export interface FieldProps {
	id: string;
	isRequired: boolean;
	isDisabled: boolean;
	isInvalid: boolean;
	onChange: (event: unknown) => void;
	onBlur: (event: unknown) => void;
	onFocus: (event: unknown) => void;
	value: any;
	'aria-invalid': 'true' | 'false';
	'aria-labelledby': string;
	name: string;
}

type Appearance = 'default' | 'subtle' | 'none';
type Spacing = 'compact' | 'default';

export type DatePickerProps = {
	appearance?: Appearance;
	autoFocus?: boolean;
	defaultIsOpen?: boolean;
	defaultValue?: string;
	disabled?: string[];
	maxDate?: string;
	minDate?: string;
	isDisabled?: boolean;
	isOpen?: boolean;
	nextMonthLabel?: string;
	previousMonthLabel?: string;
	spacing?: Spacing;
	value?: string;
	isInvalid?: boolean;
	dateFormat?: string;
	placeholder?: string;
	locale?: string;
	testId?: string;
	weekStartDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	onChange?: (value: string) => void;
	selectProps?: DateTimePickerSelectProps;
	shouldShowCalendarButton?: boolean;
} & Partial<Omit<FieldProps, 'onChange'>>;

/**
 * A date time picker allows the user to select an associated date and time.
 */
export type TDatePicker<T> = (props: DatePickerProps) => T;