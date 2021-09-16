jest.mock('../../utils/document');
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
    getCardPreview: jest.fn(),
    getCardPreviewFromCache: jest.fn(),
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
    fireCopiedEvent: jest.fn(actualModule.fireCopiedEvent),
    fireCommencedEvent: jest.fn(actualModule.fireCommencedEvent),
    fireScreenEvent: jest.fn(actualModule.fireScreenEvent),
  };
});
import { ReplaySubject } from 'rxjs/ReplaySubject';
import React from 'react';
import uuid from 'uuid/v4';
import { shallow, mount } from 'enzyme';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';
import {
  AnalyticsContext,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  MediaClient,
  FileState,
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
  getCardPreview,
  getCardPreviewFromCache,
  CardPreview,
} from '../../root/card/getCardPreview';
import { IntlProvider } from 'react-intl';
import { getFileAttributes } from '../../utils/analytics';
import { FileAttributesProvider } from '../../utils/fileAttributesContext';
import { getFileDetails } from '../../utils/metadata';
import { getCardStatus } from '../../root/card/getCardStatus';
import {
  fireOperationalEvent,
  fireCopiedEvent,
  fireCommencedEvent,
  fireScreenEvent,
} from '../../root/card/cardAnalytics';
import { isMediaCardError, MediaCardError } from '../../errors';
import { CardStatus } from '../../types';
import getDocument from '../../utils/document';

asMock(getDocument).mockImplementation(() => document);

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

