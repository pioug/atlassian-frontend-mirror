jest.autoMockOff();

import transformer, {
	datePickerImportName,
	dtpPropsToMoveIntoPickerProps,
	selectPropsToMoveIntoProps,
	timePickerImportName,
} from '../14.0.0-remove-duplicate-and-unused-props';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import React from 'react';`,
	`import React from 'react';`,
	'should not transform if imports are not present',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`
    import React from 'react';
    import { Code } from '@atlaskit/code';

    const Component1 = () => <Code prop="abc" />;

    const Component2 = () => <><Code prop="abc">text</Code></>;

    class Component3 extends React.Component { render() { return <div><Code prop="abc" /></div>; } }

    const element = <Code prop="abc" />;
    `,
	`
    import React from 'react';
    import { Code } from '@atlaskit/code';

    const Component1 = () => <Code prop="abc" />;

    const Component2 = () => <><Code prop="abc">text</Code></>;

    class Component3 extends React.Component { render() { return <div><Code prop="abc" /></div>; } }

    const element = <Code prop="abc" />;
    `,
	'should not transform if removable props are not preset',
);

describe('Migrate *selectProps to *pickerProps in DateTimePicker', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ test: 'test' }} />;
const TimeComponent1 = () => <DateTimePicker timePickerProps={{ test: 'test' }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ test: 'test' }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ test: 'test' }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker timePickerProps={{ test: 'test' }} /></div>; } }

const dateElement = <DateTimePicker datePickerProps={{ test: 'test' }} />;
const timeElement = <DateTimePicker timePickerProps={{ test: 'test' }} />;
      `,
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ test: 'test' }} />;
const TimeComponent1 = () => <DateTimePicker timePickerProps={{ test: 'test' }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ test: 'test' }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ test: 'test' }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker timePickerProps={{ test: 'test' }} /></div>; } }

const dateElement = <DateTimePicker datePickerProps={{ test: 'test' }} />;
const timeElement = <DateTimePicker timePickerProps={{ test: 'test' }} />;
      `,
		'should not touch them if no `*PickerSelectProps` exist',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerSelectProps={{ test: 'test' }} />;
const TimeComponent1 = () => <DateTimePicker timePickerSelectProps={{ test: 'test' }} />;

const DateComponent2 = () => <><DateTimePicker datePickerSelectProps={{ test: 'test' }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerSelectProps={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerSelectProps={{ test: 'test' }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker timePickerSelectProps={{ test: 'test' }} /></div>; } }

const dateElement = <DateTimePicker datePickerSelectProps={{ test: 'test' }} />;
const timeElement = <DateTimePicker timePickerSelectProps={{ test: 'test' }} />;
      `,
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{
  selectProps: { test: 'test' }
}} />;
const TimeComponent1 = () => <DateTimePicker timePickerProps={{
  selectProps: { test: 'test' }
}} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{
  selectProps: { test: 'test' }
}} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{
  selectProps: { test: 'test' }
}} /></>;

class DateComponent3 extends React.Component { render() { return (
  <div><DateTimePicker datePickerProps={{
    selectProps: { test: 'test' }
  }} /></div>
); } }
class TimeComponent3 extends React.Component { render() { return (
  <div><DateTimePicker timePickerProps={{
    selectProps: { test: 'test' }
  }} /></div>
); } }

const dateElement = <DateTimePicker datePickerProps={{
  selectProps: { test: 'test' }
}} />;
const timeElement = <DateTimePicker timePickerProps={{
  selectProps: { test: 'test' }
}} />;
      `,
		'should move `*PickerSelectProps` to `*PickerProps.selectProps`',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerSelectProps={{ test: 'test' }} id="id" />;
const TimeComponent1 = () => <DateTimePicker timePickerSelectProps={{ test: 'test' }} id="id" />;

const DateComponent2 = () => <><DateTimePicker datePickerSelectProps={{ test: 'test' }} id="id" /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerSelectProps={{ test: 'test' }} id="id" /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerSelectProps={{ test: 'test' }} id="id" /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker timePickerSelectProps={{ test: 'test' }} id="id" /></div>; } }

const dateElement = <DateTimePicker datePickerSelectProps={{ test: 'test' }} id="id" />;
const timeElement = <DateTimePicker timePickerSelectProps={{ test: 'test' }} id="id" />;
      `,
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker id="id" datePickerProps={{
  selectProps: { test: 'test' }
}} />;
const TimeComponent1 = () => <DateTimePicker id="id" timePickerProps={{
  selectProps: { test: 'test' }
}} />;

