import {
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('AvatarItem', () => {
  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'avatar',
      'basicAvatarItem',
      global.__BASEURL__,
    );

    await global.page.goto(url);

    expect(
      await takeElementScreenShot(
        global.page,
        '[data-testid="avataritem0--itemInner"]',
      ),
    ).toMatchProdImageSnapshot();
  });
});
