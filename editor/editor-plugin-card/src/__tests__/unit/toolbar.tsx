import React, { Fragment } from 'react';

import { act, render } from '@testing-library/react';
import { createIntl } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { CardOptions } from '@atlaskit/editor-common/card';
import commonMessages, {
  linkMessages,
  linkToolbarMessages,
} from '@atlaskit/editor-common/messages';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
  Command,
  DocBuilder,
  FloatingToolbarButton,
  FloatingToolbarConfig,
  FloatingToolbarCustom,
  FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import { SmallerEditIcon } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  blockCard,
  datasourceBlockCard,
  doc,
  embedCard,
  expand,
  inlineCard,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import CogIcon from '@atlaskit/icon/glyph/editor/settings';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import {
  ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
} from '@atlaskit/link-datasource';
import type { DatasourceAdf } from '@atlaskit/smart-card';
import { ffTest } from '@atlassian/feature-flags-test-utils';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { pluginKey } from '../../pm-plugins/plugin-key';
// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { floatingToolbar } from '../../toolbar';
// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import {
  cardContext,
  MockCardContextAdapter,
  mockCardContextState,
  mockPreview,
} from '../../ui/__tests__/_utils/mock-card-context';
// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import * as CardUtils from '../../utils';

jest.mock('../../ui/EditDatasourceButton', () => ({
  ...jest.requireActual('../../ui/EditDatasourceButton'),
  EditDatasourceButton: () => (
    <div data-testid={'card-edit-datasource-button'}> Datasource Button </div>
  ),
}));

const attachAnalyticsEvent = jest.fn().mockImplementation(() => () => {});

const mockEditorAnalyticsApi: EditorAnalyticsAPI = {
  attachAnalyticsEvent,
};

const mockPluginInjectionApi: any = {
  decorations: {
    actions: {
      hoverDecoration: () => () => {},
    },
  },
  analytics: {
    actions: mockEditorAnalyticsApi,
  },
  card: {
    actions: undefined,
  },
};

const mockJqlUrl = 'http://www.test123.com/issues/?jql=EDM/';

const datasourceNoUrlAdfAttrs: DatasourceAdf['attrs'] = {
  datasource: {
    id: 'datasource-id',
    parameters: { jql: 'EDM=jql', cloudId: 'cloud-id' },
    views: [
      {
        type: 'table',
        properties: { columns: [{ key: 'col1' }, { key: 'col2' }] },
      },
    ],
  },
};

const datasourceAdfAttrsWithRealJiraId: DatasourceAdf['attrs'] = {
  datasource: {
    ...datasourceNoUrlAdfAttrs.datasource,
    id: JIRA_LIST_OF_LINKS_DATASOURCE_ID,
  },
};

const datasourceWithUrlAdfAttrs: DatasourceAdf['attrs'] = {
  ...datasourceNoUrlAdfAttrs,
  url: mockJqlUrl,
};

const datasourceAdfAttrsWithRealAssetsId: DatasourceAdf['attrs'] = {
  datasource: {
    id: ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
    parameters: {
      workspaceId: 'workspace-id',
      aql: 'dummy-aql',
      schemaId: 'schema-id',
    },
    views: [
      {
        type: 'table',
        properties: { columns: [{ key: 'col1' }, { key: 'col2' }] },
      },
    ],
  },
};

// Copied and simplified from:
// editor-core/src/plugins/floating-toolbar/__tests__/_helpers.ts
const getToolbarItems = (
  toolbar: FloatingToolbarConfig,
  editorView: EditorView,
) => {
  const node = editorView.state.doc.nodeAt(editorView.state.selection.from)!;

  const items = Array.isArray(toolbar.items)
    ? toolbar.items
    : toolbar.items(node);
  return items.filter(item => item.type !== 'copy-button');
};

const getToolbarButtonByTitle = (
  toolbar: FloatingToolbarConfig,
  editorView: EditorView,
  title: string,
) => {
  return getToolbarItems(toolbar!, editorView).find(
    item => item.type === 'button' && item.title === title,
  ) as FloatingToolbarButton<Command>;
};

const checkEditDatasourceButtonDoesNotExist = (
  toolbarItems: FloatingToolbarItem<Command>[],
) => {
  const customItemsArray: any = toolbarItems.filter(
    item => item.type === 'custom',
  );
  // It will find custom items since this will be the LinkToolbarAppearance items.
  // However, we check that it's not the datasource edit button via test id.
  if (!customItemsArray) {
    return expect(customItemsArray).toBeTruthy();
  }

  customItemsArray.map((item: FloatingToolbarCustom<Command>) => {
    const { queryByTestId } = render(
      <MockCardContextAdapter card={cardContext}>
        {item.render()}
      </MockCardContextAdapter>,
    );

    expect(
      queryByTestId('card-edit-datasource-button'),
    ).not.toBeInTheDocument();
  });
};

