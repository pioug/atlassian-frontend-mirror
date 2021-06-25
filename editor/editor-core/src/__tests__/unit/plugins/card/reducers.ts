import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import { cardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, DocBuilder, p } from '@atlaskit/editor-test-helpers/doc-builder';
import reduce from '../../../../plugins/card/pm-plugins/reducers';
import { CardPluginState } from '../../../../plugins/card/types';
import { createCardRequest } from './_helpers';

const atlassianUrl = 'http://www.atlassian.com/';
const googleUrl = 'http://www.google.com/';

describe('card', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        smartLinks: {},
      },
      pluginKey,
    });
  };

  describe('reducers', () => {
    let initialState: any;
    beforeAll(() => {
      const { pluginState } = editor(doc(p()));
      initialState = pluginState;
    });

    describe('#state.init', () => {
      it('creates an empty state', () => {
        expect(initialState).toEqual({
          cards: [],
          requests: [],
          provider: null,
          showLinkingToolbar: false,
        } as CardPluginState);
      });
    });

    describe('#state.update', () => {
      describe('queue', () => {
        it('can queue an item', () => {
          const item = createCardRequest(atlassianUrl, 42);
          expect(
            reduce(initialState, {
              type: 'QUEUE',
              requests: [item],
            }),
          ).toEqual({
            cards: [],
            requests: [item],
            provider: null,
            showLinkingToolbar: false,
          } as CardPluginState);
        });

        it('queues multiple items for the same URL', () => {
          const firstItem = createCardRequest(atlassianUrl, 42);
          const secondItem = createCardRequest(atlassianUrl, 420);
          const expectedState = expect.objectContaining({
            requests: [firstItem, secondItem],
          });

          const stateWithFirstItem = reduce(initialState, {
            type: 'QUEUE',
            requests: [firstItem],
          });

          const finalState = reduce(stateWithFirstItem, {
            type: 'QUEUE',
            requests: [secondItem],
          });

          expect(finalState).toEqual(expectedState);
        });
      });

      it('should set provider', () => {
        const expectedState = expect.objectContaining({
          provider: cardProvider,
        });

        const state = reduce(initialState, {
          type: 'SET_PROVIDER',
          provider: cardProvider,
        });

        expect(state).toEqual(expectedState);
      });

      describe('resolve', () => {
        it('does nothing to an unqueued URL', () => {
          const state = reduce(initialState, {
            type: 'RESOLVE',
            url: 'http://www.unknown.com/',
          });

          expect(state).toEqual(initialState);
        });

        it('resolves a single queued URL', () => {
          const stateWithItem = reduce(initialState, {
            type: 'QUEUE',
            requests: [createCardRequest(atlassianUrl, 42)],
          });

          const stateResolved = reduce(stateWithItem, {
            type: 'RESOLVE',
            url: atlassianUrl,
          });

          expect(stateResolved).toEqual(initialState);
        });

        it('resolves multiple queued URLs', () => {
          const googleCardRequest = createCardRequest(googleUrl, 0);
          const expectedState = expect.objectContaining({
            requests: [googleCardRequest],
          });

          // queue two links with the same URL
          const stateWithTwoAtlassianRequests = [42, 420].reduce(
            (state, pos) =>
              reduce(state, {
                type: 'QUEUE',
                requests: [createCardRequest(atlassianUrl, pos)],
              }),
            initialState,
          );

          // add another, distinct URL which we don't intend to resolve
          const stateWithGoogleCardRequest = reduce(
            stateWithTwoAtlassianRequests,
            {
              type: 'QUEUE',
              requests: [googleCardRequest],
            },
          );

          // resolve the first one, leaving the other one
          const stateResolvedAtlassianRequest = reduce(
            stateWithGoogleCardRequest,
            {
              type: 'RESOLVE',
              url: atlassianUrl,
            },
          );

          expect(stateResolvedAtlassianRequest).toEqual(expectedState);
        });
      });
    });
  });
});
