import { tableADF } from './width-provider.spec.ts-fixtures';
import { rendererTestCase as test, expect } from './not-libra';

test.describe('width-provider', () => {
  test.use({
    adf: tableADF,
    rendererProps: {
      appearance: 'comment',
    },
  });

  test('should resize table on page width change', async ({ renderer }) => {
    const table = renderer.page.getByRole('table');

    const beforeWidth = (await table.boundingBox())?.width;
    expect(beforeWidth).toBe(960);

    await renderer.page.setViewportSize({ width: 600, height: 600 });

    const targetWidth = 600;

    await renderer.page.waitForFunction(
      (targetWidth) => {
        const tableWidth = document
          .querySelector('table')
          ?.getBoundingClientRect()?.width;
        return tableWidth && tableWidth <= targetWidth;
      },
      targetWidth,
      { timeout: 1000 },
    );

    const afterWidth = (await table.boundingBox())?.width;
    expect(afterWidth).toBeCloseTo(600, 0);
  });
});
