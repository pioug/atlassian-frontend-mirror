import {
  getExampleUrl,
  loadPage,
  pageSelector,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

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
      'basic-tag',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const standardTag = querySelector({
      attribute: 'data-testid',
      suffixValue: 'standard',
    });
    await page.waitForSelector(standardTag);
    const image = await takeElementScreenShot(page, standardTag);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Tag color variations should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'colors',
      global.__BASEURL__,
    );
    const wrapper = querySelector({
      attribute: 'data-testid',
      suffixValue: 'wrapper',
    });
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(wrapper);
    const image = await takeElementScreenShot(page, wrapper);
    expect(image).toMatchProdImageSnapshot();
  });

  describe('Non-interactive tag', () => {
    it('should match production example', async () => {
      const url = getExampleUrl(
        'design-system',
        'tag',
        'colors',
        global.__BASEURL__,
      );
      const tag = querySelector({
        attribute: 'data-testid',
        suffixValue: 'nonInteractiveStandard',
      });
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector(tag);
      const image = await takeElementScreenShot(page, tag);
      expect(image).toMatchProdImageSnapshot();
    });

    it('appearance on hover should match production example', async () => {
      // Should have no hover state
      const url = getExampleUrl(
        'design-system',
        'tag',
        'colors',
        global.__BASEURL__,
      );
      const tag = querySelector({
        attribute: 'data-testid',
        suffixValue: 'nonInteractiveStandard',
      });
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector(tag);
      await page.hover(tag);
      const image = await takeElementScreenShot(page, tag);
      expect(image).toMatchProdImageSnapshot();
    });

    it('appearance on active should match production example', async () => {
      // Should have no active state
      const url = getExampleUrl(
        'design-system',
        'tag',
        'colors',
        global.__BASEURL__,
      );
      const tag = querySelector({
        attribute: 'data-testid',
        suffixValue: 'nonInteractiveStandard',
      });
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector(tag);
      await page.hover(tag);
      await page.mouse.down();
      const image = await takeElementScreenShot(page, tag);
      expect(image).toMatchProdImageSnapshot();
    });
  });

  describe('Linked tag', () => {
    it('should match production example', async () => {
      const url = getExampleUrl(
        'design-system',
        'tag',
        'basic-tag',
        global.__BASEURL__,
      );
      const tag = querySelector({
        attribute: 'data-testid',
        suffixValue: 'linkTag',
      });
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector(tag);
      const image = await takeElementScreenShot(page, tag);
      expect(image).toMatchProdImageSnapshot();
    });

    it('appearance on hover should match production example', async () => {
      const url = getExampleUrl(
        'design-system',
        'tag',
        'basic-tag',
        global.__BASEURL__,
      );
      const tag = querySelector({
        attribute: 'data-testid',
        suffixValue: 'linkTag',
      });
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector(tag);
      await page.hover(tag);
      const image = await takeElementScreenShot(page, tag);
      expect(image).toMatchProdImageSnapshot();
    });

    it('appearance on active should match production example', async () => {
      const url = getExampleUrl(
        'design-system',
        'tag',
        'basic-tag',
        global.__BASEURL__,
      );
      const tag = querySelector({
        attribute: 'data-testid',
        suffixValue: 'linkTag',
      });
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector(tag);
      await page.hover(tag);
      await page.mouse.down();
      const image = await takeElementScreenShot(page, tag);
      expect(image).toMatchProdImageSnapshot();
    });

    it('appearance on focus should match production example', async () => {
      const url = getExampleUrl(
        'design-system',
        'tag',
        'basic-tag',
        global.__BASEURL__,
      );
      const tag = querySelector({
        attribute: 'data-testid',
        suffixValue: 'linkTag',
      });
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector(tag);
      await page.keyboard.press('Tab');

      // We use the page selector because the focus may be outside the element
      const image = await takeElementScreenShot(page, pageSelector);
      expect(image).toMatchProdImageSnapshot();
    });

    it('with theme provider on hover should match production example', async () => {
      const url = getExampleUrl(
        'design-system',
        'tag',
        'simple-tag-with-theme',
        global.__BASEURL__,
      );
      const tag = querySelector({
        attribute: 'data-testid',
        suffixValue: 'linkTag',
      });
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector(tag);
      await page.hover(tag);
      const image = await takeElementScreenShot(page, tag);
      expect(image).toMatchProdImageSnapshot();
    });
  });

  it('Removable avatar tag should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'appearance',
      global.__BASEURL__,
    );
    const removableAvatarTagCloseButton = querySelector({
      attribute: 'data-testid',
      prefixValue: 'close-button',
      suffixValue: 'avatarTag',
    });
    const removableAvatarTag = querySelector({
      attribute: 'data-testid',
      suffixValue: 'avatarTag',
    });
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(removableAvatarTag);
    await page.hover(removableAvatarTagCloseButton);
    const imageOnHover = await takeElementScreenShot(page, removableAvatarTag);
    expect(imageOnHover).toMatchProdImageSnapshot();
    await page.click(removableAvatarTagCloseButton);
    const imageAfterRemovingTag = await takeElementScreenShot(
      page,
      '#appearance',
    );
    expect(imageAfterRemovingTag).toMatchProdImageSnapshot();
  });

  it('Removable tag shows focus ring', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'removable-tag',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const removableTag = querySelector({
      attribute: 'data-testid',
      suffixValue: 'removableTag',
    });
    await page.waitForSelector(removableTag);

    await page.keyboard.press('Tab');

    // We use the page selector because the focus may be outside the element
    const image = await takeElementScreenShot(page, pageSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render simple tags', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'simple-tag',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    const simpleTags = await takeElementScreenShot(page, '#simpleTags');
    expect(simpleTags).toMatchProdImageSnapshot();
  });

  it('Removable tag should change bg color on remove button hover & removed when clicked', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'removable-tag',
      global.__BASEURL__,
    );
    const tagId = 'removableTag';
    const removableTag = querySelector({
      attribute: 'data-testid',
      suffixValue: tagId,
    });
    const removableTagCloseButton = querySelector({
      attribute: 'data-testid',
      prefixValue: 'close-button',
      suffixValue: tagId,
    });

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(removableTag);
    const beforeClickingRemoveButton = await takeElementScreenShot(
      page,
      removableTag,
    );
    expect(beforeClickingRemoveButton).toMatchProdImageSnapshot();

    await page.hover(removableTagCloseButton);
    const onRemoveButtonHover = await takeElementScreenShot(page, removableTag);
    expect(onRemoveButtonHover).toMatchProdImageSnapshot();

    await page.click(removableTagCloseButton);
    await page.waitForSelector(removableTag, {
      hidden: true,
    });
  });

  describe('Element before tag', () => {
    it('should match production example', async () => {
      const url = getExampleUrl(
        'design-system',
        'tag',
        'colors',
        global.__BASEURL__,
      );
      const tag = querySelector({
        attribute: 'data-testid',
        suffixValue: 'elemBeforeBlue',
      });
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector(tag);
      const image = await takeElementScreenShot(page, tag);
      expect(image).toMatchProdImageSnapshot();
    });
  });

  it('Colored Removable tag should change bg color on remove button hover & removed when clicked', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'removable-tag',
      global.__BASEURL__,
    );
    const tagId = 'removableTagColor';
    const removableTag = querySelector({
      attribute: 'data-testid',
      suffixValue: tagId,
    });
    const removableTagCloseButton = querySelector({
      attribute: 'data-testid',
      prefixValue: 'close-button',
      suffixValue: tagId,
    });

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(removableTag);
    const beforeClickingRemoveButton = await takeElementScreenShot(
      page,
      removableTag,
    );
    expect(beforeClickingRemoveButton).toMatchProdImageSnapshot();

    await page.hover(removableTagCloseButton);
    const onRemoveButtonHover = await takeElementScreenShot(page, removableTag);
    expect(onRemoveButtonHover).toMatchProdImageSnapshot();

    await page.click(removableTagCloseButton);
    await page.waitForSelector(removableTag, {
      hidden: true,
    });
  });

  it('Tag with text max length should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'text-max-length',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    const image = await takeElementScreenShot(page, '#maxLengthTag');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Removable Tag with theme provider should change bg color on remove button hover & removed when clicked', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'removable-tag-with-theme',
      global.__BASEURL__,
    );
    const tagId = 'removableTag';
    const removableTag = querySelector({
      attribute: 'data-testid',
      suffixValue: tagId,
    });
    const removableTagCloseButton = querySelector({
      attribute: 'data-testid',
      prefixValue: 'close-button',
      suffixValue: tagId,
    });

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(removableTag);
    const beforeClickingRemoveButton = await takeElementScreenShot(
      page,
      removableTag,
    );
    expect(beforeClickingRemoveButton).toMatchProdImageSnapshot();

    await page.hover(removableTagCloseButton);
    const onRemoveButtonHover = await takeElementScreenShot(page, removableTag);
    expect(onRemoveButtonHover).toMatchProdImageSnapshot();

    await page.click(removableTagCloseButton);
    await page.waitForSelector(removableTag, {
      hidden: true,
    });
  });

  it('Colored removable Tag with theme provider should change bg color on remove button hover & removed when clicked', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'removable-tag-with-theme',
      global.__BASEURL__,
    );
    const tagId = 'removableTagColor';
    const removableTag = querySelector({
      attribute: 'data-testid',
      suffixValue: tagId,
    });
    const removableTagCloseButton = querySelector({
      attribute: 'data-testid',
      prefixValue: 'close-button',
      suffixValue: tagId,
    });

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(removableTag);
    const beforeClickingRemoveButton = await takeElementScreenShot(
      page,
      removableTag,
    );
    expect(beforeClickingRemoveButton).toMatchProdImageSnapshot();

    await page.hover(removableTagCloseButton);
    const onRemoveButtonHover = await takeElementScreenShot(page, removableTag);
    expect(onRemoveButtonHover).toMatchProdImageSnapshot();

    await page.click(removableTagCloseButton);
    await page.waitForSelector(removableTag, {
      hidden: true,
    });
  });
});
