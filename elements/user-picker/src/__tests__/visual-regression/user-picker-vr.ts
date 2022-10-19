import {
  disableCaretCursor,
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

describe('UserPicker VR Snapshot Test', () => {
  async function vrForExample(
    exampleName: string,
    optionalSetup?: (page: PuppeteerPage) => Promise<void>,
  ) {
    const page: PuppeteerPage = global.page;
    await loadPage(
      page,
      getExampleUrl('elements', 'user-picker', exampleName, global.__BASEURL__),
    );
    if (optionalSetup) {
      await optionalSetup(page);
    }
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  }

  function inputTypingFactory(inputText: string) {
    return async (page: PuppeteerPage) => {
      await disableCaretCursor(page);
      await page.focus('#react-select-example-input');
      await page.type('#react-select-example-input', inputText);
    };
  }

  describe('single user picker', () => {
    it('standard', async () => {
      await vrForExample('single');
    });

    it('compact', async () => {
      await vrForExample('single-compact');
    });

    it('subtle', async () => {
      await vrForExample('single-subtle');
    });

    it('subtle and compact', async () => {
      await vrForExample('single-subtle-and-compact');
    });

    describe('when focused', () => {
      it('shows default results', async () => {
        await vrForExample('single', inputTypingFactory(''));
      });

      it('shows "team" results', async () => {
        await vrForExample('single', inputTypingFactory('team'));
      });

      it('shows "group" results', async () => {
        await vrForExample('single', inputTypingFactory('group'));
      });

      it('shows "custom" results', async () => {
        await vrForExample('single', inputTypingFactory('custom'));
      });

      it('shows "unassigned" result', async () => {
        await vrForExample('single', inputTypingFactory('unassigned'));
      });
    });
  });

  describe('multi user picker', () => {
    it('standard', async () => {
      await vrForExample('multi');
    });

    it('compact', async () => {
      await vrForExample('multi-compact');
    });

    it('with default values', async () => {
      await vrForExample('multi-with-default-values');
    });
  });
});
