import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { fullpage } from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import matchCaseAdf from './__fixtures__/match-case-adf.json';
import {
  findReplaceSelectors,
  findText,
  toggleMatchCase,
} from '../../../../__tests__/__helpers/page-objects/_find-replace';

const openFindReplace = async (
  client: any,
  adf: string,
  allowMatchCase: boolean,
) => {
  const page = await goToEditorTestingWDExample(client);
  await mountEditor(page, {
    appearance: fullpage.appearance,
    defaultValue: adf,
    allowFindReplace: allowMatchCase ? { allowMatchCase: true } : true,
    // we enable expand and panel to test text searches inside nested elements
    allowExpand: true,
    allowPanel: true,
  });
  await page.click(findReplaceSelectors.toolbarButton);
  await page.waitForSelector(findReplaceSelectors.findInput);
  if (allowMatchCase) {
    await page.waitForSelector(findReplaceSelectors.matchCaseButton);
  }
  return { page };
};

BrowserTestCase(
  'match-case.ts: should hide Match Case button if "allowMatchCase" feature flag is not explicitly toggled on',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const { page } = await openFindReplace(client, matchCaseAdf, false);
    const matchCaseBtn = await page.$(findReplaceSelectors.matchCaseButton);
    expect(await matchCaseBtn.isExisting()).toBe(false);
  },
);

BrowserTestCase(
  'match-case.ts: should initially start with Match Case button toggled off',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const { page } = await openFindReplace(client, matchCaseAdf, true);
    const matchCaseBtn = await page.$(findReplaceSelectors.matchCaseButton);
    const pressed = await matchCaseBtn.getAttribute('aria-pressed');
    expect(pressed).toBe('false');
  },
);

BrowserTestCase(
  'match-case.ts: find with Match Case button toggled off should find all results, ignoring case',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const { page } = await openFindReplace(client, matchCaseAdf, true);
    await findText(page, 'HELLO');
    const matches = await page.$$(findReplaceSelectors.decorations);
    expect(matches.length).toBe(9);
  },
);

BrowserTestCase(
  'match-case.ts: find with Match Case button toggled on should find results that exactly match case',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const { page } = await openFindReplace(client, matchCaseAdf, true);
    await toggleMatchCase(page, true);
    await findText(page, 'HELLO');
    const matches = await page.$$(findReplaceSelectors.decorations);
    expect(matches.length).toBe(3);
  },
);
