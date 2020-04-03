import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/date-adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import {
  clickOnDate,
  waitForDatePicker,
} from '../../__helpers/page-objects/_date';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import { animationFrame } from '../../__helpers/page-objects/_editor';

describe('Date:', () => {
  let page: Page;
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
      viewport: { width: 1280, height: 600 },
    });

    await clickOnDate(page);
    await waitForDatePicker(page);
    await snapshot(page);
    await pressKey(page, 'ArrowRight');
    await animationFrame(page);
    await snapshot(page);
  });
});
