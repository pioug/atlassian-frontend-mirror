import {
  PuppeteerPage,
  waitForTooltip,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';
import { snapshot, initEditorWithAdf, Appearance, pmSelector } from '../_utils';
import adf from './__fixtures__/nested-elements.adf.json';
import {
  tableSelectors,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';
import {
  animationFrame,
  selectAtPos,
} from '../../__helpers/page-objects/_editor';
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import {
  PanelSharedCssClassName,
  PanelSharedSelectors,
} from '@atlaskit/editor-common';
import { mentionSelectors } from '../../__helpers/page-objects/_mention';
import { layoutSelectors } from '../../__helpers/page-objects/_layouts';
import { unsupportedNodeSelectors } from '../../__helpers/page-objects/_unsupported';
import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';

import * as selectionPanelAdf from './__fixtures__/selection-panel-adf.json';
import * as selectionLayoutAdf from './__fixtures__/selection-layout-adf.json';
import {
  waitForMediaToBeLoaded,
  mediaImageSelector,
  mediaToolbarRemoveSelector,
  mediaDangerSelector,
} from '../../__helpers/page-objects/_media';

const selectAll = async (page: PuppeteerPage) => {
  await page.keyboard.down('Control');
  await page.keyboard.down('A');
  await page.keyboard.up('Control');
  await page.keyboard.up('A');
};

/*
When importing this ADF from a file using
`import * as selectionUnsupportedBlock from './__fixtures__/file.json';`

the unsupported block doesn't appear. The `default` key apppears in the JSON and there
appears to be an issue in the validater where it fails if there are 2 errors.

https://product-fabric.atlassian.net/browse/ED-9643
*/
const selectionUnsupportedBlock = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'text before panel',
        },
      ],
    },
    {
      type: 'notapanel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'text in panel',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'text after panel',
        },
      ],
    },
  ],
};

const selectionUnsupportedInline = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'before ',
        },
        {
          type: 'notanemoji',
          attrs: {
            shortName: ':slight_smile:',
            id: '1f642',
            text: '🙂',
          },
        },
        {
          type: 'text',
          text: ' after',
        },
      ],
    },
  ],
};

const selectionUnsupportedInlineInPanel = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'before ',
            },
            {
              type: 'notanemoji',
              attrs: {
                shortName: ':grinning:',
                id: '1f600',
                text: '😀',
              },
            },
            {
              type: 'text',
              text: ' after',
            },
          ],
        },
      ],
    },
  ],
};

const selectionUnsupportedBlockInExpand = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'expand',
      attrs: {
        title: '',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'before',
            },
          ],
        },
        {
          type: '1panel',
          attrs: {
            panelType: 'info',
          },
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

const selectionKitchenSink1Adf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello hello',
        },
      ],
    },
    {
      type: 'expand',
      attrs: {
        title: 'more hello',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'hello',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'emoji',
              attrs: {
                shortName: ':innocent:',
                id: '1f607',
                text: '😇',
              },
            },
            {
              type: 'text',
              text: ' hello ',
            },
          ],
        },
        {
          type: 'panel',
          attrs: {
            panelType: 'info',
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'more info hello',
                },
              ],
            },
          ],
        },
        {
          type: 'taskList',
          attrs: {
            localId: '71a7b8de-8921-4744-a747-8ea82924fecc',
          },
          content: [
            {
              type: 'taskItem',
              attrs: {
                localId: 'a0c201be-4e6c-4500-97b7-cc31c38380d5',
                state: 'TODO',
              },
              content: [
                {
                  type: 'text',
                  text: 'some action hello',
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'hello',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'emoji',
          attrs: {
            shortName: ':flag_bo:',
            id: '1f1e7-1f1f4',
            text: '🇧🇴',
          },
        },
        {
          type: 'text',
          text: '  hello ',
        },
        {
          type: 'status',
          attrs: {
            text: 'good status',
            color: 'green',
            localId: 'd3a684c0-5b1b-4c77-82ca-0f1278ab80a8',
            style: '',
          },
        },
        {
          type: 'text',
          text: ' hello ',
        },
        {
          type: 'status',
          attrs: {
            text: 'bad status',
            color: 'red',
            localId: '8bdb61d5-caa2-49d3-9666-85a7b9c9b03e',
            style: '',
          },
        },
        {
          type: 'text',
          text: ' hello',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello ',
        },
        {
          type: 'mention',
          attrs: {
            id: '3',
            text: '@Shae Accetta',
            accessLevel: '',
          },
        },
        {
          type: 'text',
          text: '  ',
        },
        {
          type: 'mention',
          attrs: {
            id: '5',
            text: '@Lorri Tremble',
            accessLevel: '',
          },
        },
        {
          type: 'text',
          text: '  ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':grinning:',
            id: '1f600',
            text: '😀',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':kissing_closed_eyes:',
            id: '1f61a',
            text: '😚',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'broken-roger',
          attrs: {
            shortName: ':lol:',
            id: 'lol',
            text: 'brreakit',
          },
        },
      ],
    },
    {
      type: 'panel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'hello hello',
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Hello date ',
                    },
                    {
                      type: 'date',
                      attrs: {
                        timestamp: '1595635200000',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Hello Link ',
                    },
                    {
                      type: 'text',
                      text:
                        'FAB-1558 Investigate the 25% empty experience problem',
                      marks: [
                        {
                          type: 'link',
                          attrs: {
                            href:
                              'https://product-fabric.atlassian.net/browse/FAB-1558',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello hello',
        },
      ],
    },
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'some table hello',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '5',
                        text: '@Lorri Tremble',
                        accessLevel: '',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'status',
                      attrs: {
                        text: 'HELLO HELLO',
                        color: 'purple',
                        localId: 'ef262846-7397-4e61-8a86-50663b71014e',
                        style: '',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'hello hi hello',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello',
        },
      ],
    },
  ],
};

