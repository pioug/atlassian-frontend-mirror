import { tester } from '../../__tests__/utils/_tester';
import rule, {
	addCalendarButtonProp,
	addCalendarButtonProperty,
	setCalendarButtonPropertyToTrue,
	setCalendarButtonPropToTrue,
} from '../index';

tester.run('use-datetime-picker-calendar-button', rule, {
	valid: [
		`
		  import { TimePicker } from '@atlaskit/datetime-picker';
		  <TimePicker />
		`,
		`
		  import { DatePicker } from '@atlaskit/datetime-picker';
		  <DatePicker shouldShowCalendarButton />
		`,
		`
		  import { DatePicker } from '@atlaskit/datetime-picker';
			import variableName from './foo';

		  <DatePicker shouldShowCalendarButton={variableName} />
		`,
		`
			import { DateTimePicker } from '@atlaskit/datetime-picker';
			<DateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />
		`,
		`
			import { DateTimePicker } from '@atlaskit/datetime-picker';
			import variableName from './foo';

			<DateTimePicker datePickerProps={variableName} />
		`,
		`
			import { DatePicker as AkDatePicker } from '@atlaskit/datetime-picker';
			<AkDatePicker shouldShowCalendarButton />
		`,
		`
			import { DateTimePicker as AkDateTimePicker } from '@atlaskit/datetime-picker';
			<AkDateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />
		`,
		`
			import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';

			<>
				<DatePicker shouldShowCalendarButton />
				<DateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />
			</>
		`,
		`
			import { DatePicker as AkDatePicker, DateTimePicker as AkDateTimePicker } from '@atlaskit/datetime-picker';

			<>
				<AkDatePicker shouldShowCalendarButton />
				<AkDateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />
			</>
		`,
	],
	invalid: [
		{
			code: `
import { DatePicker } from '@atlaskit/datetime-picker';
<DatePicker />
`,
			errors: [
				{
					messageId: 'datePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProp,
							output: `
import { DatePicker } from '@atlaskit/datetime-picker';
<DatePicker shouldShowCalendarButton />
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DatePicker } from '@atlaskit/datetime-picker';
<DatePicker shouldShowCalendarButton={false} />
`,
			errors: [
				{
					messageId: 'datePickerCalendarButtonShouldBeShown',
					suggestions: [
						{
							desc: setCalendarButtonPropToTrue,
							output: `
import { DatePicker } from '@atlaskit/datetime-picker';
<DatePicker shouldShowCalendarButton />
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DatePicker as AkDatePicker } from '@atlaskit/datetime-picker';
<AkDatePicker />
`,
			errors: [
				{
					messageId: 'datePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProp,
							output: `
import { DatePicker as AkDatePicker } from '@atlaskit/datetime-picker';
<AkDatePicker shouldShowCalendarButton />
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DatePicker as AkDatePicker } from '@atlaskit/datetime-picker';
<AkDatePicker shouldShowCalendarButton={false} />
`,
			errors: [
				{
					messageId: 'datePickerCalendarButtonShouldBeShown',
					suggestions: [
						{
							desc: setCalendarButtonPropToTrue,
							output: `
import { DatePicker as AkDatePicker } from '@atlaskit/datetime-picker';
<AkDatePicker shouldShowCalendarButton />
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DateTimePicker } from '@atlaskit/datetime-picker';
<DateTimePicker />
`,
			errors: [
				{
					messageId: 'dateTimePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProperty,
							output: `
import { DateTimePicker } from '@atlaskit/datetime-picker';
<DateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DateTimePicker } from '@atlaskit/datetime-picker';
<DateTimePicker datePickerProps={{ shouldShowCalendarButton: false }} />
`,
			errors: [
				{
					messageId: 'dateTimePickerCalendarButtonShouldBeShown',
					suggestions: [
						{
							desc: setCalendarButtonPropertyToTrue,
							output: `
import { DateTimePicker } from '@atlaskit/datetime-picker';
<DateTimePicker datePickerProps={{ shouldShowCalendarButton: true, }} />
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DateTimePicker } from '@atlaskit/datetime-picker';
<DateTimePicker datePickerProps={{ foo: 'bar', shouldShowCalendarButton: false }} />
`,
			errors: [
				{
					messageId: 'dateTimePickerCalendarButtonShouldBeShown',
					suggestions: [
						{
							desc: setCalendarButtonPropertyToTrue,
							output: `
import { DateTimePicker } from '@atlaskit/datetime-picker';
<DateTimePicker datePickerProps={{ foo: 'bar', shouldShowCalendarButton: true, }} />
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DateTimePicker as AkDateTimePicker } from '@atlaskit/datetime-picker';
<AkDateTimePicker />
`,
			errors: [
				{
					messageId: 'dateTimePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProperty,
							output: `
import { DateTimePicker as AkDateTimePicker } from '@atlaskit/datetime-picker';
<AkDateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DateTimePicker as AkDateTimePicker } from '@atlaskit/datetime-picker';
<AkDateTimePicker datePickerProps={{ shouldShowCalendarButton: false }} />
`,
			errors: [
				{
					messageId: 'dateTimePickerCalendarButtonShouldBeShown',
					suggestions: [
						{
							desc: setCalendarButtonPropertyToTrue,
							output: `
import { DateTimePicker as AkDateTimePicker } from '@atlaskit/datetime-picker';
<AkDateTimePicker datePickerProps={{ shouldShowCalendarButton: true, }} />
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';

<>
	<DateTimePicker />
	<DatePicker />
</>
`,
			errors: [
				{
					messageId: 'dateTimePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProperty,
							output: `
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';

<>
	<DateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />
	<DatePicker />
</>
`,
						},
					],
				},
				{
					messageId: 'datePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProp,
							output: `
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';

<>
	<DateTimePicker />
	<DatePicker shouldShowCalendarButton />
</>
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';

<>
	<DatePicker />
	<DateTimePicker />
</>
`,
			errors: [
				{
					messageId: 'datePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProp,
							output: `
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';

<>
	<DatePicker shouldShowCalendarButton />
	<DateTimePicker />
</>
`,
						},
					],
				},
				{
					messageId: 'dateTimePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProperty,
							output: `
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';

<>
	<DatePicker />
	<DateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />
</>
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DatePicker } from '@atlaskit/datetime-picker';
import { DateTimePicker } from '@atlaskit/datetime-picker';

<>
	<DatePicker />
	<DateTimePicker />
</>
`,
			errors: [
				{
					messageId: 'datePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProp,
							output: `
import { DatePicker } from '@atlaskit/datetime-picker';
import { DateTimePicker } from '@atlaskit/datetime-picker';

<>
	<DatePicker shouldShowCalendarButton />
	<DateTimePicker />
</>
`,
						},
					],
				},
				{
					messageId: 'dateTimePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProperty,
							output: `
import { DatePicker } from '@atlaskit/datetime-picker';
import { DateTimePicker } from '@atlaskit/datetime-picker';

<>
	<DatePicker />
	<DateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />
</>
`,
						},
					],
				},
			],
		},
		{
			code: `
import { DatePicker as QDatePicker, DateTimePicker as QDateTimePicker } from '@atlaskit/datetime-picker';

<>
	<QDatePicker />
	<QDateTimePicker />
</>
`,
			errors: [
				{
					messageId: 'datePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProp,
							output: `
import { DatePicker as QDatePicker, DateTimePicker as QDateTimePicker } from '@atlaskit/datetime-picker';

<>
	<QDatePicker shouldShowCalendarButton />
	<QDateTimePicker />
</>
`,
						},
					],
				},
				{
					messageId: 'dateTimePickerMissingCalendarButtonProp',
					suggestions: [
						{
							desc: addCalendarButtonProperty,
							output: `
import { DatePicker as QDatePicker, DateTimePicker as QDateTimePicker } from '@atlaskit/datetime-picker';

<>
	<QDatePicker />
	<QDateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />
</>
`,
						},
					],
				},
			],
		},
	],
});
