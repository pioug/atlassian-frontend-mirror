import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/visual-regression/helper';
import { Props } from '../../ui/Renderer';
import { selectors } from './page-objects/_renderer';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { ThemeModes } from '@atlaskit/theme';
import { GasPurePayload } from '@atlaskit/analytics-gas-types';

export type RendererPropsOverrides = { [T in keyof Props]?: Props[T] } & {
  showSidebar?: boolean;
  withRendererActions?: boolean;
  mockInlineComments?: boolean;
  themeMode?: ThemeModes;
};

export async function mountRenderer(
  page: Page,
  props?: RendererPropsOverrides,
  adf?: Object,
) {
  await page.waitForSelector('#renderer-container');
  await page.executeAsync(
    (props, adf, done: () => void) => {
      function waitAndCall() {
        let win = window as any;
        if (win.__mountRenderer) {
          win.__mountRenderer(props, adf);
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
    adf,
  );
  await page.waitForSelector(selectors.container, { timeout: 500 });
}

export async function getEvents(page: Page): Promise<GasPurePayload[]> {
  return page.execute(() => (window as any).__analytics.events);
}

export async function goToRendererTestingExample(
  client: ConstructorParameters<typeof Page>[0],
) {
  const page = new Page(client);
  const currentUrl = await page.url();
  const url = getExampleUrl(
    'editor',
    'renderer',
    'testing',
    // @ts-ignore
    global.__BASEURL__,
  );

  if (currentUrl !== url) {
    await page.goto(url);
  }

  await page.maximizeWindow();

  return page;
}
