import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
  EditorCommand,
  NextEditorPlugin,
  TypeAheadHandler,
} from '@atlaskit/editor-common/types';

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

export type TypeAheadPlugin = NextEditorPlugin<
  'typeAhead',
  {
    pluginConfiguration: TypeAheadPluginOptions | undefined;
    commands: {
      openTypeAheadAtCursor: OpenTypeAheadAtCursorType;
    };
  }
>;
