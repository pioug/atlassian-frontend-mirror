import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export type CodeBidiWarningPluginState = {
	codeBidiWarningLabel: string;
	decorationSet: DecorationSet;
	tooltipEnabled: boolean;
};
