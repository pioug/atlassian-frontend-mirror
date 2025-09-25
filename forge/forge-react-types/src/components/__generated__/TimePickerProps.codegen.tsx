/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TimePickerProps
 *
 * @codegen <<SignedSource::8400073ffade72c2330b63473b461c81>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/timepicker/__generated__/index.partial.tsx <<SignedSource::8f1c6ab03a29e7279ed2d3e82b086ab0>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { DateTimePickerSelectProps } from '@atlaskit/datetime-picker';

export interface FieldProps {
	'aria-invalid': 'true' | 'false';
	'aria-labelledby': string;
	id: string;
	isDisabled: boolean;
	isInvalid: boolean;
	isRequired: boolean;
	name: string;
	onBlur: (event: unknown) => void;
	onChange: (event: unknown) => void;
	onFocus: (event: unknown) => void;
	value: any;
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
	selectProps?: DateTimePickerSelectProps;
} & Partial<Omit<FieldProps, 'onChange'>>;

/**
 * A time picker allows the user to select a specific time.
 *
 * @see [TimePicker](https://developer.atlassian.com/platform/forge/ui-kit/components/time-picker/) in UI Kit documentation for more information
 */
export type TTimePicker<T> = (props: TimePickerProps) => T;