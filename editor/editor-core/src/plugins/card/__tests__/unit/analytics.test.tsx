import React from 'react';

import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';
import { replaceRaf, Stub } from 'raf-stub';

import '@atlaskit/link-test-helpers/jest';

import {
  AnalyticsListener,
  UIAnalyticsEvent,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { cardClient } from '@atlaskit/media-integration-test-helpers/card-client';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import {
  createFakeExtensionManifest,
  extensionHandlers,
} from '@atlaskit/editor-test-helpers/extensions';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { MockMacroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
import { setNodeSelection } from '@atlaskit/editor-common/utils';
import {
  DefaultExtensionProvider,
  combineExtensionProviders,
} from '@atlaskit/editor-common/extensions';
import {
  doc,
  p,
  a,
  DocBuilder,
  inlineCard,
  blockCard,
  embedCard,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { ContextAdapter } from '../../../../nodeviews/context-adapter';
import PluginSlot from '../../../../ui/PluginSlot';
import EditorContext from '../../../../ui/EditorContext';
import EditorActions from '../../../../actions';
import { EditorSharedConfigProvider } from '../../../../labs/next/internal/context/shared-config';
import { EditorProps } from '../../../../types';
import { createDispatch } from '../../../../event-dispatcher';
import { getPluginState } from '../../pm-plugins/util/state';

replaceRaf();

const asStub = (raf: typeof requestAnimationFrame) => raf as unknown as Stub;

const mockLinkCreated = jest.fn();
const mockLinkUpdated = jest.fn();
const mockLinkDeleted = jest.fn();

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
  useSmartLinkLifecycleAnalytics: jest.fn(),
}));

