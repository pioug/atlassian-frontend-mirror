import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

import { transitionDurationMs } from '../../../constants';

const url = getExampleUrl(
  'design-system',
  'drawer',
  'blanket-testing',
  global.__BASEURL__,
);

const showButtonSelector = '[data-testid="show-button"]';
const blanketSelector = '.atlaskit-portal > div';

const timeStampList = [
  (0.1 / 4) * transitionDurationMs,
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
          disabledSideEffects: { animation: true, transition: true },
        });

        await page.waitForSelector(showButtonSelector);
        const showButton = await page.$(showButtonSelector);

        await page.evaluate(
          (
            showButton: HTMLElement,
            blanketSelector: string,
            timeStamp: number,
          ) => {
            showButton.click();

            const blanket = document.querySelector(blanketSelector);
            if (blanket === null) {
              throw new Error('blanket not found');
            }

            /**
             * This timeout is necessary to ensure that the animation exists.
             *
             * Transition instances of Animation only exist during transitions.
             */
            setTimeout(() => {
              // @ts-ignore-next-line typecheck fails on CI even though the types are correct.
              const animationList = blanket.getAnimations({ subtree: true });
              if (animationList.length === 0) {
                throw new Error(
                  `Animations are empty when pausing. Opacity = ${
                    window.getComputedStyle(blanket).opacity
                  }`,
                );
              }
              animationList.forEach((animation) => {
                animation.pause();
                animation.currentTime = timeStamp;
              });
            }, 0);
          },
          showButton,
          blanketSelector,
          timeStamp,
        );

        const image = await page.screenshot();
        expect(image).toMatchProdImageSnapshot();
      },
    );

    it.skip.each(timeStampList)(
      'should fade out correctly (timeStamp = %dms)',
      async (timeStamp: number) => {
        const { page } = global;
        await loadPage(page, url, {
          disabledSideEffects: { animation: true, transition: true },
        });

        await page.waitForSelector(showButtonSelector);
        const showButton = await page.$(showButtonSelector);

        await page.evaluate(
          (
            showButton: HTMLElement,
            blanketSelector: string,
            transitionDurationMs: number,
          ) => {
            showButton.click();

            const blanket = document.querySelector(blanketSelector);
            if (blanket === null) {
              throw new Error('blanket not found');
            }

            return new Promise<void>((resolve) => {
              setTimeout(() => {
                // @ts-ignore-next-line typecheck fails on CI even though the types are correct.
                const animationList = blanket.getAnimations({ subtree: true });
                const { opacity } = window.getComputedStyle(blanket);
                if (animationList.length === 0 && opacity !== '1') {
                  throw new Error(
                    `Animations are empty when pausing. Opacity = ${opacity}`,
                  );
                }
                animationList.forEach((animation) => {
                  animation.currentTime = Number.MAX_SAFE_INTEGER;
                });

                resolve();
              }, 0);
            });
          },
          showButton,
          blanketSelector,
          transitionDurationMs,
        );

        await page.evaluate(
          (blanketSelector: string, timeStamp: number) => {
            const blanket =
              document.querySelector<HTMLElement>(blanketSelector);
            if (blanket === null) {
              throw new Error('blanket not found');
            }

            // @ts-ignore-next-line typecheck fails on CI even though the types are correct.
            if (blanket.getAnimations({ subtree: true }).length > 0) {
              throw new Error(
                `Animations are NOT empty when should be.... Opacity = ${
                  window.getComputedStyle(blanket).opacity
                }`,
              );
            }

            const blanketChild =
              blanket.firstElementChild as HTMLElement | null;
            if (blanketChild === null) {
              throw new Error('blanket child should not be null');
            }
            blanketChild.click();

            setTimeout(() => {
              // @ts-ignore-next-line typecheck fails on CI even though the types are correct.
              const animationList = blanket.getAnimations({ subtree: true });
              if (animationList.length === 0) {
                throw new Error(
                  `Animations are empty when pausing. 22 Opacity = ${
                    window.getComputedStyle(blanket).opacity
                  }`,
                );
              }
              animationList.forEach((animation) => {
                animation.pause();
                animation.currentTime = timeStamp;
              });
            }, 0);
          },
          blanketSelector,
          timeStamp,
        );

        const image = await page.screenshot();
        expect(image).toMatchProdImageSnapshot();
      },
    );
  });
});
