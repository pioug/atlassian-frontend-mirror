import type { WeekDay } from '@atlaskit/calendar/types';

export type DateType = {
  year: number;
  month: number;
  day?: number;
};

export type DateSegment = 'day' | 'month' | 'year';

export interface DatePluginConfig {
  weekStartDay?: WeekDay;
}
