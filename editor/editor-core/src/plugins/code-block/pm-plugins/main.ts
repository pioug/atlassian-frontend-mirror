import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { browser } from '@atlaskit/editor-common/utils';
import { NodeSelection } from 'prosemirror-state';
import { EditorView, EditorProps as PMEditorProps } from 'prosemirror-view';

import { IntlShape } from 'react-intl-next';
import type { EditorProps } from '../../../types';
import { codeBlockNodeView } from '../nodeviews/code-block';
import { createSelectionClickHandler } from '../../selection/utils';
import { pluginKey } from '../plugin-key';
import { ACTIONS } from './actions';
import {
  ignoreFollowingMutations,
  resetShouldIgnoreFollowingMutations,
} from '../actions';
import { findCodeBlock } from '../utils';
import { codeBlockClassNames } from '../ui/class-names';
import { CodeBlockState } from './main-state';

export const createPlugin = ({
  useLongPressSelection = false,
  getIntl,
  appearance,
  allowCompositionInputOverride = false,
}: {
  useLongPressSelection?: boolean;
  getIntl: () => IntlShape;
  appearance: EditorProps['appearance'];
  // We only want this DOM event on mobile as composition only happens on mobile
  // Don't want to add an uneccessary listener to web
  allowCompositionInputOverride?: boolean;
}) => {
  const handleDOMEvents: PMEditorProps['handleDOMEvents'] = {};

  // ME-1599: Composition on mobile was causing the DOM observer to mutate the code block
  // incorrecly and lose content when pressing enter in the middle of a code block line.
  if (allowCompositionInputOverride) {
    handleDOMEvents.beforeinput = (view: EditorView, event: Event) => {
      const keyEvent = event as InputEvent;
      const eventInputType = keyEvent.inputType;
      const eventText = keyEvent.data as string;

      if (
        browser.ios &&
        event.composed &&
        // insertParagraph will be the input type when the enter key is pressed.
        eventInputType === 'insertParagraph' &&
        findCodeBlock(view.state, view.state.selection)
      ) {
        event.preventDefault();
        return true;
      } else if (
        browser.android &&
        event.composed &&
        eventInputType === 'insertCompositionText' &&
        eventText[eventText?.length - 1] === '\n' &&
        findCodeBlock(view.state, view.state.selection)
      ) {
        const resultingText = (event.target as any).outerText + '\n';

        if (resultingText.endsWith(eventText)) {
          // End of paragraph
          setTimeout(() => {
            view.someProp('handleKeyDown', (f) =>
              f(
                view,
                new KeyboardEvent('keydown', {
                  bubbles: true,
                  cancelable: true,
                  key: 'Enter',
                  code: 'Enter',
                }),
              ),
            );
          }, 0);
        } else {
          // Middle of paragraph, end of line
          ignoreFollowingMutations(view.state, view.dispatch);
        }

        return true;
      }

      if (browser.android) {
        resetShouldIgnoreFollowingMutations(view.state, view.dispatch);
      }

      return false;
    };
  }

  return new SafePlugin({
    state: {
      init(_, state): CodeBlockState {
        const node = findCodeBlock(state, state.selection);
        return {
          pos: node ? node.pos : null,
          contentCopied: false,
          isNodeSelected: false,
          shouldIgnoreFollowingMutations: false,
        };
      },
      apply(
        tr,
        pluginState: CodeBlockState,
        _oldState,
        newState,
      ): CodeBlockState {
        if (tr.docChanged || tr.selectionSet) {
          const node = findCodeBlock(newState, tr.selection);
          const newPluginState: CodeBlockState = {
            ...pluginState,
            pos: node ? node.pos : null,
            isNodeSelected: tr.selection instanceof NodeSelection,
          };
          return newPluginState;
        }

        const meta = tr.getMeta(pluginKey);

        if (meta?.type === ACTIONS.SET_COPIED_TO_CLIPBOARD) {
          return {
            ...pluginState,
            contentCopied: meta.data,
          };
        } else if (
          meta?.type === ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS
        ) {
          return {
            ...pluginState,
            shouldIgnoreFollowingMutations: meta.data,
          };
        }

        return pluginState;
      },
    },
    key: pluginKey,
    props: {
      nodeViews: {
        codeBlock: codeBlockNodeView,
      },
      handleClickOn: createSelectionClickHandler(
        ['codeBlock'],
        (target) =>
          !!(
            target.closest(`.${codeBlockClassNames.gutter}`) ||
            target.classList.contains(codeBlockClassNames.content)
          ),
        { useLongPressSelection },
      ),
      handleDOMEvents,
    },
  });
};
