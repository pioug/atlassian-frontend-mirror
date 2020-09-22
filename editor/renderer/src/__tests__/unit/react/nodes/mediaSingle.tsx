import React from 'react';
import { imageFileId } from '@atlaskit/media-test-helpers';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import Media, { MediaProps } from '../../../../react/nodes/media';
import MediaSingle, {
  Props as MediaSingleProps,
} from '../../../../react/nodes/mediaSingle';
import Caption from '../../../../react/nodes/caption';
import { MediaCardInternal } from '../../../../ui/MediaCard';
import { WidthProvider } from '@atlaskit/editor-common';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import { ReactWrapper } from 'enzyme';
import { InjectedIntlProps } from 'react-intl';

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
          marks={[]}
          isLinkMark={() => false}
          {...mediaSingleProps}
        >
          <Media
            id={imageFileId.id}
            type={imageFileId.mediaItemType}
            collection={imageFileId.collectionName}
            {...mediaProps}
          />
          {showCaption && <Caption>This is a caption</Caption>}
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
    Object.defineProperties(document.body, {
      offsetWidth: {
        get: () => 123,
      },
    });

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
  });

  describe('with link mark', () => {
    let mediaSingle: ReactWrapper<InjectedIntlProps, any>;
    const fireAnalyticsEvent = jest.fn();
    const mediaOnClick = jest.fn();

    beforeAll(() => {
      mediaSingle = mountMediaSingle(
        {
          fireAnalyticsEvent,

          marks: [{ attrs: { href: 'http://atlassian.com' } } as any],
          isLinkMark: () => true,
        },
        {
          shouldOpenMediaViewer: true,
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
        mediaSingle.find(
          'MediaLink[href="http://atlassian.com"][target="_blank"]',
        ),
      ).toHaveLength(1);
    });

    it('override eventHandlers to undefined', () => {
      const mediaProps = mediaSingle.find('Media').props() as MediaProps;
      expect(mediaProps.eventHandlers).toBeUndefined();
    });

    it('override shouldOpenMediaViewer to be falsy', () => {
      const mediaProps = mediaSingle.find('Media').props() as MediaProps;
      expect(mediaProps.shouldOpenMediaViewer).toBeFalsy();
    });

    it('fires analytics on linked media', () => {
      mediaSingle.find('Media').simulate('click');

      expect(fireAnalyticsEvent).toHaveBeenCalledWith({
        action: 'visited',
        actionSubject: 'mediaSingle',
        actionSubjectId: 'mediaLink',
        attributes: {
          platform: 'web',
          mode: 'renderer',
        },
        eventType: 'track',
      });

      expect(mediaOnClick).not.toHaveBeenCalled();
    });
  });

  it('does not override media props when there is not link', () => {
    const mediaOnClick = jest.fn();
    const mediaSingle = mountMediaSingle(
      {
        marks: [],
      },
      {
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
});
