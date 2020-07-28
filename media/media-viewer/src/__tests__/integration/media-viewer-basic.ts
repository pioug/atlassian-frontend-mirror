import { BetaBrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/visual-regression/helper';
import { MediaViewerPageObject } from '@atlaskit/media-integration-test-helpers';
import { sleep } from '@atlaskit/media-test-helpers';

type WebDriverIOBrowser = ConstructorParameters<typeof Page>[0];

const executeTimes = async (n: number, callback: () => Promise<any>) => {
  for (let i = 0; i < n; i++) {
    await callback();
  }
};

const openMediaViewer = async (client: WebDriverIOBrowser) => {
  const url = getExampleUrl(
    'media',
    'media-viewer',
    'mocked-viewer',
    // @ts-ignore
    global.__BASEURL__,
  );
  const mediaViewer = new MediaViewerPageObject(client);
  await mediaViewer.goto(url);
  await mediaViewer.init();
  await sleep(500);
  return mediaViewer;
};

BetaBrowserTestCase(
  'media-viewer-basic.ts: Navigation should navigate back and forth',
  { skip: ['edge'] },
  async (client: WebDriverIOBrowser) => {
    const mediaViewer = await openMediaViewer(client);
    await mediaViewer.validateMediaCard({
      name: 'media-test-file-2.jpg',
      size: '16 KB',
      type: 'image',
      icon: 'image',
    });

    await mediaViewer.navigateNext();
    await mediaViewer.validateMediaCard({
      name: 'media-test-file-3.png',
      size: '88 KB',
      type: 'image',
      icon: 'image',
    });

    await executeTimes(2, () => mediaViewer.navigatePrevious());
    await mediaViewer.validateMediaCard({
      name: 'media-test-file-1.png',
      size: '158 B',
      type: 'image',
      icon: 'image',
    });

    await executeTimes(3, () => mediaViewer.navigateNext());
    await mediaViewer.validateMediaCard({
      name:
        'https://wac-cdn.atlassian.com/dam/jcr:616e6748-ad8c-48d9-ae93-e49019ed5259/Atlassian-horizontal-blue-rgb.svg',
      size: null,
      type: 'image',
      icon: 'image',
    });
  },
);

BetaBrowserTestCase(
  'media-viewer-basic.ts: Should close on Close click',
  { skip: ['edge'] },
  async (client: ConstructorParameters<typeof Page>[0]) => {
    const mediaViewer = await openMediaViewer(client);
    await mediaViewer.closeMediaViewer(false);
  },
);

BetaBrowserTestCase(
  'media-viewer-basic.ts: Should close on Escape press',
  { skip: ['edge'] },
  async (client: ConstructorParameters<typeof Page>[0]) => {
    const mediaViewer = await openMediaViewer(client);
    await mediaViewer.closeMediaViewer(true);
  },
);
