import { Plugin, NodeSelection } from 'prosemirror-state';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';

import { EditorReactContext } from '../../../types/editor-react-context';
import { codeBlockNodeView } from '../nodeviews/code-block';
import { highlightingCodeBlockNodeView } from '../nodeviews/highlighting-code-block';
import { createSelectionClickHandler } from '../../selection/utils';
import { pluginKey } from '../plugin-key';
import { ACTIONS } from './actions';
import { findCodeBlock } from '../utils';
import { codeBlockClassNames } from '../ui/class-names';
import { CodeBlockState } from './main-state';
import { getFeatureFlags } from '../../feature-flags-context';

export const createPlugin = ({
  useLongPressSelection = false,
  reactContext,
}: {
  useLongPressSelection?: boolean;
  reactContext: () => EditorReactContext;
}) => {
  const intl = reactContext().intl;

  const codeBidiWarningLabel = intl.formatMessage(
    codeBidiWarningMessages.label,
  );

  return new Plugin({
    state: {
      init(_, state): CodeBlockState {
        const node = findCodeBlock(state, state.selection);
        return {
          pos: node ? node.pos : null,
          contentCopied: false,
          isNodeSelected: false,
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
        }

        return pluginState;
      },
    },
    key: pluginKey,
    props: {
      nodeViews: {
        codeBlock(node, view, getPos) {
          const featureFlags = getFeatureFlags(view.state);
          const createCodeBlockNodeView = featureFlags?.codeBlockSyntaxHighlighting
            ? highlightingCodeBlockNodeView({
                codeBidiWarnings: featureFlags?.codeBidiWarnings,
                codeBidiWarningLabel,
              })
            : codeBlockNodeView();
          return createCodeBlockNodeView(node, view, getPos);
        },
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
    },
  });
};
