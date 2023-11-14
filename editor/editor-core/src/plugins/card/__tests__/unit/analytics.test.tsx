import React from 'react';

import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';
import type { Stub } from 'raf-stub';
import { replaceRaf } from 'raf-stub';

import '@atlaskit/link-test-helpers/jest';
import { createIntl } from 'react-intl-next';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { resolveWithProvider } from '@atlaskit/editor-plugin-card/src/pm-plugins/util/resolve';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { queueCards } from '@atlaskit/editor-plugin-card/src/pm-plugins/actions';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { floatingToolbar } from '@atlaskit/editor-plugin-card/src/toolbar';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import {
  insertDatasource,
  updateCardFromDatasourceModal,
} from '@atlaskit/editor-plugin-card/src/pm-plugins/doc';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createCardRequest } from '@atlaskit/editor-plugin-card/src/__tests__/unit/_helpers';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type {
  Command,
  DocBuilder,
  FloatingToolbarConfig,
  FloatingToolbarButton,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import commonMessages from '@atlaskit/editor-common/messages';

import {
  AnalyticsListener,
  UIAnalyticsEvent,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { cardClient } from '@atlaskit/media-integration-test-helpers/card-client';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createFakeExtensionManifest,
  extensionHandlers,
} from '@atlaskit/editor-test-helpers/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMacroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
import { setNodeSelection } from '@atlaskit/editor-common/utils';
import {
  DefaultExtensionProvider,
  combineExtensionProviders,
} from '@atlaskit/editor-common/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  a,
  datasourceBlockCard,
  inlineCard,
  blockCard,
  embedCard,
  clean,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { ContextAdapter } from '../../../../nodeviews/context-adapter';
import PluginSlot from '../../../../ui/PluginSlot';
import EditorContext from '../../../../ui/EditorContext';
import EditorActions from '../../../../actions';
import type { EditorProps } from '../../../../types';
import type { DatasourceAdf } from '@atlaskit/smart-card';
import { datasourceDataResponse as mockGatasourceDataResponse } from './__fixtures__/datasourceDataResponse';

replaceRaf();
const requestAnimationFrame = window.requestAnimationFrame as any;

const asStub = (raf: typeof requestAnimationFrame) => raf as unknown as Stub;

const mockLinkCreated = jest.fn();
const mockLinkUpdated = jest.fn();
const mockLinkDeleted = jest.fn();

const mockGetDatasourceData = jest.fn(() => {
  return Promise.resolve(mockGatasourceDataResponse);
});

jest.mock('@atlaskit/link-client-extension', () => {
  return {
    useDatasourceClientExtension: () => ({
      getDatasourceData: mockGetDatasourceData,
    }),
  };
});

jest.mock('@atlaskit/smart-card', () => {
  const originalModule = jest.requireActual('@atlaskit/smart-card');
  return {
    ...originalModule,
    useSmartLinkEvents: jest.fn(() => ({
      insertSmartLink(...args: any[]) {},
    })),
  };
});

jest.mock('@atlaskit/link-analytics', () => ({
  ...jest.requireActual('@atlaskit/link-analytics'),
  useSmartLinkLifecycleAnalytics: jest.fn(),
}));

const jqlUrl =
  'https://test1.atlassian.net/issues/?jql=(text%20~%20%22something*%22%20OR%20summary%20~%20%22something*%22)%20order%20by%20created%20DESC';

const datasourceAttributes: DatasourceAdf['attrs'] = {
  url: jqlUrl,
  datasource: {
    id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
    parameters: {
      cloudId: '12345',
      jql: '(text ~ "something*" OR summary ~ "something*") order by created DESC',
    },
    views: [
      {
        type: 'table',
        properties: {
          columns: [
            {
              key: 'key',
            },
            {
              key: 'updated',
            },
            {
              key: 'summary',
            },
            {
              key: 'assignee',
            },
            {
              key: 'issuetype',
            },
            {
              key: 'priority',
            },
            {
              key: 'status',
            },
          ],
        },
      },
    ],
  },
};

const originalDatasourceAdf: DatasourceAdf = {
  type: 'blockCard',
  attrs: datasourceAttributes,
};

describe('Analytics key events', () => {
  const toDisplayButtonName = (display: string) => {
    switch (display) {
      case 'url':
        return 'URL';
      case 'inline':
        return 'Inline';
      case 'block':
        return 'Card';
      case 'embed':
        return 'Embed';
    }
  };

  (useSmartLinkLifecycleAnalytics as jest.Mock).mockImplementation(() => {
    return {
      linkCreated: mockLinkCreated,
      linkUpdated: mockLinkUpdated,
      linkDeleted: mockLinkDeleted,
    };
  });

  const renderEditor = createEditorFactory();

  const flushPromises = () => new Promise((resolve) => setImmediate(resolve));
  const raf: Stub = asStub(requestAnimationFrame);

  const smartCardJsonLd = (url: string) =>
    ({
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Document',
      name: 'Welcome to Atlassian!',
      url,
      preview: {
        href: url,
      },
    } as const);

  class CardProvider extends EditorTestCardProvider {
    async resolve(
      ...args: Parameters<EditorTestCardProvider['resolve']>
    ): ReturnType<EditorTestCardProvider['resolve']> {
      const [url, appearance] = args;

      const hasPattern = await this.findPattern(url);

      if (!hasPattern) {
        return Promise.reject(new Error('Unit test pattern not found'));
      }

      return {
        type: `${appearance}Card`,
        attrs: {
          url,
          data: smartCardJsonLd,
        },
      };
    }

    async findPattern(url: string) {
      return Promise.resolve(
        [
          'https://atlassian.com',
          'https://google.com',
          'https://jdog.jira-dev.com',
        ].some((u) => url.includes(u)),
      );
    }
  }

  class DatasourceCardProvider extends EditorTestCardProvider {
    async resolve(
      ...args: Parameters<EditorTestCardProvider['resolve']>
    ): ReturnType<EditorTestCardProvider['resolve']> {
      const [url] = args;

      const hasPattern = this.isSupportedDatasourceUrl(url);

      if (!hasPattern) {
        return Promise.reject(
          new Error(`${url} is not supported in the unit test`),
        );
      }

      return {
        type: 'blockCard',
        attrs: {
          url: 'https://test1.atlassian.net/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC',
          datasource: {
            id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
            parameters: {
              jql: 'created >= -30d order by created DESC',
              cloudId: '3c621e59-faba-4f7c-b258-103383b63f45',
            },
            views: [
              {
                type: 'table',
              },
            ],
          },
        },
      };
    }

    isSupportedDatasourceUrl(url: string) {
      return new URL(url).search.includes('jql=');
    }
  }

  beforeEach(() => {
    raf.reset();
    jest.clearAllMocks();
  });

  const setup = async (options?: {
    doc?: DocBuilder;
    cardProvider?: typeof EditorTestCardProvider;
    editorProps?: (
      props: EditorProps,
      providerFactory: ProviderFactory,
    ) => EditorProps;
  }) => {
    const providerFactory = new ProviderFactory();
    const editorActions = new EditorActions();
    const analyticsSpy = jest.fn();
    const CardProviderClass = options?.cardProvider ?? CardProvider;

    const cardProviderInstance = new CardProviderClass();
    const cardProvider = Promise.resolve(cardProviderInstance);
    providerFactory.setProvider('cardProvider', cardProvider);

    const defaultEditorPropsFilter = (props: EditorProps) => props;

    const { editorView, editorProps, refs, sel } = renderEditor({
      doc: options?.doc,
      editorProps: (options?.editorProps ?? defaultEditorPropsFilter)(
        {
          allowAnalyticsGASV3: true,
          featureFlags: {
            'lp-link-picker': true,
          },
          linking: {
            smartLinks: {
              provider: cardProvider,
              allowBlockCards: true,
              allowEmbeds: true,
              allowDatasource: true,
            },
          },
        },
        providerFactory,
      ),
      providerFactory,
      editorRender: ({ editor, eventDispatcher, view, config }) => (
        <EditorContext editorActions={editorActions}>
          {editor}
          <PluginSlot
            editorView={view}
            eventDispatcher={eventDispatcher}
            providerFactory={providerFactory}
            items={config.contentComponents}
            containerElement={null}
            wrapperElement={null}
            disabled={false}
            pluginHooks={config.pluginHooks}
          />
        </EditorContext>
      ),
      renderOpts: {
        wrapper: ({ children }) => (
          <AnalyticsListener onEvent={analyticsSpy} channel={'*'}>
            <SmartCardProvider
              storeOptions={{
                initialState: {
                  'https://atlassian.com': {
                    status: 'resolved',
                    details: {
                      meta: {
                        access: 'granted',
                        visibility: 'restricted',
                        key: 'atlassian-provider',
                      },
                      data: smartCardJsonLd('https://atlassian.com'),
                    },
                  },
                },
              }}
              client={cardClient}
            >
              <ContextAdapter>{children}</ContextAdapter>
            </SmartCardProvider>
          </AnalyticsListener>
        ),
      },
    });

    const editor = await screen.findByRole('textbox', {
      name: 'Main content area, start typing to enter text.',
    });

    const undo = () => sendKeyToPm(editorView, 'Ctrl-z');
    const redo = () => sendKeyToPm(editorView, 'Ctrl-y');

    return {
      cardProviderInstance,
      refs,
      sel,
      analyticsSpy,
      editor,
      editorProps,
      editorView,
      undo,
      redo,
    };
  };

  describe('document inserted smartLink', () => {
    it('should fire `document inserted smartLink` when pasting a smart link', async () => {
      const { editorView, analyticsSpy } = await setup({
        doc: doc(p('{<>}')),
        editorProps: (props, providerFactory) => {
          const macroProvider = Promise.resolve(new MockMacroProvider({}));
          providerFactory.setProvider('macroProvider', macroProvider);

          const providerWithAutoConvertHandler = new DefaultExtensionProvider(
            [
              createFakeExtensionManifest({
                title: 'Jira issue',
                type: 'confluence.macro',
                extensionKey: 'jira',
              }),
            ],
            [
              (text: string) => {
                if (text && text.startsWith(`https://jdog`)) {
                  return {
                    type: 'inlineExtension',
                    attrs: {
                      extensionType: 'confluence.macro',
                      extensionKey: 'jira',
                      parameters: {
                        macroParams: {
                          url: text,
                        },
                      },
                    },
                  };
                }
              },
            ],
          );

          const extensionProvider = Promise.resolve(
            combineExtensionProviders([providerWithAutoConvertHandler]),
          );

          providerFactory.setProvider('extensionProvider', extensionProvider);

          return {
            ...props,
            allowExtension: true,
            extensionHandlers,
            extensionProviders: [extensionProvider],
            linking: {
              ...props.linking,
              smartLinks: {
                ...props.linking?.smartLinks,
                resolveBeforeMacros: ['jira'],
              },
            },
          };
        },
      });

      const url = 'https://jdog.jira-dev.com/browse/BENTO-3677';

      dispatchPasteEvent(editorView, {
        html: `<meta charset="utf-8"><a href="${url}">${url}</a>`,
        plain: url,
      });

      /**
       * Should not have fired a created event as link is queued for upgrade
       */
      raf.flush();
      await flushPromises();

      raf.flush();
      await flushPromises();

      /**
       * At this point we will have resolved and upgraded our link into an inline link
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(1);

      expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
        payload: {
          action: 'inserted',
          actionSubject: 'document',
          actionSubjectId: 'smartLink',
          eventType: 'track',
          attributes: {
            actionSubjectId: 'smartLink',
          },
          nonPrivacySafeAttributes: {
            domainName: 'jdog.jira-dev.com',
          },
        },
      });
    });
  });

  describe('toolbar viewed', () => {
    const url = 'https://atlassian.com';
    it.each([
      [
        'url',
        {
          displayCategory: 'link',
          docBuilder: [p(a({ href: url })('Some li{<>}nk text'))],
        },
      ],
      [
        'inline',
        {
          displayCategory: 'smartLink',
          docBuilder: [p('{<node>}', inlineCard({ url })())],
        },
      ],
      [
        'block',
        {
          displayCategory: 'smartLink',
          docBuilder: ['{<node>}', blockCard({ url })()],
        },
      ],
      [
        'embed',
        {
          displayCategory: 'smartLink',
          docBuilder: ['{<node>}', embedCard({ url, layout: 'full-width' })()],
        },
      ],
    ])(
      'should fire toolbar viewed event when the floating toolbar is displayed for link of display %s',
      async (display, { displayCategory, docBuilder }) => {
        const { analyticsSpy } = await setup({
          doc: doc(...docBuilder),
        });

        requestAnimationFrame.step();

        await screen.findByRole('button', {
          name: toDisplayButtonName(display),
        });

        expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
          payload: {
            action: 'viewed',
            actionSubject: 'inlineDialog',
            actionSubjectId: 'editLinkToolbar',
            eventType: 'ui',
            attributes: {
              extensionKey: 'atlassian-provider',
              display,
              displayCategory,
            },
          },
        });
      },
    );
  });

  describe('link created', () => {
    it('should fire when auto-linking a typed url', async () => {
      const { editorView, undo, redo } = await setup();
      const url = 'https://atlassian.com';
      insertText(editorView, `${url} `);

      /**
       * auto linking does not get upgraded
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(
        {
          url,
          displayCategory: 'link',
        },
        null,
        {
          creationMethod: 'editor_type',
          display: 'url',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledWith(
        {
          url,
          displayCategory: 'link',
        },
        null,
        {
          deleteType: 'undo',
          deleteMethod: 'undo',
          display: 'url',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(
        {
          url,
          displayCategory: 'link',
        },
        null,
        {
          creationMethod: 'redo',
          display: 'url',
          nodeContext: 'doc',
        },
      );
    });

    it('should fire when auto-linking a typed url and pressing enter', async () => {
      const { editorView, undo, redo } = await setup();
      const url = 'https://atlassian.com';
      insertText(editorView, url);
      sendKeyToPm(editorView, 'Enter');

      /**
       * auto linking does not get upgraded
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(
        {
          url,
          displayCategory: 'link',
        },
        null,
        {
          creationMethod: 'editor_type',
          display: 'url',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledWith(
        {
          url,
          displayCategory: 'link',
        },
        null,
        {
          deleteType: 'undo',
          deleteMethod: 'undo',
          display: 'url',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(
        {
          url,
          displayCategory: 'link',
        },
        null,
        {
          creationMethod: 'redo',
          display: 'url',
          nodeContext: 'doc',
        },
      );
    });

    it('should fire when typing in markdown [text](url)', async () => {
      const { editorView, sel, undo, redo } = await setup({
        doc: doc(p('{<>}')),
      });
      const url = 'https://atlassian.com';
      insertText(editorView, `[thisisthelinktext](${url})`, sel, sel);

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(
        {
          url,
          displayCategory: 'link',
        },
        null,
        {
          creationMethod: 'editor_type',
          display: 'url',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledWith(
        {
          url,
          displayCategory: 'link',
        },
        null,
        {
          deleteType: 'undo',
          deleteMethod: 'undo',
          display: 'url',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(
        {
          url,
          displayCategory: 'link',
        },
        null,
        {
          creationMethod: 'redo',
          display: 'url',
          nodeContext: 'doc',
        },
      );
    });

    it('should fire when inserting a link via legacy link picker', async () => {
      const url = 'https://atlassian.com';
      const urlDetails = { url };
      const { editorView } = await setup({
        editorProps: (props) => ({
          ...props,
          featureFlags: {
            ...props.featureFlags,
            'lp-link-picker': false,
          },
        }),
      });

      requestAnimationFrame.step();
      sendKeyToPm(editorView, 'Mod-k');

      const urlField = await screen.findByTestId('link-url');

      await userEvent.type(urlField, url);
      fireEvent.keyDown(urlField, {
        key: 'Enter',
        keyCode: 13,
        which: 13,
      });

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

      raf.flush();
      await flushPromises();

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(urlDetails, null, {
        creationMethod: 'linkpicker_manual',
        display: 'inline',
        nodeContext: 'doc',
      });
    });

    it('should fire when inserting a link via link picker that CAN be resolved', async () => {
      const url = 'https://atlassian.com';
      const urlDetails = { url };
      const { editorView, undo, redo } = await setup({});
      requestAnimationFrame.step();
      sendKeyToPm(editorView, 'Mod-k');

      const urlField = await screen.findByTestId('link-url');
      const submitButton = await screen.findByRole('button', {
        name: 'Insert',
      });
      await userEvent.type(urlField, url);
      await userEvent.click(submitButton);

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

      raf.flush();
      await flushPromises();

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(
        urlDetails,
        expect.any(UIAnalyticsEvent),
        {
          creationMethod: 'linkpicker_manual',
          display: 'inline',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        { ...urlDetails, displayCategory: 'link' },
        null,
        {
          updateType: 'undo',
          updateMethod: 'undo',
          display: 'url',
          previousDisplay: 'inline',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(urlDetails, null, {
        updateType: 'redo',
        updateMethod: 'redo',
        display: 'inline',
        previousDisplay: 'url',
        nodeContext: 'doc',
      });
    });

    it('should fire when inserting a link via link picker that CANNOT be resolved', async () => {
      const url = '/root-relative-link';
      const urlDetails = { url };

      const { editorView, undo, redo } = await setup();
      requestAnimationFrame.step();
      sendKeyToPm(editorView, 'Mod-k');

      const urlField = await screen.findByTestId('link-url');
      const submitButton = await screen.findByRole('button', {
        name: 'Insert',
      });

      await userEvent.type(urlField, url);
      await userEvent.click(submitButton);

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

      raf.flush();
      await flushPromises();

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(
        { ...urlDetails, displayCategory: 'link' },
        expect.any(UIAnalyticsEvent),
        {
          creationMethod: 'linkpicker_manual',
          display: 'url',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      // First undo un-does the "resolve" replace
      // but there is no document change being un-done
      undo();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledWith(
        { ...urlDetails, displayCategory: 'link' },
        null,
        {
          deleteType: 'undo',
          deleteMethod: 'undo',
          display: 'url',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(
        { ...urlDetails, displayCategory: 'link' },
        null,
        {
          creationMethod: 'redo',
          display: 'url',
          nodeContext: 'doc',
        },
      );
    });

    it('should fire when inserting a link via link picker over a text selection', async () => {
      const url = 'https://google.com';
      const urlDetails = { url };

      const { editorView } = await setup({
        doc: doc(p('{<}Text{>}')),
      });

      sendKeyToPm(editorView, 'Mod-k');

      const urlField = await screen.findByTestId('link-url');
      const submitButton = await screen.findByRole('button', {
        name: 'Insert',
      });

      await userEvent.type(urlField, url);
      await userEvent.click(submitButton);

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(
        { ...urlDetails, displayCategory: 'link' },
        expect.any(UIAnalyticsEvent),
        {
          creationMethod: 'linkpicker_manual',
          display: 'url',
          nodeContext: 'doc',
        },
      );
    });

    describe('paste', () => {
      it('fires link created when pasting a link over text', async () => {
        const { editorView, redo, undo } = await setup({
          doc: doc(p('{<}some plain text{>}')),
        });

        const url = 'https://atlassian.com';

        dispatchPasteEvent(editorView, {
          plain: url,
        });

        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            creationMethod: 'editor_paste',
            display: 'url',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        undo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            display: 'url',
            deleteMethod: 'undo',
            deleteType: 'undo',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        redo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            display: 'url',
            creationMethod: 'redo',
            nodeContext: 'doc',
          },
        );
      });

      it('fires link created when inserting a smart link instead of a macro', async () => {
        const { editorView, undo, redo } = await setup({
          doc: doc(p('{<>}')),
          editorProps: (props, providerFactory) => {
            const macroProvider = Promise.resolve(new MockMacroProvider({}));
            providerFactory.setProvider('macroProvider', macroProvider);

            const providerWithAutoConvertHandler = new DefaultExtensionProvider(
              [
                createFakeExtensionManifest({
                  title: 'Jira issue',
                  type: 'confluence.macro',
                  extensionKey: 'jira',
                }),
              ],
              [
                (text: string) => {
                  if (text && text.startsWith(`https://jdog`)) {
                    return {
                      type: 'inlineExtension',
                      attrs: {
                        extensionType: 'confluence.macro',
                        extensionKey: 'jira',
                        parameters: {
                          macroParams: {
                            url: text,
                          },
                        },
                      },
                    };
                  }
                },
              ],
            );

            const extensionProvider = Promise.resolve(
              combineExtensionProviders([providerWithAutoConvertHandler]),
            );

            providerFactory.setProvider('extensionProvider', extensionProvider);

            return {
              ...props,
              allowExtension: true,
              extensionHandlers,
              extensionProviders: [extensionProvider],
              linking: {
                ...props.linking,
                smartLinks: {
                  ...props.linking?.smartLinks,
                  resolveBeforeMacros: ['jira'],
                },
              },
            };
          },
        });

        const url = 'https://jdog.jira-dev.com/browse/BENTO-3677';

        dispatchPasteEvent(editorView, {
          html: `<meta charset="utf-8"><a href="${url}">${url}</a>`,
          plain: url,
        });

        /**
         * Should not have fired a created event as link is queued for upgrade
         */
        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

        raf.flush();
        await flushPromises();

        /**
         * At this point we will have done a resolve check in the paste plugin
         * We will have added a link to the page and queued it for upgrade
         */
        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

        raf.flush();
        await flushPromises();

        /**
         * At this point we will have resolved and upgraded our link into an inline link
         */
        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
          },
          null,
          {
            creationMethod: 'editor_paste',
            display: 'inline',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        undo();

        /**
         * Undo will revert the upgrade as an update
         */
        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            updateType: 'undo',
            updateMethod: 'undo',
            display: 'url',
            previousDisplay: 'inline',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        undo();
        undo();

        /**
         * Further undo deletes the link
         */
        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            deleteType: 'undo',
            deleteMethod: 'undo',
            display: 'url',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        redo();
        redo();

        /**
         * Redo re-creates the link as a hyperlink
         */
        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            creationMethod: 'redo',
            display: 'url',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        redo();

        /**
         * Further redo upgrades the link again
         */
        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledWith(
          {
            url,
          },
          null,
          {
            updateType: 'redo',
            updateMethod: 'redo',
            display: 'inline',
            previousDisplay: 'url',
            nodeContext: 'doc',
          },
        );
      });

      it('fires link created when pasting a hyperlink where the link text DOES match the href', async () => {
        const { editorView, undo, redo } = await setup();
        const url = 'https://atlassian.com';

        dispatchPasteEvent(editorView, {
          html: `<meta charset="utf-8"><a href="${url}">${url}</a>`,
        });

        /**
         * Should not have fired a created event as link is queued for upgrade
         */
        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

        raf.flush();
        await flushPromises();

        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
          },
          null,
          {
            creationMethod: 'editor_paste',
            display: 'inline',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        undo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            updateType: 'undo',
            updateMethod: 'undo',
            previousDisplay: 'inline',
            display: 'url',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        undo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            deleteType: 'undo',
            deleteMethod: 'undo',
            display: 'url',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        redo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            creationMethod: 'redo',
            display: 'url',
            nodeContext: 'doc',
          },
        );
      });

      it('fires link created when pasting a hyperlink where the link text DOES NOT match the href (is not queued for upgrade)', async () => {
        const { editorView, undo, redo } = await setup();
        const url = 'https://atlassian.com';

        dispatchPasteEvent(editorView, {
          html: `<meta charset="utf-8"><a href="${url}">Test</a>`,
        });

        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            creationMethod: 'editor_paste',
            display: 'url',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        undo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            deleteType: 'undo',
            deleteMethod: 'undo',
            display: 'url',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        redo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            creationMethod: 'redo',
            display: 'url',
            nodeContext: 'doc',
          },
        );
      });

      it('fires multiple link created when pasting content where some hyperlinks have text that DO match their href and some hyperlinks have text that DOES NOT match the href', async () => {
        const { editorView } = await setup();
        const url = 'https://atlassian.com';

        sendKeyToPm(editorView, 'Mod-a');

        dispatchPasteEvent(editorView, {
          html: `<meta charset="utf-8"><p><a href="${url}">${url}</a></p><p>Some content</p><a href="${url}">Test</a></p>`,
        });

        /**
         * One link that is not being upgrade is tracked
         */
        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            creationMethod: 'editor_paste',
            display: 'url',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();

        /**
         * Wait for link to resolve
         */
        raf.flush();
        await flushPromises();

        /**
         * Second link being upgraded is tracked after resolve
         */
        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
          },
          null,
          {
            creationMethod: 'editor_paste',
            display: 'inline',
            nodeContext: 'doc',
          },
        );
      });

      it('fires link created when pasting a hyperlink as plain text', async () => {
        const { editorView, undo, redo } = await setup();
        const url = 'https://atlassian.com';

        dispatchPasteEvent(
          editorView,
          {
            html: `<meta charset="utf-8"><p><a href="${url}">Test</a></p>`,
            plain: url,
          },
          { shift: true },
        );

        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            creationMethod: 'editor_paste',
            display: 'url',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();

        undo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            deleteMethod: 'undo',
            deleteType: 'undo',
            display: 'url',
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();

        redo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(1);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkCreated).toHaveBeenCalledWith(
          {
            url,
            displayCategory: 'link',
          },
          null,
          {
            creationMethod: 'redo',
            display: 'url',
            nodeContext: 'doc',
          },
        );
      });
    });
  });

  describe('link updated', () => {
    const url = 'https://atlassian.com';
    const linkDetails = { url };

    it.each([
      ['url', 'inline'],
      ['url', 'block'],
      ['url', 'embed'],
    ])(
      'should be fired when using the toolbar to update from a %s to %s',
      async (previousDisplay, display) => {
        const { undo, redo } = await setup({
          doc: doc(p(a({ href: url })('Some li{<>}nk text'))),
        });
        requestAnimationFrame.step();

        const appearanceButton = await screen.findByRole('button', {
          name: toDisplayButtonName(display),
        });

        fireEvent.click(appearanceButton);

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

        /**
         * URL to smart link update is executed as a request to resolve + upgrade
         * Wait for this to be resolved
         */
        raf.flush();
        await flushPromises();

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledWith(
          {
            ...linkDetails,
            displayCategory: display === 'url' ? 'link' : undefined,
          },
          null,
          {
            updateType: 'display_update',
            updateMethod: 'editor_floatingToolbar',
            display,
            previousDisplay,
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        undo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledWith(
          {
            ...linkDetails,
            displayCategory: previousDisplay === 'url' ? 'link' : undefined,
          },
          null,
          {
            updateType: 'undo',
            updateMethod: 'undo',
            display: previousDisplay,
            previousDisplay: display,
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        redo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledWith(
          {
            ...linkDetails,
            displayCategory: display === 'url' ? 'link' : undefined,
          },
          null,
          {
            updateType: 'redo',
            updateMethod: 'redo',
            display,
            previousDisplay,
            nodeContext: 'doc',
          },
        );
      },
    );

    it.each([
      ['inline', 'url', [p('{<node>}', inlineCard({ url })())]],
      ['inline', 'block', [p('{<node>}', inlineCard({ url })())]],
      ['inline', 'embed', [p('{<node>}', inlineCard({ url })())]],
      ['block', 'url', ['{<node>}', blockCard({ url })()]],
      ['block', 'inline', ['{<node>}', blockCard({ url })()]],
      ['block', 'embed', ['{<node>}', blockCard({ url })()]],
      [
        'embed',
        'url',
        ['{<node>}', embedCard({ url, layout: 'full-width' })()],
      ],
      [
        'embed',
        'inline',
        ['{<node>}', embedCard({ url, layout: 'full-width' })()],
      ],
      [
        'embed',
        'block',
        ['{<node>}', embedCard({ url, layout: 'full-width' })()],
      ],
    ])(
      'should be fired when using the toolbar to update from a %s card to %s',
      async (previousDisplay, display, docBuilder) => {
        const { editorView, refs, undo, redo } = await setup({
          doc: doc(...docBuilder),
        });

        setNodeSelection(editorView, refs.node);

        const appearanceButton = await screen.findByRole('button', {
          name: toDisplayButtonName(display),
        });

        fireEvent.click(appearanceButton);

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledWith(
          {
            ...linkDetails,
            displayCategory: display === 'url' ? 'link' : undefined,
          },
          null,
          {
            updateType: 'display_update',
            updateMethod: 'editor_floatingToolbar',
            display,
            previousDisplay,
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        undo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledWith(
          {
            ...linkDetails,
            displayCategory: previousDisplay === 'url' ? 'link' : undefined,
          },
          null,
          {
            updateType: 'undo',
            updateMethod: 'undo',
            display: previousDisplay,
            previousDisplay: display,
            nodeContext: 'doc',
          },
        );

        jest.clearAllMocks();
        redo();

        expect(mockLinkCreated).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
        expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
        expect(mockLinkUpdated).toHaveBeenCalledWith(
          {
            ...linkDetails,
            displayCategory: display === 'url' ? 'link' : undefined,
          },
          null,
          {
            updateType: 'redo',
            updateMethod: 'redo',
            display,
            previousDisplay,
            nodeContext: 'doc',
          },
        );
      },
    );

    it('should be fired when updating a smart card using the link picker to a link that CAN be resolved', async () => {
      const { editorView, refs, undo, redo } = await setup({
        doc: doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'https://google.com',
              data: { title: 'Google' },
            })(),
          ),
        ),
      });

      setNodeSelection(editorView, refs.node);

      const appearanceButton = await screen.findByRole('button', {
        name: 'Edit link',
      });

      fireEvent.click(appearanceButton);

      const urlField = await screen.findByTestId('link-url');
      const submitButton = await screen.findByRole('button', {
        name: 'Save',
      });
      await userEvent.clear(urlField);
      await userEvent.type(urlField, url);
      await userEvent.click(submitButton);

      /**
       * Has not yet fired an event as has inserted a hyperlink and is queued for upgrade attempt
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

      raf.flush();
      await flushPromises();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        linkDetails,
        expect.any(UIAnalyticsEvent),
        {
          updateType: 'link_update',
          updateMethod: 'linkpicker_manual',
          display: 'inline',
          previousDisplay: 'inline',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        { ...linkDetails, displayCategory: 'link' },
        null,
        {
          updateType: 'undo',
          updateMethod: 'undo',
          display: 'url',
          previousDisplay: 'inline',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        { url: 'https://google.com' },
        null,
        {
          updateType: 'undo',
          updateMethod: 'undo',
          display: 'inline',
          previousDisplay: 'url',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        { ...linkDetails, displayCategory: 'link' },
        null,
        {
          updateType: 'redo',
          updateMethod: 'redo',
          display: 'url',
          previousDisplay: 'inline',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(linkDetails, null, {
        updateType: 'redo',
        updateMethod: 'redo',
        display: 'inline',
        previousDisplay: 'url',
        nodeContext: 'doc',
      });
    });

    it('should be fired when updating a smart card using the link picker to a link and also changing its display text', async () => {
      const nextUrl = 'https://google.com';
      const { editorView, refs, undo, redo } = await setup({
        doc: doc(
          p(
            '{<node>}',
            inlineCard({
              url,
              data: { title: 'Atlassian' },
            })(),
          ),
        ),
      });

      setNodeSelection(editorView, refs.node);

      const appearanceButton = await screen.findByRole('button', {
        name: 'Edit link',
      });

      fireEvent.click(appearanceButton);

      const urlField = await screen.findByTestId('link-url');
      const displayTextField = await screen.findByTestId('link-text');
      const submitButton = await screen.findByRole('button', {
        name: 'Save',
      });
      await userEvent.clear(urlField);
      await userEvent.clear(displayTextField);
      await userEvent.type(urlField, nextUrl);
      await userEvent.type(displayTextField, 'Some link');

      await userEvent.click(submitButton);

      /**
       * Has not yet fired an event as has inserted a hyperlink and is queued for upgrade attempt
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

      raf.flush();
      await flushPromises();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        { url: nextUrl, displayCategory: 'link' },
        expect.any(UIAnalyticsEvent),
        {
          updateMethod: 'linkpicker_manual',
          updateType: 'link_update',
          display: 'url',
          previousDisplay: 'inline',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(linkDetails, null, {
        updateType: 'undo',
        updateMethod: 'undo',
        display: 'inline',
        previousDisplay: 'url',
        nodeContext: 'doc',
      });

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        { url: nextUrl, displayCategory: 'link' },
        null,
        {
          updateType: 'redo',
          updateMethod: 'redo',
          display: 'url',
          previousDisplay: 'inline',
          nodeContext: 'doc',
        },
      );
    });

    it('should be fired when updating a smart card using the link picker to a link that CANNOT be resolved', async () => {
      const { editorView, refs, undo, redo } = await setup({
        doc: doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'https://atlassian.com',
              data: { title: 'Atlassian' },
            })(),
          ),
        ),
      });

      setNodeSelection(editorView, refs.node);

      const editButton = await screen.findByRole('button', {
        name: 'Edit link',
      });

      fireEvent.click(editButton);

      const urlField = await screen.findByTestId('link-url');
      const submitButton = await screen.findByRole('button', {
        name: 'Save',
      });

      // Url will not be "resolvable"
      await userEvent.clear(urlField);
      await userEvent.type(urlField, 'https://example.com');
      await userEvent.click(submitButton);

      /**
       * Has not yet fired an event as has inserted a hyperlink and is queued for upgrade attempt
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

      raf.flush();
      await flushPromises();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        { url: 'https://example.com', displayCategory: 'link' },
        expect.any(UIAnalyticsEvent),
        {
          updateType: 'link_update',
          updateMethod: 'linkpicker_manual',
          display: 'url',
          previousDisplay: 'inline',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      // second undo needed as 1st undo "undos" the resolve replace which doesn't actually happen
      undo();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(linkDetails, null, {
        updateType: 'undo',
        updateMethod: 'undo',
        display: 'inline',
        previousDisplay: 'url',
        nodeContext: 'doc',
      });

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        { url: 'https://example.com', displayCategory: 'link' },
        null,
        {
          updateType: 'redo',
          updateMethod: 'redo',
          display: 'url',
          previousDisplay: 'inline',
          nodeContext: 'doc',
        },
      );
    });

    it('should be fired when updating a hyperlink using the link picker', async () => {
      const initialUrl = 'https://atlassian.com';
      const nextUrl = 'https://google.com';
      const { undo, redo } = await setup({
        doc: doc(p(a({ href: initialUrl })('https://atlas{<>}sian.com'))),
      });

      const editButton = await screen.findByRole('button', {
        name: 'Edit link',
      });

      fireEvent.click(editButton);

      const urlField = await screen.findByTestId('link-url');
      const submitButton = await screen.findByRole('button', {
        name: 'Save',
      });
      await userEvent.clear(urlField);
      await userEvent.type(urlField, nextUrl);
      await userEvent.click(submitButton);

      /**
       * Blue links do not get upgraded when editting, update fires immediately
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        { url: nextUrl, displayCategory: 'link' },
        expect.any(UIAnalyticsEvent),
        {
          updateType: 'link_update',
          updateMethod: 'linkpicker_manual',
          display: 'url',
          previousDisplay: 'url',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        { ...linkDetails, displayCategory: 'link' },
        null,
        {
          updateType: 'undo',
          updateMethod: 'undo',
          display: 'url',
          previousDisplay: 'url',
          nodeContext: 'doc',
        },
      );

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledWith(
        { url: nextUrl, displayCategory: 'link' },
        null,
        {
          updateType: 'redo',
          updateMethod: 'redo',
          display: 'url',
          previousDisplay: 'url',
          nodeContext: 'doc',
        },
      );
    });
  });

  describe('link deleted', () => {
    it('should be fired when the user deletes content by pressing delete', async () => {
      const url1 = 'https://atlassian.com';
      const url2 = 'https://google.com';
      const url1Details = { url: url1 };
      const url2Details = { url: url2 };

      const { editorView, undo, redo } = await setup({
        doc: doc(
          p(a({ href: url1 })('Some link text')),
          p(inlineCard({ url: url2 })()),
          blockCard({ url: url2 })(),
          embedCard({ url: url2, layout: 'full-width' })(),
        ),
      });

      sendKeyToPm(editorView, 'Mod-a');
      sendKeyToPm(editorView, 'Delete');
      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(4);
      expect(mockLinkDeleted).toHaveBeenCalledWith(
        { ...url1Details, displayCategory: 'link' },
        null,
        {
          deleteType: 'delete',
          deleteMethod: 'unknown',
          display: 'url',
          nodeContext: 'doc',
        },
      );
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'delete',
        deleteMethod: 'unknown',
        display: 'inline',
        nodeContext: 'doc',
      });
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'delete',
        deleteMethod: 'unknown',
        display: 'block',
        nodeContext: 'doc',
      });
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'delete',
        deleteMethod: 'unknown',
        display: 'embed',
        nodeContext: 'doc',
      });

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(4);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(
        { ...url1Details, displayCategory: 'link' },
        null,
        {
          creationMethod: 'undo',
          display: 'url',
          nodeContext: 'doc',
        },
      );
      expect(mockLinkCreated).toHaveBeenCalledWith(url2Details, null, {
        creationMethod: 'undo',
        display: 'inline',
        nodeContext: 'doc',
      });
      expect(mockLinkCreated).toHaveBeenCalledWith(url2Details, null, {
        creationMethod: 'undo',
        display: 'block',
        nodeContext: 'doc',
      });
      expect(mockLinkCreated).toHaveBeenCalledWith(url2Details, null, {
        creationMethod: 'undo',
        display: 'embed',
        nodeContext: 'doc',
      });

      jest.clearAllMocks();
      redo();

      sendKeyToPm(editorView, 'Mod-a');
      sendKeyToPm(editorView, 'Delete');
      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(4);
      expect(mockLinkDeleted).toHaveBeenCalledWith(
        { ...url1Details, displayCategory: 'link' },
        null,
        {
          deleteType: 'redo',
          deleteMethod: 'redo',
          display: 'url',
          nodeContext: 'doc',
        },
      );
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'redo',
        deleteMethod: 'redo',
        display: 'inline',
        nodeContext: 'doc',
      });
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'redo',
        deleteMethod: 'redo',
        display: 'block',
        nodeContext: 'doc',
      });
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'redo',
        deleteMethod: 'redo',
        display: 'embed',
        nodeContext: 'doc',
      });
    });

    it('should be fired when the user deletes a smart card using the floating toolbar button', async () => {
      const url = 'https://atlassian.com';
      const linkDetails = { url };

      const { editorView, refs, undo, redo } = await setup({
        doc: doc(p('{<node>}', inlineCard({ url })())),
      });

      setNodeSelection(editorView, refs.node);

      const removeButton = await screen.findByRole('button', {
        name: 'Remove',
      });

      fireEvent.click(removeButton);

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledWith(linkDetails, null, {
        deleteType: 'delete',
        deleteMethod: 'editor_floatingToolbar',
        display: 'inline',
        nodeContext: 'doc',
      });

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(linkDetails, null, {
        creationMethod: 'undo',
        display: 'inline',
        nodeContext: 'doc',
      });

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledWith(linkDetails, null, {
        deleteType: 'redo',
        deleteMethod: 'redo',
        display: 'inline',
        nodeContext: 'doc',
      });
    });

    it('should be fired when the user unlinks a smart card using the floating toolbar', async () => {
      const url = 'https://atlassian.com';
      const linkDetails = { url };

      const { editorView, refs, undo, redo } = await setup({
        doc: doc(p('{<node>}', inlineCard({ url })())),
      });

      setNodeSelection(editorView, refs.node);

      const unlinkButton = await screen.findByRole('button', {
        name: 'Unlink',
      });

      fireEvent.click(unlinkButton);

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledWith(linkDetails, null, {
        deleteType: 'unlink',
        deleteMethod: 'editor_floatingToolbar',
        display: 'inline',
        nodeContext: 'doc',
      });

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(linkDetails, null, {
        creationMethod: 'undo',
        display: 'inline',
        nodeContext: 'doc',
      });

      jest.clearAllMocks();
      redo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledWith(linkDetails, null, {
        deleteType: 'redo',
        deleteMethod: 'redo',
        display: 'inline',
        nodeContext: 'doc',
      });
    });
  });

  describe('datasource', () => {
    const jqlUrl =
      'https://test1.atlassian.net/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC';

    const getExpectedPayload = (
      action: 'created' | 'updated' | 'deleted',
      overrideAttributes = {},
      domainName = 'test1.atlassian.net',
    ) => ({
      eventType: 'track',
      actionSubject: 'datasource',
      actionSubjectId: undefined,
      action: action,
      attributes: {
        sourceEvent: null,
        display: 'table',
        nodeContext: 'doc',
        searchMethod: '',
        displayedColumnCount: 7,
        extensionKey: 'jira-object-provider',
        status: 'resolved',
        destinationObjectTypes: ['issue'],
        totalItemCount: 4,
        smartLinkId: undefined,
        ...overrideAttributes,
      },
      nonPrivacySafeAttributes: {
        domainName,
      },
    });

    const getAnalyticsCallsByAction = (
      analyticsSpy: jest.Mock,
      action: 'created' | 'updated' | 'deleted',
      actionSubject: 'datasource' | 'link' = 'datasource',
    ) => {
      return analyticsSpy.mock.calls.filter(
        ([evt]) =>
          evt.payload.actionSubject === actionSubject &&
          evt.payload.action === action,
      );
    };

    const setupWithLinkConversionToDatasource = async () => {
      const {
        analyticsSpy,
        cardProviderInstance,
        editorView,
        editorProps,
        undo,
        redo,
      } = await setup({
        doc: doc(p(a({ href: jqlUrl })(jqlUrl), ' ')),
        cardProvider: DatasourceCardProvider,
      });
      const cardRequestOne = createCardRequest(jqlUrl, 1);

      await resolveWithProvider(
        editorView,
        cardProviderInstance as DatasourceCardProvider,
        cardRequestOne,
        editorProps.linking!.smartLinks!,
        undefined,
        undefined,
      );

      editorView.dispatch(queueCards([cardRequestOne])(editorView.state.tr));

      raf.flush();
      requestAnimationFrame.step();
      await flushPromises();
      requestAnimationFrame.step();
      await flushPromises();

      return {
        analyticsSpy,
        cardProviderInstance,
        editorView,
        editorProps,
        undo,
        redo,
      };
    };

    describe('datasource created', () => {
      describe('should fire when an anchor link is converted into a datasource if FF is true', () => {
        ffTest(
          'platform.linking-platform.datasource-jira_issues',
          async () => {
            const { analyticsSpy } =
              await setupWithLinkConversionToDatasource();

            const datasourceCreatedCalls = getAnalyticsCallsByAction(
              analyticsSpy,
              'created',
            );
            expect(datasourceCreatedCalls.length).toEqual(1);

            expect(datasourceCreatedCalls[0][0].payload).toEqual(
              getExpectedPayload('created', {
                creationMethod: 'editor_paste',
                displayedColumnCount: 7,
                actions: [],
              }),
            );
          },
          async () => {
            const {
              analyticsSpy,
              cardProviderInstance,
              editorView,
              editorProps,
            } = await setup({
              doc: doc(p(a({ href: jqlUrl })(jqlUrl), ' ')),
              cardProvider: DatasourceCardProvider,
            });
            const cardRequestOne = createCardRequest(jqlUrl, 1);

            await resolveWithProvider(
              editorView,
              cardProviderInstance as DatasourceCardProvider,
              cardRequestOne,
              editorProps.linking!.smartLinks!,
              undefined,
              undefined,
            );

            editorView.dispatch(
              queueCards([cardRequestOne])(editorView.state.tr),
            );

            raf.flush();
            requestAnimationFrame.step();
            await flushPromises();
            requestAnimationFrame.step();
            await flushPromises();

            const datasourceCreatedCalls = getAnalyticsCallsByAction(
              analyticsSpy,
              'created',
            );
            expect(datasourceCreatedCalls.length).toEqual(0);
          },
        );
      });

      it('should fire when a datasource is inserted via a dispatch transaction with a source analytic event (ex. jira issues config modal) when FF is true', async () => {
        const { analyticsSpy, editorView } = await setup({
          doc: doc(p('')),
          cardProvider: DatasourceCardProvider,
        });

        insertDatasource(
          editorView.state,
          originalDatasourceAdf,
          editorView,
          new UIAnalyticsEvent({
            payload: {
              attributes: {
                actions: ['columns added'],
                inputMethod: 'datasource_config',
                searchMethod: 'datasource_basic_filter',
              },
            },
          }),
        );

        raf.flush();
        requestAnimationFrame.step();
        await flushPromises();

        const datasourceCreatedCalls = getAnalyticsCallsByAction(
          analyticsSpy,
          'created',
        );
        expect(datasourceCreatedCalls.length).toEqual(1);
        expect(datasourceCreatedCalls[0][0].payload).toEqual(
          getExpectedPayload(
            'created',
            {
              actions: ['columns added'],
              creationMethod: 'datasource_config',
              searchMethod: 'datasource_basic_filter',
            },
            'test1.atlassian.net',
          ),
        );
      });

      it('should fire when a datasource is inserted via a dispatch transaction without a source analytic event', async () => {
        const { analyticsSpy, editorView } = await setup({
          doc: doc(p('')),
          cardProvider: DatasourceCardProvider,
        });

        insertDatasource(
          editorView.state,
          originalDatasourceAdf,
          editorView,
          undefined,
        );

        raf.flush();
        requestAnimationFrame.step();
        await flushPromises();

        const datasourceCreatedCalls = getAnalyticsCallsByAction(
          analyticsSpy,
          'created',
        );
        expect(datasourceCreatedCalls.length).toEqual(1);
        expect(datasourceCreatedCalls[0][0].payload).toEqual(
          getExpectedPayload('created', {
            searchMethod: 'unknown',
            creationMethod: '',
            actions: [],
          }),
        );
      });
    });

    describe('datasource updated', () => {
      it('should be fired when updating a datasource with a source event', async () => {
        const datasourceRefsNode = datasourceBlockCard(datasourceAttributes)();
        const datasourceNode = clean(datasourceRefsNode)(defaultSchema) as Node;

        const { analyticsSpy, editorView } = await setup({
          doc: doc('{<node>}', datasourceRefsNode),
        });

        updateCardFromDatasourceModal(
          editorView.state,
          datasourceNode,
          {
            ...originalDatasourceAdf,
            attrs: {
              ...originalDatasourceAdf.attrs,
              url: jqlUrl.replace('DESC', 'ASC'),
            },
          },
          editorView,
          new UIAnalyticsEvent({
            payload: {
              attributes: {
                actions: ['columns added'],
                inputMethod: 'datasource_config',
                searchMethod: 'datasource_basic_filter',
              },
            },
          }),
        );

        raf.flush();
        requestAnimationFrame.step();
        await flushPromises();

        const datasourceUpdatedCalls = getAnalyticsCallsByAction(
          analyticsSpy,
          'updated',
        );
        expect(datasourceUpdatedCalls.length).toEqual(1);
        expect(datasourceUpdatedCalls[0][0].payload).toEqual(
          getExpectedPayload('updated', {
            searchMethod: 'datasource_basic_filter',
            updateMethod: 'datasource_config',
            actions: ['columns added'],
          }),
        );
      });

      it('should be fired when updating a datasource without a source event', async () => {
        const datasourceRefsNode = datasourceBlockCard(datasourceAttributes)();
        const datasourceNode = clean(datasourceRefsNode)(defaultSchema) as Node;

        const { analyticsSpy, editorView } = await setup({
          doc: doc('{<node>}', datasourceRefsNode),
        });

        updateCardFromDatasourceModal(
          editorView.state,
          datasourceNode,
          {
            ...originalDatasourceAdf,
            attrs: {
              ...originalDatasourceAdf.attrs,
              url: jqlUrl.replace('DESC', 'ASC'),
            },
          },
          editorView,
          undefined,
        );

        raf.flush();
        requestAnimationFrame.step();
        await flushPromises();

        const datasourceUpdatedCalls = getAnalyticsCallsByAction(
          analyticsSpy,
          'updated',
        );
        expect(datasourceUpdatedCalls.length).toEqual(1);
        expect(datasourceUpdatedCalls[0][0].payload).toEqual(
          getExpectedPayload('updated', {
            searchMethod: 'unknown',
            updateMethod: '',
            actions: [],
          }),
        );
      });
    });

    describe('datasource deleted', () => {
      it('should be fired when the user deletes content by sending a delete hotkey', async () => {
        const { analyticsSpy, editorView } = await setup({
          doc: doc('{<node>}', datasourceBlockCard(datasourceAttributes)()),
        });

        sendKeyToPm(editorView, 'Mod-a');
        sendKeyToPm(editorView, 'Delete');

        raf.flush();
        requestAnimationFrame.step();
        await flushPromises();

        const datasourceDeletedCalls = getAnalyticsCallsByAction(
          analyticsSpy,
          'deleted',
        );
        expect(datasourceDeletedCalls.length).toEqual(1);
        expect(datasourceDeletedCalls[0][0].payload).toEqual(
          getExpectedPayload('deleted', {
            searchMethod: 'unknown',
            deleteMethod: '',
          }),
        );
      });

      it('should be fired when a datasource is deleted via a toolbar', async () => {
        const providerFactory = new ProviderFactory();
        const featureFlagsMock = {};
        const intl = createIntl({ locale: 'en' });

        const getToolbarItems = (
          toolbar: FloatingToolbarConfig,
          editorView: EditorView,
        ) => {
          const node = editorView.state.doc.nodeAt(
            editorView.state.selection.from,
          )!;

          const items = Array.isArray(toolbar.items)
            ? toolbar.items
            : toolbar.items(node);
          return items.filter((item) => item.type !== 'copy-button');
        };

        const getToolbarButtonByTitle = (
          toolbar: FloatingToolbarConfig,
          editorView: EditorView,
          title: string,
        ) => {
          return getToolbarItems(toolbar!, editorView).find(
            (item) => item.type === 'button' && item.title === title,
          ) as FloatingToolbarButton<Command>;
        };

        const { analyticsSpy, editorView } = await setup({
          doc: doc(
            p('ab'),
            '{<node>}',
            datasourceBlockCard(datasourceAttributes)(),
            p('cd'),
          ),
        });
        const removeTitle = intl.formatMessage(commonMessages.remove);
        const toolbar = floatingToolbar(
          { allowDatasource: true },
          featureFlagsMock,
        )(editorView.state, intl, providerFactory);

        if (!toolbar) {
          return expect(toolbar).toBeTruthy();
        }

        const removeButton = getToolbarButtonByTitle(
          toolbar,
          editorView,
          removeTitle,
        );

        removeButton.onClick(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(doc(p('ab'), p('cd')));

        raf.flush();
        requestAnimationFrame.step();
        await flushPromises();

        const datasourceDeletedCalls = getAnalyticsCallsByAction(
          analyticsSpy,
          'deleted',
        );
        expect(datasourceDeletedCalls.length).toEqual(1);
        expect(datasourceDeletedCalls[0][0].payload).toEqual(
          getExpectedPayload('deleted', {
            deleteMethod: 'editor_floatingToolbar',
            searchMethod: 'unknown',
          }),
        );
      });

      describe('should fire appropriate events for undo/redo upgrade link to a datasource', () => {
        ffTest(
          'platform.linking-platform.datasource-jira_issues',
          async () => {
            const { analyticsSpy, undo, redo } =
              await setupWithLinkConversionToDatasource();

            let datasourceCreatedCalls = getAnalyticsCallsByAction(
              analyticsSpy,
              'created',
            );
            expect(datasourceCreatedCalls.length).toEqual(1);

            undo();

            raf.flush();
            requestAnimationFrame.step();
            await flushPromises();

            // verifying that after undo step we get 'datasource deleted'
            const datasourceDeletedCalls = getAnalyticsCallsByAction(
              analyticsSpy,
              'deleted',
            );

            expect(datasourceDeletedCalls.length).toEqual(1);
            expect(datasourceDeletedCalls[0][0].payload).toEqual(
              getExpectedPayload('deleted', {
                deleteMethod: 'undo',
                searchMethod: 'unknown',
                displayedColumnCount: 7,
              }),
            );

            redo();

            raf.flush();
            requestAnimationFrame.step();
            await flushPromises();

            const datasourceCreatedCallsAfterRedo = getAnalyticsCallsByAction(
              analyticsSpy,
              'created',
            );
            expect(datasourceCreatedCallsAfterRedo.length).toEqual(2);
            expect(datasourceCreatedCallsAfterRedo[1][0].payload).toEqual(
              getExpectedPayload('created', {
                creationMethod: 'redo',
                displayedColumnCount: 7,
                actions: [],
                searchMethod: 'unknown',
              }),
            );
          },
          async () => {
            const {
              analyticsSpy,
              cardProviderInstance,
              editorView,
              editorProps,
            } = await setup({
              doc: doc(p(a({ href: jqlUrl })(jqlUrl), ' ')),
              cardProvider: DatasourceCardProvider,
            });
            const cardRequestOne = createCardRequest(jqlUrl, 1);

            await resolveWithProvider(
              editorView,
              cardProviderInstance as DatasourceCardProvider,
              cardRequestOne,
              editorProps.linking!.smartLinks!,
              undefined,
              undefined,
            );

            editorView.dispatch(
              queueCards([cardRequestOne])(editorView.state.tr),
            );

            raf.flush();
            requestAnimationFrame.step();
            await flushPromises();
            requestAnimationFrame.step();
            await flushPromises();

            const datasourceCreatedCalls = getAnalyticsCallsByAction(
              analyticsSpy,
              'created',
            );
            expect(datasourceCreatedCalls.length).toEqual(0);
          },
        );
      });
    });
  });

  describe('EditorSmartCardEventsNext: analytics attributes', () => {
    beforeEach(() => {
      const mockUseAnalyticsEvents = useAnalyticsEvents;
      (useSmartLinkLifecycleAnalytics as jest.Mock).mockImplementation(() => {
        const { createAnalyticsEvent } = mockUseAnalyticsEvents();

        const createCallback = (
          action: 'created' | 'updated' | 'deleted',
          cb: (...args: any[]) => void,
        ) => {
          return (...args: any[]) => {
            createAnalyticsEvent({ action, actionSubject: 'link' }).fire(
              'media',
            );
            return cb(...args);
          };
        };

        return {
          linkCreated: createCallback('created', mockLinkCreated),
          linkUpdated: createCallback('updated', mockLinkUpdated),
          linkDeleted: createCallback('deleted', mockLinkDeleted),
        };
      });
    });

    it('should fire with location attribute', async () => {
      const expectedContext = [
        {
          attributes: {
            location: 'editor_fixedWidth',
          },
          location: 'editor_fixedWidth',
        },
      ];
      const { editorView, undo, analyticsSpy } = await setup({
        doc: doc(p('{<>}')),
        editorProps: (props, providerFactory) => {
          const macroProvider = Promise.resolve(new MockMacroProvider({}));
          providerFactory.setProvider('macroProvider', macroProvider);

          const providerWithAutoConvertHandler = new DefaultExtensionProvider(
            [
              createFakeExtensionManifest({
                title: 'Jira issue',
                type: 'confluence.macro',
                extensionKey: 'jira',
              }),
            ],
            [
              (text: string) => {
                if (text && text.startsWith(`https://jdog`)) {
                  return {
                    type: 'inlineExtension',
                    attrs: {
                      extensionType: 'confluence.macro',
                      extensionKey: 'jira',
                      parameters: {
                        macroParams: {
                          url: text,
                        },
                      },
                    },
                  };
                }
              },
            ],
          );

          const extensionProvider = Promise.resolve(
            combineExtensionProviders([providerWithAutoConvertHandler]),
          );

          providerFactory.setProvider('extensionProvider', extensionProvider);

          return {
            ...props,
            appearance: 'full-page',
            allowExtension: true,
            extensionHandlers,
            extensionProviders: [extensionProvider],
            linking: {
              ...props.linking,
              smartLinks: {
                ...props.linking?.smartLinks,
                resolveBeforeMacros: ['jira'],
              },
            },
          };
        },
      });

      const url = 'https://jdog.jira-dev.com/browse/BENTO-3677';

      dispatchPasteEvent(editorView, {
        html: `<meta charset="utf-8"><a href="${url}">${url}</a>`,
        plain: url,
      });

      /**
       * Should not have fired a created event as link is queued for upgrade
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

      raf.flush();
      await flushPromises();

      /**
       * At this point we will have done a resolve check in the paste plugin
       * We will have added a link to the page and queued it for upgrade
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);

      raf.flush();
      await flushPromises();

      /**
       * At this point we will have resolved and upgraded our link into an inline link
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
        payload: {
          action: 'created',
          actionSubject: 'link',
        },
        context: expectedContext,
      });

      jest.clearAllMocks();
      undo();

      /**
       * Undo will revert the upgrade as an update
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(1);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
        payload: {
          action: 'updated',
          actionSubject: 'link',
        },
        context: expectedContext,
      });

      jest.clearAllMocks();
      undo();
      undo();

      /**
       * Further undo deletes the link
       */
      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(1);
      expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
        payload: {
          action: 'deleted',
          actionSubject: 'link',
        },
        context: expectedContext,
      });

      jest.clearAllMocks();
    });
  });
});
