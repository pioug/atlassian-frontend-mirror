import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

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
    props={require('!!extract-react-types-loader!../extract-react-types/calendar-props.tsx')}
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

### SelectEvent

\`\`\`
export type DateObj = {
  day: number;
  month: number;
  year: number;
};

export type SelectEvent = {
  iso: string;
} & DateObj;
\`\`\`

### ⚠️ CalendarInternalRef:
A type of an additional Calendar ref which exposes internal api's.
Some consumers are storing this ref and calling some internal api's.
This is not recommended
`;
