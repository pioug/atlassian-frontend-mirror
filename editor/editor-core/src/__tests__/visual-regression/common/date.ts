import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/date-adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  clickOnDate,
  waitForDatePicker,
} from '../../__helpers/page-objects/_date';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import { standardDateMockMillisUnixTime } from '@atlaskit/visual-regression/helper/mock-date';

describe('Date:', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('should render and stay within bounds', async () => {
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 600 },
    });
    await snapshot(page);
  });

  it('should display as selected', async () => {
    await initEditorWithAdf(page, {
      adf: {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. ',
              },
              {
                type: 'date',
                attrs: {
                  timestamp: '1585785300000',
                },
              },
              {
                type: 'text',
                text:
                  ' Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
              },
            ],
          },
        ],
      },
      appearance: Appearance.fullPage,
      viewport: { width: 300, height: 300 },
    });

    await clickOnDate(page);
    await waitForDatePicker(page);
    await snapshot(page);
  });

  it('should show the current date as selected in the calendar of the picker', async () => {
    await initEditorWithAdf(page, {
      adf: {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'date',
                attrs: {
                  timestamp: standardDateMockMillisUnixTime.toString(),
                },
              },
            ],
          },
        ],
      },
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 600 },
    });
    await clickOnDate(page);
    await waitForDatePicker(page);
    await snapshot(page);
  });
  it('should dismiss the picker when using keys to navigate away', async () => {
    await initEditorWithAdf(page, {
      adf: {
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
      },
      appearance: Appearance.fullPage,
      viewport: { width: 300, height: 300 },
    });

    await clickOnDate(page);
    await waitForDatePicker(page);
    await snapshot(page);
    await pressKey(page, 'ArrowRight');
    await animationFrame(page);
    await snapshot(page);
  });

  it('should underline the current (non-selected) day', async () => {
    const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const oneWeekBeforeStandardMillisUnixTime =
      standardDateMockMillisUnixTime - weekInMilliseconds;
    /*
     * The timestamp is roughly a week before the mocked date (Wed Aug 16 00:00:00 2017 +0000).
     * This ensures the underline shows to make sure the mock is working.
     */
    await initEditorWithAdf(page, {
      adf: {
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
      },
      appearance: Appearance.fullPage,
      viewport: { width: 400, height: 500 },
    });

    await clickOnDate(page);
    await waitForDatePicker(page);

    // With tolerance of 0.001 it passes even if date not mocked
    await snapshot(page, { tolerance: 0.0005 });
  });
});
