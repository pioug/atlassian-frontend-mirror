import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorBlockCardModel,
  EditorBlockCardDatasourceModel,
  EditorColumnPickerPopupMenu,
  EditorFloatingToolbarModel,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  p,
  a,
  doc,
  inlineCard,
  blockCard,
  datasourceBlockCard,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  blockCardAdf,
  unAuth,
  multipleBlockCards,
  blockCardDatasource,
  multipleBlockCardDatasource,
} from './block.spec.ts-fixtures';

test.describe('block card', () => {
  test.use({
    adf: blockCardAdf,
    editorProps: {
      appearance: 'full-page',
      allowTextAlignment: true,
      smartLinks: {
        allowBlockCards: true,
      },
    },
  });

  test('card: changing the link label of a block link should convert it to a "dumb" link', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);
    const blockCardToolbar = EditorFloatingToolbarModel.from(
      editor,
      blockCardModel,
    );

    await blockCardModel.click();

    await blockCardToolbar.waitForStable();
    await blockCardToolbar.editLink();
    await blockCardToolbar.clearLabel();
    await editor.keyboard.type('New heading');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(p(' '), p(a({ href: 'http://www.atlassian.com' })('New heading'))),
    );
  });

  test('card: changing the link URL of a block link to an unsupported link should convert it to a "dumb" link', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);
    const blockCardToolbar = EditorFloatingToolbarModel.from(
      editor,
      blockCardModel,
    );

    await blockCardModel.click();
    await blockCardToolbar.editLink();
    await blockCardToolbar.clearLink();

    await editor.keyboard.type(
      'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
    );
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        p(' '),
        p(
          inlineCard({
            data: {
              '@context': 'https://www.w3.org/ns/activitystreams',
              '@type': 'Document',
              name: expect.any(String),
              url: expect.any(String),
            },
          })(),
          ' ',
        ),
      ),
    );
  });

  test.describe('with feature flag: lp-link-picker', () => {
    test.use({
      adf: blockCardAdf,
      editorProps: {
        appearance: 'full-page',
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
        },
        featureFlags: { 'lp-link-picker': true },
      },
    });

    test('card: changing the link label of a block link should convert it to a "dumb" link', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);
      const blockCardToolbar = EditorFloatingToolbarModel.from(
        editor,
        blockCardModel,
      );

      await blockCardModel.click();
      await blockCardToolbar.editLink();
      await blockCardToolbar.clearLabel();
      await editor.keyboard.type('New heading');
      await editor.keyboard.press('Enter');

      await expect(editor).toHaveDocument(
        doc(p(' '), p(a({ href: 'http://www.atlassian.com' })('New heading'))),
      );
    });

    test('card: changing the link URL of a block link to an unsupported link should convert it to a "dumb" link', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);
      const blockCardToolbar = EditorFloatingToolbarModel.from(
        editor,
        blockCardModel,
      );

      await blockCardModel.click();
      await blockCardToolbar.editLink();
      await blockCardToolbar.clearLink();

      await editor.keyboard.type(
        'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
      );
      await editor.keyboard.press('Enter');

      await expect(editor).toHaveDocument(
        doc(
          p(' '),
          p(
            inlineCard({
              data: {
                '@context': 'https://www.w3.org/ns/activitystreams',
                '@type': 'Document',
                name: 'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
                url: 'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
              },
            })(),
            ' ',
          ),
        ),
      );
    });
  });

  test.describe('embeds', () => {
    test.use({
      adf: unAuth,
      editorProps: {
        appearance: 'full-page',
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    });

    test('card: should open a new window to authenticate with a provider', async ({
      editor,
      page,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const blockCardModel = EditorBlockCardModel.from(nodes.blockCard.first());

      await blockCardModel.click();
      const popupPromise = page.waitForEvent('popup');
      await blockCardModel.openUnauthorised();
      const popup = await popupPromise;
      await popup.waitForLoadState();

      expect(popup.url()).toBe('about:blank');
    });

    test('card: should open a new window to authenticate with a provider when connecting a different account', async ({
      editor,
      page,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const blockCardModel = EditorBlockCardModel.from(nodes.blockCard.last());

      await blockCardModel.click();
      const popupPromise = page.waitForEvent('popup');
      await blockCardModel.openForbidden();
      const popup = await popupPromise;
      await popup.waitForLoadState();

      expect(popup.url()).toBe('about:blank');
    });
  });

  test.describe('multiple block cards', () => {
    test.use({
      adf: multipleBlockCards,
      editorProps: {
        appearance: 'full-page',
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    });

    test('card: copy paste multiple block card should work as expected in editor', async ({
      editor,
    }) => {
      await editor.keyboard.press('Meta+KeyA');
      await editor.copy();
      await editor.keyboard.press('ArrowLeft');
      await editor.paste();

      await expect(editor).toMatchDocument(
        doc(
          p(' '),
          blockCard({
            data: {
              '@context': 'https://www.w3.org/ns/activitystreams',
              '@type': 'Document',
              generator: {
                icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
              },
              name: 'Welcome to Atlassian!',
              url: 'http://www.atlassian.com',
            },
          })(),
          blockCard({
            data: {
              '@context': 'https://www.w3.org/ns/activitystreams',
              '@type': 'Document',
              generator: {
                icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
              },
              name: 'Welcome to Atlassian!',
              url: 'http://www.atlassian.com',
            },
          })(),
          p(' '),
          blockCard({
            data: {
              '@context': 'https://www.w3.org/ns/activitystreams',
              '@type': 'Document',
              generator: {
                icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
              },
              name: 'Welcome to Atlassian!',
              url: 'http://www.atlassian.com',
            },
          })(),
          blockCard({
            data: {
              '@context': 'https://www.w3.org/ns/activitystreams',
              '@type': 'Document',
              generator: {
                icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
              },
              name: 'Welcome to Atlassian!',
              url: 'http://www.atlassian.com',
            },
          })(),
        ),
      );
    });
  });

  test.describe('datasource', () => {
    test.use({
      adf: blockCardDatasource,
      editorProps: {
        appearance: 'full-page',
        autoScrollIntoView: true,
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowDatasource: true,
        },
      },
    });

    test('card: block card with datasource should render as datasource table in editor', async ({
      editor,
    }) => {
      await expect(editor).toMatchDocument(
        doc(
          p(' '),
          datasourceBlockCard({
            datasource: {
              id: 'some-datasource-id',
              parameters: {
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                jql: 'project=EDM',
              },
              views: [
                {
                  properties: {
                    columns: [
                      {
                        key: 'type',
                      },
                      {
                        key: 'summary',
                      },
                      {
                        key: 'assignee',
                      },
                    ],
                  },
                  type: 'table',
                },
              ],
            },
            layout: 'center',
          })(),
        ),
      );
    });

    test('card: block card with datasource on column add should render new column in table', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const blockCardModel = EditorBlockCardDatasourceModel.from(
        editor,
        nodes.blockCard,
      );
      const columnPickerPopupModel = EditorColumnPickerPopupMenu.from(editor);

      await blockCardModel.configureColumns();
      await columnPickerPopupModel.selectOption(0);

      await expect(editor).toMatchDocument(
        doc(
          p(' '),
          datasourceBlockCard({
            datasource: {
              id: 'some-datasource-id',
              parameters: {
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                jql: 'project=EDM',
              },
              views: [
                {
                  properties: {
                    columns: [
                      {
                        key: 'summary',
                      },
                      {
                        key: 'assignee',
                      },
                    ],
                  },
                  type: 'table',
                },
              ],
            },
            layout: 'center',
          })(),
        ),
      );
    });

    test('card: block card with datasource should copy and paste multiple datasource tables', async ({
      editor,
    }) => {
      await editor.keyboard.press('Meta+KeyA');
      await editor.copy();

      // paste it below
      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('Enter');
      await editor.paste();

      await expect(editor).toMatchDocument(
        doc(
          p(' '),
          datasourceBlockCard({
            datasource: {
              id: 'some-datasource-id',
              parameters: {
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                jql: 'project=EDM',
              },
              views: [
                {
                  properties: {
                    columns: [
                      {
                        key: 'type',
                      },
                      {
                        key: 'summary',
                      },
                      {
                        key: 'assignee',
                      },
                    ],
                  },
                  type: 'table',
                },
              ],
            },
            layout: 'center',
          })(),
          p(' '),
          datasourceBlockCard({
            datasource: {
              id: 'some-datasource-id',
              parameters: {
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                jql: 'project=EDM',
              },
              views: [
                {
                  properties: {
                    columns: [
                      {
                        key: 'type',
                      },
                      {
                        key: 'summary',
                      },
                      {
                        key: 'assignee',
                      },
                    ],
                  },
                  type: 'table',
                },
              ],
            },
            layout: 'center',
          })(),
        ),
      );
    });

    test('card: block card with datasource on resize should change the layout', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const blockCardModel = EditorBlockCardDatasourceModel.from(
        editor,
        nodes.blockCard,
      );

      await blockCardModel.click();
      await blockCardModel.toWide();
      await expect(editor).toMatchDocument(
        doc(
          p(' '),
          datasourceBlockCard({
            datasource: {
              id: 'some-datasource-id',
              parameters: {
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                jql: 'project=EDM',
              },
              views: [
                {
                  properties: {
                    columns: [
                      {
                        key: 'type',
                      },
                      {
                        key: 'summary',
                      },
                      {
                        key: 'assignee',
                      },
                    ],
                  },
                  type: 'table',
                },
              ],
            },
            layout: 'wide',
          })(),
        ),
      );

      await blockCardModel.toFullWidth();
      await expect(editor).toMatchDocument(
        doc(
          p(' '),
          datasourceBlockCard({
            datasource: {
              id: 'some-datasource-id',
              parameters: {
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                jql: 'project=EDM',
              },
              views: [
                {
                  properties: {
                    columns: [
                      {
                        key: 'type',
                      },
                      {
                        key: 'summary',
                      },
                      {
                        key: 'assignee',
                      },
                    ],
                  },
                  type: 'table',
                },
              ],
            },
            layout: 'full-width',
          })(),
        ),
      );

      await blockCardModel.toCenter();
      await expect(editor).toMatchDocument(
        doc(
          p(' '),
          datasourceBlockCard({
            datasource: {
              id: 'some-datasource-id',
              parameters: {
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                jql: 'project=EDM',
              },
              views: [
                {
                  properties: {
                    columns: [
                      {
                        key: 'type',
                      },
                      {
                        key: 'summary',
                      },
                      {
                        key: 'assignee',
                      },
                    ],
                  },
                  type: 'table',
                },
              ],
            },
            layout: 'center',
          })(),
        ),
      );
    });
  });

  test.describe('multipe datasource', () => {
    test.use({
      adf: multipleBlockCardDatasource,
      editorProps: {
        appearance: 'full-page',
        autoScrollIntoView: true,
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowDatasource: true,
        },
      },
    });

    test('card: block card with multiple datasources on resize should change the layout of only the selected table', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const blockCardModel0 = EditorBlockCardDatasourceModel.from(
        editor,
        nodes.blockCard.first(),
      );
      const blockCardModel1 = EditorBlockCardDatasourceModel.from(
        editor,
        nodes.blockCard.last(),
      );

      await blockCardModel0.click();
      await blockCardModel0.toWide();
      await expect(editor).toMatchDocument(
        doc(
          p(' '),
          datasourceBlockCard({
            datasource: {
              id: 'some-datasource-id',
              parameters: {
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                jql: 'project=EDM',
              },
              views: [
                {
                  properties: {
                    columns: [
                      {
                        key: 'type',
                      },
                      {
                        key: 'summary',
                      },
                      {
                        key: 'assignee',
                      },
                    ],
                  },
                  type: 'table',
                },
              ],
            },
            layout: 'wide',
          })(),
          datasourceBlockCard({
            datasource: {
              id: 'some-datasource-id',
              parameters: {
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                jql: 'project=EDM',
              },
              views: [
                {
                  properties: {
                    columns: [
                      {
                        key: 'type',
                      },
                      {
                        key: 'summary',
                      },
                      {
                        key: 'assignee',
                      },
                    ],
                  },
                  type: 'table',
                },
              ],
            },
            layout: 'center',
          })(),
        ),
      );

      await blockCardModel1.click();
      await blockCardModel1.toWide();
      await expect(editor).toMatchDocument(
        doc(
          p(' '),
          datasourceBlockCard({
            datasource: {
              id: 'some-datasource-id',
              parameters: {
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                jql: 'project=EDM',
              },
              views: [
                {
                  properties: {
                    columns: [
                      {
                        key: 'type',
                      },
                      {
                        key: 'summary',
                      },
                      {
                        key: 'assignee',
                      },
                    ],
                  },
                  type: 'table',
                },
              ],
            },
            layout: 'wide',
          })(),
          datasourceBlockCard({
            datasource: {
              id: 'some-datasource-id',
              parameters: {
                cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
                jql: 'project=EDM',
              },
              views: [
                {
                  properties: {
                    columns: [
                      {
                        key: 'type',
                      },
                      {
                        key: 'summary',
                      },
                      {
                        key: 'assignee',
                      },
                    ],
                  },
                  type: 'table',
                },
              ],
            },
            layout: 'wide',
          })(),
        ),
      );
    });
  });
});
