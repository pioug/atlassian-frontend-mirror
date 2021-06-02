import { asMockFunction } from '@atlaskit/media-test-helpers';

import {
  shouldFetchRemoteFileStates,
  shouldFetchRemoteFileStatesObservable,
} from '../../shouldFetchRemoteFileStates';

import { getVideoDimensionsFromBlob } from '../../getVideoDimensionsFromBlob';
import { FilePreview } from '../../../models/file-state';

jest.mock('../../getVideoDimensionsFromBlob');

const setup = (opts: { mimeType?: string } = {}) => {
  const { mimeType } = opts;

  return {
    defaultFilePreview: Promise.resolve({
      value: new Blob([], { type: mimeType }),
      origin: 'local',
    } as FilePreview),
    next: jest.fn(),
  };
};

describe('shouldFetchRemoteFileStates()', () => {
  it.each([
    'application/pdf',
    'application/x-pdf',
    'application/acrobat',
    'applications/vnd.pdf',
    'text/pdf',
    'text/x-pdf',
    'application/vnd.adobe.illustrator',
    'application/vnd.ms-office',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-word.document.macroenabled.12',
    'application/vnd.ms-word.template.macroenabled.12',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    'application/vnd.ms-excel.sheet.macroenabled.12',
    'application/vnd.ms-excel.template.macroenabled.12',
    'application/vnd.ms-excel.addin.macroenabled.12',
    'application/vnd.ms-excel.sheet.macroenabled',
    'application/vnd.ms-excel.template.macroenabled',
    'application/vnd.ms-excel.addin.macroenabled',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.template',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    'application/vnd.ms-powerpoint.presentation.macroenabled.12',
    'application/vnd.ms-powerpoint.template.macroenabled.12',
    'application/vnd.ms-powerpoint.slideshow.macroenabled.12',
    'application/vnd.sun.xml.writer',
    'application/vnd.sun.xml.writer.template',
    'application/vnd.sun.xml.draw',
    'application/vnd.sun.xml.draw.template',
    'application/vnd.oasis.opendocument.graphics',
    'application/vnd.oasis.opendocument.presentation',
    'application/x-vnd.oasis.opendocument.presentation',
    'application/vnd.sun.xml.calc',
    'application/vnd.sun.xml.calc.template',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/x-vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.spreadsheet-template',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.text-template',
    'application/vnd.oasis.opendocument.text-master',
    'application/x-vnd.oasis.opendocument.text',
    'application/x-vnd.oasis.opendocument.text-template',
    'application/x-vnd.oasis.opendocument.text-master',
    'application/vnd.wordperfect',
    'text/csv',
    'text/x-diff',
    'text/x-perl',
    'text/x-python',
    'text/x-ruby',
    'text/rtf',
    'text/richtext',
    'text/plain',
    'application/txt',
    'application/rtf',
    'application/x-rtf',
    'application/postscript',
  ])('should fetch remote fileStates for %s', async (mimeType) =>
    expect(await shouldFetchRemoteFileStates('doc', mimeType)).toBeTruthy(),
  );

  it('should fetch remote fileStates for non web-friendly medias', async () => {
    const { defaultFilePreview } = setup({ mimeType: 'video/x-matroska' });
    expect(
      await shouldFetchRemoteFileStates(
        'video',
        'video/x-matroska',
        defaultFilePreview,
      ),
    ).toBeTruthy();
  });

  it("should fetch remote fileStates if local preview isn't available", async () => {
    expect(
      await shouldFetchRemoteFileStates('image', 'image/jpeg'),
    ).toBeTruthy();
  });

  it('should fetch remote fileStates if unable to extract dimensions from video', async () => {
    const { defaultFilePreview } = setup({ mimeType: 'video/mp4' });

    asMockFunction(getVideoDimensionsFromBlob).mockImplementation(async () => ({
      width: 0,
      height: 0,
    }));

    expect(
      await shouldFetchRemoteFileStates(
        'video',
        'video/mp4',
        defaultFilePreview,
      ),
    ).toBeTruthy();
  });

  it('should fetch remote fileStates if getVideoDimensionsFromBlob() throws an exception', async () => {
    const { defaultFilePreview } = setup({ mimeType: 'video/mp4' });

    asMockFunction(getVideoDimensionsFromBlob).mockImplementation(() =>
      Promise.reject(new Error('unexpected error')),
    );

    expect(
      await shouldFetchRemoteFileStates(
        'video',
        'video/mp4',
        defaultFilePreview,
      ),
    ).toBeTruthy();
  });
});

describe('shouldFetchRemoteFileStatesObservable()', () => {
  it('should resolve result as an Observable', (done) => {
    const { defaultFilePreview, next } = setup({
      mimeType: 'video/x-matroska',
    });

    expect.assertions(2);
    shouldFetchRemoteFileStatesObservable(
      'video',
      'video/x-matroska',
      defaultFilePreview,
    ).subscribe({
      next,
      complete() {
        expect(next).toHaveBeenCalledTimes(1);
        expect(next.mock.calls[0][0]).toBeTruthy();
        done();
      },
    });
  });
});