describe('Analytics key events', () => {
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

  const jsonLd = (url: string) =>
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
        return Promise.reject(undefined);
      }

      return {
        type: `${appearance}Card`,
        attrs: {
          url,
          data: jsonLd,
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

  beforeEach(() => {
    raf.reset();
    jest.clearAllMocks();
  });

  const setup = async (options?: {
    doc?: DocBuilder;
    editorProps?: (
      props: EditorProps,
      providerFactory: ProviderFactory,
    ) => EditorProps;
  }) => {
    const spy = jest.fn();
    const createAnalyticsEvent = jest.fn();
    const providerFactory = new ProviderFactory();
    const editorActions = new EditorActions();

    const cardProvider = Promise.resolve(new CardProvider());
    providerFactory.setProvider('cardProvider', cardProvider);

    const defaultEditorPropsFilter = (props: EditorProps) => props;

    const { editorView, refs, sel } = renderEditor({
      doc: options?.doc,
      editorProps: (options?.editorProps ?? defaultEditorPropsFilter)(
        {
          allowAnalyticsGASV3: true,
          featureFlags: {
            'lp-link-picker': true,
            'lp-analytics-events-next': true,
          },
          linking: {
            smartLinks: {
              provider: cardProvider,
              allowBlockCards: true,
              allowEmbeds: true,
            },
          },
        },
        providerFactory,
      ),
      createAnalyticsEvent,
      providerFactory,
      editorRender: ({ editor, eventDispatcher, view, config }) => (
        <EditorContext editorActions={editorActions}>
          <EditorSharedConfigProvider
            value={{
              editorView: view!,
              eventDispatcher,
              dispatch: createDispatch(eventDispatcher),
              providerFactory,
              editorActions,
              contentComponents: config.contentComponents,
              primaryToolbarComponents: config.primaryToolbarComponents,
              popupsMountPoint: undefined,
              popupsBoundariesElement: undefined,
              popupsScrollableElement: undefined,
            }}
          >
            {editor}
            <PluginSlot
              editorView={view}
              eventDispatcher={eventDispatcher}
              providerFactory={providerFactory}
              items={config.contentComponents}
              containerElement={null}
              wrapperElement={null}
              disabled={false}
            />
          </EditorSharedConfigProvider>
        </EditorContext>
      ),
      renderOpts: {
        wrapper: ({ children }) => (
          <AnalyticsListener onEvent={spy} channel={'media'}>
            <SmartCardProvider
              storeOptions={{
                initialState: {
                  'https://atlassian.com': {
                    status: 'resolved',
                    details: {
                      meta: { access: 'granted', visibility: 'restricted' },
                      data: jsonLd('https://atlassian.com'),
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
      refs,
      sel,
      spy,
      editor,
      editorView,
      undo,
      redo,
      createAnalyticsEvent,
    };
  };

  it('should lifecycle callbacks to card plugin state', async () => {
    const { editorView } = await setup({
      editorProps: (props) => ({
        ...props,
        featureFlags: {
          ...props.featureFlags,
          'lp-analytics-events-next': true,
        },
      }),
    });

    const cardPluginState = getPluginState(editorView.state);

    expect(cardPluginState?.smartLinkEventsNext).toStrictEqual({
      created: expect.any(Function),
      updated: expect.any(Function),
      deleted: expect.any(Function),
    });
    expect(useSmartLinkLifecycleAnalytics).toHaveBeenCalledTimes(1);
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
        },
      );
    });

    it('should fire when inserting a link via link picker that CAN be resolved', async () => {
      const url = 'https://atlassian.com';
      const urlDetails = { url };
      const { editorView, undo, redo } = await setup({});
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
          display: 'inline',
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
      });
    });

    it('should fire when inserting a link via link picker that CANNOT be resolved', async () => {
      const url = '/root-relative-link';
      const urlDetails = { url };

      const { editorView, undo, redo } = await setup();
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
        null,
        {
          creationMethod: 'unknown',
          display: 'url',
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
          },
        );
      });
    });
  });

  describe('link updated', () => {
    const url = 'https://atlassian.com';
    const linkDetails = { url };
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
          updateType: undefined,
          display: 'inline',
          previousDisplay: 'inline',
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
          // does not provide update type, defers to source UIAnalyticEvent
          updateType: undefined,
          display: 'url',
          previousDisplay: 'inline',
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
        null,
        {
          updateType: 'link_update',
          updateMethod: 'unknown',
          display: 'url',
          previousDisplay: 'inline',
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
          // does not provide update type, defers to source UIAnalyticEvent
          updateType: undefined,
          display: 'url',
          previousDisplay: 'url',
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
        },
      );
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'delete',
        deleteMethod: 'unknown',
        display: 'inline',
      });
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'delete',
        deleteMethod: 'unknown',
        display: 'block',
      });
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'delete',
        deleteMethod: 'unknown',
        display: 'embed',
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
        },
      );
      expect(mockLinkCreated).toHaveBeenCalledWith(url2Details, null, {
        creationMethod: 'undo',
        display: 'inline',
      });
      expect(mockLinkCreated).toHaveBeenCalledWith(url2Details, null, {
        creationMethod: 'undo',
        display: 'block',
      });
      expect(mockLinkCreated).toHaveBeenCalledWith(url2Details, null, {
        creationMethod: 'undo',
        display: 'embed',
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
        },
      );
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'redo',
        deleteMethod: 'redo',
        display: 'inline',
      });
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'redo',
        deleteMethod: 'redo',
        display: 'block',
      });
      expect(mockLinkDeleted).toHaveBeenCalledWith(url2Details, null, {
        deleteType: 'redo',
        deleteMethod: 'redo',
        display: 'embed',
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
      });

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(linkDetails, null, {
        creationMethod: 'undo',
        display: 'inline',
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
      });

      jest.clearAllMocks();
      undo();

      expect(mockLinkCreated).toHaveBeenCalledTimes(1);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
      expect(mockLinkCreated).toHaveBeenCalledWith(linkDetails, null, {
        creationMethod: 'undo',
        display: 'inline',
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
      });
    });
  });

  describe('without ff: lp-analytics-events-next', () => {
    const setupWithoutFF = () =>
      setup({
        editorProps: (props) => ({
          ...props,
          featureFlags: {
            ...props.featureFlags,
            'lp-analytics-events-next': false,
          },
        }),
      });

    it('does not bind lifecycle callbacks to card plugin state', async () => {
      const { editorView } = await setupWithoutFF();
      const cardPluginState = getPluginState(editorView.state);

      expect(cardPluginState?.smartLinkEventsNext).toBeUndefined();
      expect(useSmartLinkLifecycleAnalytics).toHaveBeenCalledTimes(0);
    });

    it('should NOT fire when auto-linking a typed url', async () => {
      const { editorView } = await setupWithoutFF();
      const url = 'https://atlassian.com';
      insertText(editorView, `${url} `);

      raf.flush();
      await flushPromises();

      expect(mockLinkCreated).toHaveBeenCalledTimes(0);
      expect(mockLinkUpdated).toHaveBeenCalledTimes(0);
      expect(mockLinkDeleted).toHaveBeenCalledTimes(0);
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
      const { editorView, undo, spy } = await setup({
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
      expect(spy).toBeFiredWithAnalyticEventOnce({
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
      expect(spy).toBeFiredWithAnalyticEventOnce({
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
      expect(spy).toBeFiredWithAnalyticEventOnce({
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
