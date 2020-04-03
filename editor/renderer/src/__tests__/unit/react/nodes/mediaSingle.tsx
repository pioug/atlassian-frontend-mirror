import React from 'react';
import { imageFileId } from '@atlaskit/media-test-helpers';
import Media from '../../../../react/nodes/media';
import MediaSingle from '../../../../react/nodes/mediaSingle';
import { WidthProvider } from '@atlaskit/editor-common';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';

describe('MediaSingle', () => {
  const editorWidth = 123;

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

    const mediaSingle = mountWithIntl(
      <WidthProvider>
        <MediaSingle
          layout={'center'}
          rendererAppearance={'full-page'}
          marks={[]}
          isLinkMark={() => false}
        >
          <Media
            id={imageFileId.id}
            type={imageFileId.mediaItemType}
            collection={imageFileId.collectionName}
            {...mediaDimensions}
          />
        </MediaSingle>
      </WidthProvider>,
    );

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

  it('fires on linked media', () => {
    const fireAnalyticsEvent = jest.fn();
    const mediaDimensions = {
      width: 250,
      height: 250,
    };

    const mediaSingle = mountWithIntl(
      <WidthProvider>
        <MediaSingle
          layout={'center'}
          rendererAppearance={'full-page'}
          marks={[{ attrs: { href: 'http://atlassian.com' } } as any]}
          isLinkMark={() => true}
          fireAnalyticsEvent={fireAnalyticsEvent}
        >
          <Media
            id={imageFileId.id}
            type={imageFileId.mediaItemType}
            collection={imageFileId.collectionName}
            {...mediaDimensions}
          />
        </MediaSingle>
      </WidthProvider>,
    );

    fireAnalyticsEvent.mockClear();
    mediaSingle.find('a').simulate('click');

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

    mediaSingle.unmount();
  });
});
