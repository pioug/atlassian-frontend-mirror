import { doc, paragraph, text } from '@atlaskit/adf-schema';
import { keymap } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  BrowserFreezetracking,
  InputTracking,
  NextEditorPlugin,
  OptionalPlugin,
  PMPluginFactory,
} from '@atlaskit/editor-common/types';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { baseKeymap } from '@atlaskit/editor-prosemirror/commands';
import { history } from '@atlaskit/editor-prosemirror/history';

import { setKeyboardHeight } from './commands';
import disableSpellcheckingPlugin from './pm-plugins/disable-spell-checking';
import filterStepsPlugin from './pm-plugins/filter-steps';
import frozenEditor from './pm-plugins/frozen-editor';
import inlineCursorTargetPlugin from './pm-plugins/inline-cursor-target';
import newlinePreserveMarksPlugin from './pm-plugins/newline-preserve-marks';
import type { ScrollGutterPluginOptions } from './pm-plugins/scroll-gutter';
import scrollGutter, { getKeyboardHeight } from './pm-plugins/scroll-gutter';

export interface BasePluginOptions {
  allowScrollGutter?: ScrollGutterPluginOptions;
  allowInlineCursorTarget?: boolean;
  inputTracking?: InputTracking;
  browserFreezeTracking?: BrowserFreezetracking;
  ufo?: boolean;
}

export type BasePluginState = {
  /** Current height of keyboard (+ custom toolbar) in iOS app */
  keyboardHeight: number | undefined;
};

export type BasePlugin = NextEditorPlugin<
  'base',
  {
    pluginConfiguration: BasePluginOptions | undefined;
    dependencies: [
      OptionalPlugin<FeatureFlagsPlugin>,
      OptionalPlugin<ContextIdentifierPlugin>,
    ];
    sharedState: BasePluginState;
    actions: {
      setKeyboardHeight: typeof setKeyboardHeight;
    };
  }
>;

const basePlugin: BasePlugin = ({ config: options, api }) => {
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

  return {
    name: 'base',

    getSharedState(editorState) {
      return {
        keyboardHeight: getKeyboardHeight(editorState),
      };
    },

    actions: {
      setKeyboardHeight,
    },

    pmPlugins() {
      const plugins: { name: string; plugin: PMPluginFactory }[] = [
        {
          name: 'filterStepsPlugin',
          plugin: ({ dispatchAnalyticsEvent }) =>
            filterStepsPlugin(dispatchAnalyticsEvent),
        },
      ];

      // In Chrome, when the selection is placed between adjacent nodes which are not contenteditatble
      // the cursor appears at the right most point of the parent container.
      //
      // In Firefox, when the selection is placed between adjacent nodes which are not contenteditatble
      // no cursor is presented to users.
      //
      // In Safari, when the selection is placed between adjacent nodes which are not contenteditatble
      // it is not possible to navigate with arrow keys.
      //
      // This plugin works around the issues by inserting decorations between
      // inline nodes which are set as contenteditable, and have a zero width space.
      plugins.push({
        name: 'inlineCursorTargetPlugin',
        plugin: () =>
          options && options.allowInlineCursorTarget
            ? inlineCursorTargetPlugin()
            : undefined,
      });

      plugins.push(
        {
          name: 'newlinePreserveMarksPlugin',
          plugin: newlinePreserveMarksPlugin,
        },
        {
          name: 'frozenEditor',
          plugin: ({ dispatchAnalyticsEvent }) => {
            return options?.inputTracking?.enabled || options?.ufo
              ? frozenEditor(api?.contextIdentifier)(
                  dispatchAnalyticsEvent,
                  options.inputTracking,
                  options.browserFreezeTracking,
                  options.ufo,
                )
              : undefined;
          },
        },
        { name: 'history', plugin: () => history() as SafePlugin },
        // should be last :(
        {
          name: 'codeBlockIndent',
          plugin: () =>
            keymap({
              ...baseKeymap,
              'Mod-[': () => true,
              'Mod-]': () => true,
            }),
        },
      );

      if (options && options.allowScrollGutter) {
        plugins.push({
          name: 'scrollGutterPlugin',
          plugin: () => scrollGutter(options.allowScrollGutter),
        });
      }

      plugins.push({
        name: 'disableSpellcheckingPlugin',
        plugin: () => disableSpellcheckingPlugin(featureFlags),
      });

      return plugins;
    },
    nodes() {
      return [
        { name: 'doc', node: doc },
        { name: 'paragraph', node: paragraph },
        { name: 'text', node: text },
      ];
    },
  };
};

export default basePlugin;
