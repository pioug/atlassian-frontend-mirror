import React from 'react';
import { createPlugin } from './plugin';
import { findReplacePluginKey } from './types';
import keymapPlugin from './keymap';
import { EditorPlugin, Command } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import {
  cancelSearchWithAnalytics,
  replaceWithAnalytics,
  replaceAllWithAnalytics,
  findWithAnalytics,
  findNextWithAnalytics,
  findPrevWithAnalytics,
  activateWithAnalytics,
} from './commands-with-analytics';
import { blur, toggleMatchCase } from './commands';
import FindReplaceToolbarButton from './ui/FindReplaceToolbarButton';
import { TRIGGER_METHOD } from '../analytics';
import { getFeatureFlags } from '../feature-flags-context';

export const findReplacePlugin = (props: {
  takeFullWidth: boolean;
}): EditorPlugin => {
  return {
    name: 'findReplace',

    pmPlugins() {
      return [
        {
          name: 'findReplace',
          plugin: ({ dispatch }) => createPlugin(dispatch),
        },
        {
          name: 'findReplaceKeymap',
          plugin: () => keymapPlugin(),
        },
      ];
    },

    primaryToolbarComponent({
      popupsBoundariesElement,
      popupsMountPoint,
      popupsScrollableElement,
      isToolbarReducedSpacing,
      editorView,
      containerElement,
      dispatchAnalyticsEvent,
    }) {
      // we need the editor to be in focus for scrollIntoView() to work
      // so we focus it while we run the command, then put focus back into
      // whatever element was previously focused in find replace component
      const runWithEditorFocused = (fn: Function) => {
        const activeElement = document.activeElement as HTMLElement | null;
        editorView.focus();
        fn();
        activeElement?.focus();
      };

      const dispatchCommand = (cmd: Command) => {
        const { state, dispatch } = editorView;
        cmd(state, dispatch);
      };

      const handleActivate = () => {
        runWithEditorFocused(() =>
          dispatchCommand(
            activateWithAnalytics({ triggerMethod: TRIGGER_METHOD.TOOLBAR }),
          ),
        );
      };
      const handleFind = (keyword?: string) => {
        runWithEditorFocused(() =>
          dispatchCommand(
            findWithAnalytics({
              editorView,
              containerElement,
              keyword,
            }),
          ),
        );
      };
      const handleFindNext = ({
        triggerMethod,
      }: {
        triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
      }) => {
        runWithEditorFocused(() =>
          dispatchCommand(findNextWithAnalytics({ triggerMethod })),
        );
      };
      const handleFindPrev = ({
        triggerMethod,
      }: {
        triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
      }) => {
        runWithEditorFocused(() =>
          dispatchCommand(findPrevWithAnalytics({ triggerMethod })),
        );
      };
      const handleReplace = ({
        triggerMethod,
        replaceText,
      }: {
        triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
        replaceText: string;
      }) => {
        runWithEditorFocused(() =>
          dispatchCommand(replaceWithAnalytics({ triggerMethod, replaceText })),
        );
      };
      const handleReplaceAll = ({ replaceText }: { replaceText: string }) => {
        runWithEditorFocused(() =>
          dispatchCommand(replaceAllWithAnalytics({ replaceText })),
        );
      };
      const handleFindBlur = () => {
        dispatchCommand(blur());
      };
      const handleCancel = ({
        triggerMethod,
      }: {
        triggerMethod:
          | TRIGGER_METHOD.KEYBOARD
          | TRIGGER_METHOD.TOOLBAR
          | TRIGGER_METHOD.BUTTON;
      }) => {
        dispatchCommand(cancelSearchWithAnalytics({ triggerMethod }));
        editorView.focus();
      };
      const handleToggleMatchCase = () => {
        dispatchCommand(toggleMatchCase());
      };

      const { findReplaceMatchCase } = getFeatureFlags(editorView.state);

      return (
        <WithPluginState
          debounce={false}
          plugins={{
            findReplaceState: findReplacePluginKey,
          }}
          render={({ findReplaceState }) => {
            return (
              <FindReplaceToolbarButton
                allowMatchCase={findReplaceMatchCase}
                shouldMatchCase={findReplaceState!.shouldMatchCase}
                onToggleMatchCase={handleToggleMatchCase}
                isActive={findReplaceState!.isActive}
                findText={findReplaceState!.findText}
                index={findReplaceState!.index}
                numMatches={findReplaceState!.matches.length}
                replaceText={findReplaceState!.replaceText}
                shouldFocus={findReplaceState!.shouldFocus}
                popupsBoundariesElement={popupsBoundariesElement}
                popupsMountPoint={popupsMountPoint}
                popupsScrollableElement={popupsScrollableElement}
                isReducedSpacing={isToolbarReducedSpacing}
                dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                onFindBlur={handleFindBlur}
                onCancel={handleCancel}
                onActivate={handleActivate}
                onFind={handleFind}
                onFindNext={handleFindNext}
                onFindPrev={handleFindPrev}
                onReplace={handleReplace}
                onReplaceAll={handleReplaceAll}
                takeFullWidth={props.takeFullWidth}
              />
            );
          }}
        />
      );
    },
  };
};
export default findReplacePlugin;
