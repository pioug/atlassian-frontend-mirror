import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { InputMethodBasic } from '@atlaskit/editor-common/types/text-formatting';

import type { TextFormattingPlugin } from '../textFormattingPluginType';

export type ToggleMarkWithAnalyticsEditorCommand = (
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	api?: ExtractInjectionAPI<TextFormattingPlugin>,
) => ToggleMarkEditorCommand;

export type ToggleMarkEditorCommand = (inputMethod: InputMethodBasic) => EditorCommand;

export type ClearFormattingWithAnalyticsEditorCommand = (
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => (
	inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.SHORTCUT | INPUT_METHOD.FLOATING_TB,
) => EditorCommand;
