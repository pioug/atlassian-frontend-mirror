import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
  EditorCommand,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { EmojiId } from '@atlaskit/emoji';
import type {
  EmojiDescription,
  EmojiProvider,
  EmojiResourceConfig,
} from '@atlaskit/emoji';

export interface EmojiPluginOptions {
  headless?: boolean;
}

export type EmojiPluginState = {
  emojiProvider?: EmojiProvider;
  emojiResourceConfig?: EmojiResourceConfig;
  asciiMap?: Map<string, EmojiDescription>;
};

export type EmojiPlugin = NextEditorPlugin<
  'emoji',
  {
    pluginConfiguration: EmojiPluginOptions | undefined;
    dependencies: [OptionalPlugin<typeof analyticsPlugin>, TypeAheadPlugin];
    sharedState: EmojiPluginState | undefined;
    commands: {
      insertEmoji: (
        emojiId: EmojiId,
        inputMethod?:
          | INPUT_METHOD.PICKER
          | INPUT_METHOD.ASCII
          | INPUT_METHOD.TYPEAHEAD,
      ) => EditorCommand;
    };
  }
>;
