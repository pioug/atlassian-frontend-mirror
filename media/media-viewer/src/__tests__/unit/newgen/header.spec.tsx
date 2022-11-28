import React from 'react';
import { ReactWrapper } from 'enzyme';
import {
  MediaType,
  FileState,
  Identifier,
  createMediaSubscribable,
} from '@atlaskit/media-client';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import {
  fakeIntl,
  fakeMediaClient,
  asMock,
  mountWithIntlContext,
  asMockReturnValue,
  mountWithIntlWrapper,
} from '@atlaskit/media-test-helpers';
import { MediaButton } from '@atlaskit/media-ui';
import { Header } from '../../../header';
import {
  MetadataFileName,
  MetadataSubText,
  Header as HeaderWrapper,
  LeftHeader,
} from '../../../styleWrappers';
import Button from '@atlaskit/button/custom-theme-button';

const identifier: Identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  mediaItemType: 'file',
};
const externalIdentifierWithName: Identifier = {
  dataURI: 'some-external-src',
  name: 'some-name',
  mediaItemType: 'external-image',
};
const externalIdentifier: Identifier = {
  dataURI: 'some-external-src',
  mediaItemType: 'external-image',
};
const identifier2: Identifier = {
  id: 'some-id-2',
  occurrenceKey: 'some-custom-occurrence-key',
  mediaItemType: 'file',
};

const processedImageState: FileState = {
  id: '123',
  mediaType: 'image',
  mimeType: 'jpeg',
  status: 'processed',
  name: 'my image',
  size: 0,
  artifacts: {},
  representations: {
    image: {},
  },
};

const processedArchiveState: FileState = {
  id: '123',
  mediaType: 'archive',
  mimeType: 'application/zip',
  status: 'processed',
  name: 'my zip',
  size: 0,
  artifacts: {},
};