const DateComponent2 = () => <><DateTimePicker id="id" datePickerProps={{
  selectProps: { test: 'test' }
}} /></>;
const TimeComponent2 = () => <><DateTimePicker id="id" timePickerProps={{
  selectProps: { test: 'test' }
}} /></>;

class DateComponent3 extends React.Component { render() { return (
  <div><DateTimePicker id="id" datePickerProps={{
    selectProps: { test: 'test' }
  }} /></div>
); } }
class TimeComponent3 extends React.Component { render() { return (
  <div><DateTimePicker id="id" timePickerProps={{
    selectProps: { test: 'test' }
  }} /></div>
); } }

const dateElement = <DateTimePicker id="id" datePickerProps={{
  selectProps: { test: 'test' }
}} />;
const timeElement = <DateTimePicker id="id" timePickerProps={{
  selectProps: { test: 'test' }
}} />;
      `,
		'should move `*PickerSelectProps` to `*PickerProps.selectProps` and not touch unrelated props',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} />;
const TimeComponent1 = () => <DateTimePicker timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} />;

const DateComponent2 = () => <><DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} /></div>; } }

const dateElement = <DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} />;
const timeElement = <DateTimePicker timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} />;
      `,
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker
  datePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }} />;
const TimeComponent1 = () => <DateTimePicker
  timePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }} />;

const DateComponent2 = () => <><DateTimePicker
  datePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }} /></>;
const TimeComponent2 = () => <><DateTimePicker
  timePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }} /></>;

class DateComponent3 extends React.Component { render() { return (
  <div><DateTimePicker
    datePickerProps={{
      id: 'id',

      selectProps: {
        test: 'test'
      }
    }} /></div>
); } }
class TimeComponent3 extends React.Component { render() { return (
  <div><DateTimePicker
    timePickerProps={{
      id: 'id',

      selectProps: {
        test: 'test'
      }
    }} /></div>
); } }

const dateElement = <DateTimePicker
  datePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }} />;
const timeElement = <DateTimePicker
  timePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }} />;
`,
		'should combine `*PickerSelectProps` to `*PickerProps.selectProps`',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Component1 = () => <DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} />;

const Component2 = () => <><DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} /></>;

class Component3 extends React.Component { render() { return <div><DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} /></div>; } }

const element = <DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} />;
      `,
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Component1 = () => <DateTimePicker
  datePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }}
  timePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }} />;

const Component2 = () => <><DateTimePicker
  datePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }}
  timePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }} /></>;

class Component3 extends React.Component { render() { return (
  <div><DateTimePicker
    datePickerProps={{
      id: 'id',

      selectProps: {
        test: 'test'
      }
    }}
    timePickerProps={{
      id: 'id',

      selectProps: {
        test: 'test'
      }
    }} /></div>
); } }

const element = <DateTimePicker
  datePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }}
  timePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }} />;
`,
		'should combine `*PickerSelectProps` to `*PickerProps.selectProps` if both are present',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Component1 = () => <DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} id="id" />;

const Component2 = () => <><DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} id="id" /></>;

class Component3 extends React.Component { render() { return <div><DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} id="id" /></div>; } }

const element = <DateTimePicker datePickerSelectProps={{ test: 'test' }} datePickerProps={{ id: 'id' }} timePickerSelectProps={{ test: 'test' }} timePickerProps={{ id: 'id' }} id="id" />;
      `,
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Component1 = () => <DateTimePicker
  datePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }}
  timePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }}
  id="id" />;

const Component2 = () => <><DateTimePicker
  datePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }}
  timePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }}
  id="id" /></>;

class Component3 extends React.Component { render() { return (
  <div><DateTimePicker
    datePickerProps={{
      id: 'id',

      selectProps: {
        test: 'test'
      }
    }}
    timePickerProps={{
      id: 'id',

      selectProps: {
        test: 'test'
      }
    }}
    id="id" /></div>
); } }

const element = <DateTimePicker
  datePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }}
  timePickerProps={{
    id: 'id',

    selectProps: {
      test: 'test'
    }
  }}
  id="id" />;
