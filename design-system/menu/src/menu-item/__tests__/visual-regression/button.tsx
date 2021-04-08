import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import {
  focus,
  hover,
  mouseDown,
  verifyElementIn,
} from '../../../__tests__/_helper';

const buttonLink = "[data-testid='item-button']";
const buttonLinkAtScale = "[data-testid='item-button-at-scale']";
const buttonLinkAtScaleMultipleLineTitle =
  "[data-testid='item-button-at-scale-multiple-line-title']";
const buttonLinkAtScaleMultipleLineTitleAndDescription =
  "[data-testid='item-button-at-scale-multiple-line-title-and-description']";
const buttonLinkAtScaleBeforeAfter =
  "[data-testid='item-button-at-scale-before-after']";
const buttonLinkDisabled = "[data-testid='item-button-disabled']";
const buttonLinkSelected = "[data-testid='item-button-selected']";
const buttonLinkBefore = "[data-testid='item-button-before']";
const buttonLinkAfter = "[data-testid='item-button-after']";
const buttonLinkBeforeAfter = "[data-testid='item-button-before-after']";
const buttonLinkDescription = "[data-testid='item-button-description']";

const url = getExampleUrl(
  'design-system',
  'menu',
  'item-variations',
  global.__BASEURL__,
);

const verifyElementMatchProductionImage = verifyElementIn(url);

describe('<ButtonItem />', () => {
  it('should match the default state', async () => {
    await verifyElementMatchProductionImage(buttonLink);
  });

  it('should match the hovered state', async () => {
    await verifyElementMatchProductionImage(buttonLink, hover(buttonLink));
  });

  it('should match the clicked state', async () => {
    await verifyElementMatchProductionImage(buttonLink, mouseDown(buttonLink));
  });

  it('should match the focused state', async () => {
    await verifyElementMatchProductionImage(buttonLink, focus(buttonLink));
  });

  it('should match item with before element', async () => {
    await verifyElementMatchProductionImage(buttonLinkBefore);
  });

  it('should match item with after element', async () => {
    await verifyElementMatchProductionImage(buttonLinkAfter);
  });

  it('should match item with before & after element', async () => {
    await verifyElementMatchProductionImage(buttonLinkBeforeAfter);
  });

  it('should match disabled item', async () => {
    await verifyElementMatchProductionImage(buttonLinkDisabled);
  });

  it('should match disabled item in focused state', async () => {
    await verifyElementMatchProductionImage(
      buttonLinkDisabled,
      focus(buttonLinkDisabled),
    );
  });

  it('should match selected item', async () => {
    await verifyElementMatchProductionImage(buttonLinkSelected);
  });

  it('should match item with description', async () => {
    await verifyElementMatchProductionImage(buttonLinkDescription);
  });

  it('should match item with lots of text', async () => {
    await verifyElementMatchProductionImage(buttonLinkAtScale);
  });

  it('should match item with lots of text - wrap text', async () => {
    await verifyElementMatchProductionImage(buttonLinkAtScaleMultipleLineTitle);
  });

  it('should match item with lots of text - wrap title and description', async () => {
    await verifyElementMatchProductionImage(
      buttonLinkAtScaleMultipleLineTitleAndDescription,
    );
  });

  it('should match item with lots of text with before and after icon', async () => {
    await verifyElementMatchProductionImage(buttonLinkAtScaleBeforeAfter);
  });
});
