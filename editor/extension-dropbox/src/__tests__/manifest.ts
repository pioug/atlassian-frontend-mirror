import ReactDOM from 'react-dom';

import getManifest from '../manifest';
import { DropboxFile } from '../types';
import { POPUP_MOUNTPOINT } from '../constants';

jest.mock('react-dom');

const asMock = (fn: Function): jest.Mock => fn as jest.Mock;

const fakeDropboxFile: DropboxFile = {
  link: 'https://atlaskit.atlassian.com/',
  isDir: false,
  linkType: 'preview',
  name: 'fake dropbox file.pdf',
  id: 'ASDFFDSA',
  icon: 'https://atlaskit.atlassian.com/',
};

const callAction = (appKey: string, canMountinIframe: boolean = false) =>
  (getManifest({ appKey, canMountinIframe }).modules.quickInsert![0]
    .action as () => Promise<any>)();

describe('dropbox extension manifest', () => {
  beforeEach(async () => {
    await jest.resetAllMocks();
  });

  afterEach(() => {
    delete window.Dropbox;
  });
  it('should return an inline card to the quickInsert action on dropbox file chooser success', async () => {
    window.Dropbox = {
      choose: ({ success }) => {
        success([fakeDropboxFile]);
      },
    };

    let inlineCard = await callAction('FAKE_KEY');

    expect(inlineCard).toEqual({
      type: 'inlineCard',
      attrs: {
        url: 'https://atlaskit.atlassian.com/',
      },
    });
  }, 2000);
  it('should not insert an inline card if choose fails, or is exited', async () => {
    window.Dropbox = {
      choose: ({ cancel }) => {
        cancel();
      },
    };
    await expect(callAction('FAKE_KEY')).rejects.toBeUndefined();
  });
  it('should add the mount point if canMountInIframe check returns true', async () => {
    window.Dropbox = {
      choose: ({ success }) => {
        success([fakeDropboxFile]);
      },
    };

    let inlineCard = await callAction('FAKE_KEY', true);

    let mountPoint = document.getElementById(POPUP_MOUNTPOINT);
    let tagName = mountPoint && mountPoint.tagName;

    expect(tagName).toEqual('DIV');

    expect(inlineCard).toEqual({
      type: 'inlineCard',
      attrs: {
        url: 'https://atlaskit.atlassian.com/',
      },
    });
  });
  it('should load modal if canMountInIframe check returns true', async () => {
    let mockRender = asMock(ReactDOM.render).mockImplementation(
      (comp, targetDiv) => {
        component = comp;
        mountPoint = targetDiv;
      },
    );

    let mockUnmount = asMock(
      ReactDOM.unmountComponentAtNode,
    ).mockImplementation((targetDiv) => {
      unMountPoint = targetDiv;
    });

    window.Dropbox = {
      choose: ({ success }) => {
        success([fakeDropboxFile]);
      },
    };

    let inlineCard = await callAction('FAKE_KEY', true);

    expect(mockRender.mock.calls.length).toEqual(1);
    expect(mockUnmount.mock.calls.length).toEqual(1);

    let [component, mountPoint] = mockRender.mock.calls[0];
    let [unMountPoint] = mockUnmount.mock.calls[0];

    let id = mountPoint! && mountPoint!.id;
    let unmountId = unMountPoint! && unMountPoint!.id;
    let componentName = component && component.type && component.type.name;

    expect(componentName).toEqual('Modal');
    expect(id).toEqual(POPUP_MOUNTPOINT);
    expect(unmountId).toEqual(POPUP_MOUNTPOINT);

    expect(inlineCard).toEqual({
      type: 'inlineCard',
      attrs: {
        url: 'https://atlaskit.atlassian.com/',
      },
    });
  });
});
