import * as mocks from './media.mock';
import React from 'react';
import { mount } from 'enzyme';

import { MediaType } from '@atlaskit/adf-schema';
import { Card, CardEvent } from '@atlaskit/media-card';
import { sleep, nextTick } from '@atlaskit/media-test-helpers';
import {
  FileIdentifier,
  ExternalImageIdentifier,
  // @ts-ignore
  getMediaClient,
} from '@atlaskit/media-client';

import Media from '../../../../react/nodes/media';
import {
  MediaCard,
  MediaCardInternal,
  getListOfIdentifiersFromDoc,
  getClipboardAttrs,
  CardWrapper,
} from '../../../../ui/MediaCard';
import { MediaLink } from '@atlaskit/editor-common';

const doc = require('../../../../../examples/helper/media-layout.adf.json');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Media', () => {
  const mediaNode = {
    type: 'media',
    attrs: {
      type: 'file',
      id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
      collection: 'MediaServicesSample',
    },
  };
  const mediaProvider = {
    viewMediaClientConfig: {
      authProvider: jest.fn(),
    },
  };

  const createFileIdentifier = (index = 0): FileIdentifier => ({
    id: `b9d94b5f-e06c-4a80-bfda-00000000000${index}`,
    mediaItemType: 'file',
    collectionName: 'MediaServicesSample',
  });

  const createExternalIdentifier = (index = 0): ExternalImageIdentifier => ({
    dataURI: `https://example.com/image${index}.png`,
    mediaItemType: 'external-image',
    name: `https://example.com/image${index}.png`,
  });

  const mountFileCard = async (identifier: FileIdentifier) => {
    const card = mount(
      <MediaCard
        type="file"
        id={await identifier.id}
        collection={identifier.collectionName}
        mediaProvider={mediaProvider as any}
        rendererContext={{
          adDoc: {
            content: [
              {
                attrs: {
                  collection: identifier.collectionName,
                  height: 580,
                  id: await identifier.id,
                  type: 'file',
                  width: 1021,
                },
                type: 'media',
              },
            ],
          },
        }}
      />,
    );
    card.setState({ imageStatus: 'complete' });
    card.update();
    return card;
  };

  const mountExternalCard = (
    indentifier: ExternalImageIdentifier,
    extraProps?: Object,
  ) => {
    const card = mount(
      <MediaCard
        type="external"
        url={indentifier.dataURI}
        mediaProvider={mediaProvider as any}
        rendererContext={{
          adDoc: {
            content: [
              {
                attrs: {
                  height: 580,
                  url: indentifier.dataURI,
                  type: 'external',
                  width: 1021,
                },
                type: 'media',
              },
            ],
          },
        }}
        {...extraProps}
      />,
    );
    card.setState({ imageStatus: 'complete' });
    card.update();
    return card;
  };

  it('should render a media component with the proper props', () => {
    const mediaComponent = mount(
      <Media
        type={mediaNode.attrs.type as MediaType}
        id={mediaNode.attrs.id}
        marks={[]}
        isLinkMark={() => false}
        collection={mediaNode.attrs.collection}
      />,
    );

    expect(mediaComponent.find(MediaCard).length).toEqual(1);
    mediaComponent.unmount();
  });

  it('should render a media component with alt text if FF is on', () => {
    const mediaComponent = mount(
      <Media
        type={mediaNode.attrs.type as MediaType}
        id={mediaNode.attrs.id}
        collection={mediaNode.attrs.collection}
        alt="test"
        marks={[]}
        isLinkMark={() => false}
        allowAltTextOnImages={true}
      />,
    );

    const mediaCard = mediaComponent.find(MediaCard);
    expect(mediaCard.length).toEqual(1);
    expect(mediaCard.prop('alt')).toBe('test');
    mediaComponent.unmount();
  });

  it('event handlers are not called when media is linked', () => {
    const mediaOnClick = jest.fn();
    const mediaComponent = mount(
      <Media
        type={mediaNode.attrs.type as MediaType}
        id={mediaNode.attrs.id}
        collection={mediaNode.attrs.collection}
        alt="test"
        marks={[{ attrs: { href: 'http://atlassian.com' } } as any]}
        isLinkMark={() => true}
        allowAltTextOnImages={true}
        eventHandlers={{ media: { onClick: mediaOnClick } }}
      />,
    );
    mediaComponent.find(MediaLink).simulate('click');
    const mediaCardProps = mediaComponent.find(MediaCard).props();
    expect(mediaCardProps.eventHandlers).toEqual(undefined);
    expect(mediaOnClick).not.toHaveBeenCalled();
  });

  it('calls the link handlers when linked media is clicked', () => {
    const linkOnClick = jest.fn();
    const mediaComponent = mount(
      <Media
        type={mediaNode.attrs.type as MediaType}
        id={mediaNode.attrs.id}
        collection={mediaNode.attrs.collection}
        alt="test"
        marks={[{ attrs: { href: 'http://atlassian.com' } } as any]}
        isLinkMark={() => true}
        allowAltTextOnImages={true}
        eventHandlers={{ link: { onClick: linkOnClick } }}
      />,
    );
    mediaComponent.find(MediaLink).simulate('click');
    expect(linkOnClick).toHaveBeenCalled();
  });

  it('calls event handlers', () => {
    const mediaOnClick = jest.fn();
    const mediaComponent = mount(
      <Media
        type={mediaNode.attrs.type as MediaType}
        id={mediaNode.attrs.id}
        collection={mediaNode.attrs.collection}
        alt="test"
        marks={[]}
        isLinkMark={() => false}
        allowAltTextOnImages={true}
        eventHandlers={{ media: { onClick: mediaOnClick } }}
      />,
    );
    const mediaCardProps = mediaComponent.find(MediaCard).props();
    expect(mediaCardProps.eventHandlers).toEqual({
      media: { onClick: mediaOnClick },
    });
    expect(mediaOnClick).not.toHaveBeenCalled();
  });

  it('fires analytics on linked media', () => {
    const mediaOnClick = jest.fn();
    const fireAnalyticsEvent = jest.fn();
    const mediaComponent = mount(
      <Media
        type={mediaNode.attrs.type as MediaType}
        id={mediaNode.attrs.id}
        collection={mediaNode.attrs.collection}
        alt="test"
        fireAnalyticsEvent={fireAnalyticsEvent}
        marks={[{ attrs: { href: 'http://atlassian.com' } } as any]}
        isLinkMark={() => true}
        allowAltTextOnImages={true}
        eventHandlers={{ media: { onClick: mediaOnClick } }}
      />,
    );
    mediaComponent.find(MediaLink).simulate('click');

    expect(fireAnalyticsEvent).toHaveBeenCalledWith({
      action: 'visited',
      actionSubject: 'media',
      actionSubjectId: 'link',
      attributes: {
        platform: 'web',
        mode: 'renderer',
      },
      eventType: 'track',
    });
  });

  it('should render a media component without alt text if FF is off', () => {
    const mediaComponent = mount(
      <Media
        type={mediaNode.attrs.type as MediaType}
        id={mediaNode.attrs.id}
        collection={mediaNode.attrs.collection}
        alt="test"
        marks={[]}
        isLinkMark={() => false}
        allowAltTextOnImages={false}
      />,
    );

    const mediaCard = mediaComponent.find(MediaCard);
    expect(mediaCard.length).toEqual(1);
    expect(mediaCard.prop('alt')).toBeFalsy();
    mediaComponent.unmount();
  });

  it('should render a media component with external image', () => {
    const mediaComponent = mount(
      <Media
        type="external"
        url="http://image.jpg"
        marks={[]}
        isLinkMark={() => false}
      />,
    );

    expect(mediaComponent.find(MediaCard).length).toEqual(1);
    mediaComponent.unmount();
  });

  describe('<MediaCard />', () => {
    it.each([
      [true, 'Alt text'],
      [false, undefined],
    ])(
      `shows alt text on an external media based on allowAltTextOnImages, when flag is %s`,
      async (allowAltTextOnImages, expectedAltText) => {
        const externalIdentifier = createExternalIdentifier();
        const mediaCard = mountExternalCard(externalIdentifier, {
          alt: expectedAltText,
          allowAltTextOnImages: allowAltTextOnImages,
        });
        await sleep(0);

        const card = mediaCard.find(Card);
        expect(card.length).toEqual(1);
        expect(card.prop('alt')).toBe(expectedAltText);
        mediaCard.unmount();
      },
    );

    it('should pass shouldOpenMediaViewer=true if there is no onClick callback', () => {
      const cardWithOnClick = mount(
        <MediaCard
          type="file"
          id="1"
          eventHandlers={{ media: { onClick: jest.fn() } }}
        />,
      );
      const cardWithoutOnClick = mount(<MediaCard type="file" id="1" />);

      // force media mediaClientConfig to be resolved
      cardWithOnClick
        .find(MediaCardInternal)
        .setState({ mediaClientConfig: {} });
      cardWithoutOnClick
        .find(MediaCardInternal)
        .setState({ mediaClientConfig: {} });

      expect(
        cardWithOnClick.find(Card).prop('shouldOpenMediaViewer'),
      ).toBeFalsy();
      expect(
        cardWithoutOnClick.find(Card).prop('shouldOpenMediaViewer'),
      ).toBeTruthy();
    });

    it('should pass shouldOpenMediaViewer=true if renderer appearance is not mobile', () => {
      const cardMobile = mount(
        <MediaCard type="file" id="1" rendererAppearance={'mobile'} />,
      );
      const cardNoMobile = mount(<MediaCard type="file" id="1" />);

      // force media mediaClientConfig to be resolved
      cardMobile.find(MediaCardInternal).setState({ mediaClientConfig: {} });
      cardNoMobile.find(MediaCardInternal).setState({ mediaClientConfig: {} });

      expect(
        cardNoMobile.find(Card).prop('shouldOpenMediaViewer'),
      ).toBeTruthy();
      expect(cardMobile.find(Card).prop('shouldOpenMediaViewer')).toBeFalsy();
    });

    it('should pass shouldOpenMediaViewer=true if property shouldOpenMediaViewer is set to true', () => {
      const cardWithOnClick = mount(
        <MediaCard
          type="file"
          id="1"
          shouldOpenMediaViewer={true}
          eventHandlers={{ media: { onClick: jest.fn() } }}
        />,
      );

      const cardMobile = mount(
        <MediaCard
          type="file"
          id="1"
          shouldOpenMediaViewer={true}
          rendererAppearance={'mobile'}
        />,
      );

      const cardWithoutOnClick = mount(
        <MediaCard type="file" id="1" shouldOpenMediaViewer={true} />,
      );

      // force media mediaClientConfig to be resolved
      cardWithOnClick
        .find(MediaCardInternal)
        .setState({ mediaClientConfig: {} });
      cardWithoutOnClick
        .find(MediaCardInternal)
        .setState({ mediaClientConfig: {} });
      cardMobile.find(MediaCardInternal).setState({ mediaClientConfig: {} });

      expect(
        cardWithOnClick.find(Card).prop('shouldOpenMediaViewer'),
      ).toBeTruthy();
      expect(
        cardWithoutOnClick.find(Card).prop('shouldOpenMediaViewer'),
      ).toBeTruthy();
      expect(cardMobile.find(Card).prop('shouldOpenMediaViewer')).toBeTruthy();
    });

    it('should pass shouldOpenMediaViewer=false if property shouldOpenMediaViewer is set to false', () => {
      const cardWithOnClick = mount(
        <MediaCard
          type="file"
          id="1"
          shouldOpenMediaViewer={false}
          eventHandlers={{ media: { onClick: jest.fn() } }}
        />,
      );
      const cardWithoutOnClick = mount(
        <MediaCard type="file" id="1" shouldOpenMediaViewer={false} />,
      );
      const cardMobile = mount(
        <MediaCard
          type="file"
          id="1"
          shouldOpenMediaViewer={false}
          rendererAppearance={'mobile'}
        />,
      );

      // force media mediaClientConfig to be resolved
      cardWithOnClick
        .find(MediaCardInternal)
        .setState({ mediaClientConfig: {} });
      cardWithoutOnClick
        .find(MediaCardInternal)
        .setState({ mediaClientConfig: {} });
      cardMobile.find(MediaCardInternal).setState({ mediaClientConfig: {} });

      expect(
        cardWithOnClick.find(Card).prop('shouldOpenMediaViewer'),
      ).toBeFalsy();
      expect(
        cardWithoutOnClick.find(Card).prop('shouldOpenMediaViewer'),
      ).toBeFalsy();
      expect(cardMobile.find(Card).prop('shouldOpenMediaViewer')).toBeFalsy();
    });

    it('should call passed onClick', () => {
      const onClick = jest.fn();
      const cardWithOnClick = mount(
        <MediaCard type="file" id="1" eventHandlers={{ media: { onClick } }} />,
      );

      // force media mediaClientConfig to be resolved
      cardWithOnClick
        .find(MediaCardInternal)
        .setState({ mediaClientConfig: {} });
      const cardComponent = cardWithOnClick.find(Card);
      const event: CardEvent = {
        event: {} as any,
        mediaItemDetails: {
          id: 'some-id',
          mediaType: 'image',
        },
      };
      cardComponent.props().onClick!(event);
      expect(onClick).toHaveBeenCalledWith(event, undefined);
    });

    it('should not call passed onClick when inline video is enabled and its a video file', () => {
      const onClick = jest.fn();
      const cardWithOnClick = mount(
        <MediaCard type="file" id="1" eventHandlers={{ media: { onClick } }} />,
      );

      // force media mediaClientConfig to be resolved
      cardWithOnClick
        .find(MediaCardInternal)
        .setState({ mediaClientConfig: {} });
      const cardComponent = cardWithOnClick.find(Card);
      const event: CardEvent = {
        event: {} as any,
        mediaItemDetails: {
          id: 'some-id',
          mediaType: 'video',
        },
      };
      cardComponent.props().onClick!(event);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should save fileState as a component state', async () => {
      const fileIdentifier = createFileIdentifier();
      const component = await mountFileCard(fileIdentifier);

      await nextTick();
      component.update();
      expect(mocks.mockMediaClient.file.getCurrentState).toBeCalled();
      expect(mocks.mockMediaClient.file.getCurrentState).toBeCalledWith(
        fileIdentifier.id,
        {
          collectionName: fileIdentifier.collectionName,
        },
      );
      await nextTick();
      component.update();
      expect(component.find(MediaCardInternal).state('fileState')).toEqual({
        id: 'file-id',
        mediaType: 'image',
        name: 'file_name',
        status: 'processed',
      });
    });

    it('should save fileState when id changes', async () => {
      const fileIdentifier = createFileIdentifier();
      const component = await mountFileCard(fileIdentifier);

      await nextTick();
      component.update();

      component.setProps({
        id: '123',
      });

      await nextTick();
      component.update();
      expect(mocks.mockMediaClient.file.getCurrentState).toBeCalledTimes(2);
    });

    describe('populates identifier cache for the page mediaClientConfig', () => {
      it('should have a mediaViewerDataSource if doc is passed for a file card', async () => {
        const fileIdentifier = createFileIdentifier();
        const mediaFileCard = await mountFileCard(fileIdentifier);

        await sleep(0);
        mediaFileCard.update();

        expect(mediaFileCard.find(Card).at(0).props()).toHaveProperty(
          'mediaViewerDataSource',
        );
        expect(
          mediaFileCard.find(Card).at(0).props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier] });
        mediaFileCard.unmount();
      });

      it('should have a mediaViewerDataSource if doc is passed for an external card', async () => {
        const externalIdentifier = createExternalIdentifier();
        const mediaExternalCard = mountExternalCard(externalIdentifier);

        await sleep(0);
        mediaExternalCard.update();

        expect(mediaExternalCard.find(Card).at(0).props()).toHaveProperty(
          'mediaViewerDataSource',
        );
        expect(
          mediaExternalCard.find(Card).at(0).props().mediaViewerDataSource,
        ).toEqual({ list: [externalIdentifier] });
        mediaExternalCard.unmount();
      });

      it('should update the list on re-render if new cards are added', async () => {
        const fileIdentifier = createFileIdentifier(1);
        const externalIdentifier = createExternalIdentifier(1);
        const mediaFileCard = await mountFileCard(fileIdentifier);
        const mediaExternalCard = mountExternalCard(externalIdentifier);

        await sleep(0);
        mediaFileCard.update();
        mediaExternalCard.update();

        expect(
          mediaFileCard.find(Card).at(0).props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier] });
        expect(
          mediaExternalCard.find(Card).at(0).props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier, externalIdentifier] });

        mediaFileCard.setProps({});
        expect(mediaFileCard.find(Card).at(0).props()).toHaveProperty(
          'mediaViewerDataSource',
        );
        expect(
          mediaFileCard.find(Card).at(0).props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier, externalIdentifier] });
        mediaFileCard.unmount();
        mediaExternalCard.unmount();
      });

      it('should remove card from the list if a card is unmounted', async () => {
        const fileIdentifier0 = createFileIdentifier(2);
        const fileIdentifier1 = createFileIdentifier(3);
        const externalIdentifier0 = createExternalIdentifier(2);
        const externalIdentifier1 = createExternalIdentifier(3);
        const mediaFileCard0 = await mountFileCard(fileIdentifier0);
        const mediaFileCard1 = await mountFileCard(fileIdentifier1);
        const mediaExternalCard0 = mountExternalCard(externalIdentifier0);
        const mediaExternalCard1 = mountExternalCard(externalIdentifier1);

        await sleep(0);
        mediaFileCard0.update();
        mediaFileCard1.update();
        mediaExternalCard0.update();
        mediaExternalCard1.update();

        mediaFileCard0.unmount();
        mediaExternalCard1.unmount();

        mediaFileCard1.setProps({});
        mediaExternalCard0.setProps({});

        expect(
          mediaFileCard1.find(Card).at(0).props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier1, externalIdentifier0] });
        expect(
          mediaExternalCard0.find(Card).at(0).props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier1, externalIdentifier0] });

        mediaFileCard1.unmount();
        mediaExternalCard0.unmount();
      });
    });

    it('should add media attrs for copy and paste', async () => {
      const fileIdentifier = createFileIdentifier();
      const mediaFileCard = await mountFileCard(fileIdentifier);

      await sleep();
      mediaFileCard.update();
      expect(mediaFileCard.find(CardWrapper)).toHaveLength(1);
      expect(mediaFileCard.find(CardWrapper).props()).toEqual(
        expect.objectContaining({
          'data-context-id': undefined,
          'data-type': 'file',
          'data-node-type': 'media',
          'data-width': undefined,
          'data-height': undefined,
          'data-id': fileIdentifier.id,
          'data-collection': 'MediaServicesSample',
        }),
      );
    });
  });

  describe('getClipboardAttrs()', () => {
    it('should return all needed properties for copy & paste', () => {
      expect(getClipboardAttrs({ id: '1', collection: 'collection' })).toEqual({
        'data-context-id': undefined,
        'data-type': 'file',
        'data-node-type': 'media',
        'data-width': undefined,
        'data-height': undefined,
        'data-id': '1',
        'data-collection': 'collection',
        'data-file-name': 'file',
        'data-file-size': 1,
        'data-file-mime-type': '',
      });
    });

    it('should get width and height from originalDimensions', () => {
      expect(
        getClipboardAttrs({
          id: '1',
          originalDimensions: { height: 40, width: 50 },
        }),
      ).toEqual({
        'data-context-id': undefined,
        'data-type': 'file',
        'data-node-type': 'media',
        'data-width': 50,
        'data-height': 40,
        'data-id': '1',
        'data-collection': undefined,
        'data-file-name': 'file',
        'data-file-size': 1,
        'data-file-mime-type': '',
      });
    });

    it('should return context-id', () => {
      expect(
        getClipboardAttrs({
          id: '1',
          contextIdentifierProvider: {
            objectId: 'object-id',
            containerId: 'container',
          },
        }),
      ).toEqual({
        'data-context-id': 'object-id',
        'data-type': 'file',
        'data-node-type': 'media',
        'data-width': undefined,
        'data-height': undefined,
        'data-id': '1',
        'data-collection': undefined,
        'data-file-name': 'file',
        'data-file-size': 1,
        'data-file-mime-type': '',
      });
    });

    it('should use fileState fields', () => {
      expect(
        getClipboardAttrs({
          id: '1',
          contextIdentifierProvider: {
            objectId: 'object-id',
            containerId: 'container',
          },
          fileState: {
            status: 'processing',
            id: '1',
            mediaType: 'image',
            mimeType: 'image/png',
            name: 'some_name',
            size: 5,
          },
        }),
      ).toEqual({
        'data-context-id': 'object-id',
        'data-type': 'file',
        'data-node-type': 'media',
        'data-width': undefined,
        'data-height': undefined,
        'data-id': '1',
        'data-collection': undefined,
        'data-file-name': 'some_name',
        'data-file-size': 5,
        'data-file-mime-type': 'image/png',
      });
    });
  });

  describe('#getListOfIdentifiersFromDoc()', () => {
    const external0 = {
      dataURI:
        'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon-152x152.png',
      mediaItemType: 'external-image',
      name:
        'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon-152x152.png',
    };
    const external1 = {
      dataURI:
        'https://images.unsplash.com/photo-1553526665-dbfe3e8a6fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80',
      mediaItemType: 'external-image',
      name:
        'https://images.unsplash.com/photo-1553526665-dbfe3e8a6fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80',
    };
    const file0 = {
      id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
      mediaItemType: 'file',
    };
    const file1 = {
      id: 'eff24b3b-fe78-4787-805e-492b28991232',
      mediaItemType: 'file',
    };

    it('should return empty array if nothing is found', () => {
      expect(getListOfIdentifiersFromDoc({ ...doc, content: [] })).toEqual([]);
    });

    it('should transform both external images and files', () => {
      expect(getListOfIdentifiersFromDoc(doc)).toEqual(
        expect.arrayContaining([external0, external1, file0, file1]),
      );
    });

    it("should not explode if node doesn't have attrs", () => {
      expect(
        getListOfIdentifiersFromDoc({
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'mediaSingle',
              attrs: {
                layout: 'center',
              },
              content: [
                {
                  type: 'media',
                  attrs: {
                    type: 'external',
                    width: 152,
                    height: 152,
                  },
                },
              ],
            },
            {
              type: 'mediaSingle',
              attrs: {
                layout: 'full-width',
              },
              content: [
                {
                  type: 'media',
                  attrs: {
                    id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    width: 5845,
                    height: 1243,
                  },
                },
              ],
            },
            {
              type: 'mediaSingle',
              attrs: {
                layout: 'wrap-left',
              },
              content: [
                {
                  type: 'media',
                  attrs: {
                    type: 'external',
                    url:
                      'https://images.unsplash.com/photo-1553526665-dbfe3e8a6fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80',
                  },
                },
              ],
            },
            {
              type: 'mediaSingle',
              attrs: {
                layout: 'wrap-left',
              },
              content: [
                {
                  type: 'media',
                  attrs: {},
                },
              ],
            },
          ],
        }),
      ).toEqual([file0, external1]);
    });

    it("should not explode if node attrs don't have urls", () => {
      expect(
        getListOfIdentifiersFromDoc({
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'mediaSingle',
              attrs: {
                layout: 'center',
              },
              content: [
                {
                  type: 'media',
                  attrs: {},
                },
              ],
            },
            {
              type: 'mediaSingle',
              attrs: {
                layout: 'full-width',
              },
              content: [
                {
                  type: 'media',
                  attrs: {
                    id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    width: 5845,
                    height: 1243,
                  },
                },
              ],
            },
            {
              type: 'mediaSingle',
              attrs: {
                layout: 'wrap-left',
              },
              content: [
                {
                  type: 'media',
                  attrs: {
                    type: 'external',
                    url:
                      'https://images.unsplash.com/photo-1553526665-dbfe3e8a6fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80',
                  },
                },
              ],
            },
            {
              type: 'mediaSingle',
              attrs: {
                layout: 'wrap-left',
              },
              content: [
                {
                  type: 'media',
                  attrs: {
                    type: 'file',
                    collection: 'MediaServicesSample',
                    width: 6000,
                    height: 4000,
                  },
                },
              ],
            },
          ],
        }),
      ).toEqual([file0, external1]);
    });
  });
});
