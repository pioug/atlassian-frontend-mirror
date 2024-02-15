import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export type CodeBidiWarningPluginState = {
  decorationSet: DecorationSet;
  codeBidiWarningLabel: string;
  tooltipEnabled: boolean;
};
