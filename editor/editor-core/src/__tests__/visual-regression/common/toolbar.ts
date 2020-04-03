import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  Device,
  deviceViewPorts,
  editorSelector,
} from '../_utils';
import { waitForNoTooltip } from '@atlaskit/visual-regression/helper';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors as selectors,
} from '../../__helpers/page-objects/_toolbar';
import { Page } from '../../__helpers/page-objects/_types';

describe('Toolbar', () => {
  let page: Page;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1000, height: 350 },
    });
  });

  afterEach(async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
    await waitForNoTooltip(page);
    await snapshot(page, undefined, editorSelector);
  });

  it('should display headings menu correctly', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.fontStyle);
  });

  it('should display text formatting menu correctly', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.moreFormatting);
  });

  it('should display text color menu correctly', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.textColor);
  });

  it('should display insert menu correctly', async () => {
    await page.setViewport({ width: 1000, height: 700 });
    await clickToolbarMenu(page, ToolbarMenuItem.insertMenu);
  });
});

describe('Toolbar: Comment', () => {
  let page: Page;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.comment,
      device: Device.iPadPro,
    });
  });

  afterEach(async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
    await waitForNoTooltip(page);
    await snapshot(page, undefined, editorSelector);
  });

  it('should display text color menu correctly at small viewport', async () => {
    await page.setViewport(deviceViewPorts[Device.iPhonePlus]);
    await clickToolbarMenu(page, ToolbarMenuItem.textColor);
  });
});
