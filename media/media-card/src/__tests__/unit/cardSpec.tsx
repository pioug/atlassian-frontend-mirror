jest.mock('../../utils/viewportDetector', () => {
  const actualModule = jest.requireActual('../../utils/viewportDetector');
  return {
    __esModule: true,
    ...actualModule,
    ViewportDetector: jest.fn(actualModule.ViewportDetector),
  };
});
jest.mock('../../root/card/getCardPreview', () => {
  const actualModule = jest.requireActual('../../root/card/getCardPreview');
  return {
    __esModule: true,
    ...actualModule,
    getCardPreviewFromFileState: jest.fn(),
  };
});
jest.mock('../../root/card/getCardStatus', () => {
  const actualModule = jest.requireActual('../../root/card/getCardStatus');
  return {
    __esModule: true,
    ...actualModule,
    getCardStatus: jest.fn(actualModule.getCardStatus),
  };
});
jest.mock('../../root/card/cardAnalytics', () => {
  const actualModule = jest.requireActual('../../root/card/cardAnalytics');
  return {
    __esModule: true,
    ...actualModule,
    fireOperationalEvent: jest.fn(actualModule.fireOperationalEvent),
  };
});
import { ReplaySubject } from 'rxjs/ReplaySubject';
import React from 'react';
import uuid from 'uuid/v4';
import { shallow, mount, ReactWrapper } from 'enzyme';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';
import {
  AnalyticsListener,
  AnalyticsContext,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  MediaClient,
  FileState,
  FileDetails,
  FileIdentifier,
  ExternalImageIdentifier,
  Identifier,
  globalMediaEventEmitter,
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
  flushPromises,
} from '@atlaskit/media-test-helpers';

import {
  CardAction,
  CardDimensions,
  CardProps,
  CardState,
  NumericalCardDimensions,
} from '../..';
import { Card, CardBase, CardWithAnalyticsEventsProps } from '../../root/card';
import { CardView } from '../../root/cardView';
import { InlinePlayer } from '../../root/inlinePlayer';
import { ViewportDetector } from '../../utils/viewportDetector';
import {
  getCardPreviewFromFileState,
  CardPreview,
} from '../../root/card/getCardPreview';
import { IntlProvider } from 'react-intl';
import { getFileAttributes } from '../../utils/analytics';
import { FileAttributesProvider } from '../../utils/fileAttributesContext';
import { getCardStatus } from '../../root/card/getCardStatus';
import { fireOperationalEvent } from '../../root/card/cardAnalytics';
import { isMediaCardError, MediaCardError } from '../../errors';
import { CardStatus } from '../../types';

const mockViewportDetectorOnce = () => {
  const onVisibleMock = { onVisible: () => {} };
  asMockFunction(ViewportDetector).mockImplementationOnce(
    ({ children, onVisible }) => {
      onVisibleMock.onVisible = onVisible;
      return <>{children}</>;
    },
  );
  return onVisibleMock;
};

type AnalyticsHandlerResultType = ReturnType<
  typeof AnalyticsListener.prototype['props']['onEvent']
>;
type AnalyticsHandlerArgumentsType = Parameters<
  typeof AnalyticsListener.prototype['props']['onEvent']
>;

const getAnalyticsHandlerMock = () =>
  jest.fn<AnalyticsHandlerResultType, AnalyticsHandlerArgumentsType>();

const isCardLoaded = (
  reactWrapper: ReactWrapper<CardWithAnalyticsEventsProps, CardState, CardBase>,
) => {
  return (
    reactWrapper.find(CardView).prop('status') === 'complete' &&
    reactWrapper.find(CardView).prop('dataURI') !== undefined &&
    reactWrapper.find(CardView).prop('metadata') !== undefined
  );
};

