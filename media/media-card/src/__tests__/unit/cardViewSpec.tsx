jest.mock('../../utils/breakpoint', () => ({
  breakpointSize: jest.fn(),
  breakpointStyles: jest.fn(),
}));
jest.mock('../../utils/shouldDisplayImageThumbnail', () => ({
  shouldDisplayImageThumbnail: jest.fn(() => true),
}));

import React from 'react';

import { shallow, mount } from 'enzyme';
import { FileDetails } from '@atlaskit/media-client';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { CardView, CardViewBase, CardViewOwnProps } from '../../root/cardView';
import { FileCardImageView } from '../../files';
import { Wrapper } from '../../root/styled';
import { breakpointSize, BreakpointSizeValue } from '../../utils/breakpoint';

import { shouldDisplayImageThumbnail } from '../../utils/shouldDisplayImageThumbnail';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { CardDimensionValue } from '../../index';
import { FormattedMessage } from 'react-intl';
import * as mediaUi from '@atlaskit/media-ui';

const mockHumanReadableMediaSize = 'some KB';
jest.mock('@atlaskit/media-ui', () => ({
  ...jest.requireActual<Object>('@atlaskit/media-ui'),
  toHumanReadableMediaSize: jest.fn(() => mockHumanReadableMediaSize),
}));

