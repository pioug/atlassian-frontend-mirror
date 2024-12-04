/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TimePickerProps
 *
 * @codegen <<SignedSource::900a8ca4989787ed581746e8c8ee267a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/timepicker/__generated__/index.partial.tsx <<SignedSource::5c2d81f7609af38cf6593bb1d4e06fe1>>
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

type Spacing = 'compact' | 'default';

export type TimePickerProps = {
	autoFocus?: boolean;
	defaultValue?: string;
	isOpen?: boolean;
	label?: string;
	onChange?: (value: string) => void;
	spacing?: Spacing;
	times?: string[];
	timeIsEditable?: boolean;
	value?: string;
	isInvalid?: boolean;
	hideIcon?: boolean;
	timeFormat?: string;
	placeholder?: string;
	locale?: string;
	testId?: string;
	selectProps?: DateTimePickerSelectProps;
} & Partial<Omit<FieldProps, 'onChange'>>;