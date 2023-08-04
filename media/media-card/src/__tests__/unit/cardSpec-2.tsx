/**
 * TODO: https://product-fabric.atlassian.net/browse/MEX-904
 * This file has been created as a fresh start for tests in the root
 * component. Tests in cardSpec.tsx need a good clean up:
 * - many tests are duplicated and othes are fragmented (like props passing)
 * - the file is full of "global variables" being set in different places
 * - the "setup" function hides the base conditions of the tests, making them hard to understand
 * - many tests have to recreate many previous operations to test some features. They should be simplified
 */
jest.mock('../../utils/globalScope/getSSRData');
import React from 'react';
import { shallow } from 'enzyme';
import { ViewportDetector } from '../../utils/viewportDetector';
import { fakeMediaClient, flushPromises } from '@atlaskit/media-test-helpers';
import type {
  FileIdentifier,
  ExternalImageIdentifier,
  ProcessedFileState,
  FileState,
  FilePreview,
} from '@atlaskit/media-client';
import { createMediaSubject } from '@atlaskit/media-client';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { CardBase } from '../../card/card';
import type { CardDimensions, CardPreview, CardState } from '../../types';
import {
  isImageLoadError,
  ImageLoadError,
  getImageLoadPrimaryReason,
  MediaCardError,
  LocalPreviewError,
  RemotePreviewError,
  LocalPreviewPrimaryReason,
} from '../../errors';
import { CardView } from '../../card/cardView';
import * as getCardPreviewModule from '../../card/getCardPreview';
import * as stateUpdaterModule from '../../card/cardState';
import * as cardAnalyticsModule from '../../card/cardAnalytics';
import { getSSRData } from '../../utils/globalScope';
import * as videoIsPlayableModule from '../../utils/videoIsPlayable';
import { extractErrorInfo, getFileAttributes } from '../../utils/analytics';
import { getFileDetails } from '../../utils/metadata';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ImageResizeMode } from '@atlaskit/media-client';
import cardPreviewCache from '../../card/getCardPreview/cache';

const videoIsPlayable = jest.spyOn(videoIsPlayableModule, 'videoIsPlayable');

const getCardPreviewFromCache = jest.spyOn(
  getCardPreviewModule,
  'getCardPreviewFromCache',
);
const removeCardPreviewFromCache = jest.spyOn(
  getCardPreviewModule,
  'removeCardPreviewFromCache',
);
const getCardPreview = jest.spyOn(getCardPreviewModule, 'getCardPreview');
const shouldResolvePreview = jest.spyOn(
  getCardPreviewModule,
  'shouldResolvePreview',
);

const getSSRCardPreview = jest.spyOn(getCardPreviewModule, 'getSSRCardPreview');
const fetchAndCacheRemotePreview = jest.spyOn(
  getCardPreviewModule,
  'fetchAndCacheRemotePreview',
);

const getFilePreviewFromFileState = jest.spyOn(
  getCardPreviewModule,
  'getFilePreviewFromFileState',
);

const createStateUpdater = jest.spyOn(stateUpdaterModule, 'createStateUpdater');
const getCardStateFromFileState = jest.spyOn(
  stateUpdaterModule,
  'getCardStateFromFileState',
);

const fireOperationalEvent = jest.spyOn(
  cardAnalyticsModule,
  'fireOperationalEvent',
);

const fireNonCriticalErrorEvent = jest.spyOn(
  cardAnalyticsModule,
  'fireNonCriticalErrorEvent',
);

const createAnalyticsEvent = jest.fn(() => ({
  fire: () => {},
})) as unknown as CreateUIAnalyticsEvent;

const fakeObservable = (unsubscribe?: Function) => ({
  subscribe: jest.fn(() => ({ unsubscribe })),
});
const fakeMediaClientWithObservable = (observable: any) => {
  const mediaClient = fakeMediaClient();
  (mediaClient.file.getFileState as jest.Mock).mockReturnValue(observable);
  return mediaClient;
};

const indentifiers: {
  file: FileIdentifier;
  externalImage: ExternalImageIdentifier;
} = {
  file: {
    id: 'some-id',
    mediaItemType: 'file',
    collectionName: 'some-collection-name',
    occurrenceKey: 'some-occurrence-key',
  },
  externalImage: {
    dataURI: 'some-dataURI',
    mediaItemType: 'external-image',
  },
};
const defaultMode: ImageResizeMode = 'crop';

const fileStates: { processed: ProcessedFileState } = {
  processed: {
    status: 'processed',
    id: 'some-file-id',
    mimeType: 'image/png',
    mediaType: 'image',
    name: 'file-name',
    size: 1,
    artifacts: {},
    representations: {
      image: {},
    },
    preview: { value: 'some-file-preview' },
    metadataTraceContext: {
      traceId: 'some-trace-id',
    },
  },
};

const filePreviews: Record<
  | 'external'
  | 'remote'
  | 'cachedRemote'
  | 'local'
  | 'cachedLocal'
  | 'ssrClient'
  | 'ssrClientGlobalScope'
  | 'ssrServer',
  CardPreview
> = {
  external: { dataURI: indentifiers.externalImage.dataURI, source: 'external' },
  remote: { dataURI: 'some-dataURI', source: 'remote' },
  cachedRemote: { dataURI: 'some-dataURI', source: 'cache-remote' },
  local: { dataURI: 'some-dataURI', source: 'local' },
  cachedLocal: { dataURI: 'some-dataURI', source: 'cache-local' },
  ssrClient: {
    dataURI: 'client-data-uri',
    orientation: 1,
    source: 'ssr-client',
  },
  ssrClientGlobalScope: {
    dataURI: 'global-scope-data-uri',
    source: 'ssr-data',
  },
  ssrServer: {
    dataURI: 'server-data-uri',
    orientation: 1,
    source: 'ssr-server',
  },
};

