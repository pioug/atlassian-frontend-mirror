import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const querySelector = ({
  attribute,
  prefixValue,
  suffixValue,
}: {
  attribute: string;
  prefixValue?: string | null;
  suffixValue: string;
}) => {
  const value = prefixValue ? prefixValue + '-' + suffixValue : suffixValue;
  return '[' + attribute + "='" + value + "']";
};

describe('Snapshot Test', () => {
  it('Tag group basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag-group',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(
      querySelector({
        attribute: 'data-testid',
        suffixValue: 'standard',
      }),
    );
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
