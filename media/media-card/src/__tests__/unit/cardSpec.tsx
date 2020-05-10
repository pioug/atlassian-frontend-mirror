jest.mock('../../utils/getFilePreviewFromFileState');
import { ReplaySubject } from 'rxjs/ReplaySubject';
import React from 'react';
import uuid from 'uuid/v4';
import { shallow, mount } from 'enzyme';

import { FabricChannel } from '@atlaskit/analytics-listeners';
import { AnalyticsListener, AnalyticsContext } from '@atlaskit/analytics-next';
import { MediaAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import {
  MediaClient,
  FileState,
  FileDetails,
  FileIdentifier,
  ExternalImageIdentifier,
  Identifier,
  globalMediaEventEmitter,
  isFileIdentifier,
  MediaViewedEventPayload,
  RECENTS_COLLECTION,
  createFileStateSubject,
  ProcessedFileState,
} from '@atlaskit/media-client';
import { MediaViewer } from '@atlaskit/media-viewer';
import {
  fakeMediaClient,
  nextTick,
  asMockReturnValue,
  asMock,
  expectFunctionToHaveBeenCalledWith,
  asMockFunction,
  expectToEqual,
} from '@atlaskit/media-test-helpers';

import { CardAction, CardDimensions, CardProps, CardState } from '../..';
import { Card, CardBase, CardWithAnalyticsEventsProps } from '../../root/card';
import { CardView, CardViewOwnProps } from '../../root/cardView';
import { InlinePlayer } from '../../root/inlinePlayer';
import { LazyContent } from '../../utils/lazyContent';
import {
  getFilePreviewFromFileState,
  FilePreview,
} from '../../utils/getFilePreviewFromFileState';
import {
  getBaseAnalyticsContext,
  getMediaCardAnalyticsContext,
} from '../../utils/analytics';

type AnalyticsHandlerResultType = ReturnType<
  typeof AnalyticsListener.prototype['props']['onEvent']
>;
type AnalyticsHandlerArgumentsType = Parameters<
  typeof AnalyticsListener.prototype['props']['onEvent']
>;

const getAnalyticsHandlerMock = () =>
  jest.fn<AnalyticsHandlerResultType, AnalyticsHandlerArgumentsType>();

describe('Card', () => {
  let identifier: Identifier;
  let defaultFileId: string;
  let fileIdentifier: FileIdentifier;
  let actionSubjectId: FileIdentifier['id'];
  let defaultFileState: ProcessedFileState;

  const analyticsBasePayload = {
    eventType: 'operational',
    actionSubject: 'mediaCardRender',
  };

  const defaultFilePreview: Promise<FilePreview> = Promise.resolve({
    src: 'some-data-uri',
    orientation: 6,
  });

  const defaultImageBlob: Promise<Blob> = Promise.resolve(new Blob());

  const emptyPreview: Promise<FilePreview> = Promise.resolve({
    src: undefined,
  });

  const setup = (
    mediaClient: MediaClient = createMediaClientWithGetFile(),
    props: Partial<CardProps> = {},
    filePreview: Promise<FilePreview> = defaultFilePreview,
  ) => {
    asMockFunction(getFilePreviewFromFileState).mockReset();
    asMockFunction(getFilePreviewFromFileState).mockReturnValue(filePreview);

    props = { isLazy: true, ...props };

    const component = shallow<
      CardBase,
      CardWithAnalyticsEventsProps,
      CardState
    >(
      <CardBase mediaClient={mediaClient} identifier={identifier} {...props} />,
    );

    if (props.isLazy) {
      const onLazyContentRender = component.find(LazyContent).props().onRender;
      if (onLazyContentRender) {
        onLazyContentRender();
        component.update();
      }
    }

    return {
      component,
      mediaClient,
    };
  };

  const createMediaClientWithGetFile = (
    fileState: FileState = defaultFileState,
  ) => {
    const mockMediaClient = fakeMediaClient();

    asMockFunction(mockMediaClient.getImage).mockReturnValue(defaultImageBlob);
    asMockReturnValue(
      mockMediaClient.file.getFileState,
      createFileStateSubject(fileState),
    );
    return mockMediaClient;
  };

  beforeEach(() => {
    defaultFileId = uuid();
    fileIdentifier = {
      id: defaultFileId,
      mediaItemType: 'file',
      collectionName: 'some-collection-name',
      occurrenceKey: 'some-occurrence-key',
    };
    actionSubjectId = fileIdentifier.id;
    identifier = fileIdentifier;
    defaultFileState = {
      status: 'processed',
      id: defaultFileId,
      name: 'file-name',
      size: 10,
      artifacts: {},
      mediaType: 'image',
      mimeType: 'image/png',
      representations: { image: {} },
    };
    jest.spyOn(globalMediaEventEmitter, 'emit');
    asMock(getFilePreviewFromFileState).mockReturnValue(defaultFilePreview);
  });

  afterEach(() => {
    asMockFunction(getFilePreviewFromFileState).mockReset();
    jest.restoreAllMocks();
  });

  it('should use the new mediaClient to create the subscription when mediaClient prop changes', async () => {
    const firstMediaClient = createMediaClientWithGetFile();
    const secondMediaClient = createMediaClientWithGetFile();
    const { component } = setup(firstMediaClient);
    component.setProps({ mediaClient: secondMediaClient, identifier });

    const { id, collectionName, occurrenceKey } = fileIdentifier;
    await id;
    expect(secondMediaClient.file.getFileState).toHaveBeenCalledTimes(1);
    expect(secondMediaClient.file.getFileState).toBeCalledWith(id, {
      collectionName,
      occurrenceKey,
    });
    expect(component.find(CardView)).toHaveLength(1);
  });

  describe('refetching when dimensions has changed logic', () => {
    let component: ReturnType<typeof setup>['component'];
    let mediaClient: MediaClient;

    const initialDimensions: CardDimensions = {
      width: 100,
      height: 200,
    };

    beforeEach(() => {
      const setupResult = setup(
        undefined,
        {
          identifier,
          dimensions: initialDimensions,
        },
        emptyPreview,
      );
      component = setupResult.component;
      mediaClient = setupResult.mediaClient;
    });

    const setNewDimensionViaProps = async (newDimensions: CardDimensions) => {
      // Resolve all promises to get to getImage call
      await fileIdentifier.id;
      await emptyPreview;

      expect(mediaClient.getImage).toHaveBeenCalledTimes(1);

      // Resolve all remaining promises in next() function
      await defaultImageBlob;
      await nextTick(); // Will cause result of getContextedDataURIFromBackend() to resolve

      component.setProps({ mediaClient, dimensions: newDimensions });

      // Again wait for all promises in second next() call to get to getImage call
      await fileIdentifier.id;
      await emptyPreview;
    };

    it('should refetch the image when width changes to a higher value', async () => {
      const newDimensions: CardDimensions = {
        ...initialDimensions,
        width: 1000,
      };

      await setNewDimensionViaProps(newDimensions);

      expect(mediaClient.getImage).toHaveBeenCalledTimes(2);
      expect(mediaClient.getImage).toHaveBeenLastCalledWith(fileIdentifier.id, {
        allowAnimated: true,
        collection: 'some-collection-name',
        mode: 'crop',
        width: 1000,
        height: 200,
      });
    });

    it('should refetch the image when height changes to a higher value', async () => {
      const newDimensions: CardDimensions = {
        ...initialDimensions,
        height: 2000,
      };

      await setNewDimensionViaProps(newDimensions);

      expect(mediaClient.getImage).toHaveBeenCalledTimes(2);

      expect(mediaClient.getImage).toHaveBeenLastCalledWith(fileIdentifier.id, {
        allowAnimated: true,
        collection: 'some-collection-name',
        mode: 'crop',
        width: 100,
        height: 2000,
      });
    });

    it('should not refetch the image when width changes to a smaller value', async () => {
      const newDimensions: CardDimensions = {
        ...initialDimensions,
        width: 10,
      };

      await setNewDimensionViaProps(newDimensions);

      expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
    });

    it('should not refetch the image when height changes to a smaller value', async () => {
      const newDimensions: CardDimensions = {
        ...initialDimensions,
        height: 20,
      };

      await setNewDimensionViaProps(newDimensions);

      expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
    });
  });

  it('should fire onClick when passed in as a prop and CardView fires onClick', () => {
    const clickHandler = jest.fn();

    const subject = new ReplaySubject<FileState>(1);
    const mediaClient = fakeMediaClient();
    asMockReturnValue(mediaClient.file.getFileState, subject);

    const { component } = setup(mediaClient, { onClick: clickHandler });

    const cardViewOnClick = component.find(CardView).props().onClick;

    if (!cardViewOnClick) {
      throw new Error('CardView onClick was undefined');
    }

    expect(clickHandler).not.toHaveBeenCalled();
    cardViewOnClick({} as any, {} as any);
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('should fire onClick and onMouseEnter events triggered from MediaCard', () => {
    const clickHandler = jest.fn();
    const hoverHandler = jest.fn();

    const subject = new ReplaySubject<FileState>(1);
    const mediaClient = fakeMediaClient();
    asMockReturnValue(mediaClient.file.getFileState, subject);

    const { component } = setup(mediaClient, {
      onMouseEnter: hoverHandler,
      onClick: clickHandler,
    });

    const cardView = component.find(CardView);
    cardView.simulate('mouseEnter');
    cardView.simulate('click');

    expect(clickHandler).toHaveBeenCalledTimes(1);
    const clickHandlerArg = clickHandler.mock.calls[0][0];
    expect(clickHandlerArg.mediaItemDetails).toEqual(
      component.state().metadata,
    );

    expect(hoverHandler).toBeCalledTimes(1);
    const hoverHandlerArg = hoverHandler.mock.calls[0][0];
    expect(hoverHandlerArg.mediaItemDetails).toEqual(
      component.state().metadata,
    );
  });

  it('should use lazy load by default', () => {
    const hoverHandler = () => {};
    const card = shallow(
      <CardBase
        mediaClient={fakeMediaClient()}
        identifier={identifier}
        onMouseEnter={hoverHandler}
      />,
    );
    expect(card.find(LazyContent)).toHaveLength(1);
  });

  it('should not use lazy load when "isLazy" is false', () => {
    const hoverHandler = () => {};
    const { component } = setup(createMediaClientWithGetFile(), {
      isLazy: false,
      onMouseEnter: hoverHandler,
    });

    expect(component.find(LazyContent)).toHaveLength(0);
  });

  it('should pass properties down to CardView', () => {
    const subject = new ReplaySubject<FileState>(1);
    const mediaClient = fakeMediaClient();
    asMockReturnValue(mediaClient.file.getFileState, subject);

    const { component } = setup(mediaClient, {
      dimensions: { width: 100, height: 50 },
    });

    expect(component.find(CardView).props().dimensions).toEqual({
      width: 100,
      height: 50,
    });
  });

  it('should create a card placeholder with the right props', () => {
    const { component } = setup(createMediaClientWithGetFile(), {
      dimensions: { width: 100, height: 50 },
    });

    const filePlaceholder = component.find(CardView);
    const { status, dimensions } = filePlaceholder.props();

    expect(status).toBe('loading');
    expect(dimensions).toEqual({ width: 100, height: 50 });
  });

  it('should use "crop" as default resizeMode', () => {
    const mediaClient = createMediaClientWithGetFile();
    const card = mount(
      <CardBase
        mediaClient={mediaClient}
        identifier={identifier}
        isLazy={false}
      />,
    );

    expect(card.find(CardView).prop('resizeMode')).toBe('crop');
  });

  it('should pass right resizeMode down', () => {
    const mediaClient = createMediaClientWithGetFile();

    const card = mount(
      <CardBase
        mediaClient={mediaClient}
        identifier={identifier}
        isLazy={false}
        resizeMode="full-fit"
      />,
    );

    expect(card.find(CardView).prop('resizeMode')).toBe('full-fit');
  });

  it('should pass "disableOverlay" to CardView', () => {
    const mediaClient = fakeMediaClient();
    const card = shallow(
      <CardBase
        mediaClient={mediaClient}
        identifier={identifier}
        isLazy={false}
        resizeMode="full-fit"
        disableOverlay={true}
      />,
      { disableLifecycleMethods: true },
    );

    expect(card.find(CardView).prop('disableOverlay')).toBe(true);
  });

  it('should use mediaClient.file.getFile to fetch file data', async () => {
    const { mediaClient } = setup();
    await fileIdentifier.id;
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);
    expect(mediaClient.file.getFileState).toBeCalledWith(fileIdentifier.id, {
      collectionName: 'some-collection-name',
      occurrenceKey: 'some-occurrence-key',
    });
  });

  it('should work with async identifier', async () => {
    const fileId = Promise.resolve('file-id');
    const identifier: FileIdentifier = {
      id: fileId,
      mediaItemType: 'file',
      collectionName: 'collection',
      occurrenceKey: 'some-occurrence-key',
    };
    const { mediaClient } = setup(undefined, { identifier });
    await fileId;
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);
    expect(mediaClient.file.getFileState).toBeCalledWith('file-id', {
      collectionName: 'collection',
      occurrenceKey: 'some-occurrence-key',
    });
  });

  it('should set dataURI only if its not present', async () => {
    const { component } = setup();
    await fileIdentifier.id;
    await defaultFilePreview;
    expect(getFilePreviewFromFileState).toHaveBeenCalledTimes(1);
    expect(component.state('dataURI')).toEqual('some-data-uri');
  });

  it('should set preview orientation and pass it down do view', async () => {
    const { component } = setup();
    await fileIdentifier.id;
    await defaultFilePreview;
    component.update();
    expect(component.state('previewOrientation')).toEqual(6);
    expect(component.find(CardView).prop('previewOrientation')).toEqual(6);
  });

  it('should set right state when file is uploading', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'uploading',
      progress: 0.2,
    });
    const { component } = setup(mediaClient);

    await fileIdentifier.id;
    expectToEqual(component.state().metadata, {
      id: defaultFileId,
      mediaType: 'image',
      mimeType: 'image/png',
      name: 'file-name',
      size: 10,
    });

    await defaultFilePreview;

    expectToEqual(
      component.state(),
      expect.objectContaining({
        status: 'uploading',
        dataURI: 'some-data-uri',
        isCardVisible: true,
        progress: 0.2,
        previewOrientation: 6,
        isPlayingFile: false,
      } as Partial<CardState>),
    );
  });

  it('should set progress as number 0', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'uploading',
      progress: 0,
    });
    const { component } = setup(mediaClient);
    await fileIdentifier.id;
    await defaultFilePreview;
    expectToEqual(component.state().progress, 0);
  });

  it('should set right state when file is processing', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'processing',
    });
    const { component } = setup(mediaClient);

    await fileIdentifier.id;
    await defaultFilePreview;

    const { status, progress } = component.state();

    expectToEqual(status, 'complete');
    expectToEqual(progress, 1);
  });

  it('should set right state when file is processed', async () => {
    const expectedDataURIFromFileState = undefined;
    const filePreview = Promise.resolve({
      src: expectedDataURIFromFileState,
      orientation: 6,
    });
    const { component } = setup(undefined, undefined, filePreview);

    await fileIdentifier.id;
    await filePreview;

    const {
      previewOrientation,
      dataURI: dataURIFromFileState,
    } = component.state();
    expectToEqual(dataURIFromFileState, expectedDataURIFromFileState);
    // Since expectedDataURIFromFileState is empty, we are not writing it's orientation (6) to state
    expectToEqual(previewOrientation, 1);

    await defaultImageBlob;
    await nextTick(); // Will cause result of getContextedDataURIFromBackend() to resolve

    const {
      status,
      progress,
      dataURI: dataURIFromObjectURL,
    } = component.state();

    expectToEqual(status, 'complete');
    expectToEqual(progress, undefined);
    expectToEqual(dataURIFromObjectURL, 'mock result of URL.createObjectURL()');
  });

  it('should not render older cardStatus after a newer one', async () => {
    const mockMediaClient = fakeMediaClient();

    // We want to hold off first result of first getFilePreviewFromFileState until it's time later in the test
    let resolveFirstFilePreviewFromFileState: (
      preview: FilePreview,
    ) => void = () => {};
    asMockFunction(getFilePreviewFromFileState).mockReset();

    // This will be returned during first ('uploading') next() call
    const firstGetFilePreviewFromFileStatePromise = new Promise<FilePreview>(
      _resolve => (resolveFirstFilePreviewFromFileState = _resolve),
    );
    asMockFunction(getFilePreviewFromFileState).mockReturnValueOnce(
      firstGetFilePreviewFromFileStatePromise,
    );
    asMockFunction(getFilePreviewFromFileState).mockReturnValueOnce(
      // This will be returned during second ('processing') next() call
      defaultFilePreview,
    );

    const uploadingFileState = createFileStateSubject({
      ...defaultFileState,
      status: 'uploading',
      progress: 0.9,
    });

    asMockReturnValue(mockMediaClient.file.getFileState, uploadingFileState);

    const component = shallow<
      CardBase,
      CardWithAnalyticsEventsProps,
      CardState
    >(
      <CardBase
        mediaClient={mockMediaClient}
        identifier={identifier}
        isLazy={false}
      />,
    );

    await fileIdentifier.id;

    // It will be paused by first unresolved getFilePreviewFromFileState result

    // Fire second fileState
    uploadingFileState.next({
      ...defaultFileState,
      status: 'processing',
    });

    await defaultFilePreview; // will resolve second getFilePreviewFromFileState call

    const {
      status: statusAfterSecondFileState,
      progress: progressAfterSecondFileState,
      previewOrientation,
      dataURI: dataUriFromSecondFileState,
    } = component.state();
    expectToEqual(previewOrientation, 6);
    expectToEqual(dataUriFromSecondFileState, 'some-data-uri');
    expectToEqual(statusAfterSecondFileState, 'complete');
    expectToEqual(progressAfterSecondFileState, 1);

    // This will resolve first getFilePreviewFromFileState call
    resolveFirstFilePreviewFromFileState({
      orientation: 5,
      src: 'some-other-data-uri',
    });

    await firstGetFilePreviewFromFileStatePromise;

    const {
      status: statusAfterFirstFileState,
      progress: progressAfterFirstFileState,
      previewOrientation: secondPreviewOrientation,
      dataURI: dataUriFromFirstFileState,
    } = component.state();
    // dataURI is updated with result of first getFilePreviewFromFileState call
    expectToEqual(dataUriFromFirstFileState, 'some-other-data-uri');
    expectToEqual(secondPreviewOrientation, 5);

    // overall CardStatus shouldn't change back to `uploading`
    expectToEqual(statusAfterFirstFileState, 'complete');
    expectToEqual(progressAfterFirstFileState, 1);
  });

  it('should render error card when getFileState resolves with status=error', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'error',
    });
    const { component } = setup(mediaClient);

    await fileIdentifier.id;
    await defaultFilePreview;

    component.update();
    expect(component.find(CardView).prop('status')).toEqual('error');
  });

  it('should render failed card when getFileState resolves with status=failed', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'failed-processing',
    });
    const { component } = setup(mediaClient);

    await fileIdentifier.id;
    await defaultFilePreview;

    component.update();
    const { status, metadata } = component.find(CardView).props();
    expect(status).toEqual('failed-processing');
    expect(metadata).toEqual({
      id: defaultFileId,
      size: 10,
      name: 'file-name',
      mimeType: 'image/png',
      mediaType: 'image',
    } as FileDetails);
  });

  it('should render error card when getFileState fails', async () => {
    const mediaClient = fakeMediaClient();
    const fileStateSubject = createFileStateSubject();
    fileStateSubject.error('some-error');
    asMockReturnValue(mediaClient.file.getFileState, fileStateSubject);

    const { component } = setup(mediaClient);

    await fileIdentifier.id;

    expect(component.state('error')).toEqual('some-error');
    component.update();
    expect(component.find(CardView).prop('status')).toEqual('error');
  });

  it('should fetch remote preview when image representation available and there is no local preview', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'processing',
      representations: {
        image: {},
      },
    });
    setup(mediaClient, undefined, emptyPreview);

    await fileIdentifier.id;
    await emptyPreview;

    expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
    expect(mediaClient.getImage).toBeCalledWith(fileIdentifier.id, {
      collection: 'some-collection-name',
      height: 125,
      width: 156,
      allowAnimated: true,
      mode: 'crop',
    });
  });

  it('should not fetch remote preview when there is local preview', async () => {
    const subject = new ReplaySubject<FileState>(1);
    const baseState: FileState = {
      id: defaultFileId,
      mediaType: 'image',
      status: 'processing',
      mimeType: 'image/png',
      name: 'file-name',
      size: 10,
      representations: {
        image: {},
      },
    };
    subject.next(baseState);
    const mediaClient = fakeMediaClient();
    asMockReturnValue(mediaClient.file.getFileState, subject);
    const { component } = setup(mediaClient);

    await fileIdentifier.id;
    await defaultFilePreview;

    expect(component.state('dataURI')).toEqual('some-data-uri');
    expect(mediaClient.getImage).toHaveBeenCalledTimes(0);

    subject.next({
      ...baseState,
      status: 'processed',
      artifacts: {},
    });
    const dataUriFromFileStateResult = Promise.resolve({
      src: 'fooo',
      orientation: 6,
    });

    asMockReturnValue(getFilePreviewFromFileState, dataUriFromFileStateResult);

    await dataUriFromFileStateResult;

    // We want to make sure that when transition from "processing" to "processed" we still don't call getImage if we already have preview
    expect(component.state('dataURI')).toEqual('some-data-uri');
    expect(component.state('status')).toEqual('complete');
    expect(mediaClient.getImage).toHaveBeenCalledTimes(0);
  });

  it('should pass resize mode down to getImage call', async () => {
    const { mediaClient } = setup(
      undefined,
      {
        resizeMode: 'full-fit',
      },
      emptyPreview,
    );

    await fileIdentifier.id;
    await emptyPreview;

    expect(mediaClient.getImage).toBeCalledWith(
      fileIdentifier.id,
      expect.objectContaining({
        mode: 'full-fit',
      }),
    );
  });

  it('should change mode from stretchy-fit to full-fit while passing down to getImage call', async () => {
    const { mediaClient } = setup(
      undefined,
      {
        resizeMode: 'stretchy-fit',
      },
      emptyPreview,
    );

    await fileIdentifier.id;
    await emptyPreview;

    expect(mediaClient.getImage).toBeCalledWith(
      fileIdentifier.id,
      expect.objectContaining({
        mode: 'full-fit',
      }),
    );
  });

  it('should render CardView with expected props', async () => {
    const { component } = setup(
      undefined,
      {
        dimensions: { width: 10, height: 20 },
        selectable: true,
        selected: true,
        resizeMode: 'fit',
        disableOverlay: true,
      },
      emptyPreview,
    );

    await fileIdentifier.id;
    await emptyPreview;
    await defaultImageBlob;
    await nextTick(); // Will cause result of getContextedDataURIFromBackend() to resolve

    component.update();

    expect(component.find(CardView).props()).toEqual(
      expect.objectContaining({
        appearance: 'auto',
        dataURI: 'mock result of URL.createObjectURL()',
        dimensions: { width: 10, height: 20 },
        disableOverlay: true,
        progress: undefined,
        resizeMode: 'fit',
        selectable: true,
        selected: true,
        status: 'complete',
      }),
    );

    expect(component.find(CardView).prop('metadata')).toEqual({
      id: defaultFileId,
      mediaType: 'image',
      name: 'file-name',
      mimeType: 'image/png',
      size: 10,
    });
  });

  it('should cleanup resources when unmounting', () => {
    const unsubscribe = jest.fn();
    const releaseDataURI = jest.fn();
    const { component } = setup();
    const instance = component.instance() as CardBase;

    instance.unsubscribe = unsubscribe;
    instance.releaseStateDataURI = releaseDataURI;

    component.unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(releaseDataURI).toHaveBeenCalledTimes(1);
  });

  it('should not release preview for external identifier', () => {
    const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');
    const identifier: ExternalImageIdentifier = {
      mediaItemType: 'external-image',
      dataURI: 'bla',
      name: 'some external image',
    };
    const { component } = setup(undefined, { identifier });

    component.unmount();
    expect(revokeObjectURLSpy).not.toBeCalled();
  });

  it('ED-6584: should keep dataURI in the state if it was already generated', async () => {
    const { component, mediaClient } = setup(undefined, {
      dimensions: { width: 50, height: 50 },
    });

    await fileIdentifier.id;
    await defaultFilePreview;

    component.setProps({ dimensions: { width: 100, height: 100 } });
    const currentDataURI = component.state('dataURI');
    await defaultFilePreview;
    const newDataURI = component.state('dataURI');
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(2);
    expect(currentDataURI).toEqual(newDataURI);
  });

  it('should keep orientation in the state if it was already acquired', async () => {
    const { component } = setup(undefined, {
      dimensions: { width: 50, height: 50 },
    });

    await fileIdentifier.id;
    await defaultFilePreview;

    const previewOrientation = component.state('previewOrientation');

    component.setProps({ dimensions: { width: 100, height: 100 } });

    await fileIdentifier.id;

    const newDataPreviewOrientation = component.state('previewOrientation');
    expect(previewOrientation).toEqual(6);
    expect(newDataPreviewOrientation).toEqual(6);
  });

  describe('Retry', () => {
    it('should pass down "onRetry" prop when an error occurs', async () => {
      const { component, mediaClient } = setup();
      const cardViewOnError = component
        .find(CardView)
        .prop('onRetry') as CardViewOwnProps['onRetry'];
      if (!cardViewOnError) {
        return expect(cardViewOnError).toBeDefined();
      }
      await fileIdentifier.id;
      expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);
      cardViewOnError();

      await fileIdentifier.id;

      expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(2);
    });
  });

  describe('External image identifier', () => {
    it('should work with external image identifier', () => {
      const identifier: ExternalImageIdentifier = {
        mediaItemType: 'external-image',
        dataURI: 'bla',
        name: 'some external image',
      };

      const { component } = setup(undefined, { identifier });

      expect(component.find(CardView).prop('dataURI')).toEqual('bla');
      expect(component.find(CardView).prop('metadata')).toEqual({
        id: identifier.mediaItemType,
        mediaType: 'image',
        name: 'some external image',
      });
    });

    it('should use dataURI as default name and mediaItemType as id', () => {
      const identifier: ExternalImageIdentifier = {
        mediaItemType: 'external-image',
        dataURI: 'bla',
      };

      const { component } = setup(undefined, { identifier });

      expect(component.find(CardView).prop('metadata')).toEqual({
        id: identifier.mediaItemType,
        mediaType: 'image',
        name: 'bla',
      });
    });
  });

  it('should add download Action when in failed-processing state', () => {
    const initialActions: Array<CardAction> = [
      {
        handler: () => {},
      },
    ];
    const { component } = setup(undefined, {
      actions: initialActions,
    });
    component.setState({
      status: 'failed-processing',
      metadata: {
        id: 'some-id',
      },
    });
    component.update();
    const actions = component.find(CardView).prop('actions')!;
    expect(actions).toHaveLength(2);
    expect(actions[0].label).toEqual('Download');
  });

  it('should call item download when download Action is executed', async () => {
    identifier = fileIdentifier;
    const { component, mediaClient } = setup();
    component.setState({
      status: 'failed-processing',
      metadata: {
        id: 'some-id',
        name: 'some-file-name',
      },
    });
    component.update();
    const actions = component.find(CardView).prop('actions')!;
    actions[0].handler();
    await identifier.id;
    expect(mediaClient.file.downloadBinary).toHaveBeenCalledWith(
      identifier.id,
      'some-file-name',
      identifier.collectionName,
    );
  });

  describe('when CardView calls onDisplayImage', () => {
    const expectMediaViewedEvent = async ({
      fileId,
      isUserCollection,
    }: {
      fileId: string;
      isUserCollection: boolean;
    }) => {
      const { component } = setup();
      const { onDisplayImage } = component.find(CardView).props();
      if (!onDisplayImage) {
        return expect(onDisplayImage).toBeDefined();
      }
      onDisplayImage();
      if (isFileIdentifier(identifier)) {
        await identifier.id;
      }
      expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
      expectFunctionToHaveBeenCalledWith(globalMediaEventEmitter.emit, [
        'media-viewed',
        {
          fileId,
          isUserCollection,
          viewingLevel: 'minimal',
        } as MediaViewedEventPayload,
      ]);
    };

    it('should trigger "media-viewed" in globalMediaEventEmitter when collection is not recents', async () => {
      identifier = fileIdentifier;
      await expectMediaViewedEvent({
        fileId: await fileIdentifier.id,
        isUserCollection: false,
      });
    });

    it('should trigger "media-viewed" in globalMediaEventEmitter when collection is recents', async () => {
      identifier = {
        ...fileIdentifier,
        collectionName: RECENTS_COLLECTION,
      };
      await expectMediaViewedEvent({
        fileId: await fileIdentifier.id,
        isUserCollection: true,
      });
    });

    it('should trigger "media-viewed" in globalMediaEventEmitter when external identifier', async () => {
      identifier = {
        mediaItemType: 'external-image',
        dataURI: 'some-data-uri',
      };
      await expectMediaViewedEvent({
        fileId: 'some-data-uri',
        isUserCollection: false,
      });
    });
  });

  describe('Inline player', () => {
    it('should render InlinePlayer when isPlayingFile=true', () => {
      const { component } = setup();

      component.setState({
        isPlayingFile: true,
      });
      component.update();
      expect(component.find(InlinePlayer)).toHaveLength(1);
    });

    it('should set isPlayingFile=true when clicking on a video file', () => {
      const { component } = setup(undefined, { useInlinePlayer: true });
      component.setState({ metadata: { id: 'some-id', mediaType: 'video' } });
      component.find(CardView).simulate('click');
      expect(component.state('isPlayingFile')).toBeTruthy();
    });
  });

  describe('MediaViewer integration', () => {
    it('should render MV when shouldOpenMediaViewer=true', async () => {
      const { component } = setup(undefined, { shouldOpenMediaViewer: true });
      component.setState({ metadata: { id: 'some-id', mediaType: 'image' } });
      component.find(CardView).simulate('click');

      await fileIdentifier.id;

      const MV = component.find(MediaViewer);

      expect(component.state('mediaViewerSelectedItem')).toEqual(identifier);
      expect(MV).toHaveLength(1);
      expect(MV.props()).toEqual(
        expect.objectContaining({
          collectionName: 'some-collection-name',
          dataSource: { list: [] },
          selectedItem: identifier,
        }),
      );
    });

    it('should pass dataSource to MV', async () => {
      const { component } = setup(undefined, {
        shouldOpenMediaViewer: true,
        mediaViewerDataSource: { list: [identifier, identifier] },
      });
      component.setState({ metadata: { id: 'some-id', mediaType: 'image' } });
      component.find(CardView).simulate('click');

      await fileIdentifier.id;

      expect(component.find(MediaViewer).prop('dataSource')).toEqual({
        list: [identifier, identifier],
      });
    });

    it('should not render MV if useInlinePlayer=true and identifier is video type', async () => {
      const fileId = Promise.resolve('1');
      const videoIdentifier: FileIdentifier = {
        id: fileId,
        mediaItemType: 'file',
      };
      const mediaClient = createMediaClientWithGetFile({
        ...defaultFileState,
        mediaType: 'video',
      });
      const { component } = setup(mediaClient, {
        useInlinePlayer: true,
        shouldOpenMediaViewer: true,
        identifier: videoIdentifier,
      });

      await fileId;
      await defaultFilePreview;

      component.find(CardView).simulate('click');

      expect(component.find(MediaViewer)).toHaveLength(0);
      expect(component.find(InlinePlayer)).toHaveLength(1);
    });

    it('should pass contextId to MV', async () => {
      const { component } = setup(undefined, {
        shouldOpenMediaViewer: true,
        mediaViewerDataSource: { list: [identifier, identifier] },
        contextId: 'some-context-id',
      });

      await fileIdentifier.id;
      await defaultFilePreview;

      component.find(CardView).simulate('click');

      await fileIdentifier.id;

      expect(component.find(MediaViewer).prop('contextId')).toEqual(
        'some-context-id',
      );
    });
  });

  describe('Analytics', () => {
    const callCopy = async () => {
      document.dispatchEvent(new Event('copy'));
      await nextTick(); // copy handler is not awaited and fired in the next tick
    };

    it('should attach UI Analytics Context', async () => {
      const mediaClient = fakeMediaClient();
      const metadata: FileDetails = {
        id: defaultFileId,
        mediaType: 'video',
        size: 12345,
        processingStatus: 'succeeded',
      };

      const card = shallow<CardProps>(
        <CardBase mediaClient={mediaClient} identifier={identifier} />,
      );
      card.setState({ metadata });
      card.update();
      await fileIdentifier.id;

      const contextData = card
        .find(MediaAnalyticsContext)
        .at(0)
        .props().data;

      expect(contextData).toMatchObject(getMediaCardAnalyticsContext(metadata));
    });

    it('should attach Base Analytics Context', () => {
      const mediaClient = fakeMediaClient();
      const card = shallow<CardProps>(
        <Card mediaClient={mediaClient} identifier={identifier} />,
      );

      const contextData = card
        .find(AnalyticsContext)
        .at(0)
        .props().data;
      expect(contextData).toMatchObject(getBaseAnalyticsContext() || {});
    });

    it('should pass the Analytics Event fired from CardView to the provided onClick callback', () => {
      const onClickHandler = jest.fn();
      const { component } = setup(undefined, { onClick: onClickHandler });
      component
        .find(CardView)
        .props()
        .onClick({ thiIsA: 'HTMLEvent' }, { thiIsAn: 'AnalyticsEvent' });

      expect(onClickHandler).toBeCalledTimes(1);
      const actualEvent = onClickHandler.mock.calls[0][1];
      expect(actualEvent).toBeDefined();
    });

    it('should pass the Analytics Event fired from InlinePlayer to the provided onClick callback', async () => {
      const onClickHandler = jest.fn();
      const { component } = setup(undefined, { onClick: onClickHandler });
      component.setState({
        isPlayingFile: true,
      });
      component.update();
      component
        .find(InlinePlayer)
        .props()
        .onClick({ thiIsA: 'HTMLEvent' }, { thiIsAn: 'AnalyticsEvent' });

      expect(onClickHandler).toBeCalledTimes(1);
      const actualEvent = onClickHandler.mock.calls[0][1];
      expect(actualEvent).toBeDefined();
    });

    it('should fire copied file event on copy if inside a selection', async () => {
      const mediaClient = fakeMediaClient();
      const onEvent = jest.fn();
      window.getSelection = jest.fn().mockReturnValue({
        containsNode: () => true,
      });
      mount<CardProps, CardState>(
        <AnalyticsListener channel={FabricChannel.media} onEvent={onEvent}>
          <Card mediaClient={mediaClient} identifier={identifier} />
        </AnalyticsListener>,
      );
      await callCopy();
      expect(onEvent).toBeCalledWith(
        expect.objectContaining({
          payload: {
            action: 'copied',
            actionSubject: 'file',
            actionSubjectId: fileIdentifier.id,
            eventType: 'ui',
          },
          context: [
            {
              componentName: 'mediaCard',
              component: 'mediaCard',
              packageName: '@atlaskit/media-card',
              packageVersion: '999.9.9',
            },
          ],
        }),
        FabricChannel.media,
      );
    });

    it('should not fire copied file event on copy if not inside a selection', async () => {
      const mediaClient = fakeMediaClient();
      const onEvent = jest.fn();
      window.getSelection = jest.fn().mockReturnValue({
        containsNode: () => false,
      });
      mount<CardProps, CardState>(
        <AnalyticsListener channel={FabricChannel.media} onEvent={onEvent}>
          <Card mediaClient={mediaClient} identifier={identifier} />
        </AnalyticsListener>,
      );
      await callCopy();
      expect(onEvent).not.toBeCalled();
    });

    it('should not fire copy analytics if selection api is not available', async () => {
      const mediaClient = fakeMediaClient();
      const onEvent = jest.fn();
      window.getSelection = jest.fn().mockReturnValue({});
      mount<CardProps, CardState>(
        <AnalyticsListener channel={FabricChannel.media} onEvent={onEvent}>
          <Card mediaClient={mediaClient} identifier={identifier} />
        </AnalyticsListener>,
      );
      await callCopy();
      expect(onEvent).not.toBeCalled();
    });

    it('should remove listener on unmount', async () => {
      const mediaClient = fakeMediaClient();
      const onEvent = jest.fn();
      window.getSelection = jest.fn().mockReturnValue({
        containsNode: () => true,
      });
      const handler = mount<CardProps, CardState>(
        <AnalyticsListener channel={FabricChannel.media} onEvent={onEvent}>
          <Card mediaClient={mediaClient} identifier={identifier} />
        </AnalyticsListener>,
      );

      handler.unmount();
      await callCopy();
      expect(onEvent).not.toBeCalled();
    });

    it('should fire Analytics Event on file load start with static file Id', async () => {
      const subject = new ReplaySubject<FileState>(1);
      const mediaClient = fakeMediaClient();
      asMockReturnValue(mediaClient.file.getFileState, subject);
      const analyticsHandler = getAnalyticsHandlerMock();

      await mount(
        <AnalyticsListener
          channel={FabricChannel.media}
          onEvent={analyticsHandler}
        >
          <Card
            mediaClient={mediaClient}
            identifier={identifier}
            isLazy={false}
          />
        </AnalyticsListener>,
      );

      await fileIdentifier.id;
      await fileIdentifier.id;

      expect(analyticsHandler).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          payload: expect.objectContaining({
            eventType: 'operational',
            action: 'commenced',
            actionSubject: 'mediaCardRender',
            actionSubjectId: defaultFileId,
          }),
        }),
        FabricChannel.media,
      );
    });

    it('should fire Analytics Event on file load start with async file Id', async () => {
      const subject = new ReplaySubject<FileState>(1);
      const mediaClient = fakeMediaClient();
      asMockReturnValue(mediaClient.file.getFileState, subject);
      const analyticsHandler = getAnalyticsHandlerMock();
      const deferredFileId = Promise.resolve('some-async-id');
      const asyncIdentifier = {
        ...identifier,
        id: deferredFileId,
      };
      mount(
        <AnalyticsListener
          channel={FabricChannel.media}
          onEvent={analyticsHandler}
        >
          <Card
            mediaClient={mediaClient}
            identifier={asyncIdentifier}
            isLazy={false}
          />
        </AnalyticsListener>,
      );

      await deferredFileId;
      await deferredFileId;

      expect(analyticsHandler).toBeCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            eventType: 'operational',
            action: 'commenced',
            actionSubject: 'mediaCardRender',
            actionSubjectId: 'some-async-id',
          }),
        }),
        FabricChannel.media,
      );
    });

    it('should fire Analytics Event on file load start with external file Id', async () => {
      const mediaClient = fakeMediaClient();
      const analyticsHandler = getAnalyticsHandlerMock();
      const externalIdentifier: ExternalImageIdentifier = {
        mediaItemType: 'external-image',
        dataURI: 'bla',
        name: 'some external image',
      };
      mount(
        <AnalyticsListener
          channel={FabricChannel.media}
          onEvent={analyticsHandler}
        >
          <Card
            mediaClient={mediaClient}
            identifier={externalIdentifier}
            isLazy={false}
          />
        </AnalyticsListener>,
      );

      await nextTick(); // Will cause result of this.getResolvedId call to resolve

      expect(analyticsHandler).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          payload: expect.objectContaining({
            eventType: 'operational',
            action: 'commenced',
            actionSubject: 'mediaCardRender',
            actionSubjectId: externalIdentifier.mediaItemType,
          }),
        }),
        FabricChannel.media,
      );
    });

    it('should fire Analytics Event on load commence and failure if an error happened during the file loading', async () => {
      const baseState: FileState = {
        id: defaultFileId,
        mediaType: 'image',
        status: 'processing',
        mimeType: 'image/png',
        name: 'file-name',
        size: 10,
        representations: {
          image: {},
        },
      };
      const commencedFileState: FileState = {
        ...baseState,
        status: 'uploading',
        progress: 1,
      };
      const errorFileState: FileState = {
        ...baseState,
        status: 'error',
      };

      const subject = new ReplaySubject<FileState>(1);
      const mediaClient = fakeMediaClient();
      asMockReturnValue(mediaClient.file.getFileState, subject);
      const analyticsHandler = getAnalyticsHandlerMock();

      mount(
        <AnalyticsListener
          channel={FabricChannel.media}
          onEvent={analyticsHandler}
        >
          <Card
            mediaClient={mediaClient}
            identifier={identifier}
            isLazy={false}
          />
        </AnalyticsListener>,
      );

      await fileIdentifier.id;
      subject.next(commencedFileState);
      await defaultFilePreview;

      subject.next(errorFileState);
      await defaultFilePreview;

      expect(analyticsHandler).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          payload: expect.objectContaining({
            ...analyticsBasePayload,
            actionSubjectId,
            action: 'commenced',
          }),
        }),
        FabricChannel.media,
      );

      // If there is status error, Media Client does not provide any metadata. Therefore we can't log it or test it
      expect(analyticsHandler).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          payload: expect.objectContaining({
            ...analyticsBasePayload,
            actionSubjectId,
            action: 'failed',
            attributes: expect.objectContaining({
              failReason: 'file-status-error',
              error:
                'Does not have minimal metadata (filename and filesize) OR metadata/media-type is undefined',
            }),
          }),
          context: [
            {
              packageVersion: '999.9.9',
              packageName: '@atlaskit/media-card',
              componentName: 'mediaCard',
              component: 'mediaCard',
            },
          ],
        }),
        FabricChannel.media,
      );
    });

    it('should NOT fire same consecutive file states', async () => {
      const baseState: FileState = {
        id: defaultFileId,
        mediaType: 'image',
        status: 'processing',
        mimeType: 'image/png',
        name: 'file-name',
        size: 10,
        representations: {
          image: {},
        },
      };
      const commencedFileState: FileState = {
        ...baseState,
        status: 'uploading',
        progress: 1,
      };
      const errorFileState: FileState = {
        ...baseState,
        status: 'error',
      };

      const subject = new ReplaySubject<FileState>(1);
      const mediaClient = fakeMediaClient();
      asMockReturnValue(mediaClient.file.getFileState, subject);
      const analyticsHandler = getAnalyticsHandlerMock();

      mount(
        <AnalyticsListener
          channel={FabricChannel.media}
          onEvent={analyticsHandler}
        >
          <Card
            mediaClient={mediaClient}
            identifier={identifier}
            isLazy={false}
          />
        </AnalyticsListener>,
      );

      subject.next(commencedFileState);
      subject.next(errorFileState);
      subject.next(errorFileState);
      subject.next(errorFileState);

      await fileIdentifier.id;
      await defaultFilePreview;
      await defaultFilePreview;
      await defaultFilePreview;

      expect(analyticsHandler).toBeCalledTimes(2);

      expect(analyticsHandler).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          payload: expect.objectContaining({
            ...analyticsBasePayload,
            actionSubjectId,
            action: 'commenced',
          }),
        }),
        FabricChannel.media,
      );

      expect(analyticsHandler).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          payload: expect.objectContaining({
            ...analyticsBasePayload,
            action: 'failed',
            attributes: expect.objectContaining({
              failReason: 'file-status-error',
              error:
                'Does not have minimal metadata (filename and filesize) OR metadata/media-type is undefined',
            }),
          }),
          context: [
            {
              packageVersion: '999.9.9',
              packageName: '@atlaskit/media-card',
              componentName: 'mediaCard',
              component: 'mediaCard',
            },
          ],
        }),
        FabricChannel.media,
      );
    });

    it('should fire commenced and success events with context info if the file loads with success', async () => {
      asMockFunction(getFilePreviewFromFileState).mockReturnValue(emptyPreview);

      const commencedFileState: FileState = {
        status: 'processed',
        id: await fileIdentifier.id,
        name: 'file-name',
        artifacts: {},
        mediaType: 'doc',
        size: 1,
        mimeType: 'application/pdf',
        preview: {
          value: new File([], 'filename', { type: 'text/plain' }),
        },
        representations: {},
      };

      const subject = new ReplaySubject<FileState>(1);
      const mediaClient = fakeMediaClient();
      asMockReturnValue(mediaClient.file.getFileState, subject);
      const analyticsHandler = getAnalyticsHandlerMock();

      mount(
        <AnalyticsListener
          channel={FabricChannel.media}
          onEvent={analyticsHandler}
        >
          <Card
            mediaClient={mediaClient}
            identifier={identifier}
            isLazy={false}
          />
        </AnalyticsListener>,
      );

      subject.next(commencedFileState);
      await fileIdentifier.id;
      await emptyPreview;

      expect(analyticsHandler).toHaveBeenCalledTimes(2);

      expect(analyticsHandler).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          payload: expect.objectContaining({
            ...analyticsBasePayload,
            actionSubjectId,
            action: 'commenced',
          }),
        }),
        FabricChannel.media,
      );

      expect(analyticsHandler).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'succeeded',
            actionSubject: 'mediaCardRender',
            // TODO: If we use fileId as actionSubjectId, then look into moving this value to the AnalyticsContext and use everywhere
            // actionSubjectId: fileIdentifier.id,
            eventType: 'operational',
          }),
          context: [
            {
              component: 'mediaCard',
              componentName: 'mediaCard',
              packageName: '@atlaskit/media-card',
              packageVersion: '999.9.9',
            },
            {
              mediaCtx: {
                fileAttributes: {
                  fileId: fileIdentifier.id,
                  fileMediatype: 'doc',
                  fileMimetype: 'application/pdf',
                  fileSize: 1,
                  fileSource: 'mediaCard',
                  fileStatus: 'processed',
                },
              },
            },
          ],
        }),
        FabricChannel.media,
      );
    });

    it('should fire a succeeded event for unpreviewable files with minimal metadata', async () => {
      const unpreviewableFileState: FileState = {
        status: 'failed-processing',
        id: defaultFileId,
        name: 'file-name',
        size: 10,
        artifacts: {},
        mediaType: 'doc',
        mimeType: 'application/pdf',
      };

      const subject = new ReplaySubject<FileState>(1);
      const mediaClient = fakeMediaClient();
      asMockReturnValue(mediaClient.file.getFileState, subject);
      const analyticsHandler = getAnalyticsHandlerMock();

      mount(
        <AnalyticsListener
          channel={FabricChannel.media}
          onEvent={analyticsHandler}
        >
          <Card
            mediaClient={mediaClient}
            identifier={identifier}
            isLazy={false}
          />
        </AnalyticsListener>,
      );

      await fileIdentifier.id; // resolve awaited id in subscribeInternalFile
      await fileIdentifier.id; // resolves awaited id in getResolvedId
      await nextTick(); // Will cause result of getResolvedId to resolve

      subject.next(unpreviewableFileState);

      await defaultFilePreview;

      expect(analyticsHandler).toHaveBeenCalledTimes(2);

      expectToEqual(analyticsHandler.mock.calls[0][1], FabricChannel.media);
      expectToEqual(analyticsHandler.mock.calls[1][1], FabricChannel.media);

      expectToEqual(
        analyticsHandler.mock.calls[0][0],
        expect.objectContaining({
          payload: expect.objectContaining({
            ...analyticsBasePayload,
            actionSubjectId,
            action: 'commenced',
          }),
        }),
      );

      expectToEqual(
        analyticsHandler.mock.calls[1][0],
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'succeeded',
            actionSubject: 'mediaCardRender',
            eventType: 'operational',
          }),
          context: [
            {
              component: 'mediaCard',
              componentName: 'mediaCard',
              packageName: '@atlaskit/media-card',
              packageVersion: '999.9.9',
            },
            {
              mediaCtx: {
                fileAttributes: {
                  fileId: defaultFileId,
                  fileMediatype: 'doc',
                  fileMimetype: 'application/pdf',
                  fileSize: 10,
                  fileSource: 'mediaCard',
                  fileStatus: 'failed-processing',
                },
              },
            },
          ],
        }),
      );
    });

    it('should fire a failed event for unpreviewable files without minimal metadata', async () => {
      const docFileState: FileState = {
        status: 'failed-processing',
        id: defaultFileId,
        name: undefined,
        size: undefined,
        artifacts: {},
        mediaType: 'doc',
        mimeType: 'application/pdf',
      } as any;

      const subject = new ReplaySubject<FileState>(1);
      const mediaClient = fakeMediaClient();
      asMockReturnValue(mediaClient.file.getFileState, subject);
      const analyticsHandler = getAnalyticsHandlerMock();

      mount(
        <AnalyticsListener
          channel={FabricChannel.media}
          onEvent={analyticsHandler}
        >
          <Card
            mediaClient={mediaClient}
            identifier={identifier}
            isLazy={false}
          />
        </AnalyticsListener>,
      );

      await fileIdentifier.id; // resolve awaited id in subscribeInternalFile
      await fileIdentifier.id; // resolves awaited id in getResolvedId
      await nextTick(); // Will cause result of getResolvedId to resolve

      subject.next(docFileState);

      await defaultFilePreview;

      //commenced, succeeded (cardImageView), then failed(Mediacard)
      expect(analyticsHandler).toHaveBeenCalledTimes(3);

      expect(analyticsHandler).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          payload: expect.objectContaining({
            ...analyticsBasePayload,
            actionSubjectId,
            action: 'commenced',
          }),
        }),
        FabricChannel.media,
      );

      expect(analyticsHandler).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'succeeded',
            actionSubject: 'mediaCardRender',
            eventType: 'operational',
          }),
          context: [
            {
              component: 'mediaCard',
              componentName: 'mediaCard',
              packageName: '@atlaskit/media-card',
              packageVersion: '999.9.9',
            },
            {
              mediaCtx: {
                fileAttributes: {
                  fileId: defaultFileId,
                  fileMediatype: 'doc',
                  fileMimetype: 'application/pdf',
                  fileSource: 'mediaCard',
                  fileStatus: 'failed-processing',
                },
              },
            },
          ],
        }),
        FabricChannel.media,
      );

      expect(analyticsHandler).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          payload: expect.objectContaining({
            ...analyticsBasePayload,
            actionSubjectId,
            action: 'failed',
            attributes: expect.objectContaining({
              failReason: 'file-status-error',
              error:
                'Does not have minimal metadata (filename and filesize) OR metadata/media-type is undefined',
            }),
          }),
        }),
        FabricChannel.media,
      );
    });
  });
});
