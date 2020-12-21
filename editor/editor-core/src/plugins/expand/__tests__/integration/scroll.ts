import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  setProseMirrorTextSelection,
  animationFrame,
} from '../../../../__tests__/integration/_helpers';
import { expandClassNames } from '../../ui/class-names';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import longExpand from './__fixtures__/long-expand.json';

const getScrollTop = async (client: any) =>
  await client.execute(() => {
    const el = document.querySelector(
      '.fabric-editor-popup-scroll-parent',
    ) as HTMLElement;
    return el.scrollTop;
  });

BrowserTestCase(
  'scroll.ts: Page should not scroll while editing expand title',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: longExpand,
      allowExpand: true,
    });

    // Set selection to last line of expand
    // Note, this is dependent on using the longExpand fixture
    await setProseMirrorTextSelection(page, { anchor: 381, head: 381 });

    const startScrollPos = await getScrollTop(client);

    await page.type(`.${expandClassNames.titleInput}`, 'a');
    await animationFrame(page);

    const newScrollPos = await getScrollTop(client);
    expect(newScrollPos).toEqual(startScrollPos);
  },
);
