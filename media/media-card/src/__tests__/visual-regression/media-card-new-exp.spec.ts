import {
  getExampleUrl,
  pageSelector,
} from '@atlaskit/visual-regression/helper';

function getURL(params: string): string {
  return (
    getExampleUrl('media', 'media-card', 'card-view-vr', global.__BASEURL__) +
    params
  );
}

async function setup(url: string) {
  const { page } = global;
  await page.goto(url);
  await page.waitForSelector(pageSelector);
  const image = await page.screenshot();
  return { image };
}

describe('Media Card New Experience', () => {
  describe('has data URI', () => {
    describe('and metadata', () => {
      it.each(['uploading', 'complete', 'failed-processing', 'error'])(
        'with filestate %s',
        async status => {
          const url = getURL(`&dataUri=true&status=${status}`);
          const { image } = await setup(url);
          expect(image).toMatchProdImageSnapshot();
        },
      );

      it.each(['uploading', 'complete', 'failed-processing', 'error'])(
        'and is selected with filestate %s',
        async status => {
          const url = getURL(`&dataUri=true&status=${status}&selected=true`);
          const { image } = await setup(url);
          expect(image).toMatchProdImageSnapshot();
        },
      );
    });

    describe('and without metadata', () => {
      it.each(['uploading', 'complete', 'failed-processing', 'error'])(
        'with filestate %s',
        async status => {
          const url = getURL(
            `&dataUri=true&disableMetadata=true&status=${status}`,
          );
          const { image } = await setup(url);
          expect(image).toMatchProdImageSnapshot();
        },
      );

      it.each(['uploading', 'complete', 'failed-processing', 'error'])(
        'and is selected with filestate %s',
        async status => {
          const url = getURL(
            `&dataUri=true&disableMetadata=true&status=${status}&selected=true`,
          );

          const { image } = await setup(url);
          expect(image).toMatchProdImageSnapshot();
        },
      );
    });
  });

  describe('does not have the data URI', () => {
    describe('but has the metadata', () => {
      it.each(['uploading', 'complete', 'failed-processing', 'error'])(
        'with filestate %s',
        async status => {
          const url = getURL(`&status=${status}`);

          const { image } = await setup(url);
          expect(image).toMatchProdImageSnapshot();
        },
      );

      it.each(['uploading', 'complete', 'failed-processing', 'error'])(
        'and is selected with filestate %s',
        async status => {
          const url = getURL(`&status=${status}&selected=true`);

          const { image } = await setup(url);
          expect(image).toMatchProdImageSnapshot();
        },
      );
    });

    describe('and has no metadata', () => {
      it.each(['uploading', 'complete', 'failed-processing', 'error'])(
        'with filestate %s',
        async status => {
          const url = getURL(`&disableMetadata=true&status=${status}`);

          const { image } = await setup(url);
          expect(image).toMatchProdImageSnapshot();
        },
      );

      it.each(['uploading', 'complete', 'failed-processing', 'error'])(
        'and is selected with filestate %s',
        async status => {
          const url = getURL(
            `&disableMetadata=true&status=${status}&selected=true`,
          );

          const { image } = await setup(url);
          expect(image).toMatchProdImageSnapshot();
        },
      );
    });
  });
});
