import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { EditorPlugin } from '../../types';

type UpdateArgs = {
  newEditorState: EditorState;
  oldEditorState: EditorState;
  transactions: Transaction[];
};
export type ViewUpdateSubscription = (args: UpdateArgs) => void;
type LastUpdateRef = {
  current: UpdateArgs | null;
  initial: UpdateArgs | null;
  transactions: Transaction[];
  queued: boolean;
};

export const trackerStore = new WeakMap<EditorView, Tracker>();

class Tracker {
  private subscriptions: ViewUpdateSubscription[];

  constructor() {
    this.subscriptions = [];
  }

  update = (props: UpdateArgs) => {
    this.subscriptions.forEach((cb) => cb(props));
  };

  add = (subscription: ViewUpdateSubscription) => {
    this.subscriptions.push(subscription);
  };

  remove = (subscription: ViewUpdateSubscription) => {
    this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
  };
}

const pluginKey = new PluginKey('viewUpdateSubscriptionKey');

const createViewUpdateSubscriptionPlugin = (): EditorPlugin => {
  let tracker: Tracker | undefined;
  const lastUpdateRef: LastUpdateRef = {
    current: null,
    initial: null,
    transactions: [],
    queued: false,
  };

  return {
    name: 'viewUpdateSubscription',

    pmPlugins: () => {
      const createPlugin = () =>
        new Plugin({
          key: pluginKey,
          view(editorView) {
            tracker = trackerStore.get(editorView);
            if (!tracker) {
              tracker = new Tracker();
              trackerStore.set(editorView, tracker);
            }

            return {};
          },
        });

      return [{ name: 'viewUpdateSubscription', plugin: createPlugin }];
    },

    onEditorViewStateUpdated(props) {
      lastUpdateRef.current = props;
      lastUpdateRef.transactions.push(...props.transactions);

      if (!lastUpdateRef.queued) {
        lastUpdateRef.initial = props;
        lastUpdateRef.queued = true;

        queueMicrotask(() => {
          if (!lastUpdateRef.current || !lastUpdateRef.initial) {
            return;
          }

          if (tracker) {
            tracker.update({
              newEditorState: lastUpdateRef.current.newEditorState,
              oldEditorState: lastUpdateRef.initial?.oldEditorState,
              transactions: lastUpdateRef.transactions,
            });
          }

          lastUpdateRef.queued = false;
          lastUpdateRef.current = null;
          lastUpdateRef.transactions = [];
        });
      }
    },
  };
};

export default createViewUpdateSubscriptionPlugin;
