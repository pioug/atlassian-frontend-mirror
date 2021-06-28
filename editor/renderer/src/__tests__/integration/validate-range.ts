import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountRenderer,
  goToRendererTestingExample,
} from '../__helpers/testing-example-helpers';
import { selectors } from '../__helpers/page-objects/_renderer';
import { validateRange } from '../__helpers/page-objects/_actions';
import {
  paragraphsWithMedia,
  paragraphWithInlineNodes,
  paragraphWithoutInlineNodes,
} from './__fixtures__/validation-fixtures';

const CHAR_WIDTH = 6;
// TODO: https://product-fabric.atlassian.net/browse/ED-9831
// Selection in Catalina Safari isn't working properly.
BrowserTestCase(
  `A selection containing text and media validates false`,
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: WebdriverIO.BrowserObject) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { withRendererActions: true },
      paragraphsWithMedia,
    );

    await page.simulateUserSelection(
      `${selectors.document} > p:first-child`,
      `${selectors.document} > p:nth-child(3)`,
      (element) => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await validateRange(page);
    expect(result).toEqual(false);
  },
);

BrowserTestCase(
  `A selection containing text and mention validates false`,
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { withRendererActions: true },
      paragraphWithInlineNodes,
    );

    await page.simulateUserSelection(
      `${selectors.document} > p:first-child`,
      `${selectors.document} > p:first-child`,
      (element) => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await validateRange(page);
    expect(result).toEqual(false);
  },
);

BrowserTestCase(
  `A selection containing text and emoji validates false`,
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { withRendererActions: true },
      paragraphWithInlineNodes,
    );

    await page.simulateUserSelection(
      `${selectors.document} > p:nth-child(2)`,
      `${selectors.document} > p:nth-child(2)`,
      (element) => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await validateRange(page);
    expect(result).toEqual(false);
  },
);

BrowserTestCase(
  `A selection containing text and status validates false`,
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { withRendererActions: true },
      paragraphWithInlineNodes,
    );

    await page.simulateUserSelection(
      `${selectors.document} > p:nth-child(3)`,
      `${selectors.document} > p:nth-child(3)`,
      (element) => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await validateRange(page);
    expect(result).toEqual(false);
  },
);

BrowserTestCase(
  `A full line selection with inline nodes validates false`,
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: WebdriverIO.BrowserObject) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { withRendererActions: true },
      paragraphWithInlineNodes,
    );

    const bounds = await page.getBoundingRect(
      `${selectors.document} > p:first-child`,
    );

    // select exactly one line while releasing mouse on the same x level
    // so that start and end of the selection range would both be 0
    await page.simulateUserDragAndDrop(
      bounds.left + 1,
      bounds.top + 1,
      bounds.left + 1,
      bounds.height + 1,
    );

    const result = await validateRange(page);

    expect(result).toEqual(false);
  },
);

BrowserTestCase(
  `A full line selection without inline nodes validates true`,
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: WebdriverIO.BrowserObject) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { withRendererActions: true },
      paragraphWithoutInlineNodes,
    );

    const bounds = await page.getBoundingRect(
      `${selectors.document} > p:first-child`,
    );

    // select exactly one line while releasing mouse on the same x level
    // so that start and end of the selection range would both be 0
    await page.simulateUserDragAndDrop(
      bounds.left + 1,
      bounds.top + 1,
      bounds.left + 1,
      bounds.height + 1,
    );

    const result = await validateRange(page);

    expect(result).toEqual(true);
  },
);
