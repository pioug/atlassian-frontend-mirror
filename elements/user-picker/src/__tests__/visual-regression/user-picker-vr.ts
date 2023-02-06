import {
  disableCaretCursor,
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';
import {
  CLEAR_INDICATOR_SELECTOR,
  LOZENGE_CLEAR_ICON_SELECTOR,
  DISABLE_INPUT_ID_SINGLE,
  DISABLE_INPUT_ID_MULTI,
  POPUP_BUTTON,
  CONTROL_SELECTOR,
} from './_constants';

import {
  hoverOverUserPicker,
  inputTypingFactory,
  selectItemFactory,
} from './_testUtils';

type InteractionTest = {
  name: string;
  setUp?: (page: PuppeteerPage) => Promise<void>;
};

const themeModes = ['dark', 'light', 'none'] as const;

const examples = [
  'single',
  'single-compact',
  'single-subtle-and-compact',
  'multi',
  'multi-compact',
];

/**
 * Add to interactions if your test case has unique UI implications across
 * different user picker examples.
 */
const interactions: Array<InteractionTest> = [
  {
    name: 'before interaction',
  },
  {
    name: 'hover',
    setUp: hoverOverUserPicker,
  },
  {
    name: 'type blank',
    setUp: inputTypingFactory(''),
  },
  {
    name: 'show team items',
    setUp: inputTypingFactory('team'),
  },
  {
    name: 'show group items',
    setUp: inputTypingFactory('group'),
  },
  {
    name: 'show custom options',
    setUp: inputTypingFactory('custom'),
  },
  {
    name: 'select top item',
    setUp: selectItemFactory(''),
  },
  {
    name: 'select team item',
    setUp: selectItemFactory('team'),
  },
  {
    name: 'select group item',
    setUp: selectItemFactory('admin-groups-group'),
  },
  {
    name: 'select custom item',
    setUp: selectItemFactory('Custom option with lozenge'),
  },
];

describe('UserPicker VR Snapshot Test', () => {
  themeModes.forEach((themeMode) => {
    describe(`theme=${themeMode}`, () => {
      async function vrForExample(
        exampleName: string,
        optionalSetup?: (page: PuppeteerPage) => Promise<void>,
      ) {
        const page: PuppeteerPage = global.page;
        await loadPage(
          page,
          getExampleUrl(
            'elements',
            'user-picker',
            exampleName,
            global.__BASEURL__,
            themeMode,
          ),
        );
        if (optionalSetup) {
          await optionalSetup(page);
        }

        const image = await page.screenshot();
        expect(image).toMatchProdImageSnapshot();
      }

      /**
       * Loops through each theme-example-interaction combination to create
       * a VR snapshot.
       */
      examples.forEach((example) => {
        describe(`user picker type=${example}`, () => {
          interactions.forEach((interaction) => {
            // TODO: Restore skipped test https://product-fabric.atlassian.net/browse/ED-16716
            it.skip(`interaction=${interaction.name}`, async () => {
              await vrForExample(example, interaction.setUp);
            });
          });
        });
      });

      describe('custom interactions', () => {
        /**
         * Add to this section if your test case doesn't need to generalize across
         * all the different picker examples.
         */
        describe('single', () => {
          describe('disabled', () => {
            it('no change on hover', async () => {
              await vrForExample(
                'single-disabled',
                async (page: PuppeteerPage) => {
                  await page.hover(CONTROL_SELECTOR);
                },
              );
            });

            it('no change on click', async () => {
              await vrForExample(
                'single-disabled',
                async (page: PuppeteerPage) => {
                  await page.click(CONTROL_SELECTOR);
                },
              );
            });
          });

          it('highlights clear indicator when hovered', async () => {
            await vrForExample('single', async (page: PuppeteerPage) => {
              await selectItemFactory('')(page);

              await page.hover(CLEAR_INDICATOR_SELECTOR);
            });
          });

          it('clears picker when clear indicator clicked', async () => {
            await vrForExample('single', async (page: PuppeteerPage) => {
              await selectItemFactory('')(page);

              await page.click(CLEAR_INDICATOR_SELECTOR);
            });
          });

          it('cannot select a disabled item', async () => {
            await vrForExample('disable-options', selectItemFactory(''));
          });

          it('input disabled after item selected', async () => {
            await vrForExample('disable-input', async (page: PuppeteerPage) => {
              await selectItemFactory('', DISABLE_INPUT_ID_SINGLE)(page);

              await page.focus(DISABLE_INPUT_ID_SINGLE);
              await page.type(DISABLE_INPUT_ID_SINGLE, 'a');
            });
          });
        });

        describe('multi', () => {
          describe('emails', () => {
            it('prompts entering email', async () => {
              await vrForExample(
                'creatable-with-locale',
                inputTypingFactory('email@'),
              );
            });

            it('prompts selecting valid email', async () => {
              await vrForExample(
                'creatable-with-locale',
                inputTypingFactory('email@gmail.com'),
              );
            });

            it('selects new email', async () => {
              await vrForExample(
                'creatable-with-locale',
                selectItemFactory('email@gmail.com'),
              );
            });
          });

          it('highlights value lozenge', async () => {
            await vrForExample(
              'multi-with-default-values',
              async (page: PuppeteerPage) => {
                // focus
                await inputTypingFactory('')(page);

                await page.keyboard.press('ArrowLeft');
              },
            );
          });

          it('highlights lozenge clear indicator', async () => {
            await vrForExample('multi', async (page: PuppeteerPage) => {
              await selectItemFactory('')(page);
              await page.hover(LOZENGE_CLEAR_ICON_SELECTOR);
            });
          });

          it('deletes lozenge when clear indicator clicked', async () => {
            await vrForExample('multi', async (page: PuppeteerPage) => {
              await selectItemFactory('')(page);
              await selectItemFactory('')(page);
              await page.click(LOZENGE_CLEAR_ICON_SELECTOR);
            });
          });

          it('deletes a default item with backspace key', async () => {
            await vrForExample(
              'multi-with-default-values',
              async (page: PuppeteerPage) => {
                // focus
                await inputTypingFactory('')(page);

                await page.keyboard.press('Backspace');
              },
            );
          });

          it('deletes the first default item with left arrows and delete key', async () => {
            await vrForExample(
              'multi-with-default-values',
              async (page: PuppeteerPage) => {
                // focus
                await inputTypingFactory('')(page);

                await page.keyboard.press('ArrowLeft');
                await page.keyboard.press('ArrowLeft');
                await page.keyboard.press('Backspace');
              },
            );
          });

          it('types with default item present', async () => {
            await vrForExample(
              'multi-with-default-values',
              inputTypingFactory('a'),
            );
          });

          it('does not delete a fixed item with delete key', async () => {
            await vrForExample(
              'multi-with-fixed-values',
              async (page: PuppeteerPage) => {
                // focus
                await inputTypingFactory('')(page);

                await page.keyboard.press('Backspace');
              },
            );
          });

          it('autoscrolls after selected items exceed bounded height', async () => {
            // no options
            await vrForExample('multi', async (page: PuppeteerPage) => {
              // focus
              await inputTypingFactory('')(page);

              // 9 required to start autoscrolling
              const numSelections = 9;
              for (let i = 0; i < numSelections; i++) {
                await page.keyboard.press('Enter');
              }
            });
          });

          it('input is disabled after item selected', async () => {
            await vrForExample('disable-input', async (page: PuppeteerPage) => {
              await selectItemFactory('', DISABLE_INPUT_ID_MULTI)(page);

              await page.focus(DISABLE_INPUT_ID_MULTI);
              await page.type(DISABLE_INPUT_ID_MULTI, 'a');
            });
          });
        });

        describe('popup user picker', () => {
          it('opened', async () => {
            await vrForExample('modal', async (page: PuppeteerPage) => {
              await disableCaretCursor(page);
              await page.click(POPUP_BUTTON);
            });
          });

          it('selected', async () => {
            await vrForExample('modal', async (page: PuppeteerPage) => {
              await disableCaretCursor(page);
              await page.click(POPUP_BUTTON);
              await page.keyboard.press('Enter');

              // click again to verify selection
              await page.click(POPUP_BUTTON);
            });
          });
        });
      });
    });
  });
});
