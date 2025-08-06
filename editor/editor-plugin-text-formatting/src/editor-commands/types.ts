import type { EditorAnalyticsAPI, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	EditorCommand,
	ExtractInjectionAPI,
	InputMethodBasic,
} from '@atlaskit/editor-common/types';

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
