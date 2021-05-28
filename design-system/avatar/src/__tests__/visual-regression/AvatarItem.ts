/**
 * This test is disabled due to flakiness
 * TODO: Fix flakiness DS-7541
 */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
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
      await takeElementScreenShot(global.page, '#avatar-item-examples'),
    ).toMatchProdImageSnapshot();
  });
});