`,
		'should combine `*PickerSelectProps` to `*PickerProps.selectProps` if both are present and not touch unrelated props',
	);
});

describe('Migrate top-level props into *pickerProps in DateTimePicker', () => {
	dtpPropsToMoveIntoPickerProps.forEach((formula) => {
		const { oldPropName, destination } = formula;
		describe(oldPropName, () => {
			defineInlineTest(
				{ default: transformer, parser: 'tsx' },
				{},
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker dummyProp={{ test: 'test' }} />;
const TimeComponent1 = () => <DateTimePicker dummyProp={{ test: 'test' }} />;

const DateComponent2 = () => <><DateTimePicker dummyProp={{ test: 'test' }} /></>;
const TimeComponent2 = () => <><DateTimePicker dummyProp={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker dummyProp={{ test: 'test' }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker dummyProp={{ test: 'test' }} /></div>; } }

const dateElement = <DateTimePicker dummyProp={{ test: 'test' }} />;
const timeElement = <DateTimePicker dummyProp={{ test: 'test' }} />;
      `,
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker dummyProp={{ test: 'test' }} />;
const TimeComponent1 = () => <DateTimePicker dummyProp={{ test: 'test' }} />;

const DateComponent2 = () => <><DateTimePicker dummyProp={{ test: 'test' }} /></>;
const TimeComponent2 = () => <><DateTimePicker dummyProp={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker dummyProp={{ test: 'test' }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker dummyProp={{ test: 'test' }} /></div>; } }

const dateElement = <DateTimePicker dummyProp={{ test: 'test' }} />;
const timeElement = <DateTimePicker dummyProp={{ test: 'test' }} />;
      `,
				`should not touch them if \`${oldPropName}\` does not exist`,
			);

			defineInlineTest(
				{ default: transformer, parser: 'tsx' },
				{},
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Component1 = () => <DateTimePicker ${oldPropName}="value" />;

const Component2 = () => <><DateTimePicker ${oldPropName}="value" /></>;

class Component3 extends React.Component { render() { return <div><DateTimePicker ${oldPropName}="value" /></div>; } }

const element = <DateTimePicker ${oldPropName}="value" />;
      `,
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Component1 = () => <DateTimePicker ${destination[0]}={{
  ${destination[1]}: "value"
}} />;

const Component2 = () => <><DateTimePicker ${destination[0]}={{
  ${destination[1]}: "value"
}} /></>;

class Component3 extends React.Component { render() { return (
  <div><DateTimePicker ${destination[0]}={{
    ${destination[1]}: "value"
  }} /></div>
); } }

const element = <DateTimePicker ${destination[0]}={{
  ${destination[1]}: "value"
}} />;
      `,
				`should migrate \`${oldPropName}\` into \`${destination[0]}.${destination[1]} if \`${destination[0]}\` does not exist`,
			);

			defineInlineTest(
				{ default: transformer, parser: 'tsx' },
				{},
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Component1 = () => <DateTimePicker ${oldPropName}="value" ${destination[0]}={{ id: "id" }} />;

const Component2 = () => <><DateTimePicker ${oldPropName}="value" ${destination[0]}={{ id: "id" }} /></>;

class Component3 extends React.Component { render() { return <div><DateTimePicker ${oldPropName}="value" ${destination[0]}={{ id: "id" }} /></div>; } }

const element = <DateTimePicker ${oldPropName}="value" ${destination[0]}={{ id: "id" }} />;
      `,
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Component1 = () => <DateTimePicker
  ${destination[0]}={{
    id: "id",
    ${destination[1]}: "value"
  }} />;

const Component2 = () => <><DateTimePicker
  ${destination[0]}={{
    id: "id",
    ${destination[1]}: "value"
  }} /></>;

class Component3 extends React.Component { render() { return (
  <div><DateTimePicker
    ${destination[0]}={{
      id: "id",
      ${destination[1]}: "value"
    }} /></div>
); } }

const element = <DateTimePicker
  ${destination[0]}={{
    id: "id",
    ${destination[1]}: "value"
  }} />;
      `,
				`should migrate \`${oldPropName}\` into \`${destination[0]}.${destination[1]} if \`${destination[0]}\` does exist`,
			);

			defineInlineTest(
				{ default: transformer, parser: 'tsx' },
				{},
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Component1 = () => <DateTimePicker ${oldPropName}="value" ${destination[0]}={{ id: "id" }} id="id" />;

const Component2 = () => <><DateTimePicker ${oldPropName}="value" ${destination[0]}={{ id: "id" }} id="id" /></>;

class Component3 extends React.Component { render() { return <div><DateTimePicker ${oldPropName}="value" ${destination[0]}={{ id: "id" }} id="id" /></div>; } }

const element = <DateTimePicker ${oldPropName}="value" ${destination[0]}={{ id: "id" }} id="id" />;
      `,
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Component1 = () => <DateTimePicker
  ${destination[0]}={{
    id: "id",
    ${destination[1]}: "value"
  }}
  id="id" />;

const Component2 = () => <><DateTimePicker
  ${destination[0]}={{
    id: "id",
    ${destination[1]}: "value"
  }}
  id="id" /></>;

class Component3 extends React.Component { render() { return (
  <div><DateTimePicker
    ${destination[0]}={{
      id: "id",
      ${destination[1]}: "value"
    }}
    id="id" /></div>
); } }

const element = <DateTimePicker
  ${destination[0]}={{
    id: "id",
    ${destination[1]}: "value"
  }}
  id="id" />;
      `,
				`should migrate \`${oldPropName}\` into \`${destination[0]}.${destination[1]} if \`${destination[0]}\` does exist and not touch unrelated props`,
			);
		});
	});
});

