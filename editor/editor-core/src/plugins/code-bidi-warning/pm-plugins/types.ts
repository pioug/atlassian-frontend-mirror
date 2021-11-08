import { DecorationSet } from 'prosemirror-view';

export type CodeBidiWarningPluginState = {
  decorationSet: DecorationSet;
  codeBidiWarningLabel: string;
  tooltipEnabled: boolean;
};