const selectionKitchenSink2Adf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'layoutSection',
      content: [
        {
          type: 'layoutColumn',
          attrs: {
            width: 50,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Hello layout',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'mention',
                  attrs: {
                    id: '3',
                    text: '@Shae Accetta',
                    accessLevel: '',
                  },
                },
                {
                  type: 'text',
                  text: ' ',
                },
                {
                  type: 'mention',
                  attrs: {
                    id: '5',
                    text: '@Lorri Tremble',
                    accessLevel: '',
                  },
                },
                {
                  type: 'text',
                  text: ' ',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Hello text ',
                },
                {
                  type: 'text',
                  text: 'Hello code',
                  marks: [
                    {
                      type: 'code',
                    },
                  ],
                },
              ],
            },
            {
              type: 'taskList',
              attrs: {
                localId: 'e04367f5-50a9-47a9-b9ac-a59048538fbd',
              },
              content: [
                {
                  type: 'taskItem',
                  attrs: {
                    localId: '3061c097-9685-4184-8bb8-17f88cbba6b4',
                    state: 'TODO',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'hello task one',
                    },
                  ],
                },
                {
                  type: 'taskItem',
                  attrs: {
                    localId: '439ad93e-8d58-4343-bb22-aea3c841e26b',
                    state: 'TODO',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'hello action two',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'layoutColumn',
          attrs: {
            width: 50,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'hello more layout',
                },
              ],
            },
            {
              type: 'taskList',
              attrs: {
                localId: '399ccfa0-f428-4452-acdb-a5439cae1257',
              },
              content: [
                {
                  type: 'taskItem',
                  attrs: {
                    localId: 'cf185ef1-2f17-42f9-b6d1-17c8d853cbda',
                    state: 'TODO',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'hello task ',
                    },
                    {
                      type: 'mention',
                      attrs: {
                        id: '6',
                        text: '@April',
                        accessLevel: '',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
                {
                  type: 'taskItem',
                  attrs: {
                    localId: '4f8e4990-46fc-46fc-9402-8a1243d412c0',
                    state: 'TODO',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'hello action ',
                    },
                    {
                      type: 'mention',
                      attrs: {
                        id: '5',
                        text: '@Lorri Tremble',
                        accessLevel: '',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
              ],
            },
            {
              type: 'decisionList',
              attrs: {
                localId: 'e576e9ca-dc19-4100-9a1d-d24271245373',
              },
              content: [
                {
                  type: 'decisionItem',
                  attrs: {
                    localId: 'e730d97c-1b6a-40a2-974d-31b0d5e64b98',
                    state: 'DECIDED',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'Hello decision',
                    },
                  ],
                },
                {
                  type: 'decisionItem',
                  attrs: {
                    localId: 'cba688d2-445b-478f-bce0-1d2e9be25ce7',
                    state: 'DECIDED',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'Hello more decision',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello more text',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {},
      content: [
        {
          type: 'text',
          text: 'Hello codeblock',
        },
      ],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: 'e73262d1-4077-40a5-88b9-5acb52ac0d8a',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '4f125320-d10f-402c-ba33-7e9ebd3ac80a',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'hello decision',
            },
          ],
        },
        {
          type: 'decisionItem',
          attrs: {
            localId: '6967cb45-777c-49d5-8a9f-05ae2e97cbf2',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'hello more decision',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello links',
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Hello link ',
                },
                {
                  type: 'text',
                  text: 'FAB-1558 Investigate the 25% empty experience problem',
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href:
                          'https://product-fabric.atlassian.net/browse/FAB-1558',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Hello link ',
                },
                {
                  type: 'text',
                  text:
                    'FAB-997 Investigate replacing experiment with navlinks plugin',
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href:
                          'https://product-fabric.atlassian.net/browse/FAB-997',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'FAB-1558 Investigate the 25% empty experience problem',
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href:
                          'https://product-fabric.atlassian.net/browse/FAB-1558',
                      },
                    },
                  ],
                },
                {
                  type: 'text',
                  text: '  ',
                },
                {
                  type: 'emoji',
                  attrs: {
                    shortName: ':smiley:',
                    id: '1f603',
                    text: '😃',
                  },
                },
                {
                  type: 'text',
                  text: ' ',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

const selectionKitchenSink3Adf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello hello',
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.extensions.update',
        extensionKey: 'test-key-123',
        parameters: {
          count: 0,
        },
        layout: 'default',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'inlineExtension',
          attrs: {
            extensionType: 'com.atlassian.confluence.macro.core',
            extensionKey: 'inline-eh',
            parameters: {
              macroParams: {},
              macroMetadata: {
                placeholder: [
                  {
                    data: {
                      url: '',
                    },
                    type: 'icon',
                  },
                ],
              },
            },
            text: 'Inline extension demo',
          },
        },
        {
          type: 'text',
          text: '  ',
        },
        {
          type: 'inlineExtension',
          attrs: {
            extensionType: 'com.atlassian.confluence.macro.core',
            extensionKey: 'inline-async-eh',
            parameters: {
              macroParams: {},
              macroMetadata: {
                placeholder: [
                  {
                    data: {
                      url: '',
                    },
                    type: 'icon',
                  },
                ],
              },
            },
            text: 'Inline extension demo',
          },
        },
        {
          type: 'text',
          text: '  ',
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'block-iframe-eh',
        parameters: {
          macroParams: {},
          macroMetadata: {
            placeholder: [
              {
                data: {
                  url: '',
                },
                type: 'icon',
              },
            ],
          },
        },
        text: 'Full width block extension demo',
        layout: 'default',
      },
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.extensions.update',
        extensionKey: 'test-key-123',
        parameters: {
          count: 0,
        },
        layout: 'default',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello',
        },
      ],
    },
  ],
};