describe('Migrate relevant selectProps into top-level props on DatePicker/TimePicker', () => {
	[datePickerImportName, timePickerImportName].forEach((Picker) => {
		describe(Picker, () => {
			selectPropsToMoveIntoProps.forEach((formula) => {
				const { source, newPropName } = formula;
				const [selectProps, propertyName] = source;
				const propertyNameInObj = propertyName.includes('-') ? `"${propertyName}"` : propertyName;

				describe(newPropName, () => {
					defineInlineTest(
						{ default: transformer, parser: 'tsx' },
						{},
						`
import React from 'react';
import { ${Picker} } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <${Picker} dummyProp={{ test: 'test' }} />;
const TimeComponent1 = () => <${Picker} dummyProp={{ test: 'test' }} />;

const DateComponent2 = () => <><${Picker} dummyProp={{ test: 'test' }} /></>;
const TimeComponent2 = () => <><${Picker} dummyProp={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><${Picker} dummyProp={{ test: 'test' }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><${Picker} dummyProp={{ test: 'test' }} /></div>; } }

const dateElement = <${Picker} dummyProp={{ test: 'test' }} />;
const timeElement = <${Picker} dummyProp={{ test: 'test' }} />;
      `,
						`
import React from 'react';
import { ${Picker} } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <${Picker} dummyProp={{ test: 'test' }} />;
const TimeComponent1 = () => <${Picker} dummyProp={{ test: 'test' }} />;

const DateComponent2 = () => <><${Picker} dummyProp={{ test: 'test' }} /></>;
const TimeComponent2 = () => <><${Picker} dummyProp={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><${Picker} dummyProp={{ test: 'test' }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><${Picker} dummyProp={{ test: 'test' }} /></div>; } }

const dateElement = <${Picker} dummyProp={{ test: 'test' }} />;
const timeElement = <${Picker} dummyProp={{ test: 'test' }} />;
      `,
						`should not touch them if \`${newPropName}\` does not exist`,
					);

					defineInlineTest(
						{ default: transformer, parser: 'tsx' },
						{},
						`
import React from 'react';
import { ${Picker} } from '@atlaskit/datetime-picker';

const Component1 = () => <${Picker} ${selectProps}={{ ${propertyNameInObj}: "value" }} />;

const Component2 = () => <><${Picker} ${selectProps}={{ ${propertyNameInObj}: "value" }} /></>;

class Component3 extends React.Component { render() { return <div><${Picker} ${selectProps}={{ ${propertyNameInObj}: "value" }} /></div>; } }

const element = <${Picker} ${selectProps}={{ ${propertyNameInObj}: "value" }} />;
              `,
						`
import React from 'react';
import { ${Picker} } from '@atlaskit/datetime-picker';

const Component1 = () => <${Picker} ${newPropName}='value' />;

const Component2 = () => <><${Picker} ${newPropName}='value' /></>;

class Component3 extends React.Component { render() { return <div><${Picker} ${newPropName}='value' /></div>; } }

const element = <${Picker} ${newPropName}='value' />;
                          `,
						`should migrate \`${selectProps}.${propertyName}\` to \`${newPropName}\` if \`${newPropName}\` does not exist`,
					);

					defineInlineTest(
						{ default: transformer, parser: 'tsx' },
						{},
						`
import React from 'react';
import { ${Picker} } from '@atlaskit/datetime-picker';

const Component1 = () => <${Picker} ${newPropName}="value" ${selectProps}={{ ${propertyNameInObj}: "id", test: "test" }} />;

const Component2 = () => <><${Picker} ${newPropName}="value" ${selectProps}={{ ${propertyNameInObj}: "id", test: "test" }} /></>;

class Component3 extends React.Component { render() { return <div><${Picker} ${newPropName}="value" ${selectProps}={{ ${propertyNameInObj}: "id", test: "test" }} /></div>; } }

const element = <${Picker} ${newPropName}="value" ${selectProps}={{ ${propertyNameInObj}: "id", test: "test" }} />;
      `,
						`
import React from 'react';
import { ${Picker} } from '@atlaskit/datetime-picker';

const Component1 = () => <${Picker} ${newPropName}="value" ${selectProps}={{ ${propertyNameInObj}: "id", test: "test" }} />;

const Component2 = () => <><${Picker} ${newPropName}="value" ${selectProps}={{ ${propertyNameInObj}: "id", test: "test" }} /></>;

class Component3 extends React.Component { render() { return <div><${Picker} ${newPropName}="value" ${selectProps}={{ ${propertyNameInObj}: "id", test: "test" }} /></div>; } }

const element = <${Picker} ${newPropName}="value" ${selectProps}={{ ${propertyNameInObj}: "id", test: "test" }} />;
      `,
						`should leave \`${selectProps}.${propertyName}\` if \`${newPropName}\` exists`,
					);
				});
			});
		});
	});
});