describe('Media Card', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(performance, 'now').mockReturnValue(1000);
    cardPreviewCache.remove(indentifiers.file.id, defaultMode);
  });

  describe('Card Init', () => {
    it(`should start invisible if lazy load is enabled (default)`, () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
        />,
      );
      expect(mediaCard.state('isCardVisible')).toBe(false);
    });

    it(`should start visible if lazy load is disabled`, () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          isLazy={false}
        />,
      );
      expect(mediaCard.state('isCardVisible')).toBe(true);
    });

    it(`should get the preview from cache if it's file identifier`, () => {
      getCardPreviewFromCache.mockReturnValueOnce(filePreviews.cachedRemote);
      const dimensions = { width: 50, height: 50 };
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          dimensions={dimensions}
        />,
      );
      const { id } = indentifiers.file;
      expect(getCardPreviewFromCache).toBeCalledWith(id, defaultMode);
      expect(mediaCard.state('cardPreview')).toBe(filePreviews.cachedRemote);
    });

    it(`should start visible if lazy load is enabled but there is a preview in cache`, () => {
      getCardPreviewFromCache.mockReturnValueOnce(filePreviews.cachedRemote);
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
        />,
      );
      expect(mediaCard.state('cardPreview')).toBe(filePreviews.cachedRemote);
      expect(mediaCard.state('isCardVisible')).toBe(true);
    });

    it('should resolve SSR preview when ssr is server', () => {
      const expectedPreview = filePreviews.ssrServer;
      getSSRCardPreview.mockReturnValueOnce(expectedPreview);
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          ssr={'server'}
        />,
      );
      expect(getSSRCardPreview).toBeCalledTimes(1);
      expect(mediaCard.state('cardPreview')).toEqual(expectedPreview);
    });

    it('should resolve SSR preview when ssr is client and there is no SSR data in global scope', () => {
      (getSSRData as jest.Mock).mockReturnValueOnce(undefined);
      const expectedPreview = filePreviews.ssrClient;
      getSSRCardPreview.mockReturnValueOnce(expectedPreview);
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          ssr={'client'}
        />,
      );
      expect(getSSRData).toBeCalledTimes(1);
      expect(getSSRCardPreview).toBeCalledTimes(1);
      expect(mediaCard.state('cardPreview')).toEqual(expectedPreview);
    });

    it('should reuse dataURI from global scope when ssr is client', () => {
      const expectedPreview = filePreviews.ssrClientGlobalScope;
      (getSSRData as jest.Mock).mockReturnValueOnce({
        dataURI: expectedPreview.dataURI,
      });

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          ssr={'client'}
        />,
      );
      expect(getSSRData).toBeCalledTimes(1);
      expect(getSSRCardPreview).toBeCalledTimes(0);
      expect(mediaCard.state('cardPreview')).toEqual(expectedPreview);
    });

    it(`should refetch the preview if ssr client dimensions are bigger than server`, async () => {
      const expectedPreview = filePreviews.ssrClient;
      fetchAndCacheRemotePreview.mockResolvedValueOnce(expectedPreview);
      const ssrDimensions = { width: 333, height: 222 };
      (getSSRData as jest.Mock).mockReturnValueOnce({
        dataURI: filePreviews.ssrClientGlobalScope.dataURI,
        dimensions: ssrDimensions,
      });

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          dimensions={{ width: 444, height: 222 }}
          ssr={'client'}
        />,
      );
      expect(getSSRData).toBeCalledTimes(1);
      expect(fetchAndCacheRemotePreview).toBeCalledTimes(1);
      // We need to flush promises after calling fetchAndCacheRemotePreview
      await flushPromises();
      expect(mediaCard.state('cardPreview')).toEqual(expectedPreview);
    });

    it(`should catch and log the error when refetch the preview if ssr client dimensions are bigger than server`, async () => {
      const ssrDimensions = { width: 333, height: 222 };
      const expectedPreview = filePreviews.ssrClientGlobalScope;
      (getSSRData as jest.Mock).mockReturnValueOnce({
        dataURI: filePreviews.ssrClientGlobalScope.dataURI,
        dimensions: ssrDimensions,
      });

      fetchAndCacheRemotePreview.mockRejectedValueOnce(
        new Error(`I've failed you`),
      );

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          dimensions={{ width: 444, height: 222 }}
          ssr={'client'}
          createAnalyticsEvent={createAnalyticsEvent}
        />,
      );
      expect(getSSRData).toBeCalledTimes(1);
      expect(fetchAndCacheRemotePreview).toBeCalledTimes(1);
      // We need to flush promises after calling fetchAndCacheRemotePreview
      await flushPromises();
      expect(mediaCard.state('cardPreview')).toEqual(expectedPreview);
      // This error should be logged
      expect(fireNonCriticalErrorEvent).toBeCalledTimes(1);
      expect(fireNonCriticalErrorEvent).toBeCalledWith(
        createAnalyticsEvent,
        expect.any(String),
        expect.any(Object),
        expect.any(Object),
        expect.objectContaining({
          primaryReason: 'remote-preview-fetch-ssr',
        }),
        expect.any(Object),
        undefined,
      );
    });

    it(`should not refetch the preview if ssr client dimensions are smaller than server`, () => {
      const ssrDimensions = { width: 333, height: 222 };
      (getSSRData as jest.Mock).mockReturnValueOnce({
        dataURI: filePreviews.ssrClientGlobalScope.dataURI,
        dimensions: ssrDimensions,
      });

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          dimensions={{ width: 222, height: 222 }}
          ssr={'client'}
        />,
      );
      expect(getSSRData).toBeCalledTimes(1);
      expect(getSSRCardPreview).toBeCalledTimes(0);
      expect(mediaCard.state('cardPreview')).toEqual(
        filePreviews.ssrClientGlobalScope,
      );
    });

    it.each(['server', 'client'] as const)(
      `should start invisible if lazy load is enabled and there is SSR preview (%s)`,
      (ssr) => {
        const expectedPreview =
          ssr === 'client' ? filePreviews.ssrClient : filePreviews.ssrServer;

        getSSRCardPreview.mockReturnValueOnce(expectedPreview);
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            isLazy={true}
            ssr={ssr}
          />,
        );
        expect(mediaCard.state('cardPreview')).toBe(expectedPreview);
        expect(mediaCard.state('isCardVisible')).toBe(false);
      },
    );

    it.each(['server', 'client'] as const)(
      `should start visible if lazy load is disabled and there is SSR preview (%s)`,
      (ssr) => {
        const expectedPreview =
          ssr === 'client' ? filePreviews.ssrClient : filePreviews.ssrServer;

        getSSRCardPreview.mockReturnValueOnce(expectedPreview);
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            isLazy={false}
            ssr={ssr}
          />,
        );
        expect(mediaCard.state('cardPreview')).toBe(expectedPreview);
        expect(mediaCard.state('isCardVisible')).toBe(true);
      },
    );

    it.each(['server', 'client'] as const)(
      `should not resolve SSR preview when ssr is %s and there is a cached preview`,
      (ssr) => {
        getCardPreviewFromCache.mockReturnValueOnce(filePreviews.cachedRemote);
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            ssr={ssr}
          />,
        );
        expect(getSSRCardPreview).toBeCalledTimes(0);
        expect(mediaCard.state('cardPreview')).toBe(filePreviews.cachedRemote);
      },
    );

    it('should not resolve SSR preview when ssr is not defined', () => {
      const mediaClient = fakeMediaClient();
      const mediaCard = shallow(
        <CardBase mediaClient={mediaClient} identifier={indentifiers.file} />,
      );
      expect(getSSRCardPreview).toBeCalledTimes(0);
      expect(mediaCard.state('cardPreview')).toBeUndefined();
    });

    it.each(['server', 'client'] as const)(
      'should catch error from SSR dataURI generation when ssr is %s',
      (ssr) => {
        const error = new Error('some-ssr-error');
        getSSRCardPreview.mockImplementationOnce(() => {
          throw error;
        });
        try {
          const mediaCard = shallow(
            <CardBase
              mediaClient={fakeMediaClient()}
              identifier={indentifiers.file}
              ssr={ssr}
            />,
          );
          expect(getSSRCardPreview).toBeCalledTimes(1);
          expect(mediaCard.state('cardPreview')).toBeUndefined();
        } catch (e) {
          expect(e).toBeUndefined();
        }
      },
    );
  });

  describe('Upfront Preview', () => {
    it('resolves the preview upfront once mounted if card is visible and has no preview', async () => {
      const expectedPreview = filePreviews.remote;
      fetchAndCacheRemotePreview.mockResolvedValueOnce(expectedPreview);

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          isLazy={false}
        />,
      );
      expect(fetchAndCacheRemotePreview).toBeCalledTimes(1);
      await flushPromises();
      expect(mediaCard.state('cardPreview')).toBe(expectedPreview);
      // this flag must be set to true
      expect(mediaCard.state('wasResolvedUpfrontPreview')).toBe(true);
    });

    it('does not resolve the preview upfront once mounted if card is visible and has preview', async () => {
      getCardPreviewFromCache.mockReturnValueOnce(filePreviews.cachedRemote);

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          isLazy={false}
        />,
      );
      expect(fetchAndCacheRemotePreview).toBeCalledTimes(0);
      expect(mediaCard.state('cardPreview')).toBe(filePreviews.cachedRemote);
    });

    it('resolves the preview upfront if card turned visible and has no preview', async () => {
      const expectedPreview = filePreviews.remote;
      fetchAndCacheRemotePreview.mockResolvedValueOnce(expectedPreview);

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          isLazy={true}
        />,
      );
      mediaCard.setState({ isCardVisible: true });

      expect(fetchAndCacheRemotePreview).toBeCalledTimes(1);
      await flushPromises();
      expect(mediaCard.state('cardPreview')).toBe(expectedPreview);
      // this flag must be set to true
      expect(mediaCard.state('wasResolvedUpfrontPreview')).toBe(true);
    });

    it('resolves the preview upfront if ssr is client and the preview failed to load', async () => {
      const expectedPreview = filePreviews.remote;
      fetchAndCacheRemotePreview.mockResolvedValue(expectedPreview);
      getSSRCardPreview.mockReturnValueOnce(filePreviews.ssrClient);

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          ssr={'client'}
        />,
      );
      // Card must be visible
      mediaCard.setState({ isCardVisible: true });

      expect(mediaCard.state('cardPreview')).toBe(filePreviews.ssrClient);

      const cardView = mediaCard.find(CardView);
      const onImageError = cardView.prop('onImageError');
      expect(onImageError).toEqual(expect.any(Function));
      onImageError(filePreviews.ssrClient);

      // Notice that fetchAndCacheRemotePreview is called twice.
      // The first call is from setCacheSSRPreview. Though, this call should be performed only from onImageLoad
      // -> TODO: change this behaviour
      expect(fetchAndCacheRemotePreview).toBeCalledTimes(2);

      await flushPromises();
      expect(mediaCard.state('isCardVisible')).toBe(true);
      expect(mediaCard.state('cardPreview')).toBe(expectedPreview);
      // this flag must be set to true
      expect(mediaCard.state('wasResolvedUpfrontPreview')).toBe(true);
    });

    it('does not resolve the preview upfront if ssr is client, has no preview and card is not visible', async () => {
      getSSRCardPreview.mockImplementationOnce(() => {
        throw new Error();
      });

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          ssr={'client'}
        />,
      );

      await flushPromises();
      expect(mediaCard.state('cardPreview')).toBe(undefined);
      expect(mediaCard.state('isCardVisible')).toBe(false);

      // Setting state to trigger a component update
      mediaCard.setState({ isCardVisible: false });
      await flushPromises();
      expect(getSSRCardPreview).toBeCalledTimes(1);
      expect(fetchAndCacheRemotePreview).toBeCalledTimes(0);
      expect(mediaCard.state('cardPreview')).toBe(undefined);
      expect(mediaCard.state('wasResolvedUpfrontPreview')).toBe(false);
    });

    it('does not resolve the preview upfront if card turned visible and has preview', async () => {
      getCardPreviewFromCache.mockReturnValueOnce(filePreviews.cachedRemote);

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          isLazy={true}
        />,
      );
      mediaCard.setState({ isCardVisible: true });

      expect(fetchAndCacheRemotePreview).toBeCalledTimes(0);
      expect(mediaCard.state('cardPreview')).toBe(filePreviews.cachedRemote);
    });

    it('catches the error from upfront preview', async () => {
      fetchAndCacheRemotePreview.mockRejectedValueOnce(new Error('some error'));

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          isLazy={false}
        />,
      );
      expect(fetchAndCacheRemotePreview).toBeCalledTimes(1);
      await flushPromises();
      expect(mediaCard.state('cardPreview')).toBe(undefined);
      // this flag must be set to true
      expect(mediaCard.state('wasResolvedUpfrontPreview')).toBe(true);
    });

    it.each([
      ['(both equal)', 100, 100],
      ['(both smaller)', 50, 50],
      ['(width smaller)', 50, 100],
      ['(height smaller)', 100, 50],
    ])(
      'adds to the state the upfront preview if new dimensions are equal or smaller %s',
      async (_title, newWidth, newHeight) => {
        // If there are new and bigger dimensions in the props, and the upfront preview is still resolving,
        // the fetched preview is no longer valid, and thus, we dismiss it and set the flag wasResolvedUpfrontPreview = true
        // to trigger a normal preview fetch.

        let resolveUpfrontPreview: (preview: CardPreview) => void = () => {};
        fetchAndCacheRemotePreview.mockReturnValueOnce(
          new Promise((resolve) => {
            resolveUpfrontPreview = resolve;
          }),
        );
        const initialDimensions = { width: 100, height: 100 };
        const newDimensions = { width: newWidth, height: newHeight };

        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            isLazy={true}
            dimensions={initialDimensions}
          />,
        );
        mediaCard.setState({ isCardVisible: true });

        expect(fetchAndCacheRemotePreview).toBeCalledTimes(1);

        mediaCard.setProps({ dimensions: newDimensions });
        resolveUpfrontPreview(filePreviews.remote);
        await flushPromises();

        expect(mediaCard.state('cardPreview')).toBe(filePreviews.remote);
        // this flag must be set to true
        expect(mediaCard.state('wasResolvedUpfrontPreview')).toBe(true);
      },
    );

    it.each([
      ['(with and height)', 150, 101],
      ['(with only)', 200, 100],
      ['(height only)', 100, 200],
    ])(
      'does not add to the state the upfront preview if new dimensions are bigger %s',
      async (_title, newWidth, newHeight) => {
        // If there are new and bigger dimensions in the props, and the upfront preview is still resolving,
        // the fetched preview is no longer valid, and thus, we dismiss it and set the flag wasResolvedUpfrontPreview = true
        // to trigger a normal preview fetch.

        let resolveUpfrontPreview: (preview: CardPreview) => void = () => {};
        fetchAndCacheRemotePreview.mockReturnValueOnce(
          new Promise((resolve) => {
            resolveUpfrontPreview = resolve;
          }),
        );
        const initialDimensions = { width: 100, height: 100 };
        const newDimensions = { width: newWidth, height: newHeight };

        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            isLazy={true}
            dimensions={initialDimensions}
          />,
        );
        mediaCard.setState({ isCardVisible: true });

        expect(fetchAndCacheRemotePreview).toBeCalledTimes(1);

        mediaCard.setProps({ dimensions: newDimensions });
        resolveUpfrontPreview(filePreviews.remote);
        await flushPromises();

        expect(mediaCard.state('cardPreview')).toBeUndefined();
        // this flag must be set to true
        expect(mediaCard.state('wasResolvedUpfrontPreview')).toBe(true);
      },
    );
  });

  describe('Native Lazy Load', () => {
    it(`should enable native lazy load if it's lazy and not visible`, () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          isLazy={true}
        />,
      );
      expect(mediaCard.find(CardView).prop('nativeLazyLoad')).toBe(true);
    });

    it(`should not enable native lazy load if it's lazy and visible`, () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          isLazy={true}
        />,
      );
      mediaCard.setState({ isCardVisible: true });
      expect(mediaCard.find(CardView).prop('nativeLazyLoad')).toBe(false);
    });

    it(`should not enable native lazy load if it's not lazy`, () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          isLazy={false}
        />,
      );
      expect(mediaCard.find(CardView).prop('nativeLazyLoad')).toBe(false);
    });
  });

  describe('File State Subscription', () => {
    it('should subscribe to file state after mounting if lazy load is off', () => {
      const observable = fakeObservable();
      const mediaClient = fakeMediaClientWithObservable(observable);

      shallow(
        <CardBase
          mediaClient={mediaClient}
          identifier={indentifiers.file}
          isLazy={false}
        />,
      );
      const { id, collectionName, occurrenceKey } = indentifiers.file;
      expect(mediaClient.file.getFileState).toBeCalledTimes(1);
      expect(mediaClient.file.getFileState).toBeCalledWith(id, {
        collectionName,
        occurrenceKey,
      });
      expect(observable.subscribe).toBeCalledTimes(1);
      expect(observable.subscribe).toBeCalledWith(
        expect.objectContaining({
          next: expect.any(Function),
          error: expect.any(Function),
        }),
      );
    });

    it('should subscribe to file state when the card enters the viewport', () => {
      const observable = fakeObservable();
      const mediaClient = fakeMediaClientWithObservable(observable);

      const mediaCard = shallow(
        <CardBase mediaClient={mediaClient} identifier={indentifiers.file} />,
      );
      const vp = mediaCard.find(ViewportDetector);
      expect(vp).toHaveLength(1);
      const onVisible = vp.prop('onVisible');
      expect(onVisible).toEqual(expect.any(Function));
      onVisible();

      const { id, collectionName, occurrenceKey } = indentifiers.file;
      expect(mediaClient.file.getFileState).toBeCalledTimes(1);
      expect(mediaClient.file.getFileState).toBeCalledWith(id, {
        collectionName,
        occurrenceKey,
      });
      expect(observable.subscribe).toBeCalledTimes(1);
      expect(observable.subscribe).toBeCalledWith(
        expect.objectContaining({
          next: expect.any(Function),
          error: expect.any(Function),
        }),
      );
    });

    it('should not subscribe to file state when the card is out of the viewport', () => {
      const mediaClient = fakeMediaClient();
      shallow(
        <CardBase mediaClient={mediaClient} identifier={indentifiers.file} />,
      );
      expect(mediaClient.file.getFileState).toBeCalledTimes(0);
    });

    it('should not subscribe to file state when the identifier or Media Client are updated', () => {
      const mediaClient = fakeMediaClient();
      const newMediaClient = fakeMediaClient();
      const mediaCard = shallow(
        <CardBase mediaClient={mediaClient} identifier={indentifiers.file} />,
      );
      expect(mediaCard.state('isCardVisible')).toBe(false);
      mediaCard.setProps({
        identifier: { ...indentifiers.file, id: 'another-id' },
      });
      mediaCard.setProps({ mediaClient: newMediaClient });
      expect(mediaClient.file.getFileState).toBeCalledTimes(0);
      expect(newMediaClient.file.getFileState).toBeCalledTimes(0);
    });

    it('should resubscribe to file state when identifier or Media Client are updated', () => {
      const unsubscribe = jest.fn();
      const mediaClient = fakeMediaClientWithObservable(
        fakeObservable(unsubscribe),
      );
      const newMediaClient = fakeMediaClient();
      const mediaCard = shallow(
        <CardBase
          mediaClient={mediaClient}
          identifier={indentifiers.file}
          isLazy={false}
        />,
      );
      mediaCard.setProps({
        identifier: { ...indentifiers.file, id: 'another-id' },
      });
      mediaCard.setProps({ mediaClient: newMediaClient });
      expect(mediaClient.file.getFileState).toBeCalledTimes(2);
      expect(unsubscribe).toBeCalledTimes(2);
      expect(newMediaClient.file.getFileState).toBeCalledTimes(1);
    });
  });

  describe('Card State from File State', () => {
    it('should set Card State derived from File State', () => {
      getCardStateFromFileState.mockReturnValueOnce({
        status: 'some-status',
        some: 'card-state',
      } as unknown as CardState);
      createStateUpdater.mockReturnValueOnce(
        () =>
          ({
            status: 'some-updated-status',
            someUpdated: 'card-state',
          } as unknown as CardState),
      );
      const observable = createMediaSubject();
      const mediaClient = fakeMediaClientWithObservable(observable);
      const featureFlags = {};

      const mediaCard = shallow(
        <CardBase
          mediaClient={mediaClient}
          identifier={indentifiers.file}
          featureFlags={featureFlags}
          isLazy={false}
        />,
      );
      observable.next(fileStates.processed);

      expect(mediaCard.state('isBannedLocalPreview')).toBe(false);
      expect(getCardStateFromFileState).toBeCalledTimes(1);
      expect(getCardStateFromFileState).toBeCalledWith(
        fileStates.processed,
        false,
        featureFlags,
      );
      // It must use createStateUpdater to ensure the correct transition through statuses
      expect(createStateUpdater).toBeCalledTimes(1);
      expect(createStateUpdater).toBeCalledWith(
        expect.objectContaining({ status: 'some-status', some: 'card-state' }),
        expect.any(Function),
      );
      expect(mediaCard.state()).toEqual(
        expect.objectContaining({
          status: 'some-updated-status',
          someUpdated: 'card-state',
        }),
      );
    });
  });

  describe('Card Preview', () => {
    it(`should call shouldResolvePreview on each update if it's file identifier and has file state`, () => {
      const fileState = {} as FileState;
      const status = 'processing';
      const initialDimensions = { initial: 'Dimensions' } as CardDimensions;
      const nextDimensions = { next: 'Dimensions' } as CardDimensions;
      const cardPreview = { card: 'Preview' };
      const featureFlags = { feature: 'Flags' } as MediaFeatureFlags;

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          dimensions={initialDimensions}
          featureFlags={featureFlags}
        />,
      );
      mediaCard.setState({
        fileState,
        status,
        cardPreview,
        isBannedLocalPreview: false,
        wasResolvedUpfrontPreview: false,
      });

      mediaCard.setProps({
        dimensions: nextDimensions,
      });

      // Makes sure the state flags are always properly passed
      mediaCard.setState({
        wasResolvedUpfrontPreview: true,
        isBannedLocalPreview: true,
      });

      expect(shouldResolvePreview).toBeCalledTimes(3);
      expect(shouldResolvePreview).toHaveBeenNthCalledWith(1, {
        fileState,
        status,
        hasCardPreview: !!cardPreview,
        isBannedLocalPreview: false,
        prevDimensions: expect.objectContaining({}),
        dimensions: initialDimensions,
        identifier: indentifiers.file,
        fileImageMode: defaultMode,
        featureFlags,
        wasResolvedUpfrontPreview: false,
      });
      expect(shouldResolvePreview).toHaveBeenNthCalledWith(2, {
        fileState,
        status,
        hasCardPreview: !!cardPreview,
        isBannedLocalPreview: false,
        prevDimensions: initialDimensions,
        dimensions: nextDimensions,
        identifier: indentifiers.file,
        fileImageMode: defaultMode,
        featureFlags,
        wasResolvedUpfrontPreview: false,
      });

      expect(shouldResolvePreview).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          wasResolvedUpfrontPreview: true,
          isBannedLocalPreview: true,
        }),
      );
    });

    it(`should get card preview if shouldResolvePreview returns true`, async () => {
      const resizeMode = 'full-fit';
      const dimensions = { height: 125, width: 156 };
      shouldResolvePreview.mockReturnValueOnce(true);
      getCardPreview.mockResolvedValueOnce(filePreviews.remote);
      const preview = { some: 'attr' } as unknown as FilePreview;
      getFilePreviewFromFileState.mockReturnValueOnce(preview);

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          isLazy={false}
          resizeMode={resizeMode}
        />,
      );
      const fileState = { some: 'attr' } as unknown as FileState;
      mediaCard.setState({
        fileState,
        wasResolvedUpfrontPreview: true, // Upfront preview resolved with no results
      });

      expect(shouldResolvePreview).toBeCalledTimes(1);

      expect(getCardPreview).toBeCalledTimes(1);
      expect(getCardPreview).toBeCalledWith(
        expect.objectContaining({
          id: indentifiers.file.id,
          filePreview: preview, // should pass local preview if available
          imageUrlParams: expect.objectContaining({
            collection: indentifiers.file.collectionName,
            mode: 'full-fit',
            ...dimensions,
          }),
        }),
      );
      expect(getFilePreviewFromFileState).toBeCalledTimes(1);
      expect(getFilePreviewFromFileState).toBeCalledWith(fileState);
      // We need to flush promises after calling getCardPreview
      await flushPromises();
      expect(mediaCard.state('cardPreview')).toEqual(
        expect.objectContaining(filePreviews.remote),
      );
    });

    it.each([
      ['RemotePreviewError', new RemotePreviewError('remote-preview-fetch')],
      ['Unexpected Error', new Error('this is an unexpected error')],
    ])(
      'should set state to error when getCardPreview throws %s',
      async (name, error) => {
        shouldResolvePreview.mockReturnValueOnce(true);
        getCardPreview.mockRejectedValueOnce(error);

        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
          />,
        );

        mediaCard.setState({ fileState: {} as FileState });
        expect(shouldResolvePreview).toBeCalledTimes(1);
        expect(getCardPreview).toBeCalledTimes(1);
        // We need to flush promises after calling getCardPreview
        await flushPromises();
        expect(createStateUpdater).toBeCalledTimes(1);
        expect(mediaCard.state('status')).toEqual('error');
        expect(mediaCard.state('error')).toEqual(expect.any(MediaCardError));

        const expectedError =
          name === 'Unexpected Error'
            ? expect.objectContaining({ secondaryError: error })
            : error;
        expect(mediaCard.state('error')).toEqual(expectedError);
      },
    );

    it('should set isBannedLocalPreview to true when getCardPreview throws LocalPreviewError', async () => {
      shouldResolvePreview.mockReturnValueOnce(true);
      const error = new LocalPreviewError(
        'some-message' as LocalPreviewPrimaryReason,
      );
      getCardPreview.mockRejectedValueOnce(error);

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
        />,
      );

      mediaCard.setState({ fileState: {} as FileState });
      expect(shouldResolvePreview).toBeCalledTimes(1);
      expect(getCardPreview).toBeCalledTimes(1);
      // We need to flush promises after calling getCardPreview
      await flushPromises();
      expect(mediaCard.state('isBannedLocalPreview')).toBe(true);
      // Shouldn't set state to error
      expect(mediaCard.state('status')).not.toEqual('error');
      expect(mediaCard.state('error')).toBe(undefined);
    });

    it('should not pass filePreview to getCardPreview if local preview is banned', () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
        />,
      );
      expect(fileStates.processed.preview).toBeDefined();
      expect(fileStates.processed.representations).toBeDefined();
      // First, add the conditions after a new filestate with local preview
      mediaCard.setState({
        status: 'loading-preview',
        fileState: fileStates.processed,
        cardPreview: filePreviews.local,
        wasResolvedUpfrontPreview: true, // Upfront preview resolved with no results
      });
      // Second, simulate a failed to render local preview
      mediaCard.setState({
        isBannedLocalPreview: true,
        cardPreview: undefined,
      });
      expect(getCardPreview).toBeCalledTimes(1);
      expect(getCardPreview).toBeCalledWith(
        expect.objectContaining({ filePreview: undefined }),
      );
    });

    it('should call videoIsPlayable helper with the right parameter and set isPlayingFile state to true', () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          disableOverlay={true}
          useInlinePlayer={true}
        />,
      );

      const fileState: Partial<FileState> = {
        status: 'processing',
        mimeType: 'video/mp4',
        mediaType: 'video',
        preview: { value: 'some-file-preview' },
      };

      mediaCard.setState({
        isBannedLocalPreview: false,
        fileState,
        cardPreview: filePreviews.local,
      });

      // videoIsPlayable helper is tested more thoroughly in packages/media/media-card/src/utils/__tests__/unit/videoIsPlayableSpec.ts

      expect(videoIsPlayable).toHaveBeenCalled();
      expect(videoIsPlayable).toHaveReturnedWith(true);
      expect(mediaCard.state('isPlayingFile')).toBe(true);
    });

    describe('SSR preview cache', () => {
      it(`should fetch and store in cache remote preview when lazy load is disabled and SSR is client`, () => {
        getSSRCardPreview.mockReturnValueOnce(filePreviews.ssrClient);
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            ssr="client"
            isLazy={false}
          />,
        );
        expect(mediaCard.state('cardPreview')).toBe(filePreviews.ssrClient);
        expect(mediaCard.state('isCardVisible')).toBe(true);
        expect(fetchAndCacheRemotePreview).toBeCalledTimes(1);
      });

      it(`should not fetch and store in cache remote preview when lazy load is enabled and SSR is client`, () => {
        getSSRCardPreview.mockReturnValueOnce(filePreviews.ssrClient);
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            ssr="client"
            isLazy={true}
          />,
        );
        expect(mediaCard.state('cardPreview')).toBe(filePreviews.ssrClient);
        expect(mediaCard.state('isCardVisible')).toBe(false);
        expect(fetchAndCacheRemotePreview).toBeCalledTimes(0);
      });

      it(`should fetch and store in cache remote preview when the card turns visible and SSR is client`, () => {
        getSSRCardPreview.mockReturnValueOnce(filePreviews.ssrClient);
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            ssr="client"
          />,
        );
        expect(mediaCard.state('cardPreview')).toBe(filePreviews.ssrClient);
        expect(mediaCard.state('isCardVisible')).toBe(false);

        mediaCard.setState({ isCardVisible: true });
        expect(fetchAndCacheRemotePreview).toBeCalledTimes(1);
      });

      it(`should not fetch and store in cache remote preview when is not visible and SSR is client`, () => {
        getSSRCardPreview.mockReturnValueOnce(filePreviews.ssrClient);
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            ssr="client"
          />,
        );
        expect(mediaCard.state('cardPreview')).toBe(filePreviews.ssrClient);
        expect(mediaCard.state('isCardVisible')).toBe(false);
        // Triggering an update intentionally to verify the calling condition
        mediaCard.update();
        expect(fetchAndCacheRemotePreview).toBeCalledTimes(0);
      });

      // TODO https://product-fabric.atlassian.net/browse/MEX-1071
      /* it(`should catch the error when calling fetchAndCacheRemotePreview`, () => {
        expect(1).toBe(1);
      }); */
    });
  });

  describe('refetch on resize', () => {
    it.each([
      ['refetch', 'bigger', 200, 200, 2],
      ['refetch', 'bigger', 50, 200, 2],
      ['refetch', 'bigger', 200, 50, 2],
      ['not refetch', 'smaller', 45, 45, 1],
      ['not refetch', 'smaller', 45, 100, 1],
      ['not refetch', 'smaller', 100, 45, 1],
      ['not refetch', 'no change', 100, 100, 1],
    ])(
      'should %s when dimensions are %s',
      async (_title1, _title2, width, height, callTimes) => {
        const dimensions = { width: 100, height: 100 };
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            dimensions={dimensions}
          />,
        );

        // state from the subscription that should trigger the first fetch
        mediaCard.setState({
          status: 'loading-preview',
          fileState: fileStates.processed,
          wasResolvedUpfrontPreview: true, // Upfront preview resolved with no results
        });

        // simulate the result of the first preview fetch
        mediaCard.setState({
          cardPreview: {},
          status: 'complete',
        });

        const newDimensions = { width, height };
        mediaCard.setProps({ dimensions: newDimensions });
        await flushPromises();

        expect(getCardPreview).toBeCalledTimes(callTimes);
      },
    );

    it('should not refetch a second time if the first refetch failed', async () => {
      const dimensions = { width: 100, height: 100 };
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          dimensions={dimensions}
        />,
      );

      // state from the subscription that should trigger the first fetch
      mediaCard.setState({
        status: 'loading-preview',
        fileState: fileStates.processed,
        wasResolvedUpfrontPreview: true, // Upfront preview resolved with no results
      });

      // simulate the result of the first preview fetch
      mediaCard.setState({
        cardPreview: {},
        status: 'complete',
      });

      const newDimensions = { width: 120, height: 120 };

      getCardPreview.mockImplementation(() => {
        /**
         * We are throwing the error instead of rejecting the promise.
         * This is to make the test fail. If we reject the promise instead, the
         * test times out if we are facing an infinite loop situation.
         */
        throw new RemotePreviewError('remote-preview-fetch');
      });

      mediaCard.setProps({ dimensions: newDimensions });

      await flushPromises();

      expect(getCardPreview).toBeCalledTimes(2);
      getCardPreview.mockReset(); // IMPORTANT
    });
  });

  describe('onImageLoad', () => {
    it('should set previewDidRender to true when onImageLoad is called', () => {
      const unsubscribe = jest.fn();
      const mediaClient = fakeMediaClientWithObservable(
        fakeObservable(unsubscribe),
      );
      const mediaCard = shallow(
        <CardBase mediaClient={mediaClient} identifier={indentifiers.file} />,
      );
      mediaCard.setState({ cardPreview: filePreviews.remote });
      const cardView = mediaCard.find(CardView);
      const onImageLoad = cardView.prop('onImageLoad');
      expect(onImageLoad).toEqual(expect.any(Function));
      onImageLoad(filePreviews.remote);
      expect(mediaCard.state('previewDidRender')).toBe(true);
    });

    it('should not set previewDidRender to true when onImageLoad is called and the preview has been replaced', () => {
      const unsubscribe = jest.fn();
      const mediaClient = fakeMediaClientWithObservable(
        fakeObservable(unsubscribe),
      );
      const mediaCard = shallow(
        <CardBase mediaClient={mediaClient} identifier={indentifiers.file} />,
      );
      mediaCard.setState({ cardPreview: filePreviews.remote });
      const cardView = mediaCard.find(CardView);
      const onImageLoad = cardView.prop('onImageLoad');
      expect(onImageLoad).toEqual(expect.any(Function));
      onImageLoad({ ...filePreviews.remote, dataURI: 'another-dataURI' });
      expect(mediaCard.state('previewDidRender')).toBe(false);
    });

    it.each(['complete', 'uploading', 'error', 'failed-processing'])(
      'should not set status complete on onImageLoad and current status is %s',
      (status) => {
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
          />,
        );
        mediaCard.setState({ status });
        const cardView = mediaCard.find(CardView);
        const onImageLoad = cardView.prop('onImageLoad');
        expect(onImageLoad).toEqual(expect.any(Function));
        onImageLoad();
        expect(mediaCard.state('status')).toBe(status);
      },
    );
  });

  describe('onImageError', () => {
    it.each([
      [filePreviews.remote.source, filePreviews.remote],
      [filePreviews.cachedRemote.source, filePreviews.cachedRemote],
    ])(
      `should set status 'error' if onImageError is called when source is %s`,
      (_name, cardPreview) => {
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
          />,
        );
        // We add the preview to the state to test it later on the error
        mediaCard.setState({ cardPreview });

        const cardView = mediaCard.find(CardView);
        const onImageError = cardView.prop('onImageError');
        expect(onImageError).toEqual(expect.any(Function));
        onImageError(cardPreview);
        expect(createStateUpdater).toBeCalledTimes(1);
        expect(mediaCard.state('status')).toBe('error');
        const error = mediaCard.state('error');
        expect(error).toBeDefined();
        expect(isImageLoadError(error as Error)).toBe(true);
        expect((error as ImageLoadError).primaryReason).toBe(
          getImageLoadPrimaryReason(cardPreview.source),
        );
      },
    );

    it.each([
      [filePreviews.remote.source, filePreviews.remote],
      [filePreviews.cachedRemote.source, filePreviews.cachedRemote],
    ])(
      `should not set status 'error' if onImageError is called when source is %s and cardPreview has been replaced`,
      (_name, cardPreview) => {
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
          />,
        );
        mediaCard.setState({ cardPreview });
        const cardView = mediaCard.find(CardView);
        const onImageError = cardView.prop('onImageError');
        expect(onImageError).toEqual(expect.any(Function));
        // The preview passed in the callback is not the same as the current one
        onImageError({ ...cardPreview, dataURI: 'another-dataURI' });
        expect(mediaCard.state('status')).not.toBe('error');
      },
    );

    it(`should not set status 'error' if onImageError is called when source is ssr-client`, () => {
      getSSRCardPreview.mockReturnValueOnce(filePreviews.ssrClient);
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          ssr={'client'}
        />,
      );
      expect(mediaCard.state('cardPreview')).toBe(filePreviews.ssrClient);
      const cardView = mediaCard.find(CardView);
      const onImageError = cardView.prop('onImageError');
      expect(onImageError).toEqual(expect.any(Function));
      onImageError(filePreviews.ssrClient);
      expect(mediaCard.state('status')).not.toBe('error');
      // Should be removed from cache based on the Id & passed dimensions
      expect(removeCardPreviewFromCache).toBeCalledWith(
        indentifiers.file.id,
        defaultMode,
      );
    });

    it.each([
      [filePreviews.local.source, filePreviews.local],
      [filePreviews.cachedLocal.source, filePreviews.cachedLocal],
    ])(
      `should not set status 'error' & should ban local preview if onImageError is called when source is %s`,
      (_name, cardPreview) => {
        const dimensions = {}; // We only look for object equality, not equivalency
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            dimensions={dimensions}
            createAnalyticsEvent={createAnalyticsEvent}
          />,
        );
        // We add the preview to the state to test it later on the error
        mediaCard.setState({ cardPreview });
        const cardView = mediaCard.find(CardView);
        const onImageError = cardView.prop('onImageError');
        expect(onImageError).toEqual(expect.any(Function));
        onImageError(cardPreview);
        expect(mediaCard.state('status')).not.toBe('error');
        // should set isBannedLocalPreview to true
        expect(mediaCard.state('isBannedLocalPreview')).toBe(true);
        // Should be removed from cache based on the Id & passed dimensions
        expect(removeCardPreviewFromCache).toBeCalledWith(
          indentifiers.file.id,
          defaultMode,
        );
        expect(fireNonCriticalErrorEvent).toBeCalledTimes(1);
      },
    );

    it.each([
      [filePreviews.local.source, filePreviews.local],
      [filePreviews.cachedLocal.source, filePreviews.cachedLocal],
    ])(
      `should not ban local preview if onImageError is called when source is %s and cardPreview has been replaced`,
      (_name, cardPreview) => {
        const dimensions = {}; // We only look for object equality, not equivalency
        const mediaCard = shallow(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={indentifiers.file}
            dimensions={dimensions}
          />,
        );
        // We add the preview to the state to test it later on the error
        mediaCard.setState({ cardPreview });
        const cardView = mediaCard.find(CardView);
        const onImageError = cardView.prop('onImageError');
        expect(onImageError).toEqual(expect.any(Function));
        // The preview passed in the callback is not the same as the current one
        onImageError({ ...cardPreview, dataURI: 'another-dataURI' });
        expect(mediaCard.state('status')).not.toBe('error');
        expect(mediaCard.state('isBannedLocalPreview')).toBe(false);
        expect(removeCardPreviewFromCache).not.toBeCalled();
      },
    );

    it(`should set status 'error' if onImageError is called when source is external image`, () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.externalImage}
        />,
      );

      const cardView = mediaCard.find(CardView);
      const onImageError = cardView.prop('onImageError');
      expect(onImageError).toEqual(expect.any(Function));
      onImageError(mediaCard.state('cardPreview'));
      expect(mediaCard.state('status')).toBe('error');
      const error = mediaCard.state('error');
      expect(error).toBeDefined();
      expect(isImageLoadError(error as Error)).toBe(true);
      expect((error as ImageLoadError).primaryReason).toBe(
        getImageLoadPrimaryReason(filePreviews.external.source),
      );
    });

    it(`should not set status 'error' if onImageError is called when source is external image and cardPreview has been replaced`, () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.externalImage}
        />,
      );

      const cardView = mediaCard.find(CardView);
      const onImageError = cardView.prop('onImageError');
      expect(onImageError).toEqual(expect.any(Function));
      onImageError({ dataURI: 'another-dataURI' });
      expect(mediaCard.state('status')).not.toBe('error');
    });
  });

  describe('Card Complete', () => {
    const unsubscribe = jest.fn();
    const mediaClient = fakeMediaClientWithObservable(
      fakeObservable(unsubscribe),
    );
    it.each(['loading-preview', 'processing'])(
      'should set status complete if image has rendered and current status is %s',
      (status) => {
        const mediaCard = shallow(
          <CardBase
            mediaClient={mediaClient}
            identifier={indentifiers.file}
            isLazy={false}
          />,
        );
        mediaCard.setState({ status, previewDidRender: true });
        expect(createStateUpdater).toBeCalledTimes(1);
        expect(mediaCard.state('status')).toBe('complete');
        expect(unsubscribe).toBeCalledTimes(1);
      },
    );

    it.each(['loading', 'complete', 'uploading', 'error', 'failed-processing'])(
      'should not set status complete if image has rendered and current status is %s',
      (status) => {
        const mediaCard = shallow(
          <CardBase
            mediaClient={mediaClient}
            identifier={indentifiers.file}
            isLazy={false}
          />,
        );
        mediaCard.setState({ status, previewDidRender: true });
        expect(createStateUpdater).toBeCalledTimes(0);
        expect(mediaCard.state('status')).toBe(status);
        expect(unsubscribe).toBeCalledTimes(0);
      },
    );
  });

  describe('Force Media Image Display', () => {
    it(`should force sync display if SSR is enabled`, () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          ssr="client"
        />,
      );
      expect(mediaCard.find(CardView).prop('forceSyncDisplay')).toBe(true);

      //Update ssr to server
      mediaCard.setProps({ ssr: 'server' });
      expect(mediaCard.find(CardView).prop('forceSyncDisplay')).toBe(true);
    });

    it(`should not force sync display if SSR is undefined`, () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
        />,
      );
      expect(mediaCard.find(CardView).prop('forceSyncDisplay')).toBe(false);
    });
  });

  describe('SSR Reliability', () => {
    it('should set the status of client to fail if getImageUrlSync fails in client', () => {
      /*
        For the case of ssr=server, we don't really need to set the status of server, as it won't be logged. If getImageUrlSync fails in server, we log that error in client checking for ssrData (see test below).
      */
      const clientError = new MediaCardError('ssr-client-uri');

      getSSRCardPreview.mockImplementationOnce(() => {
        throw clientError;
      });

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          createAnalyticsEvent={createAnalyticsEvent}
          ssr="client"
        />,
      );

      mediaCard.setState({
        fileState: fileStates.processed,
      });
      mediaCard.setState({ status: 'complete' });

      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toBeCalledWith(
        createAnalyticsEvent,
        'complete',
        getFileAttributes(
          getFileDetails(indentifiers.file, fileStates.processed),
          fileStates.processed.status,
        ),
        {
          overall: {
            durationSinceCommenced: 0,
            durationSincePageStart: 1000,
          },
        },
        {
          server: { status: 'unknown' },
          client: { status: 'fail', ...extractErrorInfo(clientError) },
        },
        undefined,
        {
          traceId: expect.any(String),
        },
        {
          traceId: expect.any(String),
        },
      );
    });

    it('should set the status of both client and server to fail if the dataURI from server is reused in client and it fails loading', () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          createAnalyticsEvent={createAnalyticsEvent}
          ssr={'server'}
        />,
      );

      mediaCard.setState({
        fileState: fileStates.processed,
        cardPreview: filePreviews.ssrClientGlobalScope,
      });

      const cardView = mediaCard.find(CardView);
      const onImageError = cardView.prop('onImageError');
      expect(onImageError).toEqual(expect.any(Function));
      onImageError(filePreviews.ssrClientGlobalScope);

      mediaCard.setState({ status: 'complete' });

      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toBeCalledWith(
        createAnalyticsEvent,
        'complete',
        getFileAttributes(
          getFileDetails(indentifiers.file, fileStates.processed),
          fileStates.processed.status,
        ),
        {
          overall: {
            durationSinceCommenced: 0,
            durationSincePageStart: 1000,
          },
        },
        {
          server: {
            status: 'fail',
            ...extractErrorInfo(
              new ImageLoadError(filePreviews.ssrClientGlobalScope.source),
            ),
          },
          client: {
            status: 'fail',
            ...extractErrorInfo(
              new ImageLoadError(filePreviews.ssrClientGlobalScope.source),
            ),
          },
        },
        undefined,
        {
          traceId: expect.any(String),
        },
        {
          traceId: expect.any(String),
        },
      );
    });

    it('should set the status of client to fail if dataURI fails to render in client', () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          createAnalyticsEvent={createAnalyticsEvent}
          ssr={'client'}
        />,
      );

      mediaCard.setState({
        fileState: fileStates.processed,
        cardPreview: filePreviews.ssrClient,
      });

      const cardView = mediaCard.find(CardView);
      const onImageError = cardView.prop('onImageError');
      expect(onImageError).toEqual(expect.any(Function));
      onImageError(filePreviews.ssrClient);

      mediaCard.setState({ status: 'complete' });

      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toBeCalledWith(
        createAnalyticsEvent,
        'complete',
        getFileAttributes(
          getFileDetails(indentifiers.file, fileStates.processed),
          fileStates.processed.status,
        ),
        {
          overall: {
            durationSinceCommenced: 0,
            durationSincePageStart: 1000,
          },
        },
        {
          server: { status: 'unknown' },
          client: {
            status: 'fail',
            ...extractErrorInfo(
              new ImageLoadError(filePreviews.ssrClientGlobalScope.source),
            ),
          },
        },
        undefined,
        {
          traceId: expect.any(String),
        },
        {
          traceId: expect.any(String),
        },
      );
    });

    it('should preserve the fail status of server and set client to success if image load is successful only in client', () => {
      const serverError = new MediaCardError('ssr-server-uri');
      (getSSRData as jest.Mock).mockReturnValueOnce({
        error: extractErrorInfo(serverError),
      });

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          createAnalyticsEvent={createAnalyticsEvent}
          ssr="client"
        />,
      );

      mediaCard.setState({
        fileState: fileStates.processed,
        cardPreview: filePreviews.ssrClientGlobalScope,
      });

      const cardView = mediaCard.find(CardView);
      const onImageLoad = cardView.prop('onImageLoad');
      expect(onImageLoad).toEqual(expect.any(Function));
      onImageLoad(filePreviews.ssrClient);

      mediaCard.setState({
        status: 'complete',
      });

      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toBeCalledWith(
        createAnalyticsEvent,
        'complete',
        getFileAttributes(
          getFileDetails(indentifiers.file, fileStates.processed),
          fileStates.processed.status,
        ),
        {
          overall: {
            durationSinceCommenced: 0,
            durationSincePageStart: 1000,
          },
        },
        {
          server: { status: 'fail', ...extractErrorInfo(serverError) },
          client: { status: 'success' },
        },
        undefined,
        {
          traceId: expect.any(String),
        },
        {
          traceId: expect.any(String),
        },
      );
    });

    it('should set the status of client to success if preview source is client and image loads are successful', () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          createAnalyticsEvent={createAnalyticsEvent}
          ssr="server"
        />,
      );

      mediaCard.setState({
        fileState: fileStates.processed,
        cardPreview: filePreviews.ssrClient,
      });

      const cardView = mediaCard.find(CardView);
      const onImageLoad = cardView.prop('onImageLoad');
      expect(onImageLoad).toEqual(expect.any(Function));
      onImageLoad(filePreviews.ssrClient);

      mediaCard.setState({
        status: 'complete',
      });

      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toBeCalledWith(
        createAnalyticsEvent,
        'complete',
        getFileAttributes(
          getFileDetails(indentifiers.file, fileStates.processed),
          fileStates.processed.status,
        ),
        {
          overall: {
            durationSinceCommenced: 0,
            durationSincePageStart: 1000,
          },
        },
        {
          server: { status: 'unknown' },
          client: { status: 'success' },
        },
        undefined,
        {
          traceId: expect.any(String),
        },
        {
          traceId: expect.any(String),
        },
      );
    });

    it('should set the status of server and client to success if preview source is server and image loads are successful', () => {
      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          createAnalyticsEvent={createAnalyticsEvent}
          ssr="server"
        />,
      );

      mediaCard.setState({
        fileState: fileStates.processed,
        cardPreview: filePreviews.ssrClient,
      });

      const cardView = mediaCard.find(CardView);
      const onImageLoad = cardView.prop('onImageLoad');
      expect(onImageLoad).toEqual(expect.any(Function));
      onImageLoad(filePreviews.ssrClientGlobalScope);

      mediaCard.setState({
        status: 'complete',
      });

      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toBeCalledWith(
        createAnalyticsEvent,
        'complete',
        getFileAttributes(
          getFileDetails(indentifiers.file, fileStates.processed),
          fileStates.processed.status,
        ),
        {
          overall: {
            durationSinceCommenced: 0,
            durationSincePageStart: 1000,
          },
        },
        {
          server: { status: 'success' },
          client: { status: 'success' },
        },
        undefined,
        {
          traceId: expect.any(String),
        },
        {
          traceId: expect.any(String),
        },
      );
    });
  });
});
