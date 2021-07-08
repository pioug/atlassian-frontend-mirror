import React from 'react';
import { imageFileId } from '@atlaskit/media-test-helpers';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import Media, { MediaProps } from '../../../../react/nodes/media';
import MediaSingle, {
  getMediaContainerWidth,
  Props as MediaSingleProps,
} from '../../../../react/nodes/mediaSingle';
import Caption from '../../../../react/nodes/caption';
import { MediaCardInternal } from '../../../../ui/MediaCard';
import { UnsupportedBlock, WidthProvider } from '@atlaskit/editor-common';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ReactWrapper } from 'enzyme';
import { InjectedIntlProps } from 'react-intl';
import { ExtendedUIMediaSingle } from '../../../../react/nodes/mediaSingle/styles';

describe('MediaSingle', () => {
  const editorWidth = 123;

  const mountMediaSingle = (
    mediaSingleProps: Partial<MediaSingleProps> = {},
    mediaProps: Partial<MediaProps & { width: number; heigth: number }> = {},
    showCaption: boolean = true,
  ): ReactWrapper<InjectedIntlProps, any> => {
    return mountWithIntl(
      <WidthProvider>
        <MediaSingle
          layout={'center'}
          rendererAppearance={'full-page'}
          {...mediaSingleProps}
        >
          <Media
            id={imageFileId.id}
            isLinkMark={() => false}
            marks={[]}
            type={imageFileId.mediaItemType}
            collection={imageFileId.collectionName}
            {...mediaProps}
          />
          {showCaption && (
            <Caption
              marks={[]}
              serializer={{} as any}
              nodeType="caption"
              dataAttributes={{ 'data-renderer-start-pos': 0 }}
            >
              This is a caption
            </Caption>
          )}
        </MediaSingle>
      </WidthProvider>,
    );
  };

  it('passes the renderer width down as cardDimensions', () => {
    const mediaDimensions = {
      width: 250,
      height: 250,
    };
    const mediaAspectRatio = mediaDimensions.height / mediaDimensions.width;

    // mock page width
    const mockOffsetWidth = jest
      .spyOn(window.HTMLElement.prototype, 'offsetWidth', 'get')
      .mockReturnValue(123);

    const mediaSingle = mountMediaSingle({}, { ...mediaDimensions });

    const { cardDimensions } = mediaSingle.find(Media).props();
    expect(cardDimensions).toBeDefined();

    const cardHeightCss = cardDimensions!.height as string;
    const cardHeight = Number(
      cardHeightCss.substring(0, cardHeightCss.length - 2),
    );

    expect(cardDimensions!.width).toEqual(`${editorWidth}px`);
    expect(cardHeight).toBeCloseTo(editorWidth * mediaAspectRatio);

    mediaSingle.unmount();

    // reset mock page width
    mockOffsetWidth.mockReturnValue(0);
  });

  describe('with link mark', () => {
    let mediaSingle: ReactWrapper<InjectedIntlProps, any>;
    const fireAnalyticsEvent = jest.fn();
    const mediaOnClick = jest.fn();

    beforeAll(() => {
      mediaSingle = mountMediaSingle(
        {
          fireAnalyticsEvent,
        },
        {
          marks: [{ attrs: { href: 'http://atlassian.com' } } as any],
          isLinkMark: () => true,
          eventHandlers: { media: { onClick: mediaOnClick } },
        },
      );
    });

    afterAll(() => {
      if (mediaSingle) {
        mediaSingle.unmount();
      }
    });

    it('renders media with link correctly', () => {
      expect(
        mediaSingle.find('MediaLink[href="http://atlassian.com"]'),
      ).toHaveLength(1);
    });

    it('override shouldOpenMediaViewer to be falsy', () => {
      const mediaProps = mediaSingle.find('Media').props() as MediaProps;
      expect(mediaProps.shouldOpenMediaViewer).toBeFalsy();
    });
  });

  it('does not override media props when there is not link', () => {
    const mediaOnClick = jest.fn();
    const mediaSingle = mountMediaSingle(
      {},
      {
        marks: [],
        shouldOpenMediaViewer: true,
        eventHandlers: { media: { onClick: mediaOnClick } },
      },
    );

    const mediaProps = mediaSingle.find('Media').props() as MediaProps;
    expect(mediaProps.eventHandlers).toEqual({
      media: { onClick: mediaOnClick },
    });
    expect(mediaProps.shouldOpenMediaViewer).toEqual(true);
    mediaSingle.unmount();
  });

  it('passes feature flags down to media node', () => {
    const featureFlags: MediaFeatureFlags = {
      captions: false,
      newCardExperience: true,
    };
    const mediaSingle = mountMediaSingle({ featureFlags });

    expect(mediaSingle.find(MediaCardInternal).props().featureFlags).toEqual(
      featureFlags,
    );
    mediaSingle.unmount();
  });

  it('should use default editor width when <WidthConsumer /> value is not available', () => {
    const mediaSingle = mountMediaSingle();

    expect(
      mediaSingle.find(ExtendedUIMediaSingle).prop('containerWidth'),
    ).toEqual(760);
  });

  describe('Captions', () => {
    it("don't show caption if feature flag turned off", () => {
      const mediaSingle = mountMediaSingle({
        featureFlags: { captions: false },
      });

      expect(mediaSingle.find(Caption)).toHaveLength(0);
      mediaSingle.unmount();
    });
    it("don't show caption if feature flags aren't provided", () => {
      const mediaSingle = mountMediaSingle({ featureFlags: undefined });

      expect(mediaSingle.find(Caption)).toHaveLength(0);
      mediaSingle.unmount();
    });
    it('show caption if feature flag is toggle on', () => {
      const mediaSingle = mountMediaSingle({
        featureFlags: { captions: true },
      });

      expect(mediaSingle.find(Caption)).toHaveLength(1);
      mediaSingle.unmount();
    });
    it('still render media if caption is not provided', () => {
      const mediaSingle = mountMediaSingle(
        {
          featureFlags: { captions: true },
        },
        {},
        false,
      );

      expect(mediaSingle.find(Caption)).toHaveLength(0);
      expect(mediaSingle.find(Media)).toHaveLength(1);
      mediaSingle.unmount();
    });
  });

  describe('getMediaContainerWidth()', () => {
    it('should return existing value if available', () => {
      expect(getMediaContainerWidth(100, 'center')).toEqual(100);
      expect(getMediaContainerWidth(100, 'full-width')).toEqual(100);
      expect(getMediaContainerWidth(100, 'wide')).toEqual(100);
    });

    it('should return existing value if layout is not full-width or wide', () => {
      expect(getMediaContainerWidth(0, 'full-width')).toEqual(0);
      expect(getMediaContainerWidth(0, 'wide')).toEqual(0);
      expect(getMediaContainerWidth(100, 'full-width')).toEqual(100);
      expect(getMediaContainerWidth(100, 'wide')).toEqual(100);
    });

    it('should return default value when existing container width is not available and layout is not full-width or wide', () => {
      expect(getMediaContainerWidth(0, 'center')).toEqual(760);
      expect(getMediaContainerWidth(0, 'align-end')).toEqual(760);
    });
  });

  describe('Unsupported content', () => {
    it('should return Unsupported Block node when there is no media element', () => {
      const unsupportedBlock = <UnsupportedBlock></UnsupportedBlock>;
      const mediaSingle = mountWithIntl(
        <WidthProvider>
          <MediaSingle layout={'center'} rendererAppearance={'full-page'}>
            {unsupportedBlock}
          </MediaSingle>
        </WidthProvider>,
      );
      expect(mediaSingle.find(UnsupportedBlock)).toHaveLength(1);
    });

    it('should return only Unsupported Block when there is no Media Element', () => {
      const unsupportedBlock = <UnsupportedBlock></UnsupportedBlock>;
      const mediaSingle = mountWithIntl(
        <WidthProvider>
          <MediaSingle layout={'center'} rendererAppearance={'full-page'}>
            {unsupportedBlock}
            {
              <Caption
                marks={[]}
                serializer={{} as any}
                nodeType="caption"
                dataAttributes={{ 'data-renderer-start-pos': 0 }}
              >
                This is a caption
              </Caption>
            }
          </MediaSingle>
        </WidthProvider>,
      );
      expect(mediaSingle.find(UnsupportedBlock)).toHaveLength(1);
      expect(mediaSingle.find(Caption)).toHaveLength(0);
    });
  });
});
