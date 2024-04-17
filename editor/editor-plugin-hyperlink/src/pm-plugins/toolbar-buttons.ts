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
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

/**
 * Relative placement of an item
 */
type PlacementType = 'start' | 'end';
type AdditionalToolbarItems = Record<PlacementType, GetToolbarItems[]>;

export type HyperlinkToolbarItemsState = {
  items: GetToolbarItems;
  items_next?: AdditionalToolbarItems;
  onEscapeCallback: ((tr: Transaction) => Transaction) | undefined;
  onInsertLinkCallback: QueueCardsFromTransactionAction | undefined;
  /**
   * If you are mounting your own items to the hyperlink toolbar you may decide
   * you want to replace the hyperlink analytics with your own
   * Defaults to false.
   */
  skipAnalytics?: boolean;
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
  skipAnalytics,
  view,
}: PrependToolbarButtonsProps) => {
  const {
    state: { tr },
    dispatch,
  } = view;

  tr.setMeta(toolbarKey, {
    items,
    onEscapeCallback,
    onInsertLinkCallback,
    skipAnalytics,
  });
  dispatch(tr);
};

type AddToolbarItemsProps = {
  items: GetToolbarItems;
  placement: PlacementType;
  view: EditorView;
};

export type AddToolbarItems = (props: AddToolbarItemsProps) => void;

export const addToolbarItems = ({
  items,
  placement,
  view,
}: AddToolbarItemsProps) => {
  const {
    state: { tr },
    dispatch,
  } = view;

  tr.setMeta(toolbarKey, {
    items,
    placement,
  });
  dispatch(tr);
};

const VALID_PLACEMENTS: PlacementType[] = ['start', 'end'];

const isValidPlacement = (placement: unknown): placement is PlacementType => {
  return VALID_PLACEMENTS.some(p => p === placement);
};

export const toolbarButtonsPlugin = () => {
  return new SafePlugin<HyperlinkToolbarItemsState | undefined>({
    key: toolbarKey,
    state: {
      init: (_, __) => {
        return undefined;
      },
      apply: getBooleanFF('platform.editor.card.inject-settings-button')
        ? (tr, pluginState) => {
            const metaState = tr.getMeta(toolbarKey);

            if (metaState) {
              if (typeof metaState === 'object' && 'placement' in metaState) {
                const placement = metaState.placement;
                if (!isValidPlacement(placement)) {
                  return pluginState;
                }

                const previous = pluginState?.items_next ?? {
                  start: [],
                  end: [],
                };

                return {
                  ...pluginState,
                  items_next: {
                    ...previous,
                    [placement]: [...previous[placement], metaState.items],
                  },
                };
              }

              return metaState;
            }
            return pluginState;
          }
        : (tr, pluginState) => {
            const metaState = tr.getMeta(toolbarKey);

            if (metaState) {
              return metaState;
            }
            return pluginState;
          },
    },
  });
};
