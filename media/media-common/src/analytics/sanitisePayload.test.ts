import { sanitiseAnalyticsPayload } from './sanitisePayload';

describe('sanitiseAnalyticsPayload', () => {
  it('should sanitise the file id', () => {
    const ivalidId = 'this is an invalid file id';
    const payload = {
      attributes: {
        fileAttributes: {
          fileId: ivalidId,
          anotherAttr: 'some value',
        },
      },
      anotherAttr2: 'some value 2',
    };

    const sanitised = sanitiseAnalyticsPayload(payload);

    expect(sanitised).toEqual({
      attributes: {
        fileAttributes: {
          fileId: 'INVALID_FILE_ID',
          anotherAttr: 'some value',
        },
      },
      anotherAttr2: 'some value 2',
    });

    expect(payload.attributes.fileAttributes.fileId).toBe(ivalidId);
  });

  it('should preserve a valid file id', () => {
    const validFileId = 'c2c581e3-8fb7-44ef-b3ed-7c9c9a29c3ef';
    const payload = {
      attributes: {
        fileAttributes: { fileId: validFileId, anotherAttr: 'some value' },
      },
      anotherAttr2: 'some value 2',
    };

    const sanitised = sanitiseAnalyticsPayload(payload);
    expect(sanitised).toEqual(payload);
  });

  it('should skip missing file id', () => {
    const payload = {
      attributes: {
        fileAttributes: { anotherAttr: 'some value' },
      },
      anotherAttr2: 'some value 2',
    };

    const sanitised = sanitiseAnalyticsPayload(payload);
    expect(sanitised).toEqual(payload);
  });
});
