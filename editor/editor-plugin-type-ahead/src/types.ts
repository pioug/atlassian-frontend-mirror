import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type {
  Command,
  NextEditorPlugin,
  OptionalPlugin,
  TypeAheadHandler,
  TypeAheadItem,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

export type TypeAheadInputMethod =
  | INPUT_METHOD.INSERT_MENU
  | INPUT_METHOD.KEYBOARD
  | INPUT_METHOD.QUICK_INSERT
  | INPUT_METHOD.TOOLBAR;

export type TypeAheadPluginOptions = {
  isMobile?: boolean;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
};

type OpenTypeAheadProps = {
  triggerHandler: TypeAheadHandler;
  inputMethod: TypeAheadInputMethod;
  query?: string;
};
type InsertTypeAheadItemProps = {
  triggerHandler: TypeAheadHandler;
  contentItem: TypeAheadItem;
  query: string;
  sourceListItem: TypeAheadItem[];
  mode?: SelectItemMode;
};

type CloseTypeAheadProps = {
  insertCurrentQueryAsRawText: boolean;
  attachCommand?: Command;
};

/**
 * Type ahead plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export type TypeAheadPlugin = NextEditorPlugin<
  'typeAhead',
  {
    pluginConfiguration: TypeAheadPluginOptions | undefined;
    dependencies: [OptionalPlugin<AnalyticsPlugin>];
    sharedState: {
      query: string;
    };
    actions: {
      isOpen: (editorState: EditorState) => boolean;
      isAllowed: (editorState: EditorState) => boolean;
      insert: (props: InsertTypeAheadItemProps) => boolean;
      findHandlerByTrigger: (trigger: string) => TypeAheadHandler | null;
      open: (props: OpenTypeAheadProps) => boolean;
      close: (props: CloseTypeAheadProps) => boolean;
      openAtTransaction: (
        props: OpenTypeAheadProps,
      ) => (tr: Transaction) => boolean;
    };
  }
>;
