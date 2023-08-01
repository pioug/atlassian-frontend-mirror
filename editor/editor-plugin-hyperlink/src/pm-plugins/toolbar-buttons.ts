import type { IntlShape } from 'react-intl-next';

import type { QueueCardsFromTransactionAction } from '@atlaskit/editor-common/card';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { FloatingToolbarItem } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

type HyperlinkToolbarItemsState = {
  items: GetToolbarItems;
  onEscapeCallback: ((tr: Transaction) => Transaction) | undefined;
  onInsertLinkCallback: QueueCardsFromTransactionAction | undefined;
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
  onInsertLinkCallback,
  view,
}: PrependToolbarButtonsProps) => {
  const {
    state: { tr },
    dispatch,
  } = view;

  tr.setMeta(toolbarKey, { items, onEscapeCallback, onInsertLinkCallback });
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
