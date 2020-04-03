import { getMediaTypeFromMimeType } from '../../getMediaTypeFromMimeType';

describe('getMediaTypeFromMimeType()', () => {
  it('should return media type for known mime types', () => {
    expect(getMediaTypeFromMimeType('image/png')).toEqual('image');
    expect(getMediaTypeFromMimeType('image/jpeg')).toEqual('image');
    expect(getMediaTypeFromMimeType('audio/mp3')).toEqual('audio');
    expect(getMediaTypeFromMimeType('audio/wav')).toEqual('audio');
    expect(getMediaTypeFromMimeType('video/mp4')).toEqual('video');
    expect(getMediaTypeFromMimeType('video/mov')).toEqual('video');
    expect(getMediaTypeFromMimeType('application/pdf')).toEqual('doc');
  });

  it('should return unknown for not supported media types', () => {
    expect(getMediaTypeFromMimeType('image')).toEqual('unknown');
    expect(getMediaTypeFromMimeType('webp/')).toEqual('unknown');
    expect(getMediaTypeFromMimeType('audio')).toEqual('unknown');
    expect(getMediaTypeFromMimeType('1234')).toEqual('unknown');
  });
});
