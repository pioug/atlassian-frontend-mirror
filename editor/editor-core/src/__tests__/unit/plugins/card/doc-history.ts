import { CardProvider } from '@atlaskit/editor-common/provider-factory';

jest.mock('prosemirror-history');
import { closeHistory } from 'prosemirror-history';

import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p, a } from '@atlaskit/editor-test-helpers/schema-builder';

import { pluginKey } from '../../../../plugins/card/pm-plugins/main';

import {
  setProvider,
  queueCards,
} from '../../../../plugins/card/pm-plugins/actions';
import { INPUT_METHOD } from '../../../../plugins/analytics';

describe('card', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorProps: {
        UNSAFE_cards: {},
      },
      pluginKey,
    });
  };

  beforeAll(() => {
    (closeHistory as jest.Mock).mockImplementation(tr => {
      return tr;
    });
  });

  afterAll(() => {
    (closeHistory as jest.Mock).mockClear();
  });

  describe('doc', () => {
    describe('changed document', () => {
      let promises: Promise<any>[] = [];
      let provider: CardProvider;
      const cardAdf = {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'hello world',
          },
        ],
      };

      beforeEach(() => {
        provider = new (class implements CardProvider {
          resolve(): Promise<any> {
            const promise = new Promise(resolve => resolve(cardAdf));
            promises.push(promise);
            return promise;
          }
          async findPattern(): Promise<boolean> {
            return true;
          }
        })();
      });

      afterEach(() => {
        promises = [];
      });

      describe('replacedQueuedCardWithUrl', () => {
        it('closes history around the transaction', async () => {
          const href = 'http://www.atlassian.com/';
          const initialDoc = doc(
            p('hello have a link '),
            p('{<>}', a({ href })(href)),
          );

          const { editorView } = editor(initialDoc);
          const { dispatch } = editorView;

          dispatch(setProvider(provider)(editorView.state.tr));

          dispatch(
            queueCards([
              {
                url: href,
                pos: editorView.state.selection.from,
                appearance: 'inline',
                compareLinkText: true,
                source: INPUT_METHOD.CLIPBOARD,
              },
            ])(editorView.state.tr),
          );

          expect(closeHistory).not.toBeCalled();

          // resolve the provider promise and convert links to cards
          await Promise.all(promises);

          expect(closeHistory).toBeCalledTimes(1);
        });
      });
    });
  });
});