describe('<Header />', () => {
  it('passes isArchiveSideBarVisible as true if media type is archive', () => {
    const mediaClient = fakeMediaClient();
    asMock(mediaClient.file.getFileState).mockReturnValue(
      createMediaSubscribable(processedArchiveState),
    );
    const el = mountWithIntlContext(
      <Header
        intl={fakeIntl}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );
    const headerWrapper = el.find(HeaderWrapper);
    expect(headerWrapper.prop('isArchiveSideBarVisible')).toBeTruthy();
  });
  it('passes isArchiveSideBarVisible as false if media type is not archive', () => {
    const mediaClient = fakeMediaClient();
    asMock(mediaClient.file.getFileState).mockReturnValue(
      createMediaSubscribable(processedImageState),
    );
    const el = mountWithIntlContext(
      <Header
        intl={fakeIntl}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );
    const headerWrapper = el.find(HeaderWrapper);
    expect(headerWrapper.prop('isArchiveSideBarVisible')).toBeFalsy();
  });

  it('shows an empty header while loading', () => {
    const mediaClient = fakeMediaClient();
    const fileStateSubscribable = createMediaSubscribable();
    asMockReturnValue(mediaClient.file.getFileState, fileStateSubscribable);
    const el = mountWithIntlContext(
      <Header
        intl={fakeIntl}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );
    const metadata = el.find(LeftHeader);
    expect(metadata.text()).toEqual('');
  });

  it('resubscribes to the provider when the data property value is changed', () => {
    const mediaClient = fakeMediaClient();
    asMock(mediaClient.file.getFileState).mockReturnValue(
      createMediaSubscribable(processedImageState),
    );

    const el = mountWithIntlWrapper(
      <Header
        intl={fakeIntl}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );
    el.update();
    expect(el.find(MetadataFileName).text()).toEqual('my image');
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);
    el.setProps({ identifier: identifier2 });
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(2);
  });

  it('component resets initial state when new identifier is passed', () => {
    const mediaClient = fakeMediaClient();
    asMock(mediaClient.file.getFileState).mockReturnValue(
      createMediaSubscribable(processedImageState),
    );
    const el = mountWithIntlWrapper(
      <Header
        intl={fakeIntl}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );

    expect(el.find(Header).state().item.status).toEqual('SUCCESSFUL');

    // since the test is executed synchronously
    // let's prevent the second call to getFile from immediately resolving and
    // updating the state to SUCCESSFUL before we run the assertion.
    asMock(mediaClient.file.getFileState).mockReturnValue(
      createMediaSubscribable(),
    );

    el.setProps({ identifier: identifier2 });
    expect(el.find(Header).state().item.status).toEqual('PENDING');
  });

  it('component resets initial state when new mediaClient is passed', () => {
    const mediaClient = fakeMediaClient();
    asMock(mediaClient.file.getFileState).mockReturnValue(
      createMediaSubscribable(processedImageState),
    );
    const el = mountWithIntlWrapper(
      <Header
        intl={fakeIntl}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );
    expect(el.find(Header).state().item.status).toEqual('SUCCESSFUL');

    // since the test is executed synchronously
    // let's prevent the second call to getFile from immediately resolving and
    // updating the state to SUCCESSFUL before we run the assertion.
    const newMediaClient = fakeMediaClient();
    asMock(newMediaClient.file.getFileState).mockReturnValue(
      createMediaSubscribable(),
    );
    el.setProps({ mediaClient: newMediaClient });
    expect(el.find(Header).state().item.status).toEqual('PENDING');
  });

  describe('Metadata', () => {
    it('should work with external image identifier', () => {
      const element = mountWithIntlContext(
        <Header
          intl={fakeIntl}
          mediaClient={{} as any}
          identifier={externalIdentifierWithName}
        />,
      );

      expect(element.find(MetadataFileName).text()).toEqual('some-name');
      expect(element.find(MetadataSubText).text()).toEqual(
        fakeIntl.formatMessage({ defaultMessage: 'image' }),
      );
    });

    it('should default to dataURI as name when no name is passed in a external image identifier', () => {
      const element = mountWithIntlContext(
        <Header
          intl={fakeIntl}
          mediaClient={{} as any}
          identifier={externalIdentifier}
        />,
      );

      expect(element.find(MetadataFileName).text()).toEqual(
        'some-external-src',
      );
    });

    describe('File collectionName', () => {
      it('shows the title when loaded', () => {
        const mediaClient = fakeMediaClient();
        const fileStateSubscribable =
          createMediaSubscribable(processedImageState);
        asMockReturnValue(mediaClient.file.getFileState, fileStateSubscribable);
        const el = mountWithIntlContext(
          <Header
            intl={fakeIntl}
            mediaClient={mediaClient}
            identifier={identifier}
          />,
        );
        el.update();
        expect(el.find(MetadataFileName).text()).toEqual('my image');
      });

      it('shows unknown if file collectionName not provided on metadata', () => {
        const unNamedImage = {
          ...processedImageState,
          name: '',
        };
        const mediaClient = fakeMediaClient();
        asMock(mediaClient.file.getFileState).mockReturnValue(
          createMediaSubscribable(unNamedImage),
        );
        const el = mountWithIntlContext(
          <Header
            intl={fakeIntl}
            mediaClient={mediaClient}
            identifier={identifier}
          />,
        );
        el.update();
        expect(el.find(MetadataFileName).text()).toEqual(
          fakeIntl.formatMessage({ defaultMessage: 'unknown' }),
        );
      });
    });

    describe('File metadata', () => {
      const testMediaTypeText = (
        mediaType: MediaType,
        expectedText: string,
      ) => {
        const testItem: FileState = {
          id: '123',
          mediaType,
          mimeType: 'jpeg',
          status: 'processed',
          name: 'my item',
          size: 12222222,
          artifacts: {},
          representations: {
            image: {},
          },
        };
        const mediaClient = fakeMediaClient();
        asMockReturnValue(
          mediaClient.file.getFileState,
          createMediaSubscribable(testItem),
        );
        const el = mountWithIntlContext(
          <Header
            intl={fakeIntl}
            mediaClient={mediaClient}
            identifier={identifier}
          />,
        );
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual(
          fakeIntl.formatMessage({ defaultMessage: `${expectedText}` }) +
            ' · 11.7 MB',
        );
      };

      it('should render media type text and file size for each media type', () => {
        testMediaTypeText('image', 'image');
        testMediaTypeText('audio', 'audio');
        testMediaTypeText('video', 'video');
        testMediaTypeText('unknown', 'unknown');
        testMediaTypeText('doc', 'document');
      });

      it('should not render file size if unavailable', () => {
        const noSizeImage = {
          ...processedImageState,
          size: 0,
        };
        const mediaClient = fakeMediaClient();
        asMockReturnValue(
          mediaClient.file.getFileState,
          createMediaSubscribable(noSizeImage),
        );
        const el = mountWithIntlContext(
          <Header
            intl={fakeIntl}
            mediaClient={mediaClient}
            identifier={identifier}
          />,
        );
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual(
          fakeIntl.formatMessage({ defaultMessage: 'image' }),
        );
      });

      it('should not render media type if unavailable', () => {
        const noMediaTypeElement = {
          ...processedImageState,
          mediaType: '' as MediaType,
          size: 23232323,
        };
        const mediaClient = fakeMediaClient();
        asMockReturnValue(
          mediaClient.file.getFileState,
          createMediaSubscribable(noMediaTypeElement),
        );
        const el = mountWithIntlContext(
          <Header
            intl={fakeIntl}
            mediaClient={mediaClient}
            identifier={identifier}
          />,
        );
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual(
          fakeIntl.formatMessage({ defaultMessage: 'unknown' }) + ' · 22.2 MB',
        );
      });
    });

    it('shows nothing when metadata failed to be retrieved', () => {
      const mediaClient = fakeMediaClient();
      asMockReturnValue(
        mediaClient.file.getFileState,
        createMediaSubscribable(new Error('something bad happened!')),
      );
      const el = mountWithIntlContext(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifier}
        />,
      );
      const metadata = el.find(LeftHeader);
      expect(metadata.text()).toEqual('');
    });

    it('MSW-720: passes the collectionName to getFile', () => {
      const collectionName = 'some-collection';
      const mediaClient = fakeMediaClient();
      asMock(mediaClient.file.getFileState).mockReturnValue(
        createMediaSubscribable(processedImageState),
      );
      const identifierWithCollection = { ...identifier, collectionName };
      const el = mountWithIntlContext(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifierWithCollection}
        />,
      );
      el.update();
      expect(mediaClient.file.getFileState).toHaveBeenCalledWith('some-id', {
        collectionName: 'some-collection',
      });
    });

    it('MSW-720: passes the collectionName to mediaClient.file.downloadBinary', () => {
      const collectionName = 'some-collection';
      const mediaClient = fakeMediaClient();
      asMock(mediaClient.file.getFileState).mockReturnValue(
        createMediaSubscribable(processedImageState),
      );
      const identifierWithCollection = { ...identifier, collectionName };
      const el = mountWithIntlContext(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifierWithCollection}
        />,
      );
      el.update();
      el.find('button[data-testid="media-viewer-download-button"]').simulate(
        'click',
      );
      expect(
        (mediaClient.file.downloadBinary as jest.Mock).mock.calls[0][2],
      ).toEqual(collectionName);
    });
  });

  describe('Download button', () => {
    const assertDownloadButton = (
      el: ReactWrapper<any, any>,
      enabled: boolean,
    ) => {
      expect(el.find(DownloadIcon)).toHaveLength(1);
      expect(
        el.find(DownloadIcon).closest(Button).props().isDisabled,
        // when disabled the disabled value will be true
        // when enabled the disabled value can be false or undefined
      ).toBe(enabled ? false || undefined : true);
    };

    it('should show the download button disabled while the item metadata is loading', () => {
      const mediaClient = fakeMediaClient();
      asMockReturnValue(
        mediaClient.file.getFileState,
        createMediaSubscribable(),
      );
      const el = mountWithIntlContext(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifier}
        />,
      );
      el.update();
      assertDownloadButton(el, false);
    });

    it('should show the download button enabled when the item is loaded', () => {
      const mediaClient = fakeMediaClient();
      asMockReturnValue(
        mediaClient.file.getFileState,
        createMediaSubscribable(processedImageState),
      );
      const el = mountWithIntlContext(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifier}
        />,
      );
      el.update();
      assertDownloadButton(el, true);
    });

    it('should show the download button disabled when there is an error', () => {
      const mediaClient = fakeMediaClient();
      asMockReturnValue(
        mediaClient.file.getFileState,
        createMediaSubscribable(new Error('something bad happened!')),
      );
      const el = mountWithIntlContext(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifier}
        />,
      );
      el.update();
      assertDownloadButton(el, false);
    });
  });

  describe('Sidebar button', () => {
    it('should render sidebar button if sidebar component is present', () => {
      const mediaClient = fakeMediaClient();
      asMockReturnValue(
        mediaClient.file.getFileState,
        createMediaSubscribable(processedImageState),
      );
      const el = mountWithIntlContext(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifier}
          extensions={{
            sidebar: {
              icon: <EditorPanelIcon label="sidebar" />,
              renderer: () => <div />,
            },
          }}
        />,
      );
      el.update();
      expect(
        (el.find(MediaButton).at(0).prop('iconBefore') as any).type,
      ).toEqual(EditorPanelIcon);
    });
  });

  describe('CodeViewer Support', () => {
    const fakeFileState = (name: string): FileState => ({
      id: '123',
      mediaType: 'unknown',
      mimeType: '',
      status: 'processed',
      name: name,
      size: 12222222,
      artifacts: {},
      representations: {
        image: {},
      },
    });

    it.each([
      ['item.html', 'html'],
      ['item.json', 'json'],
      ['item.xml', 'xml'],
    ])(
      'Should render the corresponding header text for a %p filename',
      (filename, expectedHeaderText) => {
        const mediaClient = fakeMediaClient();
        const fileStateSubscribable = createMediaSubscribable(
          fakeFileState(filename),
        );
        asMockReturnValue(mediaClient.file.getFileState, fileStateSubscribable);
        const el = mountWithIntlContext(
          <Header
            intl={fakeIntl}
            mediaClient={mediaClient}
            identifier={identifier}
          />,
        );
        el.update();
        const text = el.find(MetadataSubText).text();
        expect(text).toEqual(`${expectedHeaderText} · 11.7 MB`);
      },
    );
  });
});
