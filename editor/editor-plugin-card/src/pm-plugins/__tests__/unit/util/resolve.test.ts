import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
  CardAdf,
  CardAppearance,
  CardProvider,
} from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import type { Request } from '@atlaskit/editor-plugin-card';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, inlineCard, p } from '@atlaskit/editor-test-helpers/doc-builder';
import * as ffPackage from '@atlaskit/platform-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { pluginKey } from '../../../plugin-key';
import { resolveWithProvider } from '../../../util/resolve';

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
      cardProvider,
      request,
      options,
      undefined,
      undefined,
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
      cardProvider,
      request,
      options,
      undefined,
      undefined,
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
        const spy = jest.spyOn(testCardProvider, 'resolve').mockResolvedValue({
          type,
          attrs: { url, ...(type === 'embedCard' && { layout: 'wide' }) },
        });

        const request: Request = {
          appearance: appearance as CardAppearance,
          compareLinkText: false,
          pos: 0,
          source: INPUT_METHOD.MANUAL,
          url,
        };
        const { editorView } = editor(
          doc(p('{<node>}', inlineCard({ url })())),
        );
        const options = { allowBlockCards, allowEmbeds };
        const cardAdf = (await resolveWithProvider(
          editorView,
          testCardProvider,
          request,
          options,
          undefined,
          undefined,
        )) as CardAdf;

        expect(testCardProvider.resolve).toBeCalledWith(url, appearance, false);
        expect(cardAdf.type).toEqual('inlineCard');

        if (type === 'embedCard' && !allowEmbeds) {
          expect(cardAdf.attrs).not.toHaveProperty('layout');
        }

        spy.mockRestore();
      },
    );
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
        const spy = jest.spyOn(testCardProvider, 'resolve').mockResolvedValue({
          type,
          attrs: { url, ...(type === 'embedCard' && { layout: 'wide' }) },
        });

        const request: Request = {
          appearance: appearance as CardAppearance,
          compareLinkText: false,
          pos: 0,
          source: INPUT_METHOD.MANUAL,
          url,
        };
        const { editorView } = editor(
          doc(p('{<node>}', inlineCard({ url })())),
        );
        const options = { allowBlockCards, allowEmbeds };
        const cardAdf = (await resolveWithProvider(
          editorView,
          testCardProvider,
          request,
          options,
          undefined,
          undefined,
        )) as CardAdf;

        expect(testCardProvider.resolve).toBeCalledWith(url, appearance, false);
        expect(cardAdf.type).toEqual('inlineCard');

        if (type === 'embedCard' && !allowEmbeds) {
          expect(cardAdf.attrs).not.toHaveProperty('layout');
        }

        spy.mockRestore();
      },
    );
  });

  it('defaults datasource request to inline view without datasource attributes when datasourceAllowed is false', async () => {
    const url =
      'https://product-fabric.atlassian.net/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC';
    const appearance = 'block';
    const mockReturnValue = {
      type: 'blockCard',
      attrs: {
        url,
        datasource: {
          views: [{ type: 'table' }],
          id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
          parameters: {
            cloudId: 'c97a19dd-05c1-4fe4-a742-3ef82dfdf1e7',
            jql: 'c97a19dd-05c1-4fe4-a742-3ef82dfdf1e7',
          },
        },
      },
    };

    const testCardProvider = new TestCardProvider();
    const spy = jest
      .spyOn(testCardProvider, 'resolve')
      .mockResolvedValue(mockReturnValue);

    const request: Request = {
      appearance,
      compareLinkText: false,
      pos: 0,
      source: INPUT_METHOD.MANUAL,
      url,
    };
    const { editorView } = editor(doc(p('{<node>}', inlineCard({ url })())));
    const options = { allowDatasource: false, allowBlockCards: true };
    const cardAdf = (await resolveWithProvider(
      editorView,
      testCardProvider,
      request,
      options,
      undefined,
      undefined,
    )) as CardAdf;

    expect(cardAdf.type).toEqual('inlineCard');
    expect(cardAdf.attrs).not.toHaveProperty('datasource');

    spy.mockRestore();
  });

  describe('should resolve JQL datasource card type and attributes correctly depending on feature flag', async () => {
    ffTest('platform.linking-platform.datasource-jira_issues', async () => {
      const url =
        'https://product-fabric.atlassian.net/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC';
      const appearance = 'block';
      const mockReturnValue = {
        type: 'blockCard',
        attrs: {
          url,
          datasource: {
            views: [{ type: 'table' }],
            id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
            parameters: {
              cloudId: 'c97a19dd-05c1-4fe4-a742-3ef82dfdf1e7',
              jql: 'c97a19dd-05c1-4fe4-a742-3ef82dfdf1e7',
            },
          },
        },
      };
      const testCardProvider = new TestCardProvider();
      const spy = jest
        .spyOn(testCardProvider, 'resolve')
        .mockResolvedValue(mockReturnValue);

      const request: Request = {
        appearance,
        compareLinkText: false,
        pos: 0,
        source: INPUT_METHOD.MANUAL,
        url,
      };
      const { editorView } = editor(doc(p('{<node>}', inlineCard({ url })())));
      const options = { allowDatasource: true, allowBlockCards: true };
      const cardAdf = (await resolveWithProvider(
        editorView,
        testCardProvider,
        request,
        options,
        undefined,
        undefined,
      )) as CardAdf;

      if (
        ffPackage.getBooleanFF(
          'platform.linking-platform.datasource-jira_issues',
        )
      ) {
        expect(cardAdf.type).toEqual('blockCard');
        expect(cardAdf.attrs).toHaveProperty('datasource');
      } else {
        expect(cardAdf.type).toEqual('inlineCard');
        expect(cardAdf.attrs).not.toHaveProperty('datasource');
      }

      spy.mockRestore();
    });
  });
});
