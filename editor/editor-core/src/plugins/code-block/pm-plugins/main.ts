import { Plugin, NodeSelection } from 'prosemirror-state';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';

import type { EditorProps } from '../../../types';
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
  appearance,
}: {
  useLongPressSelection?: boolean;
  reactContext: () => EditorReactContext;
  appearance: EditorProps['appearance'];
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
          // The appearance being mobile indicates we are in an editor being
          // rendered by mobile bridge in a web view.
          // The tooltip is likely to have unexpected behaviour there, with being cut
          // off, so we disable it. This is also to keep the behaviour consistent with
          // the rendering in the mobile Native Renderer.
          const codeBidiWarningTooltipEnabled = appearance !== 'mobile';

          const createCodeBlockNodeView = featureFlags?.codeBlockSyntaxHighlighting
            ? highlightingCodeBlockNodeView({
                codeBidiWarnings: featureFlags?.codeBidiWarnings,
                codeBidiWarningLabel,
                codeBidiWarningTooltipEnabled: codeBidiWarningTooltipEnabled,
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
