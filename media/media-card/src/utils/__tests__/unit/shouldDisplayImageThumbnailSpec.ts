import { shouldDisplayImageThumbnail } from '../../shouldDisplayImageThumbnail';

describe('#shouldDisplayImageThumbnail', () => {
  it('should return true when dataURI exists and type is not doc', () => {
    expect(shouldDisplayImageThumbnail('data-uri', 'image')).toEqual(true);
  });

  it('should return false when is an image but data-uri is not provided', () => {
    expect(shouldDisplayImageThumbnail(undefined, 'image')).toEqual(false);
  });

  it('should return false when non of the arguments provided', () => {
    expect(shouldDisplayImageThumbnail()).toEqual(false);
  });

  it('should return false when is dataURI is provided, but type is a document', () => {
    expect(shouldDisplayImageThumbnail('data-uri', 'doc')).toEqual(false);
  });
});
