/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - DatePickerProps
 *
 * @codegen <<SignedSource::1283480b16535a85647a618a3ae8762a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/datepicker/__generated__/index.partial.tsx <<SignedSource::5408131ac700a0baedb02ef897692c12>>
 */
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