import { expect, test } from '@af/integration-testing';
import { MediaViewerPageObject } from '../utils/_mediaViewerPageObject';

test.describe('media viewer password protected pdf', () => {
  test('password input success test', async ({ page }) => {
    const viewer = new MediaViewerPageObject(page);
    await viewer.init('vr-password-protected-pdf');
    await expect(viewer.fileName).toContainText('password protected.pdf');
    await expect(viewer.fileType).toContainText('document');
    await expect(viewer.size).toContainText('694 KB');
    await viewer.passwordInput.waitFor({ state: 'visible' });
    await viewer.passwordInput.fill('123');
    await viewer.submitButton.click();
    await viewer.zoomOut.waitFor({ state: 'visible' });
    await expect(page.getByText('Keep this somewhere')).toBeVisible();
  });

  test('password input fail test', async ({ page }) => {
    const viewer = new MediaViewerPageObject(page);
    await viewer.init('vr-password-protected-pdf');
    await viewer.passwordInput.fill('1234');
    await viewer.submitButton.click();
    await expect(
      page.getByText('Incorrect password. Please try again.'),
    ).toBeVisible();
  });
});
