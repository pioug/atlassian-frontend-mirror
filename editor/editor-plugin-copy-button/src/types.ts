import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { MarkType } from '@atlaskit/editor-prosemirror/model';

export type CopyButtonPlugin = NextEditorPlugin<'copyButton'>;

export type CopyButtonPluginState = {
  copied: boolean;
  markSelection?: { start: number; end: number; markType: MarkType };
};
