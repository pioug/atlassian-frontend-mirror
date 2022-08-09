export { default } from './calendar';
export type {
  CalendarProps,
  ChangeEvent,
  SelectEvent,
  // Some consumers lean on the internal api's of the Calendar.
  // This is not ideal.
  // For now we are exporting an additional ref type so that
  // consumers can ensure that they are calling the internal api's correctly.
  // Currently @atlaskit/datetime-picker is using it directly.
  CalendarRef,
} from './types';
