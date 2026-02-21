import { fg } from '@atlaskit/platform-feature-flags';

import { componentWithCondition } from '../internal/ff-component';

import DateTimePickerOld from './date-time-picker-class';
import DateTimePickerNew from './date-time-picker-fc';

const DateTimePicker: import('react').FC<
	Omit<
		Omit<import('..').DateTimePickerProps, 'ref'> & import('react').RefAttributes<HTMLElement>,
		'ref'
	> &
		Omit<
			Omit<
				Omit<
					Pick<
						Omit<
							import('..').DateTimePickerProps,
							keyof import('@atlaskit/analytics-next').WithAnalyticsEventsProps
						>,
						never
					> & {
						appearance?: import('..').Appearance | undefined;
						isDisabled?: boolean | undefined;
						innerProps?: React.AllHTMLAttributes<HTMLElement> | undefined;
						defaultValue?: string | undefined;
						autoFocus?: boolean | undefined;
						id?: string | undefined;
						'aria-describedby'?: string | undefined;
						onFocus?: React.FocusEventHandler<HTMLInputElement> | undefined;
						onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
						onChange?: ((value: string) => void) | undefined;
						value?: string | undefined;
						name?: string | undefined;
						testId?: string | undefined;
						locale?: string | undefined;
						clearControlLabel?: string | undefined;
						isInvalid?: boolean | undefined;
						isRequired?: boolean | undefined;
						spacing?: import('..').Spacing | undefined;
						datePickerProps?: import('..').DatePickerProps | undefined;
						timePickerProps?: import('..').TimePickerProps | undefined;
						parseValue?:
							| ((
									dateTimeValue: string,
									date: string,
									time: string,
									timezone: string,
							  ) => {
									dateValue: string;
									timeValue: string;
									zoneValue: string;
							  })
							| undefined;
					} & {
						ref?: React.Ref<any> | undefined;
						createAnalyticsEvent?:
							| import('@atlaskit/analytics-next').CreateUIAnalyticsEvent
							| undefined;
					},
					'ref'
				> &
					import('react').RefAttributes<any> &
					import('@atlaskit/analytics-next').WithContextProps,
				'ref'
			> &
				import('react').RefAttributes<any>,
			'ref'
		> &
		import('react').RefAttributes<any>
> = componentWithCondition(
	() => fg('dst-date-time-picker-use-functional-component'),
	DateTimePickerNew,
	DateTimePickerOld,
);
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default DateTimePicker;
