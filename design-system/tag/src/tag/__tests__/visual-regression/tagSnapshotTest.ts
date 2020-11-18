import {
  getExampleUrl,
  loadPage,
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
      'basicTag',
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

  it('Linked tag appearance on hover should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'basicTag',
      global.__BASEURL__,
    );
    const linkTag = querySelector({
      attribute: 'data-testid',
      suffixValue: 'linkTag',
    });
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(linkTag);
    await page.hover(linkTag);
    const image = await takeElementScreenShot(page, linkTag);
    expect(image).toMatchProdImageSnapshot();
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

    const image = await takeElementScreenShot(page, removableTag);
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
      'textMaxLength',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    const image = await takeElementScreenShot(page, '#maxLengthTag');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Linked tag with theme provider on hover should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'simpleTag-with-theme',
      global.__BASEURL__,
    );
    const linkTag = querySelector({
      attribute: 'data-testid',
      suffixValue: 'linkTag',
    });
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(linkTag);
    await page.hover(linkTag);
    const image = await takeElementScreenShot(page, linkTag);
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
