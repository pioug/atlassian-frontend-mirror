import { shouldDisplayImageThumbnail } from '../../shouldDisplayImageThumbnail';
import { CardStatus } from '../../..';

describe('#shouldDisplayImageThumbnail()', () => {
  const cardStatuses: CardStatus[] = [
    'uploading',
    'loading',
    'processing',
    'complete',
    'error',
    'failed-processing',
  ];

  it('should return false when none of arguments provided', () => {
    cardStatuses.forEach((cardStatus) =>
      expect(shouldDisplayImageThumbnail(cardStatus, 'file')).toEqual(false),
    );
  });

  it('should return false when dataURI is not provided', () => {
    cardStatuses.forEach((cardStatus) =>
      expect(
        shouldDisplayImageThumbnail(
          cardStatus,
          'file',
          undefined,
          'image',
          'image/png',
        ),
      ).toEqual(false),
    );
  });

  it('should return false when dataURI exists, but type is a document', () => {
    cardStatuses.forEach((cardStatus) =>
      expect(
        shouldDisplayImageThumbnail(cardStatus, 'file', 'data-uri', 'doc'),
      ).toEqual(false),
    );
  });

  it('should return false when dataURI exists, but mimeType is undefined', () => {
    cardStatuses.forEach((cardStatus) =>
      expect(
        shouldDisplayImageThumbnail(cardStatus, 'file', 'data-uri', 'image'),
      ).toEqual(false),
    );
  });

  it('should return true when dataURI exists and type is supported and not a document', () => {
    cardStatuses.forEach((cardStatus) =>
      expect(
        shouldDisplayImageThumbnail(
          cardStatus,
          'file',
          'data-uri',
          'image',
          'image/jpeg',
        ),
      ).toEqual(true),
    );
  });

  it('should return true when dataURI exists and media is external image', () => {
    cardStatuses.forEach((cardStatus) =>
      expect(
        shouldDisplayImageThumbnail(cardStatus, 'external-image', 'data-uri'),
      ).toEqual(true),
    );
  });

  it('should return false when dataURI exists and type is unsupported and not complete', () => {
    cardStatuses
      .filter((cardStatus) => cardStatus !== 'complete')
      .forEach((cardStatus) =>
        expect(
          shouldDisplayImageThumbnail(
            cardStatus,
            'file',
            'data-uri',
            'video',
            'video/3gpp',
          ),
        ).toEqual(false),
      );
  });

  it('should return true when dataURI exists and type is unsupported and complete', () => {
    expect(
      shouldDisplayImageThumbnail(
        'complete',
        'file',
        'data-uri',
        'video',
        'video/3gpp',
      ),
    ).toEqual(true);
  });
});
