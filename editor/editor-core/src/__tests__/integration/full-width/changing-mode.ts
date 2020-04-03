import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  setProseMirrorTextSelection,
  updateEditorProps,
} from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

import { mediumSizeDoc } from './__fixtures__/medium-document';

BrowserTestCase(
  'Should transition successfully, without error, when a selection over react nodes exists',
  // `page.checkConsoleErrors` only runs on Chrome so we skip all other browsers.
  { skip: ['ie', 'edge', 'safari', 'firefox'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(mediumSizeDoc),
      allowTables: {
        advanced: true,
      },
      allowLayouts: {
        allowBreakout: true,
        UNSAFE_addSidebarLayouts: true,
      },
    });

    await setProseMirrorTextSelection(page, { anchor: 314, head: 308 });
    await updateEditorProps(page, { appearance: 'full-width' });

    // Chrome only check
    await page.checkConsoleErrors();
  },
);
