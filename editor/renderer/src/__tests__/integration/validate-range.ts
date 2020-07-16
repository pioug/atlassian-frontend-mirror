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
} from './__fixtures__/validation-fixtures';

const CHAR_WIDTH = 6;

BrowserTestCase(
  `A selection containing text and media validates true`,
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { withRendererActions: true },
      paragraphsWithMedia,
    );

    await page.simulateUserSelection(
      `${selectors.document} > p:first-child`,
      `${selectors.document} > p:nth-child(3)`,
      element => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await validateRange(page);
    expect(result).toEqual(true);
  },
);

BrowserTestCase(
  `A selection containing text and mention validates false`,
  { skip: ['edge', 'firefox'] },
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
      element => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await validateRange(page);
    expect(result).toEqual(false);
  },
);

BrowserTestCase(
  `A selection containing text and emoji validates false`,
  { skip: ['edge', 'firefox'] },
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
      element => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await validateRange(page);
    expect(result).toEqual(false);
  },
);

BrowserTestCase(
  `A selection containing text and status validates false`,
  { skip: ['edge', 'firefox'] },
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
      element => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await validateRange(page);
    expect(result).toEqual(false);
  },
);
