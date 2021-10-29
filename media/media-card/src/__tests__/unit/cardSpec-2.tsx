/**
 * TODO: https://product-fabric.atlassian.net/browse/MEX-904
 * This file has been created as a fresh start for tests in the root
 * component. Tests in cardSpec.tsx need a good clean up:
 * - many tests are duplicated and othes are fragmented (like props passing)
 * - the file is full of "global variables" being set in different places
 * - the "setup" function hides the base conditions of the tests, making them hard to understand
 * - many tests have to recreate many previous operations to test some features. They should be simplified
 */
import React from 'react';
import { shallow } from 'enzyme';
import { ViewportDetector } from '../../utils/viewportDetector';
import { fakeMediaClient, flushPromises } from '@atlaskit/media-test-helpers';
import {
  FileIdentifier,
  ExternalImageIdentifier,
  createFileStateSubject,
  ProcessedFileState,
  FileState,
} from '@atlaskit/media-client';
import { CardBase } from '../../root/card';
import { CardPreview, CardState } from '../..';
import {
  isImageLoadError,
  ImageLoadError,
  getImageLoadPrimaryReason,
  MediaCardError,
  LocalPreviewError,
  RemotePreviewError,
  LocalPreviewPrimaryReason,
} from '../../errors';
import { CardView } from '../../root/cardView';
import * as getCardPreviewModule from '../../root/card/getCardPreview';
import * as stateUpdaterModule from '../../root/card/cardState';

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
const createStateUpdater = jest.spyOn(stateUpdaterModule, 'createStateUpdater');
const getCardStateFromFileState = jest.spyOn(
  stateUpdaterModule,
  'getCardStateFromFileState',
);

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
  },
};

const filePreviews: Record<
  'external' | 'remote' | 'cachedRemote' | 'local' | 'cachedLocal',
  CardPreview
> = {
  external: { dataURI: indentifiers.externalImage.dataURI, source: 'external' },
  remote: { dataURI: 'some-dataURI', source: 'remote' },
  cachedRemote: { dataURI: 'some-dataURI', source: 'cache-remote' },
  local: { dataURI: 'some-dataURI', source: 'local' },
  cachedLocal: { dataURI: 'some-dataURI', source: 'cache-local' },
};

describe('Media Card', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      expect(getCardPreviewFromCache).toBeCalledWith(id, dimensions);
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
      getCardStateFromFileState.mockReturnValueOnce(({
        status: 'some-status',
        some: 'card-state',
      } as unknown) as CardState);
      createStateUpdater.mockReturnValueOnce(
        () =>
          (({
            status: 'some-updated-status',
            someUpdated: 'card-state',
          } as unknown) as CardState),
      );
      const observable = createFileStateSubject();
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
      );
      expect(mediaCard.state()).toEqual(
        expect.objectContaining({
          status: 'some-updated-status',
          someUpdated: 'card-state',
        }),
      );
    });
  });

  describe('getCardPreview', () => {
    it(`should call shouldResolvePreview on each update if it's file identifier and has file state`, () => {
      const fileState = {} as FileState;
      const status = 'processing';
      const initialDimensions = {};
      const nextDimensions = {};
      const cardPreview = {};
      const isBannedLocalPreview = true;
      const featureFlags = {};

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
        isBannedLocalPreview,
      });
      mediaCard.setProps({ dimensions: nextDimensions });

      expect(shouldResolvePreview).toBeCalledTimes(2);
      expect(shouldResolvePreview).toHaveBeenNthCalledWith(1, {
        fileState,
        status,
        hasCardPreview: !!cardPreview,
        isBannedLocalPreview,
        dimensions: initialDimensions,
        prevDimensions: expect.objectContaining({}),
        featureFlags,
      });
      expect(shouldResolvePreview).toHaveBeenNthCalledWith(2, {
        fileState,
        status,
        hasCardPreview: !!cardPreview,
        isBannedLocalPreview,
        dimensions: nextDimensions,
        prevDimensions: initialDimensions,
        featureFlags,
      });
    });

    it(`should get card preview if shouldResolvePreview returns true`, async () => {
      shouldResolvePreview.mockReturnValueOnce(true);
      getCardPreview.mockResolvedValueOnce(filePreviews.remote);

      const mediaCard = shallow(
        <CardBase
          mediaClient={fakeMediaClient()}
          identifier={indentifiers.file}
          isLazy={false}
        />,
      );
      mediaCard.setState({ fileState: {} as FileState });
      expect(shouldResolvePreview).toBeCalledTimes(1);
      expect(getCardPreview).toBeCalledTimes(1);
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
      expect(createStateUpdater).toBeCalledTimes(0);
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
      const cardView = mediaCard.find(CardView);
      const onImageLoad = cardView.prop('onImageLoad');
      expect(onImageLoad).toEqual(expect.any(Function));
      onImageLoad();
      expect(mediaCard.state('previewDidRender')).toBe(true);
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
        expect(createStateUpdater).toBeCalledTimes(0);
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
        onImageError();
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
          />,
        );
        // We add the preview to the state to test it later on the error
        mediaCard.setState({ cardPreview });
        const cardView = mediaCard.find(CardView);
        const onImageError = cardView.prop('onImageError');
        expect(onImageError).toEqual(expect.any(Function));
        onImageError();
        expect(mediaCard.state('status')).not.toBe('error');
        // should set isBannedLocalPreview to true
        expect(mediaCard.state('isBannedLocalPreview')).toBe(true);
        // Should be removed from cache based on the Id & passed dimensions
        expect(removeCardPreviewFromCache).toBeCalledWith(
          indentifiers.file.id,
          dimensions,
        );
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
      onImageError();
      expect(mediaCard.state('status')).toBe('error');
      const error = mediaCard.state('error');
      expect(error).toBeDefined();
      expect(isImageLoadError(error as Error)).toBe(true);
      expect((error as ImageLoadError).primaryReason).toBe(
        getImageLoadPrimaryReason(filePreviews.external.source),
      );
    });
  });

  describe('Card Complete', () => {
    const unsubscribe = jest.fn();
    const mediaClient = fakeMediaClientWithObservable(
      fakeObservable(unsubscribe),
    );
    it.each(['loading', 'loading-preview', 'processing'])(
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

    it.each(['complete', 'uploading', 'error', 'failed-processing'])(
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
});
