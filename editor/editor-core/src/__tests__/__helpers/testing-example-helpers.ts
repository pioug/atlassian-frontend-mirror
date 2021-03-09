import WebdriverPage from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/visual-regression/helper';
import { getExampleUrl as getWDExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { mediaMockQueryOptInFlag } from '@atlaskit/media-test-helpers/media-mock';
import { EditorProps } from '../../types';
import { selectors } from './page-objects/_editor';
import { MountEditorOptions } from '../../../example-helpers/create-editor-example-for-tests';
import { FullPageEditor } from './page-objects/_media';

const EDITOR_SELECTOR = selectors.editor;

export async function loadLocale(page: WebdriverPage, locales: Array<string>) {
  await page.executeAsync((locales, done) => {
    (window as any).__loadReactIntlLocale(locales, done);
  }, locales);
}

export async function mountEditor<T = EditorProps>(
  page: WebdriverPage,
  props: T,
  options?: MountEditorOptions,
  { clickInEditor = true }: { clickInEditor?: boolean } = {},
) {
  await page.waitForSelector('#editor-container');
  await page.executeAsync(
    (props: T, options: MountEditorOptions | undefined, done: () => void) => {
      function waitAndCall() {
        if ((window as any).__mountEditor) {
          (window as any).__mountEditor(props, options || {});
          done();
        } else {
          // There is no need to implement own timeout, if done() is not called on time,
          // webdriver will throw with own timeout.
          setTimeout(waitAndCall, 20);
        }
      }

      waitAndCall();
    },
    props,
    options || {},
  );
  await page.waitForSelector(EDITOR_SELECTOR, { timeout: 500 });
  if (clickInEditor) {
    await page.click(EDITOR_SELECTOR);
  }
}

export async function goToEditorTestingWDExample(
  client: ConstructorParameters<typeof WebdriverPage>[0],
) {
  const page = new WebdriverPage(client);
  const currentUrl = await page.url();
  const url = getWDExampleUrl('editor', 'editor-core', 'testing');

  if (currentUrl !== url) {
    await page.goto(url);
  }

  await page.maximizeWindow();

  return page;
}

export async function goToEditorLabsTestingExample(
  client: ConstructorParameters<typeof WebdriverPage>[0],
  appearance: 'mobile' | 'full-page' = 'full-page',
) {
  const page = new WebdriverPage(client);
  const currentUrl = await page.url();
  const url = getExampleUrl(
    'editor',
    'editor-core',
    `testing-archv3-${appearance}`,
    // @ts-ignore
    global.__BASEURL__,
  );

  if (currentUrl !== url) {
    await page.goto(url);
  }

  await page.maximizeWindow();

  return page;
}

export async function goToFullPage(
  client: ConstructorParameters<typeof WebdriverPage>[0],
) {
  const page = new FullPageEditor(client);
  const url =
    getExampleUrl(
      'editor',
      'editor-core',
      'full-page',
      // @ts-ignore
      global.__BASEURL__,
    ) + `&${mediaMockQueryOptInFlag}`;

  await page.goto(url);
  await page.maximizeWindow();
  await page.waitForSelector(EDITOR_SELECTOR, { timeout: 500 });
  await page.click(EDITOR_SELECTOR);

  return page;
}

export async function goToFullPageClickToEdit(
  client: ConstructorParameters<typeof WebdriverPage>[0],
) {
  const page = new FullPageEditor(client);
  const url =
    getExampleUrl(
      'editor',
      'editor-core',
      'full-page-click-to-edit',
      // @ts-ignore
      global.__BASEURL__,
    ) + `&${mediaMockQueryOptInFlag}`;

  await page.goto(url);
  await page.maximizeWindow();
  await page.waitForSelector(EDITOR_SELECTOR, { timeout: 500 });
  await page.click(EDITOR_SELECTOR);

  return page;
}

export async function goToFullPageWithXExtensions(
  client: ConstructorParameters<typeof WebdriverPage>[0],
) {
  const page = new FullPageEditor(client);
  const url =
    getExampleUrl(
      'editor',
      'editor-core',
      'full-page-with-x-extensions',
      // @ts-ignore
      global.__BASEURL__,
    ) + `&${mediaMockQueryOptInFlag}`;

  await page.goto(url);
  await page.maximizeWindow();
  await page.waitForSelector(EDITOR_SELECTOR, { timeout: 500 });
  await page.click(EDITOR_SELECTOR);

  return page;
}
