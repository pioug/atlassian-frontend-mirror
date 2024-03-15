import { fireAnalytics } from '.';

describe('Fire Analytics', () => {
  it('should sanitise the file id', () => {
    const createAnalyticsEvent = jest.fn(() => ({ fire: jest.fn() }));
    const payload = {
      attributes: { fileAttributes: { fileId: 'this is an invalid file id' } },
    };

    fireAnalytics(payload as any, createAnalyticsEvent as any);

    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      attributes: { fileAttributes: { fileId: 'INVALID_FILE_ID' } },
    });
  });

  it('should preserve a valid file id', () => {
    const createAnalyticsEvent = jest.fn(() => ({ fire: jest.fn() }));
    const validFileId = 'c2c581e3-8fb7-44ef-b3ed-7c9c9a29c3ef';
    const payload = {
      attributes: { fileAttributes: { fileId: validFileId } },
    };

    fireAnalytics(payload as any, createAnalyticsEvent as any);

    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      attributes: { fileAttributes: { fileId: validFileId } },
    });
  });
});