describe('Migrate relevant selectProps into *PickerProps on DateTimePicker', () => {
	selectPropsToMoveIntoProps.forEach((formula) => {
		const { source, newPropName } = formula;
		const [selectProps, propertyName] = source;
		const oldPropertyNameInObj = propertyName.includes('-') ? `"${propertyName}"` : propertyName;
		const newPropertyNameInObj = `"${newPropName}"`;

		describe(newPropertyNameInObj, () => {
			defineInlineTest(
				{ default: transformer, parser: 'tsx' },
				{},
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker dummyProp={{ test: 'test' }} />;

const DateComponent2 = () => <><DateTimePicker dummyProp={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker dummyProp={{ test: 'test' }} /></div>; } }

const dateElement = <DateTimePicker dummyProp={{ test: 'test' }} />;
      `,
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker dummyProp={{ test: 'test' }} />;

const DateComponent2 = () => <><DateTimePicker dummyProp={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker dummyProp={{ test: 'test' }} /></div>; } }

const dateElement = <DateTimePicker dummyProp={{ test: 'test' }} />;
      `,
				`should not touch them if *PickerProps does not exist`,
			);

			defineInlineTest(
				{ default: transformer, parser: 'tsx' },
				{},
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ test: 'test' }} />;
const TimeComponent1 = () => <DateTimePicker timePickerProps={{ test: 'test' }} />;
const BothComponent1 = () => <DateTimePicker datePickerProps={{ test: 'test' }} timePickerProps={{ test: 'test' }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ test: 'test' }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ test: 'test' }} /></>;
const BothComponent2 = () => <><DateTimePicker datePickerProps={{ test: 'test' }} timePickerProps={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ test: 'test' }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker timePickerProps={{ test: 'test' }} /></div>; } }
class BothComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ test: 'test' }} timePickerProps={{ test: 'test' }} /></div>; } }

const dateElement = <DateTimePicker datePickerProps={{ test: 'test' }} />;
const timeElement = <DateTimePicker timePickerProps={{ test: 'test' }} />;
const bothElement = <DateTimePicker datePickerProps={{ test: 'test' }} timePickerProps={{ test: 'test' }} />;
      `,
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ test: 'test' }} />;
const TimeComponent1 = () => <DateTimePicker timePickerProps={{ test: 'test' }} />;
const BothComponent1 = () => <DateTimePicker datePickerProps={{ test: 'test' }} timePickerProps={{ test: 'test' }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ test: 'test' }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ test: 'test' }} /></>;
const BothComponent2 = () => <><DateTimePicker datePickerProps={{ test: 'test' }} timePickerProps={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ test: 'test' }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker timePickerProps={{ test: 'test' }} /></div>; } }
class BothComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ test: 'test' }} timePickerProps={{ test: 'test' }} /></div>; } }

const dateElement = <DateTimePicker datePickerProps={{ test: 'test' }} />;
const timeElement = <DateTimePicker timePickerProps={{ test: 'test' }} />;
const bothElement = <DateTimePicker datePickerProps={{ test: 'test' }} timePickerProps={{ test: 'test' }} />;
      `,
				`should not touch them if \`*PickerProps.selectProps\` does not exist`,
			);

			defineInlineTest(
				{ default: transformer, parser: 'tsx' },
				{},
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;
const TimeComponent1 = () => <DateTimePicker timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;
const BothComponent1 = () => <DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} /></>;
const BothComponent2 = () => <><DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} timePickerProps={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} /></div>; } }
class BothComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} /></div>; } }

