import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`

The \`datetime-picker\` component is capable of rendering a date picker, time picker, or combinations of both, and is
composed from several components including \`@atlaskit/select\` and \`@atlaskit/calendar\`.

The date & time pickers will open onFocus while onBlur, 'Enter' or selecting via a click will trigger an onChange. A keypress of 'Escape'
while the calendar or select is open will close it but not change or clear the value. When focussed 'Backspace' or 'Delete' will clear the value.

If needed you can modify or these default behaviours by passing props to the select component using the prop selectProps.

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
