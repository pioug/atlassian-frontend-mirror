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
	bulletListActive?: boolean;
	bulletListDisabled?: boolean;
	disabled?: boolean;
	editorView: EditorView;
	featureFlags: FeatureFlags;
	indentDisabled?: boolean;
	isReducedSpacing?: boolean;
	isSeparator?: boolean;
	isSmall?: boolean;
	onItemActivated: ReturnType<typeof onItemActivated>;
	orderedListActive?: boolean;
	orderedListDisabled?: boolean;
	outdentDisabled?: boolean;
	pluginInjectionApi?: ExtractInjectionAPI<ToolbarListsIndentationPlugin> | undefined;
	showIndentationButtons?: boolean;
}
