/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TimePickerProps
 *
 * @codegen <<SignedSource::d674cb805411d0a1d2e687abeeeba9e3>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/timepicker/__generated__/index.partial.tsx <<SignedSource::785d7ffcaac38544d4658ed1560d72f5>>
 */
import type { SelectProps } from '@atlaskit/select';

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

export type TimePickerProps = {
	appearance?: Appearance;
	autoFocus?: boolean;
	defaultIsOpen?: boolean;
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
  selectProps?: SelectProps<any | false>;
} & Partial<Omit<FieldProps, 'onChange' | 'isRequired'>>;