import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';

import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

type BoundingRect = {
  width: number;
  height: number;
  left: number;
  top: number;
};
type Coords = {
  x: number;
  y: number;
};

BrowserTestCase(
  'MediaCard siblings can be clicked through',
  {},
  async (client: BrowserObject) => {
    const page = new Page(client);

    const url = getExampleUrl(
      'media',
      'media-card',
      'Test-Integration-surrounding-elements',
    );
    const fileCardSelector =
      '[data-testid="media-file-card-view"][data-test-status="complete"]';

    await page.goto(url);

    await page.waitForVisible(fileCardSelector);

    const {
      left: wrapperLeft,
      top: wrapperTop,
      width: wrapperWidth,
      height: wrapperHeight,
    } = await page.getBoundingRect('#wrapper');

    const cardElements = await page.$$('div[data-testid="media-card-view"]');
    const wrapperElement = await page.$('#wrapper');

    const cardRects = await Promise.all(
      cardElements.map(async (cardElement) => {
        const size = await cardElement.getSize();
        const location = await cardElement.getLocation();
        return { left: location.x, top: location.y, ...size };
      }),
    );

    const isInsideCardBounds = (
      { x, y }: Coords,
      cardElement: BoundingRect,
    ): boolean =>
      x >= cardElement.left &&
      x <= cardElement.left + cardElement.width &&
      y >= cardElement.top &&
      y <= cardElement.top + cardElement.height;

    const isInsideAnyCardBounds = (
      cardElements: BoundingRect[],
      { x, y }: Coords,
    ) => cardElements.some((card) => isInsideCardBounds({ x, y }, card));

    let actions = [];
    let clickTotal = 0;
    for (let i = 12.5; i <= 87.5; i += 12.5) {
      for (let j = 12.5; j <= 87.5; j += 12.5) {
        let yPos = Math.floor(wrapperHeight * (i / 100));
        let xPos = Math.floor(wrapperWidth * (j / 100));
        if (page.isBrowser('chrome')) {
          await wrapperElement.moveTo({ xOffset: xPos, yOffset: yPos });
          await page.click();
        }

        xPos += wrapperLeft;
        yPos += wrapperTop;

        if (!page.isBrowser('chrome')) {
          actions.push(
            {
              type: 'pointerMove',
              duration: 0,
              origin: 'viewport',
              x: xPos,
              y: yPos,
            },
            { type: 'pointerDown', button: 0 },
            { type: 'pointerUp', button: 0 },
          );
        }

        if (!isInsideAnyCardBounds(cardRects, { x: xPos, y: yPos })) {
          clickTotal++;
        }
      }
    }
    if (!page.isBrowser('chrome')) {
      await client.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'mouse' },
          actions: actions,
        },
      ]);
      await client.releaseActions();
    }
    const clickCount = await page.getText('#clickCounts');
    expect(Number(clickCount)).toEqual(clickTotal);
  },
);
