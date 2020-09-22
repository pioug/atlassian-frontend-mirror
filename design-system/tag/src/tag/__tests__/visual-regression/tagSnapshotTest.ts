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
  it('Tag-basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'removable-tag',
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

  it('removable tag shows focus ring', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'removable-tag',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(
      querySelector({
        attribute: 'data-testid',
        suffixValue: 'removableTag',
      }),
    );

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Tag-colors should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'colors',
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
    await page.waitForSelector(
      querySelector({
        attribute: 'data-testid',
        suffixValue: 'blue',
      }),
    );
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  describe('Simple Tag', () => {
    it('Should render simple tags', async () => {
      const url = getExampleUrl(
        'design-system',
        'tag',
        'simple-tag',
        global.__BASEURL__,
      );

      const { page } = global;
      await loadPage(page, url);

      const simpleTags = await page.screenshot();
      expect(simpleTags).toMatchProdImageSnapshot();
    });
  });

  describe('Link Tag', () => {
    it('Tag should open link on click', async () => {
      const tagId = 'linkTag';
      const url = getExampleUrl(
        'design-system',
        'tag',
        'removable-tag',
        global.__BASEURL__,
      );
      const tagQuerySelector = querySelector({
        attribute: 'data-testid',
        suffixValue: tagId,
      });

      const { page } = global;
      await loadPage(page, url);

      const beforeClickingOnLinkTag = await page.screenshot();
      await page.waitForSelector(tagQuerySelector);
      expect(beforeClickingOnLinkTag).toMatchProdImageSnapshot();
    });
  });

  describe('Removable Tag', () => {
    it('Tag should change bg color on remove button hover & removed when clicked', async () => {
      const url = getExampleUrl(
        'design-system',
        'tag',
        'removable-tag',
        global.__BASEURL__,
      );
      const tagId = 'removableTag';
      const tagQuerySelector = querySelector({
        attribute: 'data-testid',
        suffixValue: tagId,
      });
      const tagRemoveButtonQuerySelector = querySelector({
        attribute: 'data-testid',
        prefixValue: 'close-button',
        suffixValue: tagId,
      });

      const { page } = global;
      await loadPage(page, url);

      await page.waitForSelector(tagQuerySelector);
      const beforeClickingRemoveButton = await page.screenshot();
      expect(beforeClickingRemoveButton).toMatchProdImageSnapshot();

      await page.hover(tagRemoveButtonQuerySelector);
      const onRemoveButtonHover = await page.screenshot();
      expect(onRemoveButtonHover).toMatchProdImageSnapshot();

      await page.click(tagRemoveButtonQuerySelector);
      await page.waitForSelector(tagQuerySelector, {
        hidden: true,
      });
      const afterRemoveButtonClicked = await page.screenshot();
      expect(afterRemoveButtonClicked).toMatchProdImageSnapshot();
    });
  });
});
