import type { WeekDay } from '@atlaskit/calendar/types';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
  EditorCommand,
  NextEditorPlugin,
  TOOLBAR_MENU_TYPE,
} from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';

export type DateSegment = 'day' | 'month' | 'year';

export type DateType = {
  year: number;
  month: number;
  day?: number;
};

export interface DatePluginConfig {
  weekStartDay?: WeekDay;
}

export type DatePluginSharedState = {
  showDatePickerAt?: number | null;
  isNew: boolean;
  focusDateInput: boolean;
};

export type InsertDate = (props: {
  date?: DateType;
  inputMethod?: TOOLBAR_MENU_TYPE;
  commitMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD;
  enterPressed?: boolean;
}) => EditorCommand;

export type DeleteDate = EditorCommand;

export type DatePlugin = NextEditorPlugin<
  'date',
  {
    pluginConfiguration: DatePluginConfig | undefined;
    dependencies: [typeof analyticsPlugin, EditorDisabledPlugin];
    sharedState: DatePluginSharedState;
    commands: {
      insertDate: InsertDate;
      deleteDate: DeleteDate;
    };
  }
>;
