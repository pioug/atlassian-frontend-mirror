// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/date-adf.json';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickOnDate,
  dateSelectors,
  waitForDatePicker,
  waitForNoDatePicker,
} from '@atlaskit/editor-test-helpers/page-objects/date';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  pressKey,
  pressKeyCombo,
} from '@atlaskit/editor-test-helpers/page-objects/keyboard';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  animationFrame,
  typeInEditorAtEndOfDocument,
  selectors,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { quickInsert } from '@atlaskit/editor-test-helpers/page-objects/extensions';
import { standardDateMockMillisUnixTime } from '@atlaskit/visual-regression/helper/mock-date';
import { THEME_MODES } from '@atlaskit/theme/constants';
import { getModeFromTheme } from '@atlaskit/editor-common/utils';

const { dateInput, dateInputFocused } = dateSelectors;
const defaultViewPort = { width: 600, height: 600 };

const initEditor = async (
  page: PuppeteerPage,
  viewport: { width: number; height: number },
  theme: string,
  adf?: Object,
) =>
  initEditorWithAdf(page, {
    adf: adf,
    appearance: Appearance.fullPage,
    viewport: viewport,
    mode: getModeFromTheme(theme),
  });

describe('Date:', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  describe('keyboard accessible picker', () => {
    describe.each(THEME_MODES)('Theme: %s', (theme) => {
      it('should autofocus textfield and select text when creating new date', async () => {
        await initEditor(page, defaultViewPort, theme);

        // Insert date by quick insert
        await typeInEditorAtEndOfDocument(page, '');
        await quickInsert(page, 'Date', false);
        await pressKey(page, 'Enter');

        await waitForDatePicker(page);
        await snapshot(page);
      });
      it('should autofocus textfield, select text and allow editing when creating new date', async () => {
        await initEditor(page, defaultViewPort, theme);

        // Insert date by quick insert
        await typeInEditorAtEndOfDocument(page, '');
        await quickInsert(page, 'Date', false);
        await pressKey(page, 'Enter');

        // Date picker is now open
        await waitForDatePicker(page);

        // Remove date in datepicker
        await pressKey(page, 'Backspace');

        // Type new date
        // US locale by default
        await page.type(dateInput, '2/26/2019');

        // Commit date
        await pressKey(page, 'Enter');

        // Ensure date saves correctly
        await snapshot(page);
      });

      it('should not autofocus the textfield when selecting an existing date', async () => {
        const adf = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'date',
                  attrs: {
                    timestamp: '1587513600000',
                  },
                },
              ],
            },
          ],
        };
        await initEditor(page, defaultViewPort, theme, adf);

        await clickOnDate(page);
        await snapshot(page);
      });
      it('should focus existing date input on tab press', async () => {
        const adf = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'date',
                  attrs: {
                    timestamp: '1587513600000',
                  },
                },
              ],
            },
          ],
        };
        await initEditor(page, defaultViewPort, theme, adf);

        await clickOnDate(page);
        await pressKey(page, 'Tab');
        await page.waitForSelector(dateInputFocused);
        await snapshot(page);
      });

      it('should change calendar view when changing date with keyboard', async () => {
        await initEditor(page, defaultViewPort, theme);

        // Insert date by quick insert
        await typeInEditorAtEndOfDocument(page, '');
        await quickInsert(page, 'Date', false);
        await pressKey(page, 'Enter');

        // Date picker is now open
        await waitForDatePicker(page);

        // Remove date in datepicker
        await pressKey(page, 'Backspace');

        // Type new date
        // US locale by default
        await page.type(dateInput, '2/26/2019');

        await snapshot(page);
      });
      it('should display invalid date error when textfield full of letters', async () => {
        await initEditor(page, defaultViewPort, theme);

        // Insert date by quick insert
        await typeInEditorAtEndOfDocument(page, '');
        await quickInsert(page, 'Date', false);
        await pressKey(page, 'Enter');

        // Date picker is now open
        await waitForDatePicker(page);

        // Remove date in datepicker
        await pressKey(page, 'Backspace');

        // Type in input
        await page.type(dateInput, 'notadate');

        await snapshot(page);
      });
      it('should display invalid date error when textfield empty', async () => {
        await initEditor(page, defaultViewPort, theme);

        // Insert date by quick insert
        await typeInEditorAtEndOfDocument(page, '');
        await quickInsert(page, 'Date', false);
        await pressKey(page, 'Enter');

        // Date picker is now open
        await waitForDatePicker(page);

        // Remove date in datepicker
        await pressKey(page, 'Backspace');

        await snapshot(page);
      });
      it('should display invalid date error when year > 9999', async () => {
        await initEditor(page, defaultViewPort, theme);

        // Insert date by quick insert
        await typeInEditorAtEndOfDocument(page, '');
        await animationFrame(page);
        await quickInsert(page, 'Date', false);
        await page.waitForSelector(selectors.typeaheadPopup);
        await animationFrame(page);
        await pressKey(page, 'Enter');

        // Date picker is now open
        await waitForDatePicker(page);

        // Remove date in datepicker
        await pressKey(page, 'Backspace');
        await animationFrame(page);

        // Type new date
        // US locale by default
        await page.type(dateInput, '2/26/10000');
        await animationFrame(page);

        await snapshot(page);
      });
    });
    it('should delete date when pressing enter in empty textfield', async () => {
      // Test flakes when run in dark theme
      await initEditor(page, defaultViewPort, 'light');

      await typeInEditorAtEndOfDocument(page, 'hello ');
      await quickInsert(page, 'Date', false);
      await pressKey(page, 'Enter');

      await waitForDatePicker(page);

      // Date picker is now open

      // Remove date in datepicker, as the text is selected by default
      await pressKey(page, 'Backspace');

      // Date picker is now empty, enter should remove date
      await pressKey(page, 'Enter');
      await waitForNoDatePicker(page);

      // Type to verify selection
      await typeInEditorAtEndOfDocument(page, 'world!');

      // Text is all that remains
      await snapshot(page);
    });

    it('should dismiss the date picker when deleting the date', async () => {
      await initEditor(page, defaultViewPort, 'light');

      // Insert date by quick insert
      await typeInEditorAtEndOfDocument(page, '');
      await quickInsert(page, 'Date', false);
      await pressKey(page, 'Enter');

      await waitForDatePicker(page);
      await pressKey(page, 'Enter');
      await waitForNoDatePicker(page);
      await clickOnDate(page);

      await pressKey(page, 'Backspace');

      await snapshot(page);
    });

    it('should dismiss the date picker when cutting a date', async () => {
      await initEditor(page, defaultViewPort, 'light');

      // Insert date by quick insert
      await typeInEditorAtEndOfDocument(page, '');
      await quickInsert(page, 'Date', false);
      await pressKey(page, 'Enter');

      await waitForDatePicker(page);
      await pressKey(page, 'Enter');
      await waitForNoDatePicker(page);
      await clickOnDate(page);

      await pressKeyCombo(page, ['Control', 'KeyX']);

      await snapshot(page);
    });
  });

  describe('standard picker', () => {
    describe.each(THEME_MODES)('Theme: %s', (theme) => {
      it('should render and stay within bounds', async () => {
        const viewport = { width: 1280, height: 600 };

        await initEditor(page, viewport, theme, adf);
        await snapshot(page);
      });

      it('should display as selected', async () => {
        const adf = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. ',
                },
                {
                  type: 'date',
                  attrs: {
                    timestamp: '1585785300000',
                  },
                },
                {
                  type: 'text',
                  text: ' Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
                },
              ],
            },
          ],
        };
        await initEditor(page, defaultViewPort, theme, adf);

        await clickOnDate(page);
        await snapshot(page);
      });

      it('should show the current date as selected in the calendar of the picker', async () => {
        const adf = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'date',
                  attrs: {
                    timestamp: '1587513600000',
                  },
                },
              ],
            },
          ],
        };
        await initEditor(page, defaultViewPort, theme, adf);

        await clickOnDate(page);
        await snapshot(page);
      });

      // FIXME: This test was automatically skipped due to failure on 27/05/2023: https://product-fabric.atlassian.net/browse/ED-18092
      it.skip('should dismiss the picker when using keys to navigate away', async () => {
        const adf = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'date',
                  attrs: {
                    timestamp: '1559779200000',
                  },
                },
              ],
            },
          ],
        };
        const viewport = { width: 300, height: 300 };

        await initEditor(page, viewport, theme, adf);

        await clickOnDate(page);
        await snapshot(page);
        await pressKey(page, 'ArrowRight');
        await animationFrame(page);
        await snapshot(page);
      });

      // Failing for a different reason than expected:
      // `Node is either not visible or not an HTMLElement`
      it('should show next month when clicking calendar arrow', async () => {
        const adf = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'date',
                  attrs: {
                    timestamp: '1559779200000',
                  },
                },
              ],
            },
          ],
        };
        await initEditor(page, defaultViewPort, theme, adf);
        await animationFrame(page);

        await clickOnDate(page);
        await snapshot(page, undefined, undefined, {
          captureBeyondViewport: false,
        });
        await page.click(dateSelectors.calendarNextMonth);
        await animationFrame(page);
        await snapshot(page, undefined, undefined, {
          captureBeyondViewport: false,
        });
      });

      it('should underline the current (non-selected) day', async () => {
        const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        const oneWeekBeforeStandardMillisUnixTime =
          standardDateMockMillisUnixTime - weekInMilliseconds;
        /*
         * The timestamp is roughly a week before the mocked date (Wed Aug 16 00:00:00 2017 +0000).
         * This ensures the underline shows to make sure the mock is working.
         */
        const adf = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'date',
                  attrs: {
                    // A week before the mocked date
                    timestamp: oneWeekBeforeStandardMillisUnixTime.toString(),
                  },
                },
              ],
            },
          ],
        };
        const viewport = { width: 400, height: 500 };

        await initEditor(page, viewport, theme, adf);

        await clickOnDate(page);

        // With tolerance of 0.001 it passes even if date not mocked
        await snapshot(page, { tolerance: 0.0005 });
      });
    });
  });
});
