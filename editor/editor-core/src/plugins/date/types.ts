import type { WeekDay } from '@atlaskit/calendar/types';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { insertDate, deleteDate } from './actions';

export type DateType = {
  year: number;
  month: number;
  day?: number;
};

export type DateSegment = 'day' | 'month' | 'year';

export interface DatePluginConfig {
  weekStartDay?: WeekDay;
}

export type DatePluginSharedState = {
  showDatePickerAt?: number | null;
  isNew: boolean;
  focusDateInput: boolean;
};

export type DatePlugin = NextEditorPlugin<
  'date',
  {
    pluginConfiguration: DatePluginConfig | undefined;
    dependencies: [typeof analyticsPlugin, EditorDisabledPlugin];
    sharedState: DatePluginSharedState;
    actions: {
      insertDate: typeof insertDate;
      deleteDate: typeof deleteDate;
    };
  }
>;
