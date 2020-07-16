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
    expect(getMediaTypeFromMimeType('text/plain')).toEqual('doc');
    expect(getMediaTypeFromMimeType('text/csv')).toEqual('doc');
    expect(getMediaTypeFromMimeType('text/x-java')).toEqual('doc');
    expect(getMediaTypeFromMimeType('application/msword')).toEqual('doc');
    expect(
      getMediaTypeFromMimeType(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ),
    ).toEqual('doc');
    expect(
      getMediaTypeFromMimeType(
        'application/vnd.oasis.opendocument.presentation',
      ),
    ).toEqual('doc');
    expect(
      getMediaTypeFromMimeType(
        'application/vnd.oasis.opendocument.spreadsheet',
      ),
    ).toEqual('doc');
    expect(
      getMediaTypeFromMimeType('application/vnd.oasis.opendocument.text'),
    ).toEqual('doc');
    expect(getMediaTypeFromMimeType('application/vnd.ms-powerpoint')).toEqual(
      'doc',
    );
    expect(
      getMediaTypeFromMimeType(
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ),
    ).toEqual('doc');
    expect(getMediaTypeFromMimeType('application/rtf')).toEqual('doc');
    expect(getMediaTypeFromMimeType('application/vnd.visio')).toEqual('doc');
    expect(getMediaTypeFromMimeType('application/vnd.ms-excel')).toEqual('doc');
    expect(
      getMediaTypeFromMimeType(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ),
    ).toEqual('doc');
  });

  it('should return unknown for not supported media types', () => {
    expect(getMediaTypeFromMimeType('image')).toEqual('unknown');
    expect(getMediaTypeFromMimeType('webp/')).toEqual('unknown');
    expect(getMediaTypeFromMimeType('audio')).toEqual('unknown');
    expect(getMediaTypeFromMimeType('1234')).toEqual('unknown');
  });
});
