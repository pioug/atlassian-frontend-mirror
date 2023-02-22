import { initRendererWithADF, waitForText } from './_utils';
import { taskWithDateAdf } from './__fixtures__/task-with-date';
import { selectors } from '../__helpers/page-objects/_renderer';

describe('task', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  it('should format date correctly in task item', async () => {
    await initRendererWithADF(page, {
      adf: taskWithDateAdf,
      appearance: 'full-page',
    });

    const checkboxSelector = `${selectors.document} [type="checkbox"]`;
    const taskItemSelector = `[data-task-local-id]`;
    await page.waitForSelector(checkboxSelector);
    const taskItem = await page.waitForSelector(taskItemSelector);

    await waitForText(page, taskItemSelector, 'Today');
    const textValue = await taskItem?.evaluate((el) => el.textContent);
    expect(textValue).toMatch('Today');

    await page.click(checkboxSelector);

    // Date based on mockStandardDate()
    await waitForText(page, taskItemSelector, 'Aug 16, 2017');
    const updatedText = await taskItem?.evaluate((el) => el.textContent);
    expect(updatedText).toMatch('Aug 16, 2017');
  });
});
