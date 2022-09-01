import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import { fullpage, setProseMirrorTextSelection } from '../../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../__helpers/testing-example-helpers';
import { WebDriverPage } from '../../../__helpers/page-objects/_types';
import { onlyOneChar } from '../__fixtures__/base-adfs';

export const addBodyListener = (done: any) => {
  document.addEventListener('keydown', () => {
    const elem = document.createElement('div');
    elem.setAttribute('data-testid', 'bubble');
    document.body.appendChild(elem);
  });
  done(true);
};

const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
  const page = await goToEditorTestingWDExample(client);

  await mountEditor(page, {
    appearance: fullpage.appearance,
    defaultValue: adf,
    allowStatus: true,
    allowTextColor: true,
    allowDate: true,
    allowTextAlignment: true,
  });

  return page;
};

/**
 * Configure escape keydown suite.
 */
type KeydownSuiteOptions = {
  /**
   * @param {any} adf value to setup editor.
   */
  adf?: any;
  /**
   * @param {function} openMenu to open menu being tested. Returns a Promise.
   */
  openMenu: (page: WebDriverPage) => Promise<void>;
};

/**
 * Helper to check correct escape keydown event bubbling. When a menu is open, escape
 * keydown should not bubble past .akEditor.
 *
 * @param {KeydownSuiteOptions} config Configure escape keydown suite.
 */
export function runEscapeKeydownSuite({ openMenu, adf }: KeydownSuiteOptions) {
  describe('escape keydown', () => {
    BrowserTestCase(
      'escape keydown event should not bubble to document when menu open',
      {},
      async (client: any, testName: string) => {
        const page = await startEditor(client, adf || onlyOneChar);

        await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });
        await page.keys(' ');

        await openMenu(page);

        await page.executeAsync(addBodyListener);

        await page.keys(['Escape']);
        expect(await page.isExisting('[data-testid="bubble"]')).toBe(false);

        await page.keys(['Escape']);
        expect(await page.isExisting('[data-testid="bubble"]')).toBe(true);
      },
    );
  });
}
