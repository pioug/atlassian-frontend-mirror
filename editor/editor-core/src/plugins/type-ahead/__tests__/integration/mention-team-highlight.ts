import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import { Node } from 'prosemirror-model';
import {
  fullpage,
  editable,
  getDocFromElement,
  setProseMirrorTextSelection,
} from '../../../../__tests__/integration/_helpers';
import { doc, p, mention } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { WebDriverPage } from '../../../../__tests__/__helpers/page-objects/_types';
import { mentionSearch } from '../../../../__tests__/__helpers/page-objects/_mention';

const spaceAtEnd = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
  ],
};

const TYPE_AHEAD_MENU_LIST = `[aria-label="Popup"] [role="listbox"]`;
const MENTION_HIGHLIGHT_LINK = `.fabric-editor-typeahead a`;
const MENTION_HIGHLIGHT_CLOSE_BUTTON = `.fabric-editor-typeahead [aria-label="Close"]`;
describe('mention: Team Highlight on TypeAhead', () => {
  const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await page.refresh();

    await page.clearLocalStorage();

    await mountEditor(
      page,
      {
        appearance: fullpage.appearance,
        defaultValue: adf,
      },
      {
        providers: {
          mentionProviderWithTeamHighlight: true,
        },
      },
    );

    // Set selection after the space at end
    await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });
    return page;
  };

  describe('when the user clicks at the close icon at the team highligh', () => {
    BrowserTestCase(
      'it should not close the typeahead popup',
      {},
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);

        await mentionSearch(page, '');
        await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

        await page.waitForVisible(MENTION_HIGHLIGHT_CLOSE_BUTTON);
        await page.click(MENTION_HIGHLIGHT_CLOSE_BUTTON);

        const isPopupVisible = await page.waitForVisible(TYPE_AHEAD_MENU_LIST);
        expect(isPopupVisible).toBeTruthy();
      },
    );

    BrowserTestCase(
      'it should not change the typing focus',
      {},
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);

        await mentionSearch(page, '');
        await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

        await page.waitForVisible(MENTION_HIGHLIGHT_CLOSE_BUTTON);
        await page.click(MENTION_HIGHLIGHT_CLOSE_BUTTON);

        await page.keys('C');
        await page.keys('a');
        await page.keys('r');
        await page.keys('Enter');

        const expectedDocument = doc(
          // prettier-ignore
          p(
            ' ',
            mention({
              id: '0',
              text: '@Carolyn',
              accessLevel: '',
            })(),
            ' ',
          ),
        );

        const jsonDocument = await page.$eval(editable, getDocFromElement);
        const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
        expect(pmDocument).toEqualDocument(expectedDocument);
      },
    );
  });

  describe('when the user clicks at the team highlight external link', () => {
    BrowserTestCase(
      'it should not close the typeahead popup',
      {},
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);

        await mentionSearch(page, '');
        await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

        const titlePage = await page.title();

        await page.waitForVisible(MENTION_HIGHLIGHT_LINK);
        await page.click(MENTION_HIGHLIGHT_LINK);

        await page.switchWindow(titlePage);

        const isPopupVisible = await page.waitForVisible(TYPE_AHEAD_MENU_LIST);
        expect(isPopupVisible).toBeTruthy();
      },
    );

    BrowserTestCase(
      'it should open a new window',
      {},
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);

        await mentionSearch(page, '');
        await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

        const oldHandles = await page.getWindowHandles();

        const titlePage = await page.title();

        await page.waitForVisible(MENTION_HIGHLIGHT_LINK);
        await page.click(MENTION_HIGHLIGHT_LINK);

        await page.switchWindow(titlePage);

        const newHandles = await page.getWindowHandles();

        expect(newHandles.length).toBeGreaterThan(oldHandles.length);
      },
    );
  });
});
