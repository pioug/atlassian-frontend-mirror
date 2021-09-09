import React from 'react';
import { mount } from 'enzyme';
import { FileIdentifier, MediaClient } from '@atlaskit/media-client';
import { MediaImage } from '@atlaskit/media-ui';
import SpinnerIcon from '@atlaskit/spinner';

import { CardSSRView } from '../../card/cardSSRView';
import { CardDimensions } from '../../..';
import { CardImageContainer } from '../../ui/styledSSR';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
const asAMock = (fn: unknown): jest.Mock => fn as jest.Mock;

describe(CardSSRView, () => {
  function givenAnIdentifier(): FileIdentifier {
    return {
      id: 'id',
      mediaItemType: 'file',
      collectionName: 'collection name',
      occurrenceKey: 'occurance key',
    };
  }
  function givenDimensions(): CardDimensions {
    return {
      height: 14,
      width: 18,
    };
  }

  function withSyncUrl(
    client: MediaClient,
    syncUrlAction: (...props: any[]) => string,
  ): MediaClient {
    asAMock(client.getImageUrlSync).mockImplementation(syncUrlAction);
    return client;
  }

  function givenAFakeMediaClient(): MediaClient {
    return withSyncUrl(fakeMediaClient(), () => 'https://fake.image.url');
  }

  function givenAFakeMediaClientThatCantGetAUrl(): MediaClient {
    return withSyncUrl(fakeMediaClient(), () => {
      throw new Error('oops no auth');
    });
  }

  function givenAFakeMediaClientThatReturnsEmptyStringForImageUrl(): MediaClient {
    return withSyncUrl(fakeMediaClient(), () => '');
  }

  it('should render Card Image Container', () => {
    const identifier = givenAnIdentifier();

    const wrapper = mount(
      <CardSSRView
        identifier={identifier}
        dimensions={givenDimensions()}
        mediaClient={givenAFakeMediaClient()}
        alt="alt text"
        resizeMode="fit"
        disableOverlay={false}
      />,
    );

    expect(wrapper.find(CardImageContainer)).toHaveLength(1);
  });

  describe('should use the correct parameters to fetch the image url', () => {
    it('should use id to fetch image url synchronusly', () => {
      const identifier = givenAnIdentifier();
      const mediaClient = givenAFakeMediaClient();

      const dimensions = givenDimensions();
      mount(
        <CardSSRView
          identifier={identifier}
          dimensions={dimensions}
          mediaClient={mediaClient}
          resizeMode={'crop'}
          alt="alt text"
          disableOverlay={false}
        />,
      );

      expect(mediaClient.getImageUrlSync).toHaveBeenCalledWith(identifier.id, {
        collection: identifier.collectionName,
        mode: 'crop',
        width: dimensions.width,
        height: dimensions.height,
        allowAnimated: true,
      });
    });

    test.each`
      mode              | expectedMode
      ${'stretchy-fit'} | ${'full-fit'}
      ${'full-fit'}     | ${'full-fit'}
      ${'crop'}         | ${'crop'}
      ${'fit'}          | ${'fit'}
    `(
      'should use $expectedMode when $mode is passed in',
      ({ mode, expectedMode }) => {
        const identifier = givenAnIdentifier();
        const mediaClient = givenAFakeMediaClient();
        const dimensions = givenDimensions();
        mount(
          <CardSSRView
            identifier={identifier}
            dimensions={dimensions}
            mediaClient={mediaClient}
            resizeMode={mode}
            alt="alt text"
            disableOverlay={false}
          />,
        );

        expect(mediaClient.getImageUrlSync).toHaveBeenCalledWith(
          identifier.id,
          {
            collection: identifier.collectionName,
            mode: expectedMode,
            width: dimensions.width,
            height: dimensions.height,
            allowAnimated: true,
          },
        );
      },
    );
  });

  it('should render the spinner and not the image when an error occurs getting the image url', () => {
    const wrapper = mount(
      <CardSSRView
        identifier={givenAnIdentifier()}
        dimensions={givenDimensions()}
        mediaClient={givenAFakeMediaClientThatCantGetAUrl()}
        alt="alt text"
        resizeMode="fit"
        disableOverlay={false}
      />,
    );

    expect(wrapper.find(CardImageContainer)).toHaveLength(1);
    expect(wrapper.find(SpinnerIcon)).toHaveLength(1);
    expect(wrapper.find(MediaImage)).toHaveLength(0);
  });

  it('should render the spinner and not the image when the image url is empty', () => {
    const wrapper = mount(
      <CardSSRView
        identifier={givenAnIdentifier()}
        dimensions={givenDimensions()}
        mediaClient={givenAFakeMediaClientThatReturnsEmptyStringForImageUrl()}
        alt="alt text"
        disableOverlay={false}
        resizeMode="fit"
      />,
    );

    expect(wrapper.find(CardImageContainer)).toHaveLength(1);
    expect(wrapper.find(SpinnerIcon)).toHaveLength(1);
    expect(wrapper.find(MediaImage)).toHaveLength(0);
  });

  it('should render ImageRenderer and spinner when a image url can be found', () => {
    const identifier = givenAnIdentifier();

    const wrapper = mount(
      <CardSSRView
        identifier={identifier}
        dimensions={givenDimensions()}
        mediaClient={givenAFakeMediaClient()}
        alt="alt text"
        resizeMode="fit"
        disableOverlay={false}
      />,
    );
    expect(wrapper.find(SpinnerIcon)).toHaveLength(1);
    expect(wrapper.find(MediaImage)).toHaveLength(1);
  });
});