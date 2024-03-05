import { expect, type Locator, type Page } from '@af/integration-testing';
type validationParameters = {
  name: string;
  size: string | null;
  type: string;
  icon: string;
};

export class MediaViewerPageObject {
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly closeButton: Locator;
  readonly sidebarButton: Locator;
  readonly sidepannelContent: Locator;
  readonly fileName: Locator;
  readonly fileType: Locator;
  readonly size: Locator;
  readonly icon: Locator;
  readonly wrapper: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly zoomOut: Locator;

  constructor(readonly page: Page) {
    this.nextButton = page.locator(
      '[data-testid="media-viewer-navigation-next"]',
    );
    this.prevButton = page.locator(
      '[data-testid="media-viewer-navigation-prev"]',
    );
    this.closeButton = page.locator(
      '[data-testid="media-viewer-close-button"]',
    );
    this.sidebarButton = page.locator(
      '[data-testid="media-viewer-sidebar-button"]',
    );
    this.sidepannelContent = page.locator(
      '[data-testid="media-viewer-sidebar-content"]',
    );
    this.fileName = page.locator(`[data-testid="media-viewer-file-name"]`);
    this.fileType = page.locator(
      `[data-testid="media-viewer-file-metadata-text"] span`,
    );
    this.size = page.locator(`[data-testid="media-viewer-file-metadata-text"]`);
    this.icon = page.locator(`[data-testid="media-viewer-file-type-icon"]`);
    this.wrapper = page.locator('[data-testid="media-viewer-popup"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.zoomOut = page.locator('span[aria-label="zoom out"]');
  }

  init = async (exampleId: string) => {
    await this.page.visitExample('media', 'media-viewer', exampleId);
    await this.wrapper.waitFor({ state: 'attached' });
  };

  validateMediaCard = async ({
    name,
    size,
    type,
    icon,
  }: validationParameters) => {
    await expect(this.fileName).toContainText(name);
    await expect(this.fileType).toContainText(type);
    if (size) {
      await expect(this.size).toContainText(size);
    }
    await expect(this.icon).toHaveAttribute('data-type', icon);
  };

  navigateNext = async (times = 1) => {
    for (let i = 0; i < times; i++) {
      await this.nextButton.click();
    }
  };

  navigatePrevious = async (times = 1) => {
    for (let i = 0; i < times; i++) {
      await this.prevButton.click();
    }
  };

  closeMediaViewer = async (closeWithEsc: boolean) => {
    if (closeWithEsc) {
      await this.wrapper.press('Escape');
    } else {
      await this.closeButton.click();
    }
    await this.wrapper.waitFor({ state: 'detached' });
  };

  openSidebar = async () => {
    await this.sidebarButton.click();
    await this.sidepannelContent.waitFor({ state: 'attached' });
  };

  closeSidebar = async () => {
    await this.page.getByLabel('Close panel').click();
    await this.sidepannelContent.waitFor({ state: 'detached' });
  };
}
