import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`

The \`datetime-picker\` component is capable of rendering a date picker, time picker, or combinations of both, and is
composed from several components including \`@atlaskit/select\` and \`@atlaskit/calendar\`.

The date & time pickers will open onFocus while onBlur, 'Enter' or selecting via a click will trigger an onChange. A keypress of 'Escape'
while the calendar or select is open will close it but not change or clear the value. When focussed 'Backspace' or 'Delete' will clear the value.

If needed you can modify or these default behaviors by passing props to the select component using the prop selectProps.

## Usage

${code`import { DatePicker, DateTimePicker, TimePicker } from '@atlaskit/datetime-picker';`}

${(
  <Example
    packageName="@atlaskit/datetime-picker"
    Component={require('../examples/00-basic').default}
    title="Basic"
    source={require('!!raw-loader!../examples/00-basic')}
  />
)}

Note that the \`value\` prop for the \`DateTimePicker\` is now a \`string\`, using \`Date\` object could cause other issues. You can see that in the following example:

${(
  <Example
    packageName="@atlaskit/datetime-picker"
    Component={require('../examples/99-format-editable').default}
    title="DatetimePicker Editable"
    source={require('!!raw-loader!../examples/99-format-editable')}
  />
)}

### Disabling dates in DatePicker

DatePicker exposes the same props for disabling certain dates as [\`@atlaskit/calendar\`](/packages/design-system/calendar).
- \`disabled\` accepts an array of individual dates
- \`minDate\` and \`maxDate\` allow you to disable dates outside a given range, by setting a minimum and maximum enabled date
- \`disabledDateFilter\` accepts a callback that returns whether a given date is disabled or not.

The button in the Calendar will be visually disabled if it is disabled by any of the above props.

Note that these props accept dates in the ISO format (YYYY-MM-DD). disabledDateFilter must accept dates in this format.

If using the \`disabled\` or \`disabledDateFilter\` props, make sure your filter callback has a stable reference, to avoid necessary
re-renders. This can be done by defining it outside of the render function's scope or using useState/useCallback hooks.

${(
  <Example
    packageName="@atlaskit/datetime-picker"
    Component={require('../examples/12-date-picker-disabled').default}
    title="Disabled dates"
    source={require('!!raw-loader!../examples/12-date-picker-disabled')}
  />
)}

These props can be used to make a date range picker:

${(
  <Example
    packageName="@atlaskit/datetime-picker"
    Component={require('../examples/13-date-picker-range').default}
    title="Disabled dates"
    source={require('!!raw-loader!../examples/13-date-picker-range')}
  />
)}

${(
  <Props
    heading="DatePicker Props"
    props={require('!!extract-react-types-loader!../src/components/DatePicker')}
  />
)}

${(
  <Props
    heading="TimePicker Props"
    props={require('!!extract-react-types-loader!../src/components/TimePicker')}
  />
)}

${(
  <Props
    heading="DateTimePicker Props"
    props={require('!!extract-react-types-loader!../src/components/DateTimePicker')}
  />
)}
`;