describe('card', () => {
  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();
  let createAnalyticsEvent = createAnalyticsEventMock();
  let featureFlagsMock = {};
  const editor = (doc: DocBuilder, smartLinksOptions?: CardOptions) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
          allowResizing: true,
          allowDatasource: true,
          ...smartLinksOptions,
        },
        allowExpand: true,
        allowAnalyticsGASV3: true,
      },
      pluginKey,
      createAnalyticsEvent,
    });
  };

  describe('toolbar', () => {
    const intl = createIntl({
      locale: 'en',
    });

    const visitTitle = intl.formatMessage(linkMessages.openLink);
    const unlinkTitle = intl.formatMessage(linkToolbarMessages.unlink);
    const removeTitle = intl.formatMessage(commonMessages.remove);
    const openSettingsTitle = intl.formatMessage(
      linkToolbarMessages.settingsLink,
    );
    const editDatasourceTitle = intl.formatMessage(
      linkToolbarMessages.editDatasource,
    );

    describe.each(['true', 'false', undefined])(
      'with settings button flag returning %s',
      isLinkSettingsButtonEnabled => {
        const getSettingsButton = (
          toolbar: FloatingToolbarConfig,
          editorView: EditorView,
        ) =>
          getToolbarItems(toolbar, editorView).find(
            item => item.type === 'button' && item.title === openSettingsTitle,
          ) as FloatingToolbarButton<Command> | undefined;

        const verifySettingsButton = (
          settingsButton: FloatingToolbarButton<Command> | undefined,
          editorView: EditorView,
        ) => {
          if (isLinkSettingsButtonEnabled === 'true') {
            expect(settingsButton).toBeDefined();
            expect(settingsButton).toMatchObject({
              icon: CogIcon,
            });

            act(() => {
              settingsButton?.onClick(editorView.state, editorView.dispatch);
            });

            expect(open).toBeCalledWith(
              'https://id.atlassian.com/manage-profile/link-preferences',
            );
          } else {
            expect(settingsButton).not.toBeDefined();
          }
        };

        beforeEach(() => {
          featureFlagsMock = {
            floatingToolbarLinkSettingsButton: isLinkSettingsButtonEnabled,
          };
          global.open = jest.fn();
        });
        afterEach(() => {
          featureFlagsMock = {};
          (global.open as jest.Mock).mockReset();
        });

        afterAll(() => {
          featureFlagsMock = {};
          (global.open as jest.Mock).mockRestore();
        });

        it('displays toolbar items in correct order for inlineCard', () => {
          const { editorView } = editor(
            doc(
              p(
                '{<node>}',
                inlineCard({
                  url: 'http://www.atlassian.com/',
                })(),
              ),
            ),
          );

          const toolbar = floatingToolbar(
            {
              allowBlockCards: true,
              allowEmbeds: true,
              allowResizing: true,
            },
            featureFlagsMock,
            undefined,
            undefined,
            mockPluginInjectionApi,
          )(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toHaveLength(
            isLinkSettingsButtonEnabled === 'true' ? 12 : 10,
          );
          expect(toolbarItems).toMatchSnapshot();

          const settingsButton = getSettingsButton(toolbar!, editorView);
          verifySettingsButton(settingsButton, editorView);
        });

        it('displays toolbar items in correct order for inlineCard on mobile', () => {
          const { editorView } = editor(
            doc(
              p(
                '{<node>}',
                inlineCard({
                  url: 'http://www.atlassian.com/',
                })(),
              ),
            ),
          );

          const toolbar = floatingToolbar(
            {
              allowBlockCards: true,
              allowEmbeds: true,
              allowResizing: true,
            },
            featureFlagsMock,
            'mobile',
            undefined,
            mockPluginInjectionApi,
          )(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbarItems[2].type).not.toBe('custom');
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toHaveLength(
            isLinkSettingsButtonEnabled === 'true' ? 12 : 10,
          );
          expect(toolbarItems).toMatchSnapshot();

          const settingsButton = getSettingsButton(toolbar!, editorView);
          verifySettingsButton(settingsButton, editorView);
        });

        it('displays toolbar items in correct order for blockCard', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              blockCard({
                url: 'http://www.atlassian.com/',
              })(),
            ),
          );

          const toolbar = floatingToolbar(
            {
              allowBlockCards: true,
              allowEmbeds: true,
              allowResizing: true,
            },
            featureFlagsMock,
            undefined,
            undefined,
            mockPluginInjectionApi,
          )(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toHaveLength(
            isLinkSettingsButtonEnabled === 'true' ? 10 : 8,
          );
          expect(toolbarItems).toMatchSnapshot();

          const settingsButton = getSettingsButton(toolbar!, editorView);
          verifySettingsButton(settingsButton, editorView);
        });

        it('displays inlineCard toolbar if allowDatasource is false', () => {
          const { editorView } = editor(
            doc('{<node>}', datasourceBlockCard(datasourceWithUrlAdfAttrs)()),
          );

          const toolbar = floatingToolbar(
            {
              allowBlockCards: true,
              allowEmbeds: true,
              allowResizing: true,
              allowDatasource: false,
            },
            featureFlagsMock,
            undefined,
            undefined,
            mockPluginInjectionApi,
          )(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);

          expect(
            toolbarItems.filter((item: any) => item.id === 'editor.link.edit'),
          ).toHaveLength(1);
        });

        it('displays toolbar items in correct order for datasource with url', () => {
          const { editorView } = editor(
            doc('{<node>}', datasourceBlockCard(datasourceWithUrlAdfAttrs)()),
          );

          const toolbar = floatingToolbar(
            {
              allowBlockCards: true,
              allowEmbeds: true,
              allowResizing: true,
              allowDatasource: true,
            },
            featureFlagsMock,
            undefined,
            undefined,
            mockPluginInjectionApi,
          )(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toHaveLength(5); // 3 buttons and 2 separators
          expect(toolbarItems).toMatchSnapshot();
        });

        it('displays toolbar items in correct order for datasource without url', () => {
          const { editorView } = editor(
            doc('{<node>}', datasourceBlockCard(datasourceNoUrlAdfAttrs)()),
          );

          const toolbar = floatingToolbar(
            {
              allowBlockCards: true,
              allowEmbeds: true,
              allowResizing: true,
              allowDatasource: true,
            },
            featureFlagsMock,
            undefined,
            undefined,
            mockPluginInjectionApi,
          )(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toHaveLength(3); // 2 buttons and 1 separator
          expect(toolbarItems).toMatchSnapshot();
        });

        it('displays toolbar items in correct order for embedCard', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              embedCard({
                url: 'http://www.atlassian.com/',
                layout: 'center',
              })(),
            ),
          );

          const toolbar = floatingToolbar(
            {
              allowBlockCards: true,
              allowEmbeds: true,
              allowResizing: true,
            },
            featureFlagsMock,
            undefined,
            undefined,
            mockPluginInjectionApi,
          )(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toHaveLength(
            isLinkSettingsButtonEnabled === 'true' ? 17 : 15,
          );
          expect(toolbarItems).toMatchSnapshot();

          const settingsButton = getSettingsButton(toolbar!, editorView);
          verifySettingsButton(settingsButton, editorView);
        });

        it('displays toolbar items in correct order for embedCard inside an expand', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              expand()(
                embedCard({
                  url: 'http://www.atlassian.com/',
                  layout: 'center',
                })(),
              ),
            ),
          );

          const toolbar = floatingToolbar(
            {
              allowBlockCards: true,
              allowEmbeds: true,
              allowResizing: true,
            },
            featureFlagsMock,
            undefined,
            undefined,
            mockPluginInjectionApi,
          )(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toMatchSnapshot();

          const settingsButton = getSettingsButton(toolbar!, editorView);
          verifySettingsButton(settingsButton, editorView);
        });
      },
    );

    describe('tests `allowWrapping`, `allowAlignment` and `allowResizing` props in toolbar', () => {
      beforeEach(() => {
        mockPreview('some-preview');
        mockCardContextState();
      });
      it.each([
        {
          allowEmbeds: true,
          allowBlockCards: true,
          allowWrapping: false,
          allowAlignment: false,
          allowResizing: false,
        },
        {
          allowEmbeds: true,
          allowBlockCards: true,
          allowWrapping: false,
          allowAlignment: false,
          allowResizing: true,
        },
        {
          allowEmbeds: true,
          allowBlockCards: true,
          allowWrapping: false,
          allowAlignment: true,
          allowResizing: true,
        },
        {
          allowEmbeds: true,
          allowBlockCards: true,
          allowWrapping: false,
          allowAlignment: true,
          allowResizing: false,
        },
        {
          allowEmbeds: true,
          allowBlockCards: true,
          allowWrapping: true,
          allowAlignment: true,
          allowResizing: false,
        },
        {
          allowEmbeds: true,
          allowBlockCards: true,
          allowWrapping: true,
          allowAlignment: false,
          allowResizing: false,
        },
        {
          allowEmbeds: true,
          allowBlockCards: true,
          allowWrapping: true,
          allowAlignment: false,
          allowResizing: true,
        },
        {
          allowEmbeds: true,
          allowBlockCards: true,
          allowWrapping: true,
          allowAlignment: true,
          allowResizing: true,
        },
      ])(
        'should generate correct toolbar layout with the following toolbar config: %s',

        (toolbarConfig: CardOptions) => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              embedCard({
                url: 'http://www.atlassian.com/',
                layout: 'center',
              })(),
            ),
          );

          const toolbar = floatingToolbar(
            toolbarConfig,
            featureFlagsMock,
            'web',
            undefined,
            mockPluginInjectionApi,
          )(editorView.state, intl, providerFactory);

          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toMatchSnapshot();
        },
      );
    });
    describe('tests `allowBlockCards` & `allowEmbeds` props in toolbar', () => {
      beforeEach(() => {
        mockPreview('some-preview');
        mockCardContextState();
      });
      it.each([
        {
          allowEmbeds: false,
          allowBlockCards: false,
        },
        {
          allowEmbeds: false,
          allowBlockCards: true,
        },
        {
          allowEmbeds: true,
          allowBlockCards: false,
        },
        {
          allowEmbeds: true,
          allowBlockCards: true,
        },
      ])(
        'displays toolbar items in correct order for inlineCard with the following toolbar config: %s',
        (toolbarConfig: CardOptions) => {
          const { editorView } = editor(
            doc(
              p(
                '{<node>}',
                inlineCard({
                  url: 'http://www.atlassian.com/',
                })(),
              ),
            ),
            toolbarConfig,
          );

          const toolbar = floatingToolbar(
            toolbarConfig,
            featureFlagsMock,
            'web',
            undefined,
            mockPluginInjectionApi,
          )(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toHaveLength(10);

          const customItems = toolbarItems.filter(
            item => item.type === 'custom',
          );

          const { getByTestId, queryByTestId } = render(
            <MockCardContextAdapter card={cardContext}>
              {customItems.map((item: any, i) => (
                <Fragment key={i}>{item.render()}</Fragment>
              ))}
            </MockCardContextAdapter>,
          );

          // verify the correct config is present in the link switching toolbar:
          // "inline" & "url" option should always be present, whereas embed & block options should depend on the passed props
          expect(getByTestId('url-appearance')).toBeInTheDocument();
          expect(getByTestId('inline-appearance')).toBeInTheDocument();
          if (toolbarConfig.allowBlockCards) {
            expect(getByTestId('block-appearance')).toBeInTheDocument();
          } else {
            expect(queryByTestId('block-appearance')).toBeNull();
          }
          if (toolbarConfig.allowEmbeds) {
            expect(getByTestId('embed-appearance')).toBeInTheDocument();
          } else {
            expect(queryByTestId('embed-appearance')).toBeNull();
          }
        },
      );
    });

    it('has no toolbar items when url via url attr is invalid', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'javascript:alert(document.domain)',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar(
        {},
        featureFlagsMock,
        undefined,
        undefined,
        mockPluginInjectionApi,
      )(editorView.state, intl, providerFactory);
      expect(getToolbarItems(toolbar!, editorView).length).toEqual(0);
    });

    it('has no toolbar items when url via data attr is invalid', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'javascript:alert(document.domain)',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar(
        {},
        featureFlagsMock,
        undefined,
        undefined,
        mockPluginInjectionApi,
      )(editorView.state, intl, providerFactory);
      expect(getToolbarItems(toolbar!, editorView).length).toEqual(0);
    });

    it.each([
      [true, 570],
      [false, 360],
    ])(
      'when feature flag `lpLinkPicker` is %p, should provide height of %d to link picker toolbar',
      (lpLinkPicker, height) => {
        const featureFlags = { lpLinkPicker };
        const { editorView } = editor(
          doc(
            p(
              '{<node>}',
              inlineCard({
                url: 'http://www.atlassian.com/',
              })(),
            ),
          ),
        );

        const toolbar = floatingToolbar(
          {},
          featureFlags,
          undefined,
          undefined,
          mockPluginInjectionApi,
        )(editorView.state, intl, providerFactory);
        const items = getToolbarItems(toolbar!, editorView);
        const editButton = items.find(
          item => 'id' in item && item.id === 'editor.link.edit',
        ) as FloatingToolbarButton<Command>;

        act(() => {
          editButton.onClick(editorView.state, editorView.dispatch);
        });

        const editToolbar = floatingToolbar(
          {},
          featureFlags,
          undefined,
          undefined,
          mockPluginInjectionApi,
        )(editorView.state, intl, providerFactory);

        expect(editToolbar?.height).toBe(height);
      },
    );

    it('metadata correctly resolves url and title from plugin state', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      jest.spyOn(CardUtils, 'findCardInfo').mockImplementationOnce(() => {
        return {
          title: 'hey hey hey',
          pos: 1,
        };
      });

      const toolbar = floatingToolbar(
        {
          allowBlockCards: true,
          allowEmbeds: true,
          allowResizing: true,
        },
        featureFlagsMock,
        undefined,
        undefined,
        mockPluginInjectionApi,
      )(editorView.state, intl, providerFactory);
      const toolbarItems = getToolbarItems(toolbar!, editorView);
      expect(toolbar).toBeDefined();
      expect(
        toolbarItems.filter(object => object.hasOwnProperty('metadata')),
      ).toMatchSnapshot();
    });

    it('has an unlink button for inlineCard', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({}, featureFlagsMock)(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();

      const unlinkButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === unlinkTitle,
      );

      expect(unlinkButton).toBeDefined();
      expect(unlinkButton).toMatchObject({
        icon: UnlinkIcon,
      });
    });

    it('has a remove button for blockCard', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          blockCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      );

      const toolbar = floatingToolbar({}, featureFlagsMock)(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();

      const removeButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === removeTitle,
      );

      expect(removeButton).toBeDefined();
      expect(removeButton).toMatchObject({
        appearance: 'danger',
        icon: RemoveIcon,
      });
    });

    it('has a remove button for embedCard', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          embedCard({
            url: 'http://www.atlassian.com/',
            layout: 'center',
          })(),
        ),
      );

      const toolbar = floatingToolbar({}, featureFlagsMock)(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();

      const removeButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === removeTitle,
      );

      expect(removeButton).toBeDefined();
      expect(removeButton).toMatchObject({
        appearance: 'danger',
        icon: RemoveIcon,
      });
    });

    it('has a visit button', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({}, featureFlagsMock)(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();

      const visitButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === visitTitle,
      );

      expect(visitButton).toBeDefined();
      expect(visitButton).toMatchObject({
        icon: OpenIcon,
      });
    });

    it('opens the url in a new window defined on an inline card', () => {
      // @ts-ignore
      global.open = jest.fn();

      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar(
        {},
        featureFlagsMock,
        undefined,
        undefined,
        mockPluginInjectionApi,
      )(editorView.state, intl, providerFactory);

      const visitButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === visitTitle,
      ) as FloatingToolbarButton<Command>;

      act(() => {
        visitButton.onClick(editorView.state, editorView.dispatch);
      });

      expect(attachAnalyticsEvent).toBeCalledWith({
        action: 'visited',
        actionSubject: 'smartLink',
        actionSubjectId: 'inlineCard',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
        }),
        eventType: 'track',
      });
      expect(open).toBeCalledWith('http://www.atlassian.com/');
    });

    it('opens the url in a new window via data on an inline card', () => {
      // @ts-ignore
      global.open = jest.fn();

      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              data: {
                url: 'http://www.atlassian.com/',
              },
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({}, featureFlagsMock)(
        editorView.state,
        intl,
        providerFactory,
      );
      const visitButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === visitTitle,
      ) as FloatingToolbarButton<Command>;

      act(() => {
        visitButton.onClick(editorView.state, editorView.dispatch);
      });

      expect(open).toBeCalledWith('http://www.atlassian.com/');
    });

    it('deletes a block card', () => {
      const { editorView } = editor(
        doc(
          p('ab'),
          '{<node>}',
          blockCard({
            url: 'http://www.atlassian.com/',
          })(),
          p('cd'),
        ),
      );

      const toolbar = floatingToolbar({}, featureFlagsMock)(
        editorView.state,
        intl,
        providerFactory,
      );
      const removeButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === removeTitle,
      ) as FloatingToolbarButton<Command>;

      act(() => {
        removeButton.onClick(editorView.state, editorView.dispatch);
      });

      expect(editorView.state.doc).toEqualDocument(doc(p('ab'), p('cd')));
    });

    it('deletes an inline card', () => {
      const { editorView } = editor(
        doc(
          p(
            'ab',
            '{<node>}',
            inlineCard({
              data: {
                title: 'Welcome to Atlassian!',
                url: 'http://www.atlassian.com/',
              },
            })(),
            'cd',
          ),
        ),
      );

      const toolbar = floatingToolbar(
        {},
        featureFlagsMock,
        undefined,
        undefined,
        mockPluginInjectionApi,
      )(editorView.state, intl, providerFactory);
      const unlinkButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === unlinkTitle,
      ) as FloatingToolbarButton<Command>;

      act(() => {
        unlinkButton.onClick(editorView.state, editorView.dispatch);
      });

      expect(attachAnalyticsEvent).toBeCalledWith({
        action: 'unlinked',
        actionSubject: 'smartLink',
        actionSubjectId: 'inlineCard',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
        }),
        eventType: 'track',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(p('abWelcome to Atlassian!cd')),
      );
    });

    it('deletes an embed card', () => {
      const { editorView } = editor(
        doc(
          p('ab'),
          '{<node>}',
          embedCard({
            url: 'http://www.atlassian.com/',
            layout: 'center',
          })(),
          p('cd'),
        ),
      );

      const toolbar = floatingToolbar(
        {},
        featureFlagsMock,
        undefined,
        undefined,
        mockPluginInjectionApi,
      )(editorView.state, intl, providerFactory);
      const removeButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === removeTitle,
      ) as FloatingToolbarButton<Command>;

      act(() => {
        removeButton.onClick(editorView.state, editorView.dispatch);
      });

      expect(editorView.state.doc).toEqualDocument(doc(p('ab'), p('cd')));
    });

    describe('datasource toolbar', () => {
      it('has an edit button, open link button, and delete button if is a datasource with url', () => {
        const { editorView } = editor(
          doc(
            p('ab'),
            '{<node>}',
            datasourceBlockCard(datasourceWithUrlAdfAttrs)(),
            p('cd'),
          ),
        );

        const toolbar = floatingToolbar(
          { allowDatasource: true },
          featureFlagsMock,
        )(editorView.state, intl, providerFactory);

        if (!toolbar) {
          return expect(toolbar).toBeTruthy();
        }

        const editButton = getToolbarButtonByTitle(
          toolbar,
          editorView,
          editDatasourceTitle,
        );
        const visitLinkButton = getToolbarButtonByTitle(
          toolbar,
          editorView,
          visitTitle,
        );
        const removeButton = getToolbarButtonByTitle(
          toolbar,
          editorView,
          removeTitle,
        );

        expect(editButton).toBeDefined();
        expect(editButton).toMatchObject({
          icon: SmallerEditIcon,
        });

        expect(visitLinkButton).toBeDefined();
        expect(visitLinkButton).toMatchObject({
          icon: OpenIcon,
        });

        expect(removeButton).toBeDefined();
        expect(removeButton).toMatchObject({
          appearance: 'danger',
          icon: RemoveIcon,
        });
      });

      it('has an edit button and delete button, and no open link button if it is a datasource without a url', () => {
        const { editorView } = editor(
          doc(
            p('ab'),
            '{<node>}',
            datasourceBlockCard(datasourceNoUrlAdfAttrs)(),
            p('cd'),
          ),
        );

        const toolbar = floatingToolbar(
          { allowDatasource: true },
          featureFlagsMock,
        )(editorView.state, intl, providerFactory);

        if (!toolbar) {
          return expect(toolbar).toBeTruthy();
        }

        const editButton = getToolbarButtonByTitle(
          toolbar,
          editorView,
          editDatasourceTitle,
        );
        const visitLinkButton = getToolbarButtonByTitle(
          toolbar,
          editorView,
          visitTitle,
        );
        const removeButton = getToolbarButtonByTitle(
          toolbar,
          editorView,
          removeTitle,
        );

        expect(editButton).toBeDefined();
        expect(editButton).toMatchObject({
          icon: SmallerEditIcon,
        });

        expect(visitLinkButton).not.toBeDefined();

        expect(removeButton).toBeDefined();
        expect(removeButton).toMatchObject({
          appearance: 'danger',
          icon: RemoveIcon,
        });
      });

      it('visits the link in a new tab if datasource has a url', () => {
        const { editorView } = editor(
          doc(
            p('ab'),
            '{<node>}',
            datasourceBlockCard(datasourceWithUrlAdfAttrs)(),
            p('cd'),
          ),
        );

        const toolbar = floatingToolbar(
          { allowDatasource: true },
          featureFlagsMock,
        )(editorView.state, intl, providerFactory);

        if (!toolbar) {
          return expect(toolbar).toBeTruthy();
        }

        const visitLinkButton = getToolbarButtonByTitle(
          toolbar,
          editorView,
          visitTitle,
        );

        act(() => {
          visitLinkButton.onClick(editorView.state, editorView.dispatch);
        });

        expect(open).toBeCalledWith(mockJqlUrl);
      });

      it('deletes a datasource block card', () => {
        const { editorView } = editor(
          doc(
            p('ab'),
            '{<node>}',
            datasourceBlockCard(datasourceWithUrlAdfAttrs)(),
            p('cd'),
          ),
        );

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

        act(() => {
          removeButton.onClick(editorView.state, editorView.dispatch);
        });

        expect(editorView.state.doc).toEqualDocument(doc(p('ab'), p('cd')));
      });

      describe('shows jira issues modal after edit button is clicked when the feature flag is ON', () => {
        ffTest(
          'platform.linking-platform.datasource-jira_issues',
          () => {
            const { editorView, pluginState } = editor(
              doc(
                p('ab'),
                '{<node>}',
                datasourceBlockCard(datasourceAdfAttrsWithRealJiraId)(),
                p('cd'),
              ),
            );

            const toolbar = floatingToolbar(
              { allowDatasource: true },
              featureFlagsMock,
            )(editorView.state, intl, providerFactory);

            if (!toolbar) {
              return expect(toolbar).toBeTruthy();
            }

            expect(pluginState.datasourceModalType).toBeUndefined();
            expect(pluginState.showDatasourceModal).toEqual(false);

            const editButton = getToolbarButtonByTitle(
              toolbar,
              editorView,
              editDatasourceTitle,
            );

            act(() => {
              editButton.onClick(editorView.state, editorView.dispatch);
            });

            const toolbarAfterClick = floatingToolbar(
              {},
              featureFlagsMock,
              undefined,
              undefined,
              mockPluginInjectionApi,
            )(editorView.state, intl, providerFactory);

            if (!toolbarAfterClick) {
              return expect(toolbarAfterClick).toBeTruthy();
            }

            const pluginStateAfterClick = pluginKey.getState(editorView.state);
            expect(pluginStateAfterClick?.datasourceModalType).toEqual('jira');
            expect(pluginStateAfterClick?.showDatasourceModal).toEqual(true);
          },
          () => {
            const { editorView, pluginState } = editor(
              doc(
                p('ab'),
                '{<node>}',
                datasourceBlockCard(datasourceAdfAttrsWithRealJiraId)(),
                p('cd'),
              ),
            );

            const toolbar = floatingToolbar({}, featureFlagsMock)(
              editorView.state,
              intl,
              providerFactory,
            );

            if (!toolbar) {
              return expect(toolbar).toBeTruthy();
            }

            expect(pluginState.datasourceModalType).toBeUndefined();
            expect(pluginState.showDatasourceModal).toEqual(false);

            const editButton = getToolbarButtonByTitle(
              toolbar,
              editorView,
              'Edit link',
            );

            act(() => {
              editButton.onClick(editorView.state, editorView.dispatch);
            });

            const pluginStateAfterClick = pluginKey.getState(editorView.state);
            expect(pluginStateAfterClick?.datasourceModalType).toBeUndefined();
            expect(pluginStateAfterClick?.showDatasourceModal).toEqual(false);
          },
        );
      });

      describe('shows assets modal after edit button is clicked when the feature flag is ON', () => {
        ffTest(
          'platform.linking-platform.datasource-assets_objects',
          () => {
            const { editorView, pluginState } = editor(
              doc(
                p('ab'),
                '{<node>}',
                datasourceBlockCard(datasourceAdfAttrsWithRealAssetsId)(),
                p('cd'),
              ),
            );

            const toolbar = floatingToolbar(
              { allowDatasource: true },
              featureFlagsMock,
            )(editorView.state, intl, providerFactory);

            if (!toolbar) {
              return expect(toolbar).toBeTruthy();
            }

            expect(pluginState.datasourceModalType).toBeUndefined();
            expect(pluginState.showDatasourceModal).toEqual(false);

            const editButton = getToolbarButtonByTitle(
              toolbar,
              editorView,
              editDatasourceTitle,
            );

            act(() => {
              editButton.onClick(editorView.state, editorView.dispatch);
            });

            const toolbarAfterClick = floatingToolbar(
              {},
              featureFlagsMock,
              undefined,
              undefined,
              mockPluginInjectionApi,
            )(editorView.state, intl, providerFactory);

            if (!toolbarAfterClick) {
              return expect(toolbarAfterClick).toBeTruthy();
            }

            const pluginStateAfterClick = pluginKey.getState(editorView.state);
            expect(pluginStateAfterClick?.datasourceModalType).toEqual(
              'assets',
            );
            expect(pluginStateAfterClick?.showDatasourceModal).toEqual(true);
          },
          () => {
            const { editorView, pluginState } = editor(
              doc(
                p('ab'),
                '{<node>}',
                datasourceBlockCard(datasourceAdfAttrsWithRealAssetsId)(),
                p('cd'),
              ),
            );

            const toolbar = floatingToolbar({}, featureFlagsMock)(
              editorView.state,
              intl,
              providerFactory,
            );

            if (!toolbar) {
              return expect(toolbar).toBeTruthy();
            }

            expect(pluginState.datasourceModalType).toBeUndefined();
            expect(pluginState.showDatasourceModal).toEqual(false);

            const editButton = getToolbarButtonByTitle(
              toolbar,
              editorView,
              'Edit link',
            );

            act(() => {
              editButton.onClick(editorView.state, editorView.dispatch);
            });

            const pluginStateAfterClick = pluginKey.getState(editorView.state);
            expect(pluginStateAfterClick?.datasourceModalType).toEqual(
              undefined,
            );
            expect(pluginStateAfterClick?.showDatasourceModal).toEqual(false);
          },
        );
      });

      describe('when using feature flag', () => {
        ffTest(
          'platform.linking-platform.datasource-jira_issues',
          () => {
            const { editorView } = editor(
              doc(
                p('ab'),
                '{<node>}',
                datasourceBlockCard(datasourceAdfAttrsWithRealJiraId)(),
                p('cd'),
              ),
            );

            const toolbar = floatingToolbar(
              { allowDatasource: true },
              featureFlagsMock,
            )(editorView.state, intl, providerFactory);

            if (!toolbar) {
              return expect(toolbar).toBeTruthy();
            }

            const editButton = getToolbarButtonByTitle(
              toolbar,
              editorView,
              editDatasourceTitle,
            );

            expect(editButton).toBeDefined();
            expect(editButton).toMatchObject({
              icon: SmallerEditIcon,
            });
          },
          () => {
            const { editorView } = editor(
              doc(
                p('ab'),
                '{<node>}',
                datasourceBlockCard(datasourceAdfAttrsWithRealJiraId)(),
                p('cd'),
              ),
            );

            const toolbar = floatingToolbar({}, featureFlagsMock)(
              editorView.state,
              intl,
              providerFactory,
            );

            if (!toolbar) {
              return expect(toolbar).toBeTruthy();
            }

            const editButton = getToolbarButtonByTitle(
              toolbar,
              editorView,
              'Edit link',
            );

            expect(editButton).toBeDefined();
          },
        );
      });

      describe('inline card toolbar: datasource edit button', () => {
        it('has datasource edit button as first item in toolbar when the link can be viewed as a datasource', () => {
          const { editorView } = editor(
            doc(
              p(
                '{<node>}',
                inlineCard({
                  url: 'http://www.somelink.com/?jql=EDM',
                })(),
              ),
            ),
          );
          const toolbar = floatingToolbar(
            { allowDatasource: true },
            featureFlagsMock,
          )(editorView.state, intl, providerFactory);

          if (!toolbar) {
            return expect(toolbar).toBeTruthy();
          }

          const toolbarItems = getToolbarItems(toolbar!, editorView);
          const customItemsArray: any = toolbarItems.filter(
            item => item.type === 'custom',
          );

          if (!customItemsArray) {
            return expect(customItemsArray).toBeTruthy();
          }

          const { getByTestId } = render(
            <MockCardContextAdapter card={cardContext}>
              {customItemsArray[0].render()}
            </MockCardContextAdapter>,
          );

          expect(
            getByTestId('card-edit-datasource-button'),
          ).toBeInTheDocument();
        });

        it('does not have datasource edit button when the link cannot be viewed as a datasource', () => {
          const { editorView } = editor(
            doc(
              p(
                '{<node>}',
                inlineCard({
                  url: 'http://www.somelink.com/?jql=EDM',
                })(),
              ),
            ),
          );
          const toolbar = floatingToolbar(
            { allowDatasource: false },
            featureFlagsMock,
          )(editorView.state, intl, providerFactory);

          if (!toolbar) {
            return expect(toolbar).toBeTruthy();
          }

          const toolbarItems = getToolbarItems(toolbar!, editorView);

          checkEditDatasourceButtonDoesNotExist(toolbarItems);
        });

        it('does not have datasource edit button when the platform is mobile', () => {
          const { editorView } = editor(
            doc(
              p(
                '{<node>}',
                inlineCard({
                  url: 'http://www.somelink.com/?jql=EDM',
                })(),
              ),
            ),
          );
          const toolbar = floatingToolbar(
            { allowDatasource: true },
            featureFlagsMock,
            'mobile',
          )(editorView.state, intl, providerFactory);

          if (!toolbar) {
            return expect(toolbar).toBeTruthy();
          }

          const toolbarItems = getToolbarItems(toolbar!, editorView);
          checkEditDatasourceButtonDoesNotExist(toolbarItems);
        });
      });

      describe('block card toolbar: datasource edit button', () => {
        it('has datasource edit button as first item in toolbar when the link can be viewed as a datasource', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              blockCard({
                url: 'http://www.somelink.com/?jql=EDM',
              })(),
            ),
          );

          const toolbar = floatingToolbar(
            { allowDatasource: true },
            featureFlagsMock,
          )(editorView.state, intl, providerFactory);

          if (!toolbar) {
            return expect(toolbar).toBeTruthy();
          }

          const toolbarItems = getToolbarItems(toolbar!, editorView);
          const customItemsArray: any = toolbarItems.filter(
            item => item.type === 'custom',
          );

          if (!customItemsArray) {
            return expect(customItemsArray).toBeTruthy();
          }

          const { getByTestId } = render(
            <MockCardContextAdapter card={cardContext}>
              {customItemsArray[0].render()}
            </MockCardContextAdapter>,
          );

          expect(
            getByTestId('card-edit-datasource-button'),
          ).toBeInTheDocument();
        });

        it('does not have datasource edit button when the link cannot be viewed as a datasource', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              blockCard({
                url: 'http://www.somelink.com/?jql=EDM',
              })(),
            ),
          );
          const toolbar = floatingToolbar(
            { allowDatasource: false },
            featureFlagsMock,
          )(editorView.state, intl, providerFactory);

          if (!toolbar) {
            return expect(toolbar).toBeTruthy();
          }

          const toolbarItems = getToolbarItems(toolbar!, editorView);

          checkEditDatasourceButtonDoesNotExist(toolbarItems);
        });

        it('does not have datasource edit button when the platform is mobile', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              blockCard({
                url: 'http://www.somelink.com/?jql=EDM',
              })(),
            ),
          );
          const toolbar = floatingToolbar(
            { allowDatasource: true },
            featureFlagsMock,
            'mobile',
          )(editorView.state, intl, providerFactory);

          if (!toolbar) {
            return expect(toolbar).toBeTruthy();
          }

          const toolbarItems = getToolbarItems(toolbar!, editorView);

          checkEditDatasourceButtonDoesNotExist(toolbarItems);
        });
      });

      describe('embed card toolbar: datasource edit button', () => {
        it('has datasource edit button as first item in toolbar when the link can be viewed as a datasource', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              embedCard({
                url: 'http://www.somelink.com/?jql=EDM',
                layout: 'center',
              })(),
            ),
          );

          const toolbar = floatingToolbar(
            { allowDatasource: true },
            featureFlagsMock,
          )(editorView.state, intl, providerFactory);

          if (!toolbar) {
            return expect(toolbar).toBeTruthy();
          }

          const toolbarItems = getToolbarItems(toolbar!, editorView);
          const customItem: any = toolbarItems.find(
            item => item.type === 'custom',
          );

          const { getByTestId } =
            customItem &&
            render(
              <MockCardContextAdapter card={cardContext}>
                {customItem.render()}
              </MockCardContextAdapter>,
            );

          expect(
            getByTestId('card-edit-datasource-button'),
          ).toBeInTheDocument();
        });

        it('does not have datasource edit button when the link cannot be viewed as a datasource', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              embedCard({
                url: 'http://www.somelink.com/?jql=EDM',
                layout: 'center',
              })(),
            ),
          );

          const toolbar = floatingToolbar(
            { allowDatasource: false },
            featureFlagsMock,
          )(editorView.state, intl, providerFactory);

          if (!toolbar) {
            return expect(toolbar).toBeTruthy();
          }

          const toolbarItems = getToolbarItems(toolbar!, editorView);
          checkEditDatasourceButtonDoesNotExist(toolbarItems);
        });

        it('does not have datasource edit button when the platform is mobile', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              embedCard({
                url: 'http://www.somelink.com/?jql=EDM',
                layout: 'center',
              })(),
            ),
          );

          const toolbar = floatingToolbar(
            { allowDatasource: true },
            featureFlagsMock,
            'mobile',
          )(editorView.state, intl, providerFactory);

          if (!toolbar) {
            return expect(toolbar).toBeTruthy();
          }

          const toolbarItems = getToolbarItems(toolbar!, editorView);
          checkEditDatasourceButtonDoesNotExist(toolbarItems);
        });
      });
    });
  });
});
