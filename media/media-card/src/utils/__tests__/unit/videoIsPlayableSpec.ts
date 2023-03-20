import { videoIsPlayable } from '../../videoIsPlayable';

describe('videoIsPlayable', () => {
  it.each`
    isBannedLocalPreview | mimeType             | fileState                   | videoIsPlayableResult
    ${false}             | ${'video/mp4'}       | ${undefined}                | ${true}
    ${false}             | ${'video/quicktime'} | ${undefined}                | ${true}
    ${false}             | ${'video/3gpp'}      | ${undefined}                | ${false}
    ${false}             | ${'video/webm'}      | ${undefined}                | ${false}
    ${true}              | ${'video/mp4'}       | ${undefined}                | ${false}
    ${false}             | ${undefined}         | ${{ status: 'processed' }}  | ${true}
    ${false}             | ${undefined}         | ${{ status: 'processing' }} | ${false}
  `(
    'videoIsPlayable returns $videoIsPlayableResult when isBannedLocalPreview is $isBannedLocalPreview, mimeType is $mimeType, and fileState is $fileState',
    ({ isBannedLocalPreview, mimeType, fileState, videoIsPlayableResult }) => {
      expect(videoIsPlayable(isBannedLocalPreview, fileState, mimeType)).toBe(
        videoIsPlayableResult,
      );
    },
  );
});
