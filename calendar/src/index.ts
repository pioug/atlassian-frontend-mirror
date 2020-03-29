export { default, CalendarProps } from './components/Calendar';
export { ChangeEvent, ArrowKeys } from './types';

import { CalendarWithoutAnalytics } from './components/Calendar';

// Some consumers lean on the instance methods of the Calendar class
// This is not ideal.
// For now we are exporting the type of the Calendar class so that
// consumers can ensure that they are calling the instance methods correctly.
// This sucks as it is making the internal shape of the class public API
// Currently @atlaskit/datetime-picker is using the instance directly
export type CalendarClassType = CalendarWithoutAnalytics;
