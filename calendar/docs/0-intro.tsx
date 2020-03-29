import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`

The calendar component displays a simple calendar that can be:

- Used to display a calendar of dates.
- Composed with other components to build a datepicker.

## Usage

${code`import Calendar from '@atlaskit/calendar';`}

${(
  <Example
    packageName="@atlaskit/calendar"
    Component={require('../examples/0-basic').default}
    title="Basic"
    source={require('!!raw-loader!../examples/0-basic')}
  />
)}

${(
  <Props
    heading="Calendar Props"
    props={require('!!extract-react-types-loader!../src/components/Calendar')}
  />
)}

## Typescript

We also export a number of types that can be useful when using TypeScript:

### ChangeEvent

\`\`\`
export type DateObj = {
  day: number;
  month: number;
  year: number;
};

export type ChangeEvent = {
  iso?: string;
  type: 'left' | 'up' | 'right' | 'down' | 'prev' | 'next';
} & DateObj;
\`\`\`

### ⚠️ CalendarClassType:
A type of the internal Calendar class.
Some consumers are storing a reference to the Calendar class instance and calling instance functions on it.
This is not recommended

### ⚠️ ArrowKeys
For usage with \`CalendarClassType\`.
Needed for interacting with \`.navigate()\`
`;
