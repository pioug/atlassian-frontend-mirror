import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ToolbarListsIndentationPlugin } from './plugin';
import type { onItemActivated } from './ui/onItemActivated';

export type ButtonName = 'bullet_list' | 'ordered_list' | 'indent' | 'outdent';

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
