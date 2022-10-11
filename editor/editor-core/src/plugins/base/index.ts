import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { browser } from '@atlaskit/editor-common/utils';
import { doc, paragraph, text } from '@atlaskit/adf-schema';
import { EditorPlugin, PMPluginFactory } from '../../types';
import filterStepsPlugin from './pm-plugins/filter-steps';
import focusHandlerPlugin from './pm-plugins/focus-handler';
import fixChrome88SelectionPlugin from './pm-plugins/fix-chrome-88-selection';
import disableSpellcheckingPlugin from './pm-plugins/disable-spell-checking';
import contextIdentifierPlugin from './pm-plugins/context-identifier';
import newlinePreserveMarksPlugin from './pm-plugins/newline-preserve-marks';
import inlineCursorTargetPlugin from './pm-plugins/inline-cursor-target';
import betterTypeHistoryPlugin from './pm-plugins/better-type-history';
import { plugin as reactNodeView } from './pm-plugins/react-nodeview';
import decorationPlugin from './pm-plugins/decoration';
import scrollGutter, {
  ScrollGutterPluginOptions,
} from './pm-plugins/scroll-gutter';
import { keymap } from '../../utils/keymap';
import frozenEditor from './pm-plugins/frozen-editor';
import {
  InputTracking,
  BrowserFreezetracking,
} from '../../types/performance-tracking';
import compositionPlugin from './pm-plugins/composition';

export interface BasePluginOptions {
  allowScrollGutter?: ScrollGutterPluginOptions;
  allowInlineCursorTarget?: boolean;
  inputTracking?: InputTracking;
  browserFreezeTracking?: BrowserFreezetracking;
  ufo?: boolean;
}

// Chrome >= 88
export const isChromeWithSelectionBug =
  browser.chrome && browser.chrome_version >= 88;

const basePlugin = (options?: BasePluginOptions): EditorPlugin => ({
  name: 'base',

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
        name: 'focusHandlerPlugin',
        plugin: ({ dispatch }) => focusHandlerPlugin(dispatch),
      },
      {
        name: 'newlinePreserveMarksPlugin',
        plugin: newlinePreserveMarksPlugin,
      },
      { name: 'reactNodeView', plugin: () => reactNodeView },
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
      { name: 'decorationPlugin', plugin: () => decorationPlugin() },
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
      {
        name: 'betterTypeHistory',
        plugin: ({ dispatch, providerFactory }) => betterTypeHistoryPlugin(),
      },
    );

    if (options && options.allowScrollGutter) {
      plugins.push({
        name: 'scrollGutterPlugin',
        plugin: () => scrollGutter(options.allowScrollGutter),
      });
    }

    if (isChromeWithSelectionBug) {
      plugins.push({
        name: 'fixChrome88SelectionPlugin',
        plugin: () => fixChrome88SelectionPlugin(),
      });
    }

    plugins.push({
      name: 'disableSpellcheckingPlugin',
      plugin: () => disableSpellcheckingPlugin(),
    });

    plugins.push({
      name: 'compositionPlugin',
      plugin: () => compositionPlugin(),
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
});

export default basePlugin;
