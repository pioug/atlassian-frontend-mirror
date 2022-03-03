import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { imageFileId } from '@atlaskit/media-test-helpers';
import { Card } from '../../root/card';
import { tallImage, createMediaStoreError } from '@atlaskit/media-test-helpers';
import { MediaClient } from '@atlaskit/media-client';
import {
  MediaCardSsrData,
  GLOBAL_MEDIA_NAMESPACE,
  GLOBAL_MEDIA_CARD_SSR,
  getKey,
} from '../../utils/globalScope';

const createMediaClient = (error?: boolean) => {
  return {
    getImageUrlSync: () => {
      if (!error) {
        return tallImage;
      }
      throw createMediaStoreError();
    },
  };
};

const createHTMLTemplate = (content: string) => `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Media Card SSR Example</title>
    ${(global as any).document.querySelector('head').innerHTML}
  </head>
  <body>${content}</body>
  </html>`;

describe('Media Card SSR', () => {
  it('should store image dataURI in global scope', async () => {
    const mediaClient = createMediaClient();
    const dimensions = { width: 300, height: 200 };
    const html = ReactDOMServer.renderToString(
      <Card
        featureFlags={{ newCardExperience: true }}
        mediaClient={(mediaClient as unknown) as MediaClient}
        identifier={imageFileId}
        dimensions={dimensions}
        ssr={'server'}
      />,
    );
    const { page } = global;
    await page.setViewport({ width: 350, height: 250 });
    await page.setContent(createHTMLTemplate(html));

    const data: MediaCardSsrData = await page.evaluate(
      (namespace, mediacardssr, dataKey) =>
        (window as any)[namespace][mediacardssr][dataKey] || {},
      GLOBAL_MEDIA_NAMESPACE,
      GLOBAL_MEDIA_CARD_SSR,
      getKey(imageFileId),
    );

    expect(data.dataURI).toBe(mediaClient.getImageUrlSync());
    expect(data.dimensions).toEqual(dimensions);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should store error in global scope', async () => {
    const mediaClient = createMediaClient(true);
    const dimensions = { width: 300, height: 200 };
    const html = ReactDOMServer.renderToString(
      <Card
        featureFlags={{ newCardExperience: true }}
        mediaClient={(mediaClient as unknown) as MediaClient}
        identifier={imageFileId}
        dimensions={dimensions}
        ssr={'server'}
      />,
    );
    const { page } = global;
    await page.setViewport({ width: 350, height: 250 });
    await page.setContent(createHTMLTemplate(html));

    const data: MediaCardSsrData = await page.evaluate(
      (namespace, mediacardssr, dataKey) =>
        (window as any)[namespace][mediacardssr][dataKey] || {},
      GLOBAL_MEDIA_NAMESPACE,
      GLOBAL_MEDIA_CARD_SSR,
      getKey(imageFileId),
    );

    expect(data.error).toBeDefined();
    expect(data.error).toMatchObject({
      failReason: 'ssr-server-uri',
      error: 'missingInitialAuth',
      errorDetail: 'missingInitialAuth',
    });
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
