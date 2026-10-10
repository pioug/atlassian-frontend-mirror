import type { WeekDay } from '@atlaskit/calendar/types';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { TOOLBAR_MENU_TYPE } from '@atlaskit/editor-common/types/insert-block';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPlugin';
import type { AnnotationPlugin } from '@atlaskit/editor-plugin-annotation/annotationPluginType';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';

export type DateSegment = 'day' | 'month' | 'year';

export type DateType = {
	day?: number;
	month: number;
	year: number;
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
	focusDateInput: boolean;
	isInitialised: boolean;
	isNew: boolean;
	showDatePickerAt?: number | null;
};

export type InsertDate = (props: {
	commitMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD;
	date?: DateType;
	enterPressed?: boolean;
	inputMethod?: TOOLBAR_MENU_TYPE;
}) => EditorCommand;

export type DeleteDate = EditorCommand;

export type DatePlugin = NextEditorPlugin<
	'date',
	{
		commands: {
			deleteDate: DeleteDate;
			insertDate: InsertDate;
		};
		dependencies: [
			typeof analyticsPlugin,
			EditorDisabledPlugin,
			OptionalPlugin<AnnotationPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<UiControlRegistryPlugin>,
		];
		pluginConfiguration: DatePluginOptions | undefined;
		sharedState: DatePluginSharedState;
	}
>;
