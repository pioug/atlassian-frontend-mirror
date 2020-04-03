import enableDropbox from '../enable-dropbox';

describe('enable dropbox', () => {
  it('should enable dropbox with the provided app ID', async () => {
    await enableDropbox('fake-appkey');
    expect(typeof window.Dropbox).toEqual('object');
    expect(window.Dropbox.appKey).toEqual('fake-appkey');
  });
  it('should not replace existing dropbox property', async () => {
    let fakeDropbox = {
      appKey: 'nunya',
      testProperty: 'thing',
      choose: () => undefined,
    };
    window.Dropbox = fakeDropbox;

    await enableDropbox('fake-appkey');
    expect(window.Dropbox).toEqual({ ...fakeDropbox, appKey: 'fake-appkey' });
  });
});
