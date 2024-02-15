import React from 'react';
import { mount, shallow } from 'enzyme';
import * as sinon from 'sinon';
import {
  imageFileId,
  genericFileId,
  nextTick,
} from '@atlaskit/media-test-helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import type { CardEvent } from '@atlaskit/media-card';
import { Card, defaultImageCardDimensions } from '@atlaskit/media-card';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { UnsupportedBlock } from '@atlaskit/editor-common/ui';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import Media from '../../../../react/nodes/media';
import MediaGroup from '../../../../react/nodes/mediaGroup';
import { MediaCardInternal } from '../../../../ui/MediaCard';
import { act } from 'react-dom/test-utils';
import { MediaClientContext } from '@atlaskit/media-client-react';
import * as mocks from './media.mock';

describe('MediaGroup', () => {
  let fixture: HTMLDivElement;

  const mediaProvider = storyMediaProviderFactory();

  const providerFactory = ProviderFactory.create({ mediaProvider });

  beforeEach(() => {
    fixture = document.createElement('div');
    document.body.appendChild(fixture);
  });

  afterEach(() => {
    document.body.removeChild(fixture);
  });

  it('should render media card with the right dimention if is a file', () => {
    const mediaGroup = shallow(
      <MediaGroup>
        <Media
          id={genericFileId.id}
          type={genericFileId.mediaItemType}
          marks={[]}
          isLinkMark={() => false}
          isBorderMark={() => false}
          collection={genericFileId.collectionName}
        />
      </MediaGroup>,
    );
    expect(mediaGroup.find(Media).prop('cardDimensions')).toEqual(
      defaultImageCardDimensions,
    );
  });

  it('should not render a FilmstripView component if it has only one media node', () => {
    const mediaGroup = mount(
      <MediaGroup>
        <Media
          id={imageFileId.id}
          type={imageFileId.mediaItemType}
          marks={[]}
          isLinkMark={() => false}
          isBorderMark={() => false}
          collection={imageFileId.collectionName}
        />
      </MediaGroup>,
    );
    expect(mediaGroup.find(FilmstripView)).toHaveLength(0);
  });

  it('should render a FilmstripView component if it has more than one media node', () => {
    const mediaGroup = shallow(
      <MediaGroup>
        <Media
          id={imageFileId.id}
          type={imageFileId.mediaItemType}
          marks={[]}
          isLinkMark={() => false}
          isBorderMark={() => false}
          collection={imageFileId.collectionName}
        />
        <Media
          id={imageFileId.id}
          marks={[]}
          isLinkMark={() => false}
          isBorderMark={() => false}
          type={imageFileId.mediaItemType}
          collection={imageFileId.collectionName}
        />
      </MediaGroup>,
    );
    expect(mediaGroup.find(FilmstripView)).toHaveLength(1);
  });

  it('should call onClick with all the items in a media group', async () => {
    const onClick = sinon.spy() as any;
    const eventHandlers = {
      media: { onClick },
    } as EventHandlers;
    const mediaGroup = mount(
      <MediaClientContext.Provider value={mocks.mockMediaClient}>
        <MediaGroup eventHandlers={eventHandlers}>
          <Media
            id={imageFileId.id}
            type={imageFileId.mediaItemType}
            occurrenceKey="001"
            marks={[]}
            isLinkMark={() => false}
            isBorderMark={() => false}
            collection={imageFileId.collectionName}
            providers={providerFactory}
          />
          <Media
            id={imageFileId.id}
            type={imageFileId.mediaItemType}
            occurrenceKey="001"
            marks={[]}
            isLinkMark={() => false}
            isBorderMark={() => false}
            collection={imageFileId.collectionName}
            providers={providerFactory}
          />
        </MediaGroup>
      </MediaClientContext.Provider>,
      { attachTo: fixture },
    );

    expect(mediaGroup.find(FilmstripView)).toHaveLength(1);

    await act(async () => {
      await mediaProvider;
    });
    await nextTick();
    mediaGroup.update();

    const card = mediaGroup.find(FilmstripView).find(Media).first().find(Card);
    card.props().onClick!({} as CardEvent);

    expect(onClick.callCount).toBe(1);
    expect(onClick.lastCall.args.length).toBeGreaterThan(1);

    const surroundingItems = onClick.lastCall.args[1].list;
    expect(surroundingItems.length).toBe(2);

    expect(surroundingItems[0].id).toBe(imageFileId.id);
    expect(surroundingItems[0].mediaItemType).toBe(imageFileId.mediaItemType);
    expect(surroundingItems[0].collectionName).toBe(imageFileId.collectionName);
    expect(surroundingItems[0].occurrenceKey).toBe('001');

    mediaGroup.unmount();
  });

  it('should send useInlinePlayer: false to the Media', () => {
    const mediaGroup = mount(
      <MediaGroup>
        <Media
          id={imageFileId.id}
          marks={[]}
          isLinkMark={() => false}
          isBorderMark={() => false}
          type={imageFileId.mediaItemType}
          collection={imageFileId.collectionName}
        />
      </MediaGroup>,
    );
    expect(mediaGroup.find(Media).prop('useInlinePlayer')).toBe(false);
  });

  it('should pass onClick callback only if eventHandlers.media.onClick its defined', () => {
    const mediaGroupWithoutHandlers = mount(
      <MediaGroup>
        <Media
          id={imageFileId.id}
          marks={[]}
          isLinkMark={() => false}
          isBorderMark={() => false}
          type={imageFileId.mediaItemType}
          collection={imageFileId.collectionName}
        />
        <Media
          id={imageFileId.id}
          marks={[]}
          isLinkMark={() => false}
          isBorderMark={() => false}
          type={imageFileId.mediaItemType}
          collection={imageFileId.collectionName}
        />
      </MediaGroup>,
    );
    const mediaGroupWithHandlers = mount(
      <MediaGroup eventHandlers={{ media: { onClick: jest.fn() } }}>
        <Media
          id={imageFileId.id}
          type={imageFileId.mediaItemType}
          marks={[]}
          isLinkMark={() => false}
          isBorderMark={() => false}
          collection={imageFileId.collectionName}
        />
        <Media
          id={imageFileId.id}
          type={imageFileId.mediaItemType}
          marks={[]}
          isLinkMark={() => false}
          isBorderMark={() => false}
          collection={imageFileId.collectionName}
        />
      </MediaGroup>,
    );

    expect(
      mediaGroupWithoutHandlers.find(Media).first().prop('eventHandlers')!
        .media!.onClick,
    ).toBeUndefined();
    expect(
      mediaGroupWithHandlers.find(Media).first().prop('eventHandlers')!.media!
        .onClick,
    ).toBeDefined();
  });

  it('should pass feature flags to MediaCardInternal', () => {
    const featureFlags: MediaFeatureFlags = {};
    const mediaGroup = mount(
      <MediaGroup featureFlags={featureFlags}>
        <Media
          id={imageFileId.id}
          marks={[]}
          isLinkMark={() => false}
          isBorderMark={() => false}
          type={imageFileId.mediaItemType}
          collection={imageFileId.collectionName}
        />
      </MediaGroup>,
    );
    expect(mediaGroup.find(MediaCardInternal).props().featureFlags).toEqual(
      featureFlags,
    );
  });

  it('should render unsupported content if there is unsupported content', () => {
    const mediaGroup = shallow(
      <MediaGroup>
        <UnsupportedBlock />
      </MediaGroup>,
    );
    expect(mediaGroup.find(UnsupportedBlock)).toHaveLength(1);
  });

  describe('enableDownloadButton', () => {
    const mountMediaGroup = (enableDownloadButton: boolean) =>
      mount(
        <MediaGroup enableDownloadButton={enableDownloadButton}>
          <Media
            id={imageFileId.id}
            marks={[]}
            isLinkMark={() => false}
            isBorderMark={() => false}
            type={imageFileId.mediaItemType}
            collection={imageFileId.collectionName}
          />
        </MediaGroup>,
      );

    it('should enable download button when enableDownloadButton is true', () => {
      const mediaGroup = mountMediaGroup(true);
      expect(
        mediaGroup.find(MediaCardInternal).props().shouldEnableDownloadButton,
      ).toEqual(true);
    });

    it('should not enable download button when enableDownloadButton is false', () => {
      const mediaGroup = mountMediaGroup(true);
      expect(
        mediaGroup.find(MediaCardInternal).props().shouldEnableDownloadButton,
      ).toEqual(true);
    });
  });
});