describe('Card', () => {
  let identifier: Identifier;
  let defaultFileId: string;
  let fileIdentifier: FileIdentifier;
  let defaultFileState: ProcessedFileState;
  let mediaClient: MediaClient;

  const defaultCardPreview: Promise<CardPreview> = Promise.resolve({
    dataURI: 'some-data-uri',
    orientation: 6,
  });

  const defaultImageBlob: Promise<Blob> = Promise.resolve(new Blob());

  const emptyPreview = Promise.resolve(undefined);

  const setup = (
    mediaClient: MediaClient = createMediaClientWithGetFile(),
    props: Partial<CardWithAnalyticsEventsProps> = {},
    cardPreview: Promise<CardPreview | undefined> = defaultCardPreview,
  ) => {
    asMockFunction(getCardPreviewFromFileState).mockReset();
    asMockFunction(getCardPreviewFromFileState).mockReturnValue(cardPreview);

    props = { isLazy: false, ...props };

    const component = shallow<
      CardBase,
      CardWithAnalyticsEventsProps,
      CardState
    >(
      <CardBase mediaClient={mediaClient} identifier={identifier} {...props} />,
    );

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
    asMockFunction(fireOperationalEvent).mockClear();
    mediaClient = fakeMediaClient();
    const fileStateSubject = createFileStateSubject({
      status: 'processed',
      id: defaultFileId,
      mimeType: 'image/png',
      mediaType: 'image',
      name: 'file-name',
      size: 1,
      artifacts: {},
      representations: {
        image: {},
      },
    });
    asMock(mediaClient.file.getFileState).mockReturnValue(fileStateSubject);
    defaultFileId = uuid();
    fileIdentifier = {
      id: defaultFileId,
      mediaItemType: 'file',
      collectionName: 'some-collection-name',
      occurrenceKey: 'some-occurrence-key',
    };
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
    asMock(getCardPreviewFromFileState).mockReturnValue(defaultCardPreview);
  });

  afterEach(() => {
    asMockFunction(getCardPreviewFromFileState).mockReset();
    jest.restoreAllMocks();
  });

  it('should use the new mediaClient to create the subscription when mediaClient prop changes', () => {
    const firstMediaClient = createMediaClientWithGetFile();
    const secondMediaClient = createMediaClientWithGetFile();
    const { component } = setup(firstMediaClient);
    component.setProps({ mediaClient: secondMediaClient, identifier });

    const { id, collectionName, occurrenceKey } = fileIdentifier;
    expect(secondMediaClient.file.getFileState).toHaveBeenCalledTimes(1);
    expect(secondMediaClient.file.getFileState).toBeCalledWith(id, {
      collectionName,
      occurrenceKey,
    });
    expect(component.find(CardView)).toHaveLength(1);
  });

  it('should attach default IntlProvider when an ancestor is not found', () => {
    const component = shallow(<CardBase identifier={identifier} />);
    expect(component.find(IntlProvider).length).toBe(1);
  });

  it('should not attach default IntlProvider when an ancestor is found', () => {
    const component = mount(
      <IntlProvider locale="es">
        <CardBase identifier={identifier} />
      </IntlProvider>,
    );
    expect(component.find(IntlProvider).length).toBe(1);
  });

  describe('refetching when dimensions has changed logic', () => {
    let component: ReturnType<typeof setup>['component'];
    let mediaClient: MediaClient;

    const initialDimensions: CardDimensions = {
      width: 100,
      height: 200,
    };

    const initialOriginalDimensions: NumericalCardDimensions = {
      width: 50,
      height: 40,
    };

    beforeEach(() => {
      const setupResult = setup(
        undefined,
        {
          identifier,
          originalDimensions: initialOriginalDimensions,
          dimensions: initialDimensions,
        },
        emptyPreview,
      );
      component = setupResult.component;
      mediaClient = setupResult.mediaClient;
    });

    const setNewDimensionViaProps = async (newDimensions: CardDimensions) => {
      // Resolve all promises to get to getImage call
      await nextTick();

      expect(mediaClient.getImage).toHaveBeenCalledTimes(1);

      await nextTick();
      await nextTick();
      await nextTick();

      component.setProps({ mediaClient, dimensions: newDimensions });

      // Again wait for all promises in second next() call to get to getImage call
      await nextTick();
      await nextTick();
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
    const viewportDetector = card.find(ViewportDetector);
    expect(viewportDetector).toHaveLength(1);
    expect(viewportDetector.prop('onVisible')).toBeDefined();
  });

  it('should request metadata when Card is in viewport', () => {
    const onVisibleMock = mockViewportDetectorOnce();
    mount(<CardBase mediaClient={mediaClient} identifier={identifier} />);
    onVisibleMock.onVisible();
    expect(mediaClient.file.getFileState).toBeCalledTimes(1);
  });

  it('should not use lazy load when "isLazy" is false', () => {
    const hoverHandler = () => {};
    const { component } = setup(createMediaClientWithGetFile(), {
      isLazy: false,
      onMouseEnter: hoverHandler,
    });
    expect(component.find(ViewportDetector)).toHaveLength(0);
  });

  it('should pass "secondary error" or actual error down to CardView', () => {
    const { component } = setup(fakeMediaClient());
    const someError = new Error('some-error');
    const error = new MediaCardError('remote-preview-fetch', someError);

    component.setState({ error });
    expect(component.find(CardView).props().error).toBe(someError);
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

  it('should use mediaClient.file.getFile to fetch file data', () => {
    const { mediaClient } = setup();
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);
    expect(mediaClient.file.getFileState).toBeCalledWith(fileIdentifier.id, {
      collectionName: 'some-collection-name',
      occurrenceKey: 'some-occurrence-key',
    });
  });

  it('should work with async identifier', () => {
    const fileId = 'file-id';
    const identifier: FileIdentifier = {
      id: fileId,
      mediaItemType: 'file',
      collectionName: 'collection',
      occurrenceKey: 'some-occurrence-key',
    };
    const { mediaClient } = setup(undefined, { identifier });
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);
    expect(mediaClient.file.getFileState).toBeCalledWith('file-id', {
      collectionName: 'collection',
      occurrenceKey: 'some-occurrence-key',
    });
  });

  it('should set dataURI only if its not present', async () => {
    const { component } = setup();
    await nextTick();
    await nextTick();
    expect(getCardPreviewFromFileState).toHaveBeenCalledTimes(1);
    expect(component.state('cardPreview')).toMatchObject({
      dataURI: 'some-data-uri',
    });
  });

  it('should set preview orientation and pass it down do view', async () => {
    const { component } = setup();
    await nextTick();
    await nextTick();
    component.update();
    expect(component.state('cardPreview')).toMatchObject({
      orientation: 6,
    });
    expect(component.find(CardView).prop('previewOrientation')).toEqual(6);
  });

  it('should set right state when file is uploading', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'uploading',
      progress: 0.2,
      preview: {
        value: new Blob([]),
      },
    });
    const { component } = setup(mediaClient);

    expectToEqual(component.state().metadata, {
      id: defaultFileId,
      mediaType: 'image',
      mimeType: 'image/png',
      name: 'file-name',
      size: 10,
    });

    await nextTick();
    await nextTick();

    expectToEqual(
      component.state(),
      expect.objectContaining({
        status: 'uploading',
        isCardVisible: true,
        progress: 0.2,
        cardPreview: {
          dataURI: 'some-data-uri',
          orientation: 6,
        },
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

    await nextTick();
    await nextTick();

    expectToEqual(component.state().progress, 0);
  });

  it('should set right state when file is processing with no preview', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'processing',
    });
    const { component } = setup(mediaClient);

    await nextTick();
    await nextTick();

    const { status } = component.state();

    expectToEqual(status, 'processing');
  });

  // TODO: Update this test to differenciate files unsupported by the browser
  // https://product-fabric.atlassian.net/browse/BMPT-1308
  it('should set complete state when file is processing with preview', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'processing',
      preview: {
        value: new Blob([]),
      },
    });
    const { component } = setup(mediaClient);

    await nextTick();
    await nextTick();

    const { status, progress } = component.state();

    expectToEqual(status, 'complete');
    expectToEqual(progress, 1);
  });

  it('should set right state when file is processed', async () => {
    const { component } = setup(undefined, undefined, emptyPreview);

    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    const { status, cardPreview: cardPreviewFromBackend } = component.state();
    if (!cardPreviewFromBackend) {
      return expect(cardPreviewFromBackend).toBeDefined();
    }

    expectToEqual(status, 'complete');
    expectToEqual(
      cardPreviewFromBackend.dataURI,
      'mock result of URL.createObjectURL()',
    );
  });

  it('should not render older cardStatus after a newer one', async () => {
    const mockMediaClient = fakeMediaClient();

    // We want to hold off first result of first getCardPreviewFromFileState until it's time later in the test
    let resolveFirstCardPreviewFromFileState: (
      preview: CardPreview,
    ) => void = () => {};
    asMockFunction(getCardPreviewFromFileState).mockReset();

    // This will be returned during first ('uploading') next() call
    const firstGetCardPreviewFromFileStatePromise = new Promise<CardPreview>(
      _resolve => (resolveFirstCardPreviewFromFileState = _resolve),
    );
    asMockFunction(getCardPreviewFromFileState).mockReturnValueOnce(
      firstGetCardPreviewFromFileStatePromise,
    );
    // This will be returned during second ('processing') next() call
    asMockFunction(getCardPreviewFromFileState).mockReturnValueOnce(
      defaultCardPreview,
    );

    const uploadingFileState = createFileStateSubject({
      ...defaultFileState,
      status: 'uploading',
      progress: 0.9,
      preview: {
        value: new Blob([]),
      },
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

    // It will be paused by first unresolved getCardPreviewFromFileState result

    // Fire second fileState
    uploadingFileState.next({
      ...defaultFileState,
      status: 'processing',
      preview: {
        value: new Blob([]),
      },
    });

    // will resolve second getCardPreviewFromFileState call
    await nextTick();
    await nextTick();

    const {
      status: statusAfterSecondFileState,
      progress: progressAfterSecondFileState,
      cardPreview: cardPreviewAfterSecondFileState,
    } = component.state();

    if (!cardPreviewAfterSecondFileState) {
      return expect(cardPreviewAfterSecondFileState).toBeDefined();
    }

    expectToEqual(cardPreviewAfterSecondFileState.orientation, 6);
    expectToEqual(cardPreviewAfterSecondFileState.dataURI, 'some-data-uri');
    // TODO: Update this test to differenciate files unsupported by the browser
    // https://product-fabric.atlassian.net/browse/BMPT-1308
    expectToEqual(statusAfterSecondFileState, 'complete');
    expectToEqual(progressAfterSecondFileState, 1);

    // This will resolve first getCardPreviewFromFileState call
    resolveFirstCardPreviewFromFileState({
      orientation: 5,
      dataURI: 'some-other-data-uri',
    });

    await nextTick();
    await nextTick();

    const {
      status: statusAfterFirstFileState,
      progress: progressAfterFirstFileState,
      cardPreview: cardPreviewAfterFirstFileState,
    } = component.state();

    if (!cardPreviewAfterFirstFileState) {
      return expect(cardPreviewAfterFirstFileState).toBeDefined();
    }

    // dataURI and previewOrientation should not have been updated by the first promise
    expectToEqual(cardPreviewAfterFirstFileState.dataURI, 'some-data-uri');
    expectToEqual(cardPreviewAfterFirstFileState.orientation, 6);

    // TODO: Update this test to differenciate files unsupported by the browser
    // https://product-fabric.atlassian.net/browse/BMPT-1308
    expectToEqual(statusAfterFirstFileState, 'complete');
    expectToEqual(progressAfterFirstFileState, 1);
  });

  it('should set error card state and wrap the error when filestate subscription sends error', async () => {
    const subject = new ReplaySubject<FileState>(1);
    const mediaClient = fakeMediaClient();
    asMockReturnValue(mediaClient.file.getFileState, subject);
    const { component } = setup(mediaClient);

    const errorThrown = new Error('this is an error');
    subject.error(errorThrown);

    expect(component.state('status')).toEqual('error');
    const error = component.state('error');
    expect(!!error && isMediaCardError(error)).toBe(true);
    expect(error?.secondaryError).toBe(errorThrown);
  });

  it('should render error card when getFileState resolves with status=error', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'error',
      message: 'some error here',
    });
    const { component } = setup(mediaClient);

    await nextTick();
    component.update();

    expect(component.state('status')).toEqual('error');
    const error = component.state('error');
    expect(!!error && isMediaCardError(error)).toBe(true);
    expect(error?.secondaryError?.message).toBe('some error here');

    expect(component.find(CardView).prop('status')).toEqual('error');
  });

  it('should render failed card when getFileState resolves with status=failed', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'failed-processing',
    });
    const { component } = setup(mediaClient, undefined, emptyPreview);

    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

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

  it('should render error card when getFileState fails', () => {
    const mediaClient = fakeMediaClient();
    const fileStateSubject = createFileStateSubject();
    fileStateSubject.error('some-error');
    asMockReturnValue(mediaClient.file.getFileState, fileStateSubject);
    const { component } = setup(mediaClient);
    component.update();
    expect(component.find(CardView).prop('status')).toEqual('error');
  });

  // If file state subscription decides that the card is completed
  // and later there is an error, we won't change the card's status.
  it('should not render error card when getFileState throws and previous state is complete', async () => {
    asMockFunction(getCardStatus).mockReturnValueOnce('complete');
    const mediaClient = fakeMediaClient();
    const fileStateSubject = createFileStateSubject();
    asMockReturnValue(mediaClient.file.getFileState, fileStateSubject);
    const { component } = setup(mediaClient);

    fileStateSubject.next({
      id: 'some-id',
      name: 'some-name',
      size: 10,
      status: 'uploading',
      progress: 0.5,
      mediaType: 'doc',
      mimeType: 'application/pdf',
    });
    await nextTick();
    expect(component.state().status).toBe('complete');

    fileStateSubject.error(new Error('This is a pressumable polling error'));
    await nextTick();
    expect(component.state().status).toBe('complete');
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

    await nextTick();

    expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
    expect(mediaClient.getImage).toBeCalledWith(fileIdentifier.id, {
      collection: 'some-collection-name',
      height: 125,
      width: 156,
      allowAnimated: true,
      mode: 'crop',
    });
  });

  it('should fetch remote preview for documents with new design', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'processing',
      mediaType: 'doc',
      mimeType: 'application/pdf',
      preview: {
        value: new Blob([], { type: 'application/pdf' }),
        origin: 'local',
      },
      representations: {
        image: {},
      },
    });
    setup(mediaClient, { featureFlags: { newCardExperience: true } });

    await nextTick();

    expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
    expect(mediaClient.getImage).toBeCalledWith(fileIdentifier.id, {
      collection: 'some-collection-name',
      height: 125,
      width: 156,
      allowAnimated: true,
      mode: 'crop',
    });
  });

  it('should not fetch remote preview for documents with classic design', async () => {
    const mediaClient = createMediaClientWithGetFile({
      ...defaultFileState,
      status: 'processing',
      mediaType: 'doc',
      mimeType: 'application/pdf',
      preview: {
        value: new Blob([], { type: 'application/pdf' }),
        origin: 'local',
      },
      representations: {
        image: {},
      },
    });
    setup(mediaClient);

    await nextTick();

    expect(mediaClient.getImage).toHaveBeenCalledTimes(0);
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

    await nextTick();
    await nextTick();

    expect(component.state('cardPreview')).toMatchObject({
      dataURI: 'some-data-uri',
    });

    expect(mediaClient.getImage).toHaveBeenCalledTimes(0);

    subject.next({
      ...baseState,
      status: 'processed',
      artifacts: {},
    });
    const cardPreviewFromFileStateResult = Promise.resolve({
      dataURI: 'fooo',
      orientation: 6,
    });

    asMockReturnValue(
      getCardPreviewFromFileState,
      cardPreviewFromFileStateResult,
    );

    await nextTick();
    await nextTick();

    // We want to make sure that when transition from "processing" to "processed" we still don't call getImage if we already have preview
    expect(component.state('cardPreview')).toEqual({
      dataURI: 'some-data-uri',
      orientation: 6,
    });
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

    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    component.update();

    expect(component.find(CardView).props()).toEqual(
      expect.objectContaining({
        appearance: 'auto',
        dataURI: 'mock result of URL.createObjectURL()',
        dimensions: { width: 10, height: 20 },
        disableOverlay: true,
        progress: 1,
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

  it('should call unsubscribe on unmounting', async () => {
    const { component } = setup();

    await nextTick();

    const instance = component.instance();

    const unsubscribe = jest.fn();
    instance.unsubscribe = unsubscribe;

    component.unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should reuse cached dataURI even after unmounting', async () => {
    const { component, mediaClient } = setup(
      undefined,
      undefined,
      emptyPreview,
    );

    await nextTick();
    await nextTick();
    await nextTick();

    expect(mediaClient.getImage).toHaveBeenCalledTimes(1);

    component.unmount();

    setup(mediaClient, undefined, emptyPreview);

    await nextTick();
    await nextTick();
    await nextTick();

    expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
  });

  it('should retrieve cardPreview from cache if it was already generated by id', async () => {
    const { component } = setup(undefined, {
      dimensions: { width: 50, height: 50 },
    });

    await nextTick();
    component.update();

    expect(getCardPreviewFromFileState).toHaveBeenCalledTimes(1);
    const currentCardPreview = component.state('cardPreview');
    component.setProps({ dimensions: { width: 50, height: 50 } });

    expect(getCardPreviewFromFileState).toHaveBeenCalledTimes(1);

    const newCardPreview = component.state('cardPreview');
    expect(currentCardPreview).toEqual(newCardPreview);
  });

  it('should subscribe to file state immediately if the component was remounted', async () => {
    const onVisibleMock = mockViewportDetectorOnce();
    const props = {
      dimensions: { width: 50, height: 50 },
    };

    // We mount the card for the first time
    const component = mount<CardBase, CardWithAnalyticsEventsProps, CardState>(
      <CardBase mediaClient={mediaClient} identifier={identifier} {...props} />,
    );
    await flushPromises();
    expect(isCardLoaded(component)).toEqual(false);

    // We let the IntersectionObserver kicks in and it should start
    // subscribing to the fileState and populate all the neccesary
    // data to redner the image
    onVisibleMock.onVisible();
    await flushPromises();
    component.update();
    await flushPromises();
    expect(isCardLoaded(component)).toEqual(true);

    // Unmount the component
    component.unmount();

    // We mount the component second time and expecting
    // the image will be loaded without IntersectionObserver
    // kicks in
    const remountedComponent = mount<
      CardBase,
      CardWithAnalyticsEventsProps,
      CardState
    >(
      <CardBase mediaClient={mediaClient} identifier={identifier} {...props} />,
    );
    await flushPromises();
    remountedComponent.update();
    await flushPromises();
    expect(isCardLoaded(remountedComponent)).toEqual(true);
  });

  it('should keep orientation in the state if it was already acquired', async () => {
    const { component } = setup(undefined, {
      dimensions: { width: 50, height: 50 },
    });

    await nextTick();
    await nextTick();

    const cardPreview = component.state('cardPreview');

    component.setProps({ dimensions: { width: 100, height: 100 } });

    await nextTick();
    await nextTick();

    const newCardPreview = component.state('cardPreview');

    if (!cardPreview || !newCardPreview) {
      expect(cardPreview).toBeDefined();
      expect(newCardPreview).toBeDefined();
      return;
    }

    expect(cardPreview.orientation).toEqual(6);
    expect(newCardPreview.orientation).toEqual(6);
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

  it('should call item download when download Action is executed', () => {
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
        fileId: fileIdentifier.id,
        isUserCollection: false,
      });
    });

    it('should trigger "media-viewed" in globalMediaEventEmitter when collection is recents', async () => {
      identifier = {
        ...fileIdentifier,
        collectionName: RECENTS_COLLECTION,
      };
      await expectMediaViewedEvent({
        fileId: fileIdentifier.id,
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

    it('should set isPlayingFile=true when clicking on a viewable video file', () => {
      const { component } = setup(undefined, { useInlinePlayer: true });
      component.setState({
        cardPreview: { dataURI: 'data-uri' },
        metadata: { id: 'some-id', mediaType: 'video' },
      });
      component.find(CardView).simulate('click');
      expect(component.state('isPlayingFile')).toBeTruthy();
    });

    it("shouldn't set isPlayingFile=true when clicking on a non-viewable video file", () => {
      const { component } = setup(undefined, { useInlinePlayer: true });
      component.setState({ metadata: { id: 'some-id', mediaType: 'video' } });
      component.find(CardView).simulate('click');
      expect(component.state('isPlayingFile')).toBeFalsy();
    });
  });

  describe('MediaViewer integration', () => {
    it('should render MV when shouldOpenMediaViewer=true', () => {
      const { component } = setup(undefined, { shouldOpenMediaViewer: true });
      component.setState({ metadata: { id: 'some-id', mediaType: 'image' } });
      component.find(CardView).simulate('click');

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

    it('should pass dataSource to MV', () => {
      const { component } = setup(undefined, {
        shouldOpenMediaViewer: true,
        mediaViewerDataSource: { list: [identifier, identifier] },
      });
      component.setState({ metadata: { id: 'some-id', mediaType: 'image' } });
      component.find(CardView).simulate('click');

      expect(component.find(MediaViewer).prop('dataSource')).toEqual({
        list: [identifier, identifier],
      });
    });

    it('should not render MV if useInlinePlayer=true and identifier is video type', async () => {
      const fileId = '1';
      const videoIdentifier: FileIdentifier = {
        id: fileId,
        mediaItemType: 'file',
      };
      const mediaClient = createMediaClientWithGetFile({
        ...defaultFileState,
        mediaType: 'video',
        mimeType: 'video/mp4',
      });
      const { component } = setup(mediaClient, {
        useInlinePlayer: true,
        shouldOpenMediaViewer: true,
        identifier: videoIdentifier,
      });

      await nextTick();
      await nextTick();

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

      await nextTick();
      await nextTick();

      component.find(CardView).simulate('click');

      expect(component.find(MediaViewer).prop('contextId')).toEqual(
        'some-context-id',
      );
    });

    it('should pass featureFlags to MV', async () => {
      const featureFlags = {} as MediaFeatureFlags;

      const { component } = setup(undefined, {
        shouldOpenMediaViewer: true,
        mediaViewerDataSource: { list: [identifier, identifier] },
        contextId: 'some-context-id',
        featureFlags,
      });

      await nextTick();
      await nextTick();

      component.find(CardView).simulate('click');

      expect(component.find(MediaViewer).prop('featureFlags')).toEqual(
        featureFlags,
      );
    });
  });

  it('should not change card status if local preview throws an error', async () => {
    asMockFunction(getCardPreviewFromFileState).mockRejectedValueOnce(
      new MediaCardError('local-preview-get', new Error('some kind of error')),
    );
    const mediaClient = createMediaClientWithGetFile();
    const { component } = setup(mediaClient, { isLazy: false });
    await nextTick();
    await nextTick();
    await nextTick();
    expect(getCardPreviewFromFileState).toHaveBeenCalled();
    expect(component.state('status')).toBe('complete');
  });

  describe('Analytics', () => {
    const callCopy = async () => {
      document.dispatchEvent(new Event('copy'));
      await nextTick(); // copy handler is not awaited and fired in the next tick
    };

    it('should attach FileAttributes Context', () => {
      const mediaClient = fakeMediaClient();
      const metadata: FileDetails = {
        id: defaultFileId,
        mediaType: 'video',
        size: 12345,
        processingStatus: 'succeeded',
      };

      const featureFlags: MediaFeatureFlags = {
        newCardExperience: true,
      };

      const card = shallow<CardProps>(
        <CardBase
          mediaClient={mediaClient}
          identifier={identifier}
          featureFlags={featureFlags}
        />,
      );
      card.setState({ metadata });
      card.update();

      const dataProvider = card.find(FileAttributesProvider);
      expect(dataProvider).toBeDefined();
      const contextData = card.find(FileAttributesProvider).at(0).props().data;

      expect(contextData).toMatchObject(getFileAttributes(metadata));
    });

    it('should attach package attributes to Analytics Context', () => {
      const mediaClient = fakeMediaClient();
      const card = mount<CardProps>(
        <Card mediaClient={mediaClient} identifier={identifier} />,
      );

      const contextData = card.find(AnalyticsContext).at(0).props().data;
      expect(contextData).toMatchObject({
        packageVersion: '999.9.9',
        packageName: '@atlaskit/media-card',
        componentName: 'mediaCard',
        component: 'mediaCard',
      });
    });

    it('should attach feature flags to Analytics Context', () => {
      const mediaClient = fakeMediaClient();

      const relevantFetureFlags: MediaFeatureFlags = {
        newCardExperience: true,
        poll_intervalMs: 10,
        poll_maxAttempts: 20,
        poll_backoffFactor: 30,
        poll_maxIntervalMs: 40,
        poll_maxGlobalFailures: 50,
        captions: false,
      };

      const featureFlags: MediaFeatureFlags = {
        ...relevantFetureFlags,
        zipPreviews: true,
        folderUploads: true,
      };

      const card = mount<CardProps>(
        <Card
          mediaClient={mediaClient}
          identifier={identifier}
          featureFlags={featureFlags}
        />,
      );

      const contextData = card.find(AnalyticsContext).at(0).props().data;
      expect(contextData).toMatchObject({
        [MEDIA_CONTEXT]: { featureFlags: relevantFetureFlags },
      });
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

    it('should pass the Analytics Event fired from InlinePlayer to the provided onClick callback', () => {
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
      const featureFlags: MediaFeatureFlags = {
        newCardExperience: true,
      };
      mount<CardProps, CardState>(
        <AnalyticsListener channel={FabricChannel.media} onEvent={onEvent}>
          <Card
            mediaClient={mediaClient}
            identifier={identifier}
            featureFlags={featureFlags}
            isLazy={false}
          />
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
            attributes: {},
          },
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

    it('should fire commenced analytics event on file load start with internal file Id', async () => {
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
            identifier={fileIdentifier}
            isLazy={false}
          />
        </AnalyticsListener>,
      );

      expect(analyticsHandler).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          payload: expect.objectContaining({
            eventType: 'operational',
            action: 'commenced',
            actionSubject: 'mediaCardRender',
            attributes: {
              fileAttributes: expect.objectContaining({
                fileId: fileIdentifier.id,
              }),
            },
          }),
        }),
        FabricChannel.media,
      );
    });

    it('should fire commenced analytics event on file load start with external file Id', async () => {
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
            attributes: {
              fileAttributes: expect.objectContaining({
                fileId: externalIdentifier.mediaItemType,
              }),
            },
          }),
        }),
        FabricChannel.media,
      );
    });

    it(`should fire an operational event on card status change`, () => {
      const createAnalyticsEvent = ((() => ({
        fire: () => {},
      })) as unknown) as CreateUIAnalyticsEvent;
      const { component } = setup(fakeMediaClient(), { createAnalyticsEvent });
      const metadata: FileDetails = {
        id: 'some-file-id',
        mediaType: 'image',
        mimeType: 'image/png',
        name: 'file-name',
        size: 10,
      };
      const params = ({
        cardPreview: 'some-card-preview',
        error: 'some-error',
      } as unknown) as CardState;

      component.setState({ metadata, ...params });

      component.setState({ status: 'some-status' as CardStatus });
      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toHaveBeenLastCalledWith(
        createAnalyticsEvent,
        'some-status',
        getFileAttributes(metadata),
        params,
      );

      component.setState({ status: 'another-status' as CardStatus });
      expect(fireOperationalEvent).toBeCalledTimes(2);
      expect(fireOperationalEvent).toHaveBeenLastCalledWith(
        createAnalyticsEvent,
        'another-status',
        getFileAttributes(metadata),
        params,
      );
    });
  });
});
