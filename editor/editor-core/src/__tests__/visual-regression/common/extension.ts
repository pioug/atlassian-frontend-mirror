import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  clickBlockMenuItem,
  BlockMenuItem,
} from '../../__helpers/page-objects/_blocks';
import { clickOnExtension } from '../../__helpers/page-objects/_extensions';
import adf from './__fixtures__/extension-wide.adf.json';

describe('Extension:', () => {
  const initEditor = async (adf?: Object) => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1040, height: 400 },
      adf,
    });
  };

  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('should insert a block extension with a selected state.', async () => {
    await initEditor();
    await clickBlockMenuItem(page, BlockMenuItem.blockExtension);
    await snapshot(page);
  });

  it('should insert a bodied extension without a selected state.', async () => {
    await initEditor();
    await clickBlockMenuItem(page, BlockMenuItem.bodiedExtension);
    await snapshot(page);
  });

  it('should display a selected ring around a breakout extension', async () => {
    await initEditor(adf);
    await clickOnExtension(
      page,
      'com.atlassian.confluence.macro.core',
      'block-eh',
    );
    await snapshot(page);
  });
});
