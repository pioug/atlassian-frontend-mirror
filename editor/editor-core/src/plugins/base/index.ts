import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { browser } from '@atlaskit/editor-common';
import { doc, paragraph, text } from '@atlaskit/adf-schema';
import { EditorPlugin, PMPluginFactory } from '../../types';
import filterStepsPlugin from './pm-plugins/filter-steps';
import focusHandlerPlugin from './pm-plugins/focus-handler';
import fixChrome88SelectionPlugin from './pm-plugins/fix-chrome-88-selection';
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

export interface BasePluginOptions {
  allowScrollGutter?: ScrollGutterPluginOptions;
  allowInlineCursorTarget?: boolean;
  inputTracking?: InputTracking;
  browserFreezeTracking?: BrowserFreezetracking;
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
      {
        name: 'inlineCursorTargetPlugin',
        plugin: () =>
          options && options.allowInlineCursorTarget
            ? inlineCursorTargetPlugin()
            : undefined,
      },
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
        plugin: ({ dispatchAnalyticsEvent, providerFactory }) => {
          return options &&
            options.inputTracking &&
            options.inputTracking.enabled
            ? frozenEditor(
                dispatchAnalyticsEvent,
                options.inputTracking,
                options.browserFreezeTracking,
              )
            : undefined;
        },
      },
      { name: 'decorationPlugin', plugin: () => decorationPlugin() },
      { name: 'history', plugin: () => history() },
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
    ];

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
