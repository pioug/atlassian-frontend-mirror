import type {
  EditorCommand,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import { type DecorationSet } from '@atlaskit/editor-prosemirror/view';

export interface PluginState {
  decorations: DecorationSet;
  decorationState: DecorationState;
  isDragging: boolean;
  isMenuOpen?: boolean;
  activeNode: {
    pos: number;
  } | null;
}

export type ReleaseHiddenDecoration = () => boolean | undefined;

export type BlockControlsPlugin = NextEditorPlugin<
  'blockControls',
  {
    dependencies: [];
    sharedState:
      | {
          isMenuOpen: boolean;
          activeNode: { pos: number };
          decorationState: DecorationState;
        }
      | undefined;
    actions: {};
    commands: {
      moveNode: (start: number, to: number) => EditorCommand;
    };
  }
>;

export type DecorationState = {
  index: number;
  pos: number;
}[];
