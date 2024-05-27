import React from 'react';
import { mount } from 'enzyme';
import { MediaViewer } from '../../media-viewer';
import { type MediaFeatureFlags } from '@atlaskit/media-common';
import { fakeMediaClient, imageFileId } from '@atlaskit/media-test-helpers';
import { MediaViewer as MediaViewerNextGen } from '../../../media-viewer';
import { type MediaViewerExtensions } from '../../../components/types';
import {
  type ExternalImageIdentifier,
  type FileIdentifier,
} from '@atlaskit/media-client';

describe('MediaViewer', () => {
  it('renders MediaViewerNextGen with props', () => {
    const mediaClient = fakeMediaClient();
    const featureFlags = { aFeature: 'flag' } as MediaFeatureFlags;
    const onClose = jest.fn();
    const extensions = {
      sidebar: {
        icon: null,
        renderer: () => {},
      },
    } as MediaViewerExtensions;

    const component = mount(
      <MediaViewer
        mediaClient={mediaClient}
        selectedItem={imageFileId}
        items={[]}
        collectionName={'some-collection'}
        featureFlags={featureFlags}
        onClose={onClose}
        contextId={'some-contextId'}
        extensions={extensions}
      />,
    );

    const mediaViewerNextGen = component.find(MediaViewerNextGen);
    expect(mediaViewerNextGen).toBeDefined();
    expect(mediaViewerNextGen.prop('mediaClient')).toBe(mediaClient);
    expect(mediaViewerNextGen.prop('featureFlags')).toBe(featureFlags);
    expect(mediaViewerNextGen.prop('onClose')).toBe(onClose);
    expect(mediaViewerNextGen.prop('contextId')).toBe('some-contextId');
    expect(mediaViewerNextGen.prop('extensions')).toBe(extensions);
  });

  it(`adds the collection name to file identifiers only when it's missing`, () => {
    const mediaClient = fakeMediaClient();
    const id1: FileIdentifier = {
      mediaItemType: 'file',
      id: 'some-id-1',
    };
    const id2: FileIdentifier = {
      mediaItemType: 'file',
      id: 'some-id-2',
    };
    const id3: FileIdentifier = {
      mediaItemType: 'file',
      id: 'some-id-2',
      collectionName: 'collection-3',
    };

    const items = [id1, id2, id3];

    const component = mount(
      <MediaViewer
        mediaClient={mediaClient}
        selectedItem={id1}
        items={items}
        collectionName={'some-collection'}
      />,
    );

    const mediaViewerNextGen = component.find(MediaViewerNextGen);
    expect(mediaViewerNextGen).toBeDefined();
    expect(mediaViewerNextGen.prop('items')).toEqual([
      {
        ...id1,
        collectionName: 'some-collection',
      },
      {
        ...id2,
        collectionName: 'some-collection',
      },
      id3,
    ]);
  });

  it(`does not add collection name to external image identifiers`, () => {
    const mediaClient = fakeMediaClient();
    const id1: ExternalImageIdentifier = {
      mediaItemType: 'external-image',
      dataURI: 'some-data-uri-1',
    };
    const id2: ExternalImageIdentifier = {
      mediaItemType: 'external-image',
      dataURI: 'some-data-uri-2',
    };

    const items = [id1, id2];

    const component = mount(
      <MediaViewer
        mediaClient={mediaClient}
        selectedItem={id1}
        items={items}
        collectionName={'some-collection'}
      />,
    );

    const mediaViewerNextGen = component.find(MediaViewerNextGen);
    expect(mediaViewerNextGen).toBeDefined();
    expect(mediaViewerNextGen.prop('items')).toEqual([id1, id2]);
  });

  it(`adds the collection name to the selected item if it's a file identifier and does not have it`, () => {
    const mediaClient = fakeMediaClient();
    const id1: FileIdentifier = {
      mediaItemType: 'file',
      id: 'some-id-1',
    };

    const component = mount(
      <MediaViewer
        mediaClient={mediaClient}
        selectedItem={id1}
        items={[]}
        collectionName={'some-collection'}
      />,
    );

    const mediaViewerNextGen = component.find(MediaViewerNextGen);
    expect(mediaViewerNextGen).toBeDefined();
    expect(mediaViewerNextGen.prop('selectedItem')).toEqual({
      ...id1,
      collectionName: 'some-collection',
    });
  });

  it(`does not add the collection name to the selected item if it's a file identifier and already has it`, () => {
    const mediaClient = fakeMediaClient();
    const id1: FileIdentifier = {
      mediaItemType: 'file',
      id: 'some-id-1',
      collectionName: 'collection-1',
    };

    const component = mount(
      <MediaViewer
        mediaClient={mediaClient}
        selectedItem={id1}
        items={[]}
        collectionName={'some-collection'}
      />,
    );

    const mediaViewerNextGen = component.find(MediaViewerNextGen);
    expect(mediaViewerNextGen).toBeDefined();
    expect(mediaViewerNextGen.prop('selectedItem')).toEqual(id1);
  });

  it(`does not add the collection name to the selected item if it's an external image identifier`, () => {
    const mediaClient = fakeMediaClient();
    const id1: ExternalImageIdentifier = {
      mediaItemType: 'external-image',
      dataURI: 'some-data-uri-1',
    };

    const component = mount(
      <MediaViewer
        mediaClient={mediaClient}
        selectedItem={id1}
        items={[]}
        collectionName={'some-collection'}
      />,
    );

    const mediaViewerNextGen = component.find(MediaViewerNextGen);
    expect(mediaViewerNextGen).toBeDefined();
    expect(mediaViewerNextGen.prop('selectedItem')).toEqual(id1);
  });

  it(`adds the selected item to the list if it's not present`, () => {
    const mediaClient = fakeMediaClient();
    const id1: FileIdentifier = {
      mediaItemType: 'file',
      id: 'some-id-1',
      collectionName: 'collection-1',
    };
    const id2: FileIdentifier = {
      mediaItemType: 'file',
      id: 'some-id-2',
      collectionName: 'collection-2',
    };
    const id3: FileIdentifier = {
      mediaItemType: 'file',
      id: 'some-id-2',
      collectionName: 'collection-3',
    };

    const items = [id2, id3];

    const component = mount(
      <MediaViewer
        mediaClient={mediaClient}
        selectedItem={id1}
        items={items}
        collectionName={'some-collection'}
      />,
    );

    const mediaViewerNextGen = component.find(MediaViewerNextGen);
    expect(mediaViewerNextGen).toBeDefined();
    expect(mediaViewerNextGen.prop('items')).toEqual([id1, id2, id3]);
  });

  it(`does not add the selected item to the list if it's present`, () => {
    const mediaClient = fakeMediaClient();
    const id1: FileIdentifier = {
      mediaItemType: 'file',
      id: 'some-id-1',
      collectionName: 'collection-1',
    };
    const id2: FileIdentifier = {
      mediaItemType: 'file',
      id: 'some-id-2',
      collectionName: 'collection-2',
    };
    const id3: FileIdentifier = {
      mediaItemType: 'file',
      id: 'some-id-2',
      collectionName: 'collection-3',
    };

    const items = [id1, id2, id3];

    const component = mount(
      <MediaViewer
        mediaClient={mediaClient}
        selectedItem={id1}
        items={items}
        collectionName={'some-collection'}
      />,
    );

    const mediaViewerNextGen = component.find(MediaViewerNextGen);
    expect(mediaViewerNextGen).toBeDefined();
    expect(mediaViewerNextGen.prop('items')).toEqual([id1, id2, id3]);
  });
});