const dateElement = <DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;
const timeElement = <DateTimePicker timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;
const bothElement = <DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;
      `,
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;
const TimeComponent1 = () => <DateTimePicker timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;
const BothComponent1 = () => <DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} /></>;
const BothComponent2 = () => <><DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} timePickerProps={{ test: 'test' }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} /></div>; } }
class BothComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} /></div>; } }

const dateElement = <DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;
const timeElement = <DateTimePicker timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;
const bothElement = <DateTimePicker datePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} timePickerProps={{ test: 'test', selectProps: { dummyProperty: 'yes' } }} />;
      `,
				`should not touch them if \`*PickerProps.selectProps.${oldPropertyNameInObj}}\` does not exist`,
			);

			defineInlineTest(
				{ default: transformer, parser: 'tsx' },
				{},
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} />;
const TimeComponent1 = () => <DateTimePicker timePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} />;
const BothComponent1 = () => <DateTimePicker datePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} timePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} /></>;
const BothComponent2 = () => <><DateTimePicker datePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} timePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} /></div>; } }
class BothComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} timePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} /></div>; } }

const dateElement = <DateTimePicker datePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} />;
const timeElement = <DateTimePicker timePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} />;
const bothElement = <DateTimePicker datePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} timePickerProps={{ selectProps: { ${oldPropertyNameInObj}: "value" } }} />;
`,
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value" }} />;
const TimeComponent1 = () => <DateTimePicker timePickerProps={{ ${newPropertyNameInObj}: "value" }} />;
const BothComponent1 = () => <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value" }} timePickerProps={{ ${newPropertyNameInObj}: "value" }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value" }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ ${newPropertyNameInObj}: "value" }} /></>;
const BothComponent2 = () => <><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value" }} timePickerProps={{ ${newPropertyNameInObj}: "value" }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value" }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value" }} /></div>; } }
class BothComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value" }} timePickerProps={{ ${newPropertyNameInObj}: "value" }} /></div>; } }

const dateElement = <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value" }} />;
const timeElement = <DateTimePicker timePickerProps={{ ${newPropertyNameInObj}: "value" }} />;
const bothElement = <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value" }} timePickerProps={{ ${newPropertyNameInObj}: "value" }} />;
                          `,
				`should migrate \`*PickerProps.${selectProps}.${propertyName}\` to \`*PickerProps.${newPropertyNameInObj}\` if \`*PickerProps.${newPropertyNameInObj}\` does not exist`,
			);

			defineInlineTest(
				{ default: transformer, parser: 'tsx' },
				{},
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} />;
const TimeComponent1 = () => <DateTimePicker timePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} />;
const BothComponent1 = () => <DateTimePicker datePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} timePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} /></>;
const BothComponent2 = () => <><DateTimePicker datePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} timePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} /></div>; } }
class BothComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} timePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} /></div>; } }

const dateElement = <DateTimePicker datePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} />;
const timeElement = <DateTimePicker timePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} />;
const bothElement = <DateTimePicker datePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} timePickerProps={{ times: [1, 2, 3], selectProps: { ${oldPropertyNameInObj}: "value" } }} />;
`,
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} />;
const TimeComponent1 = () => <DateTimePicker timePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} />;
const BothComponent1 = () => <DateTimePicker datePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} timePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} /></>;
const BothComponent2 = () => <><DateTimePicker datePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} timePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} /></div>; } }
class BothComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} timePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} /></div>; } }

const dateElement = <DateTimePicker datePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} />;
const timeElement = <DateTimePicker timePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} />;
const bothElement = <DateTimePicker datePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} timePickerProps={{ times: [1, 2, 3], ${newPropertyNameInObj}: "value" }} />;
                          `,
				`should migrate \`*PickerProps.${selectProps}.${propertyName}\` to \`*PickerProps.${newPropertyNameInObj}\` if \`*PickerProps.${newPropertyNameInObj}\` does not exist and not touch other props in *PickerProps`,
			);

			defineInlineTest(
				{ default: transformer, parser: 'tsx' },
				{},
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;
const TimeComponent1 = () => <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;
const BothComponent1 = () => <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></>;
const BothComponent2 = () => <><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></div>; } }
class BothComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></div>; } }
Dat
const dateElement = <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;
const timeElement = <DateTimePicker timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;
const bothElement = <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;
      `,
				`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const DateComponent1 = () => <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;