describe('Card', () => {
  let identifier: Identifier;
  let defaultFileId: string;
  let fileIdentifier: FileIdentifier;
  let defaultFileState: ProcessedFileState;
  let mediaClient: MediaClient;

  const defaultCardPreview: CardPreview = {
    dataURI: 'some-data-uri',
    orientation: 6,
    source: 'remote',
  };

  const defaultImageBlob: Promise<Blob> = Promise.resolve(new Blob());

  const setup = (
    mediaClient: MediaClient = createMediaClientWithGetFile(),
    props: Partial<CardWithAnalyticsEventsProps> = {},
    cardPreview: CardPreview | false = defaultCardPreview,
  ) => {
    asMockFunction(getCardPreview).mockReset();
    if (!!cardPreview) {
      asMockFunction(getCardPreview).mockResolvedValue(cardPreview);
    } else {
      asMockFunction(getCardPreview).mockRejectedValue(new Error('some-error'));
    }

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
  });

  afterEach(() => {
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
        false,
      );
      component = setupResult.component;
      mediaClient = setupResult.mediaClient;
    });

    const setNewDimensionViaProps = async (newDimensions: CardDimensions) => {
      // Resolve all promises to get to getImage call
      await nextTick();

      expect(getCardPreview).toHaveBeenCalledTimes(1);

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

      expect(getCardPreview).toHaveBeenCalledTimes(2);
      expect(getCardPreview).toHaveBeenLastCalledWith(
        expect.objectContaining({
          id: fileIdentifier.id,
          collectionName: 'some-collection-name',
          resizeMode: 'crop',
          requestedDimensions: { width: 1000, height: 200 },
        }),
      );
    });

    it('should refetch the image when height changes to a higher value', async () => {
      const newDimensions: CardDimensions = {
        ...initialDimensions,
        height: 2000,
      };

      await setNewDimensionViaProps(newDimensions);

      expect(getCardPreview).toHaveBeenCalledTimes(2);

      expect(getCardPreview).toHaveBeenLastCalledWith(
        expect.objectContaining({
          id: fileIdentifier.id,
          collectionName: 'some-collection-name',
          resizeMode: 'crop',
          requestedDimensions: {
            width: 100,
            height: 2000,
          },
        }),
      );
    });

    it('should not refetch the image when width changes to a smaller value', async () => {
      const newDimensions: CardDimensions = {
        ...initialDimensions,
        width: 10,
      };

      await setNewDimensionViaProps(newDimensions);

      expect(getCardPreview).toHaveBeenCalledTimes(1);
    });

    it('should not refetch the image when height changes to a smaller value', async () => {
      const newDimensions: CardDimensions = {
        ...initialDimensions,
        height: 20,
      };

      await setNewDimensionViaProps(newDimensions);

      expect(getCardPreview).toHaveBeenCalledTimes(1);
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

    const { component } = setup(undefined, {
      onMouseEnter: hoverHandler,
      onClick: clickHandler,
    });

    const cardView = component.find(CardView);
    cardView.simulate('mouseEnter');
    cardView.simulate('click');

    expect(clickHandler).toHaveBeenCalledTimes(1);
    const clickHandlerArg = clickHandler.mock.calls[0][0];
    expect(clickHandlerArg.mediaItemDetails).toEqual(
      getFileDetails(component.state('fileState')!),
    );

    expect(hoverHandler).toBeCalledTimes(1);
    const hoverHandlerArg = hoverHandler.mock.calls[0][0];
    expect(hoverHandlerArg.mediaItemDetails).toEqual(
      getFileDetails(component.state('fileState')!),
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
    await nextTick();
    expect(getCardPreview).toHaveBeenCalledTimes(1);
    expect(component.state('cardPreview')).toMatchObject({
      dataURI: 'some-data-uri',
    });
  });

  it('should set preview orientation and pass it down do view', async () => {
    const { component } = setup();
    await nextTick();
    await nextTick();
    await nextTick();
    component.update();
    expect(component.state('cardPreview')).toMatchObject({
      orientation: 6,
    });
    expect(component.find(CardView).prop('previewOrientation')).toEqual(6);
  });

  it('should set right state when file is uploading', async () => {
    const fileState: FileState = {
      ...defaultFileState,
      status: 'uploading',
      progress: 0.2,
      preview: {
        value: new Blob([]),
      },
    };
    const mediaClient = createMediaClientWithGetFile(fileState);
    const { component } = setup(mediaClient);

    expectToEqual(component.state().fileState, fileState);

    await nextTick();
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
          source: 'remote',
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
      representations: undefined,
    });
    const { component } = setup(mediaClient, undefined, false);

    await nextTick();
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
    await nextTick();

    const { status, progress } = component.state();

    expectToEqual(status, 'complete');
    expectToEqual(progress, 1);
  });

  it('should set right state when file is processed', async () => {
    const { component } = setup();

    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    const { status, cardPreview: cardPreviewFromBackend } = component.state();
    if (!cardPreviewFromBackend) {
      return expect(cardPreviewFromBackend).toBeDefined();
    }

    expectToEqual(status, 'complete');
    expectToEqual(cardPreviewFromBackend.dataURI, 'some-data-uri');
  });

  it('should not render older cardStatus after a newer one', async () => {
    const mockMediaClient = fakeMediaClient();

    // We want to hold off first result of first getCardPreview until it's time later in the test
    let resolveFirstCardPreviewFromFileState: (
      preview: CardPreview,
    ) => void = () => {};
    asMockFunction(getCardPreview).mockReset();

    // This will be returned during first ('uploading') next() call
    const firstgetCardPreviewPromise = new Promise<CardPreview>(
      (_resolve) => (resolveFirstCardPreviewFromFileState = _resolve),
    );
    asMockFunction(getCardPreview).mockReturnValueOnce(
      firstgetCardPreviewPromise,
    );
    // This will be returned during second ('processing') next() call
    asMockFunction(getCardPreview).mockResolvedValueOnce(defaultCardPreview);

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

    // It will be paused by first unresolved getCardPreview result

    // Fire second fileState
    uploadingFileState.next({
      ...defaultFileState,
      status: 'processing',
      preview: {
        value: new Blob([]),
      },
    });

    // will resolve second getCardPreview call
    await nextTick();
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

    // This will resolve first getCardPreview call
    resolveFirstCardPreviewFromFileState({
      orientation: 5,
      dataURI: 'some-other-data-uri',
      source: 'local',
    });

    await nextTick();
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
    const { component } = setup(mediaClient, undefined, false);

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
      processingStatus: 'failed',
      createdAt: undefined,
    });
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
    setup(mediaClient, undefined, false);

    await nextTick();

    expect(getCardPreview).toHaveBeenCalledTimes(1);
    expect(getCardPreview).toBeCalledWith(
      expect.objectContaining({
        id: fileIdentifier.id,
        collectionName: 'some-collection-name',
        requestedDimensions: { height: 125, width: 156 },
        resizeMode: 'crop',
      }),
    );
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

    expect(getCardPreview).toHaveBeenCalledTimes(1);
    expect(getCardPreview).toBeCalledWith(
      expect.objectContaining({
        id: fileIdentifier.id,
        collectionName: 'some-collection-name',
        requestedDimensions: { height: 125, width: 156 },
        resizeMode: 'crop',
      }),
    );
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

    expect(getCardPreview).toHaveBeenCalledTimes(0);
  });

  it('should pass resize mode down to getImage call', async () => {
    setup(
      undefined,
      {
        resizeMode: 'full-fit',
      },
      false,
    );

    expect(getCardPreview).toBeCalledWith(
      expect.objectContaining({
        id: fileIdentifier.id,
        resizeMode: 'full-fit',
      }),
    );
  });

  it('should render CardView with expected props', async () => {
    const { component } = setup(undefined, {
      dimensions: { width: 10, height: 20 },
      selectable: true,
      selected: true,
      resizeMode: 'fit',
      disableOverlay: true,
    });

    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    component.update();

    expect(component.find(CardView).props()).toEqual(
      expect.objectContaining({
        appearance: 'auto',
        dataURI: 'some-data-uri',
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
      processingStatus: 'succeeded',
      createdAt: undefined,
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
    const { component, mediaClient } = setup(undefined, undefined, false);

    await nextTick();
    await nextTick();
    await nextTick();

    expect(getCardPreview).toHaveBeenCalledTimes(1);

    component.unmount();

    setup(mediaClient, undefined, false);

    await nextTick();
    await nextTick();
    await nextTick();

    expect(getCardPreview).toHaveBeenCalledTimes(1);
  });

  it('should retrieve cardPreview from cache if it was already generated by id', async () => {
    const { component } = setup(undefined, {
      dimensions: { width: 50, height: 50 },
    });

    await nextTick();
    component.update();

    expect(getCardPreview).toHaveBeenCalledTimes(1);
    const currentCardPreview = component.state('cardPreview');
    component.setProps({ dimensions: { width: 50, height: 50 } });

    expect(getCardPreview).toHaveBeenCalledTimes(1);

    const newCardPreview = component.state('cardPreview');
    expect(currentCardPreview).toEqual(newCardPreview);
  });

  it('should not lazy load if the preview was cached', async () => {
    asMockFunction(getCardPreviewFromCache).mockReturnValueOnce(
      await defaultCardPreview,
    );
    const { component, mediaClient } = setup(undefined, { isLazy: true });
    /* Card is visible even though the ViewportDetector didn't trigger onVisible callback */
    expect(component.state('isCardVisible')).toEqual(true);
    /* File state subscription must have been triggered */
    expect(mediaClient.file.getFileState).toBeCalled();
  });

  it('should keep orientation in the state if it was already acquired', async () => {
    const { component } = setup(undefined, {
      dimensions: { width: 50, height: 50 },
    });

    await nextTick();
    await nextTick();
    await nextTick();

    const cardPreview = component.state('cardPreview');

    component.setProps({ dimensions: { width: 100, height: 100 } });

    await nextTick();
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
      fileState: defaultFileState,
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
      fileState: defaultFileState,
    });
    component.update();
    const actions = component.find(CardView).prop('actions')!;
    actions[0].handler();

    expect(mediaClient.file.downloadBinary).toHaveBeenCalledWith(
      identifier.id,
      'file-name',
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
        cardPreview: { dataURI: 'data-uri', source: 'remote' },
        fileState: {
          id: 'some-id',
          name: 'some-video.mp4',
          mediaType: 'video',
          mimeType: 'video/mp4',
          size: 12345,
          status: 'processed',
          artifacts: {},
        },
      });
      component.find(CardView).simulate('click');
      expect(component.state('isPlayingFile')).toBeTruthy();
    });

    it("shouldn't set isPlayingFile=true when clicking on a non-viewable video file", () => {
      const { component } = setup(undefined, { useInlinePlayer: true });
      component.setState({ fileState: defaultFileState });
      component.find(CardView).simulate('click');
      expect(component.state('isPlayingFile')).toBeFalsy();
    });
  });

  describe('MediaViewer integration', () => {
    it('should render MV when shouldOpenMediaViewer=true', () => {
      const { component } = setup(undefined, { shouldOpenMediaViewer: true });
      component.setState({ fileState: defaultFileState });
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
      component.setState({ fileState: defaultFileState });
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
    asMockFunction(getCardPreview).mockRejectedValueOnce(
      new MediaCardError(
        'local-preview-image',
        new Error('some kind of error'),
      ),
    );
    const mediaClient = createMediaClientWithGetFile();
    const { component } = setup(mediaClient, { isLazy: false });
    await nextTick();
    await nextTick();
    await nextTick();
    expect(getCardPreview).toHaveBeenCalled();
    expect(component.state('status')).toBe('complete');
  });

  describe('Analytics', () => {
    beforeEach(() => {
      jest.spyOn(performance, 'now').mockReturnValue(1000);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const createAnalyticsEvent = (jest.fn(() => ({
      fire: () => {},
    })) as unknown) as CreateUIAnalyticsEvent;

    it('should attach FileAttributes Context', () => {
      const mediaClient = fakeMediaClient();
      const fileState = {
        id: defaultFileId,
        mediaType: 'video',
        size: 12345,
        status: 'processed',
      } as FileState;

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
      card.setState({ fileState });
      card.update();

      const dataProvider = card.find(FileAttributesProvider);
      expect(dataProvider).toBeDefined();
      const contextData = card.find(FileAttributesProvider).at(0).props().data;

      expect(contextData).toMatchObject(
        getFileAttributes(getFileDetails(fileState)),
      );
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

    it(`should fire an operational event on card status change`, () => {
      const { component } = setup(fakeMediaClient(), { createAnalyticsEvent });
      const fileState: FileState = defaultFileState;
      const params = ({
        cardPreview: 'some-card-preview',
        error: 'some-error',
      } as unknown) as CardState;

      component.setState({ fileState, ...params });

      component.setState({ status: 'some-status' as CardStatus });
      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toHaveBeenLastCalledWith(
        createAnalyticsEvent,
        'some-status',
        getFileAttributes(getFileDetails(fileState)),
        {
          overall: {
            durationSinceCommenced: 0,
            durationSincePageStart: 1000,
          },
        },
        params,
      );

      component.setState({ status: 'another-status' as CardStatus });
      expect(fireOperationalEvent).toBeCalledTimes(2);
      expect(fireOperationalEvent).toHaveBeenLastCalledWith(
        createAnalyticsEvent,
        'another-status',
        getFileAttributes(getFileDetails(fileState)),
        {
          overall: {
            durationSinceCommenced: 0,
            durationSincePageStart: 1000,
          },
        },
        params,
      );
    });

    describe('Impressions', () => {
      beforeEach(() => {
        asMock(fireScreenEvent).mockClear();
      });

      it(`should fire a screen event when the file status is complete`, () => {
        const { component } = setup(fakeMediaClient(), {
          createAnalyticsEvent,
        });
        const fileState: FileState = defaultFileState;
        const params = ({
          cardPreview: 'some-card-preview',
          error: 'some-error',
        } as unknown) as CardState;

        component.setState({ fileState, ...params });

        component.setState({ status: 'complete' as CardStatus });

        expect(fireScreenEvent).toBeCalledTimes(1);
      });

      it(`should fire a screen event if the file is a video and has a preview`, () => {
        const { component } = setup(fakeMediaClient(), {
          createAnalyticsEvent,
        });

        component.setState({
          cardPreview: { dataURI: 'data-uri', source: 'remote' },
          fileState: {
            id: 'some-id',
            name: 'some-video.mp4',
            mediaType: 'video',
            mimeType: 'video/mp4',
            size: 12345,
            status: 'processing',
            artifacts: {},
          },
        });

        component.setState({ status: 'processing' as CardStatus });

        expect(fireScreenEvent).toBeCalledTimes(1);
      });
    });

    describe('Commenced', () => {
      beforeEach(() => {
        asMock(fireCommencedEvent).mockClear();
      });

      it('should fire commenced analytics event on file load start with internal file Id', async () => {
        mount(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={fileIdentifier}
            isLazy={false}
            createAnalyticsEvent={createAnalyticsEvent}
          />,
        );
        expect(fireCommencedEvent).toBeCalledTimes(1);
        expect(fireCommencedEvent).toBeCalledWith(
          createAnalyticsEvent,
          expect.objectContaining({ fileId: fileIdentifier.id }),
          { overall: { durationSincePageStart: 1000 } },
        );
      });

      it('should fire commenced analytics event on file load start with external file Id', async () => {
        const identifier: ExternalImageIdentifier = {
          mediaItemType: 'external-image',
          dataURI: 'bla',
          name: 'some external image',
        };
        mount(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={identifier}
            isLazy={false}
            createAnalyticsEvent={createAnalyticsEvent}
          />,
        );
        expect(fireCommencedEvent).toBeCalledTimes(1);
        expect(fireCommencedEvent).toBeCalledWith(
          createAnalyticsEvent,
          expect.objectContaining({ fileId: 'external-image' }),
          { overall: { durationSincePageStart: 1000 } },
        );
      });
    });

    describe('Copy', () => {
      let evtCallBack: ((e: Event) => void) | undefined;
      beforeAll(() => {
        asMock(getDocument).mockImplementation(() => ({
          addEventListener: (_evt: string, callback: (e: Event) => void) => {
            evtCallBack = callback;
          },
          removeEventListener: () => {
            evtCallBack = undefined;
          },
        }));
      });

      beforeEach(() => {
        asMock(fireCopiedEvent).mockClear();
      });

      afterAll(() => {
        asMock(getDocument).mockImplementation(() => document);
      });

      const callCopy = async () => {
        evtCallBack && evtCallBack(new Event('copy'));
        await nextTick(); // copy handler is not awaited and fired in the next tick
      };

      it('should call fireCopiedEvent when a UI copy event has been dispatched', async () => {
        const handler = mount(
          <Card mediaClient={fakeMediaClient()} identifier={identifier} />,
        );
        await callCopy();
        expect(fireCopiedEvent).toBeCalledTimes(1);
        // we need to unmount to release the listener and let the other test pass!
        handler.unmount();
      });

      it('should remove onCopy listener on unmount', async () => {
        const handler = mount(
          <Card mediaClient={fakeMediaClient()} identifier={identifier} />,
        );
        await callCopy();
        expect(fireCopiedEvent).toBeCalledTimes(1);
        handler.unmount();
        await callCopy();
        expect(fireCopiedEvent).toBeCalledTimes(1);
      });
    });
  });
});
