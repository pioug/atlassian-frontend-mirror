import { doc, paragraph, text } from '@atlaskit/adf-schema';
import { keymap } from '@atlaskit/editor-common/keymaps';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  BrowserFreezetracking,
  InputTracking,
  NextEditorPlugin,
  PMPluginFactory,
} from '@atlaskit/editor-common/types';
import { browser } from '@atlaskit/editor-common/utils';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { baseKeymap } from '@atlaskit/editor-prosemirror/commands';
import { history } from '@atlaskit/editor-prosemirror/history';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { setKeyboardHeight } from './commands';
import contextIdentifierPlugin, {
  getContextIdentifier,
} from './pm-plugins/context-identifier';
import disableSpellcheckingPlugin from './pm-plugins/disable-spell-checking';
import filterStepsPlugin from './pm-plugins/filter-steps';
import fixChrome88SelectionPlugin from './pm-plugins/fix-chrome-88-selection';
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
  contextIdentifier: ContextIdentifierProvider | undefined;
  /** Current height of keyboard (+ custom toolbar) in iOS app */
  keyboardHeight: number | undefined;
};

export type BasePlugin = NextEditorPlugin<
  'base',
  {
    pluginConfiguration: BasePluginOptions | undefined;
    dependencies: [FeatureFlagsPlugin];
    sharedState: BasePluginState;
    actions: {
      setKeyboardHeight: typeof setKeyboardHeight;
    };
  }
>;

// Chrome >= 88
export const isChromeWithSelectionBug =
  browser.chrome && browser.chrome_version >= 88;

const basePlugin: BasePlugin = ({ config: options, api }) => {
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

  return {
    name: 'base',

    getSharedState(editorState) {
      return {
        contextIdentifier: getContextIdentifier(editorState),
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
      // In Firefox, when the selection is placed between adjacent nodes which are not contenteditatble
      // no cursor is presented to users.
      // In Safari, when the selection is placed between adjacent nodes which are not contenteditatble
      // it is not possible to navigate with arrow keys.
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
              ? frozenEditor(
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
        {
          name: 'contextIdentifier',
          plugin: ({ dispatch, providerFactory }) =>
            contextIdentifierPlugin(dispatch, providerFactory),
        },
      );

      if (options && options.allowScrollGutter) {
        plugins.push({
          name: 'scrollGutterPlugin',
          plugin: () => scrollGutter(options.allowScrollGutter),
        });
      }

      if (
        isChromeWithSelectionBug &&
        !getBooleanFF('platform.editor.disable-chrome-88-selection-fix_uk53m')
      ) {
        plugins.push({
          name: 'fixChrome88SelectionPlugin',
          plugin: () => fixChrome88SelectionPlugin(),
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