const TimeComponent1 = () => <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;
const BothComponent1 = () => <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;

const DateComponent2 = () => <><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></>;
const TimeComponent2 = () => <><DateTimePicker timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></>;
const BothComponent2 = () => <><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></>;

class DateComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></div>; } }
class TimeComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></div>; } }
class BothComponent3 extends React.Component { render() { return <div><DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} /></div>; } }
Dat
const dateElement = <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;
const timeElement = <DateTimePicker timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;
const bothElement = <DateTimePicker datePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} timePickerProps={{ ${newPropertyNameInObj}: "value", selectProps: { ${oldPropertyNameInObj}: "not this one" } }} />;
      `,
				`should leave \`*PickerProps.${selectProps}.${propertyName}\` if \`*PickerProps.${newPropertyNameInObj}\` exists`,
			);
		});
	});
});

describe('Complex interactions', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

<DateTimePicker
  times={defaultTimes}
  datePickerSelectProps={{
    placeholder: intl.formatDate(new Date(new Date().getTime() - ONE_DAY_IN_MILLISECONDS)),
    'aria-label': intl.formatMessage(messages.startDateInputLabel),
  }}
  timePickerSelectProps={{
    'aria-label': intl.formatMessage(messages.startTimeInputLabel),
  }}
/>
      `,
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

<DateTimePicker
  timePickerProps={{
    times: defaultTimes,
    "label": intl.formatMessage(messages.startTimeInputLabel)
  }}
  datePickerProps={{
    "label": intl.formatMessage(messages.startDateInputLabel),
    "placeholder": intl.formatDate(new Date(new Date().getTime() - ONE_DAY_IN_MILLISECONDS))
  }} />
      `,
		`should migrate complex DateTimePicker with nested select props and picker to top-level props`,
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { DatePicker } from '@atlaskit/datetime-picker';

const Example = <>
  <Label labelFor="default-date-picker-example">Choose date</Label>
  <DatePicker
    selectProps={{
      inputId: 'default-date-picker-example',
    }}
  />
</>
      `,
		`
import React from 'react';
import { DatePicker } from '@atlaskit/datetime-picker';

const Example = <>
  <Label labelFor="default-date-picker-example">Choose date</Label>
  <DatePicker
    id='default-date-picker-example'
  />
</>
      `,
		'should handle basic example',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Example = <>
  <Label labelFor="default-date-picker-example">Choose date</Label>
  <DateTimePicker
    timeIsEditable
  />
</>
      `,
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

const Example = <>
  <Label labelFor="default-date-picker-example">Choose date</Label>
  <DateTimePicker
    timePickerProps={{
      timeIsEditable: true
    }}
  />
</>
      `,
		'should handle basic example',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

<DateTimePicker
  times={getDefaultTimes()}
  timeIsEditable
/>
      `,
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

<DateTimePicker
  timePickerProps={{
    times: getDefaultTimes(),
    timeIsEditable: true
  }} />
      `,
		'should handle boolean attributes and remove brackets',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { TimePicker } from '@atlaskit/datetime-picker';

<TimePicker
  selectProps={{
    inputId: input.id,
    'aria-label': formatMessage(messages.selectTime),
  }}
  times={getDefaultTimes()}
  timeIsEditable
/>
      `,
		`
import React from 'react';
import { TimePicker } from '@atlaskit/datetime-picker';

<TimePicker
  times={getDefaultTimes()}
  timeIsEditable
  label={formatMessage(messages.selectTime)}
  id={input.id} />
      `,
		'should handle variables when moving from select props into top level',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

<DateTimePicker
  datePickerSelectProps={props}
/>
      `,
		`
import React from 'react';
import { DateTimePicker } from '@atlaskit/datetime-picker';

<DateTimePicker
  datePickerProps={{
    selectProps: props
  }}
/>
      `,
		'should handle variables when moving from select props into top level',
	);
});