describe('CardView', () => {
  const file: FileDetails = {
    id: 'abcd',
    name: 'my-file',
    mimeType: 'image/png',
    size: 42,
    processingStatus: 'pending',
    mediaType: 'image',
  };

  let createAnalyticsEventMock: any;
  beforeEach(() => {
    createAnalyticsEventMock = jest.fn();
    (shouldDisplayImageThumbnail as any).mockReturnValue(true);
  });

  const shallowCardViewBaseElement = (
    props: Partial<CardViewOwnProps>,
    renderOptions = {},
  ) =>
    shallow(
      <CardViewBase
        createAnalyticsEvent={createAnalyticsEventMock}
        status="loading"
        {...props}
      />,
      renderOptions,
    );

  describe('render FileCardImageView', () => {
    it('should render FileCardImageView when no metadata is passed', () => {
      const element = mount(<CardView status="loading" mediaItemType="file" />);
      const fileCard = element.find(FileCardImageView);
      expect(fileCard).toHaveLength(1);
    });

    it('should render FileCardImageView with details passed through to props', function () {
      const filesize = 123456;

      const details: FileDetails = {
        id: 'id',
        mediaType: 'image',
        mimeType: 'image/jpeg',
        name: 'some-image.jpg',
        processingStatus: 'succeeded',
        size: filesize,
        artifacts: {},
      };

      const expectedProps = {
        status: 'complete',
        dimensions: undefined,

        mediaName: details.name,
        mediaType: details.mediaType,
        fileSize: mockHumanReadableMediaSize,
      };
      const card = shallowCardViewBaseElement({
        metadata: details,
        status: 'complete',
      });

      const fileCardView = card.find(FileCardImageView);
      expect(fileCardView.length).toEqual(1);
      expect(fileCardView.props()).toMatchObject(expectedProps);
      expect(mediaUi.toHumanReadableMediaSize).toBeCalledWith(filesize);
    });

    it('should render FileCardImageView with dataUri when passed', () => {
      const fakeDataUri: string = 'l33tdatauri';

      const details: FileDetails = {
        id: 'id',
        mediaType: 'image',
        mimeType: 'image/jpeg',
        name: 'some-image.jpg',
        processingStatus: 'succeeded',
        size: 123456,
        artifacts: {},
      };

      const card = shallowCardViewBaseElement({
        metadata: details,
        status: 'complete',
        dataURI: fakeDataUri,
      });

      expect(card.find(FileCardImageView).length).toEqual(1);
      expect(card.find(FileCardImageView).props().dataURI).toContain(
        fakeDataUri,
      );
    });

    it('should render FileCardImageView with alt prop when passed', () => {
      const details: FileDetails = {
        id: 'id',
        mediaType: 'image',
        mimeType: 'image/jpeg',
        name: 'some-image.jpg',
        processingStatus: 'succeeded',
        size: 123456,
        artifacts: {},
      };

      const alt = 'this is a test';

      const card = shallowCardViewBaseElement({
        metadata: details,
        status: 'complete',
        alt,
      });

      expect(card.find(FileCardImageView).length).toEqual(1);
      expect(card.find(FileCardImageView).props().alt).toBe(alt);
    });

    it('should pass "Failed to load" copy to "image" card view', () => {
      const card = shallowCardViewBaseElement({ status: 'error' });

      expect(
        (card.find(FileCardImageView).prop('error')! as FormattedMessage).props
          .defaultMessage,
      ).toEqual('Failed to load');
    });

    it('should pass "disableOverlay" prop to <FileCardImageView /> when appearance is "image"', () => {
      const card = shallowCardViewBaseElement({
        status: 'complete',
        disableOverlay: true,
      });

      expect(card.find(FileCardImageView).props().disableOverlay).toEqual(true);
    });
  });

  it('should render a cropped image by default', () => {
    const card = mount(
      <CardView
        status="complete"
        mediaItemType="file"
        dataURI="a"
        metadata={file}
      />,
    );

    expect(card.find('MediaImage').prop('crop')).toBe(true);
  });

  it('should render a non-stretched image by default', () => {
    const card = mount(
      <CardView
        status="complete"
        mediaItemType="file"
        dataURI="a"
        metadata={file}
      />,
    );

    expect(card.find('MediaImage').prop('stretch')).toBe(false);
  });

  it('should render not render a cropped image if we specify a different resizeMode', () => {
    const card = mount(
      <CardView
        status="complete"
        mediaItemType="file"
        dataURI="a"
        metadata={file}
        resizeMode="full-fit"
      />,
    );

    expect(card.find('MediaImage').prop('crop')).toBe(false);
  });

  it('should render a stretched image if we specify stretchy-fit resizeMode', () => {
    const card = mount(
      <CardView
        status="complete"
        mediaItemType="file"
        dataURI="a"
        metadata={file}
        resizeMode="stretchy-fit"
      />,
    );

    expect(card.find('MediaImage').prop('stretch')).toBe(true);
  });

  describe('Dimensions', () => {
    it('should render wrapper with correct breakpoint size', () => {
      const dimensions = { width: '100%', height: '50%' };

      ((breakpointSize as (
        width: CardDimensionValue,
        sizes?: any,
      ) => BreakpointSizeValue) as jest.Mock<string>).mockReturnValue('small');
      const element = shallowCardViewBaseElement(
        {
          status: 'loading',
          metadata: file,
          dimensions,
        },
        { disableLifecycleMethods: true },
      );
      expect(breakpointSize).toHaveBeenCalledWith('100%');

      expect(element.find(Wrapper).props().breakpointSize).toEqual('small');
    });

    it('should render wrapper with default dimensions based on default appearance when dimensions and appearance are not provided', () => {
      const element = shallowCardViewBaseElement({
        status: 'loading',
        metadata: file,
      });
      expect(element.find(Wrapper).props().dimensions).toEqual({
        width: 156,
        height: 125,
      });
    });

    it('should use default dimensions based on passed appearance', () => {
      const element = shallowCardViewBaseElement({
        status: 'loading',
        metadata: file,
      });
      expect(element.find(Wrapper).props().dimensions).toEqual({
        width: 156,
        height: 125,
      });
    });

    it('should use passed dimensions when provided', () => {
      const element = shallowCardViewBaseElement(
        {
          status: 'loading',
          metadata: file,
          dimensions: { width: '70%', height: 100 },
        },
        { disableLifecycleMethods: true },
      );

      expect(element.find(Wrapper).props().dimensions).toEqual({
        width: '70%',
        height: 100,
      });
    });

    it('should use item type to calculate default dimensions', () => {
      const element = shallowCardViewBaseElement({
        status: 'loading',
        metadata: file,
      });
      const props = element.find(Wrapper).props();

      expect(props.dimensions).toEqual({
        width: 156,
        height: 125,
      });
    });

    it('should pass "disableOverlay" prop to <FileCard /> when mediaItemType is "file"', () => {
      const element = shallowCardViewBaseElement(
        {
          status: 'complete',
          metadata: file,
          disableOverlay: true,
        },
        { disableLifecycleMethods: true },
      );

      expect(element.find(FileCardImageView).props().disableOverlay).toEqual(
        true,
      );
    });
  });

  it('should return analytics event as a last argument when card is clicked', () => {
    const clickHandler = jest.fn();
    const analyticsEventHandler = jest.fn();
    const card = mount(
      <AnalyticsListener
        channel={FabricChannel.media}
        onEvent={analyticsEventHandler}
      >
        <CardView
          status="loading"
          mediaItemType="file"
          metadata={file}
          onClick={clickHandler}
        />
      </AnalyticsListener>,
    );

    card.simulate('click');

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(analyticsEventHandler).toHaveBeenCalledTimes(1);
    const actualFiredEvent: Partial<UIAnalyticsEvent> =
      analyticsEventHandler.mock.calls[0][0];
    const actualReturnedEvent: UIAnalyticsEvent = clickHandler.mock.calls[0][1];
    expect(actualFiredEvent.hasFired).toEqual(true);
    expect(actualFiredEvent.payload).toMatchObject({
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'mediaCard',
      attributes: {},
    });
    expect(actualReturnedEvent.hasFired).toEqual(false);
    expect(actualReturnedEvent.payload.action).toEqual('clicked');
    expect(actualReturnedEvent.context).toEqual(actualFiredEvent.context);
  });

  it('should trigger "media-viewed" in globalMediaEventEmitter when image card is rendered', () => {
    const onDisplayImage = jest.fn();
    mount(
      <CardView
        status="complete"
        mediaItemType="file"
        dataURI="a"
        metadata={file}
        resizeMode="stretchy-fit"
        onDisplayImage={onDisplayImage}
      />,
    );

    expect(onDisplayImage).toHaveBeenCalledTimes(1);
  });
});
