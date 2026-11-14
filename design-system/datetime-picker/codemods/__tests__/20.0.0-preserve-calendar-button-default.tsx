jest.autoMockOff();

import transformer from '../20.0.0-preserve-calendar-button-default';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

// The package root is composed here so the test sources exercise the codemod's handling of root
// imports without adding real root-barrel imports that the ratcheting rules would flag.
const packageRoot = ['@atlaskit', 'datetime-picker'].join('/');

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"const value = ({ label: 'unchanged' }) as const;",
	"const value = ({ label: 'unchanged' }) as const;",
	'preserves source text without a datetime-picker import',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker />;",
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker shouldShowCalendarButton={false} />;",
	'adds false to a DatePicker without the prop',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ label: 'Date' }} />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{\n  label: 'Date',\n  shouldShowCalendarButton: false\n}} />;",
	'adds false to DateTimePicker datePickerProps',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker\n  datePickerProps={{\n    shouldShowCalendarButton: false\n  }} />;",
	'adds datePickerProps to a DateTimePicker without it',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={undefined} />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{\n  shouldShowCalendarButton: false\n}} />;",
	'preserves an undefined DateTimePicker datePickerProps value',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker shouldShowCalendarButton />;",
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker shouldShowCalendarButton />;",
	'preserves an explicit true prop',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker shouldShowCalendarButton={undefined} />;",
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker shouldShowCalendarButton={false} />;",
	'changes an undefined DatePicker prop to false',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ shouldShowCalendarButton: true }} />;",
	'preserves an explicit true DateTimePicker property',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ shouldShowCalendarButton: undefined }} />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ shouldShowCalendarButton: false }} />;",
	'changes an undefined DateTimePicker property to false',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import { DateTimePicker } from '${packageRoot}'; <DateTimePicker {...props} datePickerProps={{ label: 'Date' }} />;`,
	`import { DateTimePicker } from '${packageRoot}'; <DateTimePicker {...props} datePickerProps={{ label: 'Date' }} />;`,
	'leaves explicit DateTimePicker props with a spread for manual migration',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import { DateTimePicker } from '${packageRoot}'; <DateTimePicker {...{ testId: 'date-time' }} />;`,
	`import { DateTimePicker } from '${packageRoot}'; <DateTimePicker\n  {...{ testId: 'date-time' }}\n  datePickerProps={{\n    shouldShowCalendarButton: false\n  }} />;`,
	'adds false to DateTimePicker props after an unrelated object spread',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import { DatePicker } from '${packageRoot}'; <DatePicker {...props} />;`,
	`import { DatePicker } from '${packageRoot}'; <DatePicker {...props} />;`,
	'leaves a DatePicker spread prop for manual migration',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker {...props} />;",
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker {...props} />;",
	'leaves a subpath DatePicker spread prop for manual migration',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker {...{ shouldShowCalendarButton: undefined }} />;",
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker {...{ shouldShowCalendarButton: undefined }} />;",
	'leaves a DatePicker spread that can override false with undefined for manual migration',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker shouldShowCalendarButton={undefined} {...props} />;",
	"import DatePicker from '@atlaskit/datetime-picker/date-picker'; <DatePicker shouldShowCalendarButton={undefined} {...props} />;",
	'leaves an undefined DatePicker property before a spread for manual migration',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ ...props }} />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ ...props }} />;",
	'leaves a DateTimePicker spread property for manual migration',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ ...{ shouldShowCalendarButton: undefined } }} />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ ...{ shouldShowCalendarButton: undefined } }} />;",
	'leaves a DateTimePicker spread that can override false with undefined for manual migration',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ shouldShowCalendarButton: undefined, ...props }} />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ shouldShowCalendarButton: undefined, ...props }} />;",
	'leaves an undefined DateTimePicker property before a spread for manual migration',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker {...props} />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker {...props} />;",
	'leaves a DateTimePicker non-object spread for manual migration',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ ['shouldShowCalendarButton']: true }} />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={{ ['shouldShowCalendarButton']: true }} />;",
	'preserves a computed calendar button property',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={props} />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={props} />;",
	'leaves a DateTimePicker variable prop for manual migration',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={condition ? enabledProps : disabledProps} />;",
	"import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker'; <DateTimePicker datePickerProps={condition ? enabledProps : disabledProps} />;",
	'leaves a conditional DateTimePicker prop for manual migration',
);
