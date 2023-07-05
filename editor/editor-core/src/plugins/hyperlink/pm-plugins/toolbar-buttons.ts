import { PluginKey, EditorState, Transaction } from 'prosemirror-state';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { FloatingToolbarItem } from '@atlaskit/editor-common/types';
import { EditorView } from 'prosemirror-view';
import type { IntlShape } from 'react-intl-next';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

type HyperlinkToolbarItemsState = {
  items: GetToolbarItems;
  onEscapeCallback: ((tr: Transaction) => Transaction) | undefined;
};

export const toolbarKey = new PluginKey<HyperlinkToolbarItemsState | undefined>(
  'hyperlinkToolbarItems',
);

type GetToolbarItems = (
  state: EditorState,
  intl: IntlShape,
  providerFactory: ProviderFactory,
  link: string,
) => FloatingToolbarItem<any>[];

interface PrependToolbarButtonsProps extends HyperlinkToolbarItemsState {
  view: EditorView;
}

export type PrependToolbarButtons = (props: PrependToolbarButtonsProps) => void;

export const prependToolbarButtons = ({
  items,
  onEscapeCallback,
  view,
}: PrependToolbarButtonsProps) => {
  const {
    state: { tr },
    dispatch,
  } = view;

  tr.setMeta(toolbarKey, { items, onEscapeCallback });
  dispatch(tr);
};

export const toolbarButtonsPlugin = () => {
  return new SafePlugin({
    key: toolbarKey,
    state: {
      init: (_, state) => {
        return undefined;
      },
      apply: (tr, pluginState) => {
        const metaState = tr.getMeta(toolbarKey);

        if (metaState) {
          return metaState;
        }
        return pluginState;
      },
    },
  });
};
