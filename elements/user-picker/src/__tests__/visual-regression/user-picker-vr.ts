import {
  disableAllTransitions,
  disableCaretCursor,
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

const themeModes = ['dark', 'light', 'none'] as const;

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

      describe('single user picker', () => {
        describe('before interaction', () => {
          it('standard', async () => {
            await vrForExample('single');
          });

          it('compact', async () => {
            await vrForExample('single-compact');
          });

          it('subtle', async () => {
            await vrForExample('single-subtle');
          });

          it('subtle and compact', async () => {
            await vrForExample('single-subtle-and-compact');
          });
        });

        describe('when hovered', () => {
          async function hoverOverUserPicker(page: PuppeteerPage) {
            // Disable CSS transitions so the hover styles are applied immediately
            await disableAllTransitions(page);
            await page.hover('.fabric-user-picker__control');
          }

          it('standard', async () => {
            await vrForExample('single', hoverOverUserPicker);
          });

          it('compact', async () => {
            await vrForExample('single-compact', hoverOverUserPicker);
          });

          it('subtle', async () => {
            await vrForExample('single-subtle', hoverOverUserPicker);
          });

          it('subtle and compact', async () => {
            await vrForExample(
              'single-subtle-and-compact',
              hoverOverUserPicker,
            );
          });
        });

        describe('when focused', () => {
          function inputTypingFactory(inputText: string) {
            return async (page: PuppeteerPage) => {
              await disableCaretCursor(page);
              await page.focus('#react-select-example-input');
              await page.type('#react-select-example-input', inputText);
            };
          }

          it('shows default results', async () => {
            await vrForExample('single', inputTypingFactory(''));
          });

          it('shows "team" results', async () => {
            await vrForExample('single', inputTypingFactory('team'));
          });

          it('shows "group" results', async () => {
            await vrForExample('single', inputTypingFactory('group'));
          });

          it('shows "custom" results', async () => {
            await vrForExample('single', inputTypingFactory('custom'));
          });

          it('shows "unassigned" result', async () => {
            await vrForExample('single', inputTypingFactory('unassigned'));
          });
        });
      });

      describe('multi user picker', () => {
        it('standard', async () => {
          await vrForExample('multi');
        });

        it('compact', async () => {
          await vrForExample('multi-compact');
        });

        it('with default values', async () => {
          await vrForExample('multi-with-default-values');
        });
      });
    });
  });
});
