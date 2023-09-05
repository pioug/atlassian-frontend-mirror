import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
  EditorCommand,
  NextEditorPlugin,
  TypeAheadHandler,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export type TypeAheadInputMethod =
  | INPUT_METHOD.INSERT_MENU
  | INPUT_METHOD.KEYBOARD
  | INPUT_METHOD.QUICK_INSERT
  | INPUT_METHOD.TOOLBAR;

type Props = {
  triggerHandler: TypeAheadHandler;
  inputMethod: TypeAheadInputMethod;
  query?: string;
};

export type TypeAheadPluginOptions = {
  isMobile?: boolean;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
};

type OpenTypeAheadAtCursorType = (props: Props) => EditorCommand;

/**
 * Type ahead plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export type TypeAheadPlugin = NextEditorPlugin<
  'typeAhead',
  {
    pluginConfiguration: TypeAheadPluginOptions | undefined;
    actions: {
      isOpen: (editorState: EditorState) => boolean;
    };
    commands: {
      openTypeAheadAtCursor: OpenTypeAheadAtCursorType;
    };
  }
>;
