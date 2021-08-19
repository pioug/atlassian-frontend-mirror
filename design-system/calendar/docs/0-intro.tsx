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

### Disabling dates

Calendar provides a number of different props for disabling dates in Calendar:
- \`disabled\` accepts an array of individual dates
- \`minDate\` and \`maxDate\` allow you to disable dates outside a given range, by setting a minimum and maximum enabled date
- \`disabledDateFilter\` accepts a callback that returns whether a given date is disabled or not.

The button in the Calendar will be visually disabled if it is disabled by any of the above props.

If using the \`disabled\` or \`disabledDateFilter\` props, make sure your filter callback has a stable reference, to avoid necessary
re-renders. This can be done by defining it outside of the render function's scope or using useState/useCallback hooks

${(
  <Example
    packageName="@atlaskit/calendar"
    Component={require('../examples/4-disabled').default}
    title="disabled: Disable an array of specific dates"
    source={require('!!raw-loader!../examples/4-disabled')}
  />
)}

${(
  <Example
    packageName="@atlaskit/calendar"
    Component={require('../examples/5-disabled-range').default}
    title="minDate/maxDate: Disable dates outside a range"
    source={require('!!raw-loader!../examples/5-disabled-range')}
  />
)}

${(
  <Example
    packageName="@atlaskit/calendar"
    Component={require('../examples/6-disabled-filter').default}
    title="disabledDateFilter: Create custom disabling patterns"
    source={require('!!raw-loader!../examples/6-disabled-filter')}
  />
)}



${(
  <Props
    heading="Calendar Props"
    props={require('!!extract-react-types-loader!../src/calendar.tsx')}
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
`;
