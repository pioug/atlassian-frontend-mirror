import type { WeekDay } from '@atlaskit/calendar/types';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
	TOOLBAR_MENU_TYPE,
} from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { AnnotationPlugin } from '@atlaskit/editor-plugin-annotation';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';

export type DateSegment = 'day' | 'month' | 'year';

export type DateType = {
	year: number;
	month: number;
	day?: number;
};

export interface DatePluginOptions {
	weekStartDay?: WeekDay;
}

/**
 * @private
 * @deprecated Use {@link DatePluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type DatePluginConfig = DatePluginOptions;

export type DatePluginSharedState = {
	showDatePickerAt?: number | null;
	isNew: boolean;
	focusDateInput: boolean;
	isInitialised: boolean;
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
		pluginConfiguration: DatePluginOptions | undefined;
		dependencies: [
			typeof analyticsPlugin,
			EditorDisabledPlugin,
			OptionalPlugin<AnnotationPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
		];
		sharedState: DatePluginSharedState;
		commands: {
			insertDate: InsertDate;
			deleteDate: DeleteDate;
		};
	}
>;
