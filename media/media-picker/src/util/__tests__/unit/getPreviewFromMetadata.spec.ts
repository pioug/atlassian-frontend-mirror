import { ImageMetadata } from '@atlaskit/media-client';
import { getPreviewFromMetadata } from '../../../domain/preview';

describe('getPreviewFromMetadata()', () => {
  it('should return original dimensions', () => {
    const metadata: ImageMetadata = {
      pending: false,
      preview: {
        width: 1,
        height: 1,
        url: 'some-preview',
      },
      original: {
        width: 10,
        height: 10,
        url: 'image-url',
      },
    };

    expect(getPreviewFromMetadata(metadata)).toEqual({
      dimensions: {
        width: 10,
        height: 10,
      },
      scaleFactor: 1,
    });
  });

  it('should return empty dimensions when original is not available', () => {
    const metadata: ImageMetadata = {
      pending: true,
    };

    expect(getPreviewFromMetadata(metadata)).toEqual({});
  });

  it('should default to empty src if url is not available', () => {
    const metadata: ImageMetadata = {
      pending: false,
      original: {
        width: 10,
        height: 10,
      },
    };

    expect(getPreviewFromMetadata(metadata)).toEqual({
      dimensions: {
        width: 10,
        height: 10,
      },
      scaleFactor: 1,
    });
  });
});
