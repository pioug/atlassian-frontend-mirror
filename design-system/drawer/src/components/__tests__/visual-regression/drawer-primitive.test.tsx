import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

import { transitionDurationMs } from '../../../constants';

const url = getExampleUrl(
  'design-system',
  'drawer',
  'drawer-testing',
  global.__BASEURL__,
);

const showButtonSelector = '[data-testid="show-button"]';
const drawerSelector = '[data-testid="drawer"]';
const closeButtonSelector = '[data-testid="DrawerPrimitiveSidebarCloseButton"]';

const timeStampList = [
  (0 / 4) * transitionDurationMs,
  (1 / 4) * transitionDurationMs,
  (2 / 4) * transitionDurationMs,
  (3 / 4) * transitionDurationMs,
  (4 / 4) * transitionDurationMs,
];

describe('Blanket', () => {
  describe('animation', () => {
    it.skip.each(timeStampList)(
      'should fade in correctly (timeStamp = %dms)',
      async (timeStamp: number) => {
        const { page } = global;
        await loadPage(page, url, {
          allowedSideEffects: { animation: true, transition: true },
        });

        await page.waitForSelector(showButtonSelector);
        await page.click(showButtonSelector);

        await page.waitForSelector(drawerSelector);
        const drawer = await page.$(drawerSelector);
        await page.evaluate(
          (drawer: HTMLElement, timeStamp: number) => {
            // @ts-ignore-next-line typecheck fails on CI even though the types are correct.
            const animationList = drawer.getAnimations({ subtree: true });
            if (animationList.length === 0) {
              throw new Error(
                `Animations are empty when pausing. Opacity = ${
                  window.getComputedStyle(drawer).opacity
                }`,
              );
            }
            animationList.forEach((animation) => {
              animation.pause();
              animation.currentTime = timeStamp;
            });
          },
          drawer,
          timeStamp,
        );

        const image = await page.screenshot();
        expect(image).toMatchProdImageSnapshot();
      },
    );

    // FIXME: This test was automatically skipped due to failure on 08/08/2022: https://product-fabric.atlassian.net/browse/DSP-6228
    it.skip.each(timeStampList)(
      'should fade out correctly (timeStamp = %dms)',
      async (timeStamp: number) => {
        const { page } = global;
        await loadPage(page, url, {
          allowedSideEffects: { animation: true, transition: true },
        });

        await page.waitForSelector(showButtonSelector);
        await page.click(showButtonSelector);

        await page.waitForSelector(drawerSelector);
        const drawer = await page.$(drawerSelector);
        await page.evaluate((drawer: HTMLElement) => {
          // @ts-ignore-next-line typecheck fails on CI even though the types are correct.
          const animationList = drawer.getAnimations({ subtree: true });
          if (animationList.length === 0) {
            throw new Error(
              `Animations are empty when pausing. Opacity = ${
                window.getComputedStyle(drawer).opacity
              }`,
            );
          }
          animationList.forEach((animation) => {
            animation.currentTime = Number.MAX_SAFE_INTEGER;
          });
        }, drawer);

        await page.click(closeButtonSelector);
        await page.evaluate(
          (drawer: HTMLElement, timeStamp: number) => {
            // @ts-ignore-next-line typecheck fails on CI even though the types are correct.
            const animationList = drawer.getAnimations({ subtree: true });
            if (animationList.length === 0) {
              throw new Error(
                `Animations are empty when pausing. Opacity = ${
                  window.getComputedStyle(drawer).opacity
                }`,
              );
            }
            animationList.forEach((animation) => {
              animation.pause();
              animation.currentTime = timeStamp;
            });
          },
          drawer,
          timeStamp,
        );

        const image = await page.screenshot();
        expect(image).toMatchProdImageSnapshot({
          failureThreshold: '0.64',
          failureThresholdType: 'percent',
        });
      },
    );
  });
});
