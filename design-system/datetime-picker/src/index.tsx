/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import DatePicker from '@atlaskit/datetime-picker/date-picker'` instead.
 */
export { default as DatePicker } from './components/date-picker';
/**
 * @deprecated Use `import TimePicker from '@atlaskit/datetime-picker/time-picker'` instead.
 */
export { default as TimePicker } from './components/time-picker';
/**
 * @deprecated Use `import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'` instead.
 */
export { default as DateTimePicker } from './components/date-time-picker';
/**
 * @deprecated Use `import type { Appearance, Spacing, DatePickerBaseProps, TimePickerBaseProps, DateTimePickerBaseProps, DateTimePickerSelectProps } from '@atlaskit/datetime-picker/types'` instead.
 */
export type {
	Appearance,
	Spacing,
	DatePickerBaseProps as DatePickerProps,
	TimePickerBaseProps as TimePickerProps,
	DateTimePickerBaseProps as DateTimePickerProps,
	DateTimePickerSelectProps,
} from './types';
