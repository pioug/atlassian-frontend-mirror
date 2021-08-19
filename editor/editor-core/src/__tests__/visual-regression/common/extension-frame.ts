import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import extensionFrame from './__fixtures__/extension-frame.adf.json';

describe('Extension frame:', () => {
  const initEditor = async (
    adf: Object,
    appearance: Appearance,
    viewport:
      | {
          width: number;
          height: number;
        }
      | undefined = { width: 1040, height: 800 },
  ) => {
    await initEditorWithAdf(page, {
      withTestExtensionProviders: {
        extensionFrameManifest: true,
      },
      appearance,
      viewport,
      editorProps: {
        allowExtension: {
          // trigger extension providers scaffolding
          allowExtendFloatingToolbars: true,
        },
      },
      adf,
    });
  };

  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('should render extensions marked with `__hideFrame`', async () => {
    await initEditor(extensionFrame, Appearance.fullPage);
    await page.$$('[data-frameless-list-id]');
    await snapshot(page);
  });

  it('should always render frames for mobile appearance', async () => {
    await initEditor(extensionFrame, Appearance.mobile);
    await page.$$('[data-frameless-list-id]');
    await snapshot(page);
  });
});
