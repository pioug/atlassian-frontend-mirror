import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  inlineCard,
  DocBuilder,
  a,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  CardAdf,
  CardAppearance,
  CardProvider,
} from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { Request } from '../../../types';
import { INPUT_METHOD } from '../../../../../plugins/analytics/types';
import { pluginKey } from '../../plugin-key';
import { createAnalyticsQueue } from '../../analytics/create-analytics-queue';
import { resolveWithProvider } from '../../util/resolve';

const mockAnalyticsQueue = {
  push: jest.fn(),
  flush: jest.fn(),
  canDispatch: jest.fn(() => true),
};

jest.mock('../../analytics/create-analytics-queue', () => ({
  createAnalyticsQueue: jest.fn(() => mockAnalyticsQueue),
}));

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
    await resolveWithProvider(editorView, cardProvider, request, options);
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
    await resolveWithProvider(editorView, cardProvider, request, options);
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
});

describe('analytics queue', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();
  const editor = (doc: DocBuilder, featureFlags?: Record<string, boolean>) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        featureFlags,
        smartLinks: {},
      },
      pluginKey,
    });
  };

  it('should enable dispatch of events if `lp-analytics-events-next` is provided as `true`', () => {
    const url = 'https://atlassian.com';
    editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
      {
        'lp-analytics-events-next': true,
      },
    );

    expect(createAnalyticsQueue).toHaveBeenCalledWith(true);
  });

  it('should disable dispatch of events if `lp-analytics-events-next` is not provided', () => {
    const url = 'https://atlassian.com';
    editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
      {},
    );

    expect(createAnalyticsQueue).toHaveBeenCalledWith(false);
  });

  it('should disable dispatch of events if `lp-analytics-events-next` is provided as `false`', () => {
    const url = 'https://atlassian.com';
    editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
      {
        'lp-analytics-events-next': false,
      },
    );

    expect(createAnalyticsQueue).toHaveBeenCalledWith(false);
  });

  it('should flush events when the editor updates and flush should always be called after push', () => {
    let lastCalled = null;
    mockAnalyticsQueue.push.mockImplementation(() => {
      lastCalled = mockAnalyticsQueue.push;
    });
    mockAnalyticsQueue.flush.mockImplementation(() => {
      lastCalled = mockAnalyticsQueue.flush;
    });
    const url = 'https://atlassian.com';
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
      {
        'lp-analytics-events-next': true,
      },
    );

    expect(mockAnalyticsQueue.push).toHaveBeenCalled();
    expect(mockAnalyticsQueue.flush).toHaveBeenCalled();
    expect(lastCalled).toBe(mockAnalyticsQueue.flush);

    mockAnalyticsQueue.push.mockClear();
    mockAnalyticsQueue.flush.mockClear();

    editorView.dispatch(
      editorView.state.tr.insert(
        0,
        a({ href: url })('Some link')(editorView.state.schema),
      ),
    );

    expect(mockAnalyticsQueue.push).toHaveBeenCalled();
    expect(mockAnalyticsQueue.flush).toHaveBeenCalled();
    expect(lastCalled).toBe(mockAnalyticsQueue.flush);
  });
});