describe('Danger for nested elements', () => {
  let page: PuppeteerPage;
  const cardProvider = new EditorTestCardProvider();

  describe(`Full page`, () => {
    beforeAll(async () => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf,
        viewport: { width: 1280, height: 550 },
        editorProps: {
          UNSAFE_cards: { provider: Promise.resolve(cardProvider) },
        },
      });
      await waitForResolvedInlineCard(page);
      await clickFirstCell(page);
      await animationFrame(page);
    });

    afterEach(async () => {
      await snapshot(page);
    });

    it(`should show danger for table and all nested elements`, async () => {
      await page.waitForSelector(tableSelectors.removeTable);
      await page.hover(tableSelectors.removeTable);
      await page.waitForSelector(tableSelectors.removeDanger);
      await waitForTooltip(page);
    });
  });
});

describe('Selection:', () => {
  let page: PuppeteerPage;

  describe('Panel', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionPanelAdf,
        viewport: { width: 400, height: 320 },
      });
    });

    afterEach(async () => {
      await page.waitForSelector(PanelSharedSelectors.removeButton);
      await page.hover(PanelSharedSelectors.removeButton);
      await page.waitForSelector(`.${PanelSharedCssClassName.prefix}.danger`);
      await waitForTooltip(page);
      await snapshot(page);
    });

    it('displays danger styling when node is selected', async () => {
      await page.click(`.${PanelSharedCssClassName.icon}`);
    });

    it('displays danger styling when child node is selected', async () => {
      await page.click(mentionSelectors.mention);
    });
  });

  describe('Media', () => {
    const cardProvider = new EditorTestCardProvider();

    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf,
        viewport: { width: 1280, height: 550 },
        editorProps: {
          UNSAFE_cards: { provider: Promise.resolve(cardProvider) },
        },
      });

      await waitForMediaToBeLoaded(page);
      await waitForLoadedImageElements(page, 3000);
    });

    afterEach(async () => {
      await snapshot(page);
    });

    it('displays danger styling when selected and hovering over delete button', async () => {
      await page.click(mediaImageSelector);
      await page.waitForSelector(mediaToolbarRemoveSelector);
      await page.hover(mediaToolbarRemoveSelector);
      await page.waitForSelector(mediaDangerSelector);
      await waitForTooltip(page);
    });
  });

  describe('Layout', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionLayoutAdf,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      await page.waitForSelector(layoutSelectors.removeButton);
      await page.hover(layoutSelectors.removeButton);
      await page.waitForSelector(`[data-layout-section].danger`);
      await waitForTooltip(page);
      await snapshot(page);
    });

    it('displays danger styling when node is selected', async () => {
      await page.click(layoutSelectors.column);
    });

    it('displays danger styling when child node is selected', async () => {
      await page.click(mentionSelectors.mention);
    });
  });
  describe('Unsupported block', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionUnsupportedBlock,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      await snapshot(page);
    });

    it('displays selection when node is clicked', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedBlock);
      await page.click(unsupportedNodeSelectors.unsupportedBlock);
    });
    it('deletes selected node with backspace', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedBlock);
      await page.click(unsupportedNodeSelectors.unsupportedBlock);
      await page.keyboard.press('Backspace');
    });
    it('deletes selected node with typing', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedBlock);
      await page.click(unsupportedNodeSelectors.unsupportedBlock);
      await page.keyboard.type('replaced');
    });
  });
  describe('Unsupported Inline', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionUnsupportedInline,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      await snapshot(page);
    });

    it('displays selection when inline node is clicked', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
      await page.click(unsupportedNodeSelectors.unsupportedInline);
    });
    it('deletes selected node with backspace', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
      await page.click(unsupportedNodeSelectors.unsupportedInline);
      await page.keyboard.press('Backspace');
    });
    it('deletes selected node with typing', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
      await page.click(unsupportedNodeSelectors.unsupportedInline);
      await page.keyboard.type('replaced');
    });
  });
  describe('Unsupported Inline inside Panel', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionUnsupportedInlineInPanel,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      await waitForTooltip(page);
      await snapshot(page, { tolerance: 0.0005 });
    });

    it('displays red border when selected and panel about to be deleted', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
      await page.click(unsupportedNodeSelectors.unsupportedInline);
      await snapshot(page);
      await page.waitForSelector(PanelSharedSelectors.removeButton);
      await page.hover(PanelSharedSelectors.removeButton);
    });
    it(`doesn't display red border when not selected and panel about to be deleted`, async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
      await page.click(`.${PanelSharedCssClassName.icon}`);
      await page.waitForSelector(PanelSharedSelectors.removeButton);
      await page.hover(PanelSharedSelectors.removeButton);
    });
  });
  describe('Unsupported Block inside Expand', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionUnsupportedBlockInExpand,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      await waitForTooltip(page);
      await snapshot(page);
    });

    it('displays red border when selected and panel about to be deleted', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedBlock);
      await page.click(unsupportedNodeSelectors.unsupportedBlock);
      await snapshot(page);
      await page.waitForSelector(`button[aria-label="Remove"]`);
      await page.hover(`button[aria-label="Remove"]`);
    });
    it(`doesn't display red border when not selected and panel about to be deleted`, async () => {
      await page.click(`.ak-editor-expand p`);
      await page.waitForSelector(`button[aria-label="Remove"]`);
      await page.hover(`button[aria-label="Remove"]`);
    });
  });
  describe('TextSelection (mouse click/drag)', () => {
    beforeAll(() => {
      page = global.page;
    });
    const tests = [
      {
        adf: selectionKitchenSink1Adf,
        selection: { start: 0, end: 325 },
        name:
          'kitchen-sink-1:should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
      },
      {
        adf: selectionKitchenSink1Adf,
        selection: { start: 0, end: 72 },
        name:
          'kitchen-sink-1:should not apply selection styles to partially selected top-level nodes (expand)',
      },
      {
        adf: selectionKitchenSink1Adf,
        selection: { start: 83, end: 156 },
        name:
          'kitchen-sink-1:should not apply selection styles to partially selected top-level nodes (panel)',
      },
      {
        adf: selectionKitchenSink1Adf,
        selection: { start: 106, end: 283 },
        name:
          'kitchen-sink-1:should not apply selection styles to partially selected top-level nodes (table)',
      },
      {
        adf: selectionKitchenSink2Adf,
        selection: { start: 0, end: 473 },
        name:
          'kitchen-sink-2:should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
      },
      {
        adf: selectionKitchenSink2Adf,
        selection: { start: 1, end: 46 },
        name:
          'kitchen-sink-2:should not apply selection styles to partially selected top-level nodes (layout)',
      },
      {
        adf: selectionKitchenSink2Adf,
        selection: { start: 1, end: 212 },
        name:
          'kitchen-sink-2:should not apply selection styles to partially selected top-level nodes (codeblock)',
      },
      {
        adf: selectionKitchenSink2Adf,
        selection: { start: 1, end: 229 },
        name:
          'kitchen-sink-2:should not apply selection styles to partially selected top-level nodes (decisions)',
      },
      {
        adf: selectionKitchenSink3Adf,
        selection: { start: 0, end: 30 },
        name:
          'kitchen-sink-3:should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
        beforeSnapshot: async (page: PuppeteerPage) => {
          // Need to wait for min-width to be calculated
          // and applied on inline-extension
          await page.waitFor(1000);
        },
      },
    ];
    tests.forEach(({ selection, name, adf, beforeSnapshot }) => {
      it(name, async () => {
        await initEditorWithAdf(page, {
          appearance: Appearance.fullPage,
          adf,
          viewport: { width: 1040, height: 1200 },
        });
        await page.waitForSelector(pmSelector);
        await page.click(pmSelector);
        await selectAtPos(page, selection.start, selection.end, false);
        // Unfortunately need to wait not just for decoration classes to apply,
        // but also for the selection styles to paint
        await page.waitFor(1000);
        beforeSnapshot && (await beforeSnapshot(page));
        await snapshot(page);
      });
    });
  });
  describe('AllSelection (Cmd + A)', () => {
    const tests = [
      {
        adf: selectionKitchenSink1Adf,
        name:
          'kitchen-sink-1:should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
      },
      {
        adf: selectionKitchenSink2Adf,
        name:
          'kitchen-sink-2:should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
      },
      {
        adf: selectionKitchenSink3Adf,
        name:
          'kitchen-sink-3:should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
        beforeSelect: async (page: PuppeteerPage) => {
          // For some reason, focus is still trapped on one of the inline
          // nodes, so we manually select to move focus in preparation for Ctrl + A
          await selectAtPos(page, 1, 1, false);
        },
        beforeSnapshot: async (page: PuppeteerPage) => {
          // Need to wait for min-width to be calculated
          // and applied on inline-extension
          await page.waitFor(1000);
        },
      },
    ];
    tests.forEach(({ name, adf, beforeSnapshot, beforeSelect }) => {
      it(name, async () => {
        await initEditorWithAdf(page, {
          appearance: Appearance.fullPage,
          adf,
          viewport: { width: 1040, height: 1200 },
        });
        await page.waitForSelector(pmSelector);
        await page.click(pmSelector);
        beforeSelect && (await beforeSelect(page));
        await selectAll(page);
        // Unfortunately need to wait not just for decoration classes to apply,
        // but also for the selection styles to paint
        await page.waitFor(1000);
        beforeSnapshot && (await beforeSnapshot(page));
        await snapshot(page);
      });
    });
  });
});
