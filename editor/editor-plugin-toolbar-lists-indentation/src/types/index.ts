import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ToolbarListsIndentationPlugin } from '../toolbarListsIndentationPluginType';
import type { onItemActivated } from '../ui/onItemActivated';

export type ButtonName = 'bullet_list' | 'ordered_list' | 'indent' | 'outdent';

export enum ToolbarType {
	PRIMARY = 'primaryToolbar',
	FLOATING = 'floatingToolbar',
}

export type ListsIndentationInputMethod = INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;
export interface ToolbarProps {
	editorView: EditorView;
	featureFlags: FeatureFlags;
	bulletListActive?: boolean;
	bulletListDisabled?: boolean;
	orderedListActive?: boolean;
	orderedListDisabled?: boolean;
	disabled?: boolean;
	isSmall?: boolean;
	isSeparator?: boolean;
	isReducedSpacing?: boolean;
	showIndentationButtons?: boolean;
	indentDisabled?: boolean;
	outdentDisabled?: boolean;
	onItemActivated: ReturnType<typeof onItemActivated>;
	pluginInjectionApi?: ExtractInjectionAPI<ToolbarListsIndentationPlugin> | undefined;
}
