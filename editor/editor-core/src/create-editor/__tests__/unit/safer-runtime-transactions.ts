import {
  NodeSelection,
  Plugin,
  Transaction,
  ReadonlyTransaction,
} from 'prosemirror-state';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { UNSAFE_PROPERTY_SET_ERROR } from '../../../utils/performance/safer-transactions';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../../plugins/analytics';

const mockAnalyticsDispatch = jest.fn();

jest.mock('../../../utils/performance/safer-transactions', () => {
  const actual = jest.requireActual<Object>(
    '../../../utils/performance/safer-transactions',
  );
  return {
    ...actual,
    freezeUnsafeTransactionProperties: (opts: any) => {
      const { pluginKey } = opts;
      return (actual as any).freezeUnsafeTransactionProperties({
        dispatchAnalyticsEvent: mockAnalyticsDispatch,
        pluginKey,
      });
    },
  };
});

const createEditor = createEditorFactory();
const mockPlugin = new Plugin({
  state: {
    init() {},
    apply(unsafeTr: Transaction | ReadonlyTransaction, pluginState: any) {
      const tr = (unsafeTr as unknown) as Transaction;
      const shouldBreak = tr.getMeta('mutateInApply');
      const shouldSetSelection = tr.getMeta('setSelectionInApply');
      const isAppendedTransaction = tr.getMeta('anAppendedTransaction');

      if (shouldBreak) {
        tr.insertText('mochi');
      }

      if (shouldSetSelection) {
        const $pos = tr.doc.resolve(0);
        tr.setSelection(new NodeSelection($pos));
      }

      if (isAppendedTransaction) {
        tr.insertText('mochi');
      }

      return pluginState;
    },
  },
  filterTransaction: (tr) => {
    const shouldBreak = tr.getMeta('mutateInFilterTransaction');
    const shouldSetSelection = tr.getMeta('setSelectionInFilterTransaction');

    if (shouldBreak) {
      tr.insertText('mochi');
    }

    if (shouldSetSelection) {
      const $pos = tr.doc.resolve(0);
      tr.setSelection(new NodeSelection($pos));
    }
    return true;
  },
  appendTransaction: (transactions, _oldState, newState) => {
    let shouldAppendTransaction = false;
    transactions.forEach((tr) => {
      const shouldBreak = tr.getMeta('mutateInAppendTransaction');
      const shouldAppendTransactionMeta = tr.getMeta('shouldAppendTransaction');
      const shouldSetSelection = tr.getMeta('setSelectionInAppendTransaction');

      if (shouldAppendTransactionMeta) {
        shouldAppendTransaction = true;
      }

      if (shouldBreak) {
        tr.insertText('mochi');
      }

      if (shouldSetSelection) {
        const $pos = tr.doc.resolve(0);
        tr.setSelection(new NodeSelection($pos));
      }
    });

    if (shouldAppendTransaction) {
      return newState.tr.setMeta('anAppendedTransaction', true);
    }

    return;
  },
});

describe('safer-runtime-transactions', () => {
  describe('enabled', () => {
    const createMockEditor = (saferDispatchedTransactions = true) =>
      createEditor({
        doc: doc(p('{<>}')),
        editorProps: {
          featureFlags: {
            'safer-dispatched-transactions': saferDispatchedTransactions,
          },
        },
        editorPlugins: [
          {
            name: 'aMockEditorPlugin',
            pmPlugins() {
              return [
                {
                  name: 'aMockPMPlugin',
                  plugin: () => {
                    return mockPlugin;
                  },
                },
              ];
            },
          },
        ],
      });
    it('should not throw when we do not mutate transactions', () => {
      const { editorView } = createMockEditor();

      expect(() => {
        const aTr = editorView.state.tr;
        aTr.setMeta('mutateInApply', false);
        aTr.setMeta('mutateInFilterTransaction', false);
        aTr.setMeta('mutateInAppendTransaction', false);
        editorView.dispatch(aTr);
      }).not.toThrow();
    });

    describe('with feature flag OFF', () => {
      it.each<[string, string]>([
        [
          'should NOT throw when we try to mutate transactions in apply',
          'mutateInApply',
        ],
        [
          'should NOT throw when we try to mutate transactions in filterTransaction',
          'mutateInFilterTransaction',
        ],
        [
          'should NOT throw when we try to mutate transactions in appendTransaction',
          'mutateInAppendTransaction',
        ],
        [
          'should NOT throw when we try to set selection in apply',
          'setSelectionInApply',
        ],
        [
          'should NOT throw when we try to set selection in filterTransaction',
          'setSelectionInFilterTransaction',
        ],
        [
          'should NOT throw when we try to set selection in appendTransaction',
          'setSelectionInAppendTransaction',
        ],
      ])('%s', (_, metaName) => {
        const { editorView } = createMockEditor(false);

        expect(() => {
          const aTr = editorView.state.tr;
          aTr.setMeta(metaName, false);
          editorView.dispatch(aTr);
        }).not.toThrowError(UNSAFE_PROPERTY_SET_ERROR);
        expect(mockAnalyticsDispatch).not.toBeCalled();
      });
    });

    describe('with feature flag ON', () => {
      it.each<[string, string]>([
        [
          'should throw when we try to mutate transactions in apply',
          'mutateInApply',
        ],
        [
          'should throw when we try to mutate transactions in filterTransaction',
          'mutateInFilterTransaction',
        ],
        [
          'should throw when we try to mutate transactions in appendTransaction',
          'mutateInAppendTransaction',
        ],
        [
          'should throw when we try to set selection in apply',
          'setSelectionInApply',
        ],
        [
          'should throw when we try to set selection in filterTransaction',
          'setSelectionInFilterTransaction',
        ],
        [
          'should throw when we try to set selection in appendTransaction',
          'setSelectionInAppendTransaction',
        ],
      ])('%s', (_, metaName) => {
        const { editorView } = createMockEditor();

        expect(() => {
          const aTr = editorView.state.tr;
          aTr.setMeta(metaName, true);
          editorView.dispatch(aTr);
        }).toThrowError(UNSAFE_PROPERTY_SET_ERROR);
        expect(mockAnalyticsDispatch).toBeCalledWith(
          expect.objectContaining({
            action: ACTION.TRANSACTION_MUTATED_AFTER_DISPATCH,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
            attributes: {
              pluginKey: expect.any(String),
            },
          }),
        );
      });
      /**
       * We need to also hook into apply and not just our ReactEditorView
       * connection to dispatch; as appendTransaction will call each
       * plugin directly with a new transaction
       */
      it('should stop mutating applyInner transactions from appendedTransactions', () => {
        const { editorView } = createMockEditor();

        expect(() => {
          const aTr = editorView.state.tr;
          aTr.setMeta('shouldAppendTransaction', true);
          editorView.dispatch(aTr);
        }).toThrowError(UNSAFE_PROPERTY_SET_ERROR);
        expect(mockAnalyticsDispatch).toBeCalledWith(
          expect.objectContaining({
            action: ACTION.TRANSACTION_MUTATED_AFTER_DISPATCH,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
            attributes: {
              pluginKey: expect.any(String),
            },
          }),
        );
      });
    });
  });
});
