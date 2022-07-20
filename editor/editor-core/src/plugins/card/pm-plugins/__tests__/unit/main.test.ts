import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  inlineCard,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  CardAdf,
  CardAppearance,
  CardProvider,
} from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { OutstandingRequests } from '../../../types';
import { Request } from '../../../types';
import { INPUT_METHOD } from '../../../../../plugins/analytics/types';
import { pluginKey } from '../../plugin-key';
import { resolveWithProvider } from '../../util/resolve';

describe('resolveWithProvider()', () => {
  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();
  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        allowPanel: true,
        smartLinks: {},
      },
      pluginKey,
    });
  };

  class TestCardProvider implements CardProvider {
    resolve = jest.fn().mockReturnValue(Promise.resolve({}));
    async findPattern(): Promise<boolean> {
      return true;
    }
  }

  let cardProvider: CardProvider;

  beforeEach(() => {
    cardProvider = new TestCardProvider();
  });

  it('should resolve with the right request appearance', async () => {
    const url = 'https://docs.google.com/spreadsheets/d/168c/edit?usp=sharing';
    const request: Request = {
      appearance: 'block',
      compareLinkText: false,
      pos: 0,
      source: INPUT_METHOD.MANUAL,
      shouldReplaceLink: true,
      url,
    };
    const outstandingRequests: OutstandingRequests = {};
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
    );
    const options = { allowBlockCards: true };
    await resolveWithProvider(
      editorView,
      outstandingRequests,
      cardProvider,
      request,
      options,
    );
    expect(cardProvider.resolve).toHaveBeenCalledTimes(1);
    expect(cardProvider.resolve).toBeCalledWith(url, 'block', true);
  });

  it('should set shouldForceAppearance as false in case input source is Manual, but shouldReplaceLink flag is false', async () => {
    const url = 'https://docs.google.com/spreadsheets/d/168c/edit?usp=sharing';
    const request: Request = {
      appearance: 'block',
      compareLinkText: false,
      pos: 0,
      source: INPUT_METHOD.MANUAL,
      shouldReplaceLink: false,
      url,
    };
    const outstandingRequests: OutstandingRequests = {};
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
    );
    const options = { allowBlockCards: true };
    await resolveWithProvider(
      editorView,
      outstandingRequests,
      cardProvider,
      request,
      options,
    );
    expect(cardProvider.resolve).toHaveBeenCalledTimes(1);
    expect(cardProvider.resolve).toBeCalledWith(url, 'block', false);
  });

  describe('Allowed card type', () => {
    it.each([
      ['block', 'blockCard', false, true],
      ['embed', 'embedCard', true, false],
    ])(
      'resolves fallback to inline if %s card is not allowed',
      async (appearance, type, allowBlockCards, allowEmbeds) => {
        const url = 'https://atlassian.slack.com/archives/CR54/p123456';

        const testCardProvider = new TestCardProvider();
        const spy = jest
          .spyOn(testCardProvider, 'resolve')
          .mockResolvedValue({ type, attrs: { url } });

        const request: Request = {
          appearance: appearance as CardAppearance,
          compareLinkText: false,
          pos: 0,
          source: INPUT_METHOD.MANUAL,
          url,
        };
        const outstandingRequests: OutstandingRequests = {};
        const { editorView } = editor(
          doc(p('{<node>}', inlineCard({ url })())),
        );
        const options = { allowBlockCards, allowEmbeds };
        const cardAdf = (await resolveWithProvider(
          editorView,
          outstandingRequests,
          testCardProvider,
          request,
          options,
        )) as CardAdf;

        expect(testCardProvider.resolve).toBeCalledWith(url, appearance, false);

        expect(cardAdf.type).toEqual('inlineCard');

        spy.mockRestore();
      },
    );
  });
});
