jest.mock('../../utils/document');
jest.mock('../../utils/viewportDetector', () => {
  const actualModule = jest.requireActual('../../utils/viewportDetector');
  return {
    __esModule: true,
    ...actualModule,
    ViewportDetector: jest.fn(({ children }) => <>{children}</>),
  };
});
jest.mock('../../card/getCardPreview', () => {
  const actualModule = jest.requireActual('../../card/getCardPreview');
  return {
    __esModule: true,
    ...actualModule,
    getCardPreview: jest.fn(),
    getCardPreviewFromCache: jest.fn(),
  };
});
jest.mock('../../card/getCardStatus', () => {
  const actualModule = jest.requireActual('../../card/getCardStatus');
  return {
    __esModule: true,
    ...actualModule,
    getCardStatus: jest.fn(actualModule.getCardStatus),
  };
});
jest.mock('../../card/cardAnalytics', () => {
  const actualModule = jest.requireActual('../../card/cardAnalytics');
  return {
    __esModule: true,
    ...actualModule,
    fireOperationalEvent: jest.fn(actualModule.fireOperationalEvent),
    fireCopiedEvent: jest.fn(actualModule.fireCopiedEvent),
    fireCommencedEvent: jest.fn(actualModule.fireCommencedEvent),
    fireScreenEvent: jest.fn(actualModule.fireScreenEvent),
  };
});
jest.mock('../../utils/ufoExperiences', () => {
  const actualModule = jest.requireActual('../../utils/ufoExperiences');
  return {
    __esModule: true,
    ...actualModule,
    startUfoExperience: jest.fn(actualModule.startUfoExperience),
    completeUfoExperience: jest.fn(actualModule.completeUfoExperience),
    abortUfoExperience: jest.fn(actualModule.abortUfoExperience),
  };
});
jest.mock('../../utils/generateUniqueId', () => ({
  generateUniqueId: () => 'some-id',
}));

import React from 'react';
import uuid from 'uuid/v4';
import { shallow, mount } from 'enzyme';
import { MediaFeatureFlags, MediaType } from '@atlaskit/media-common';
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
  ProcessedFileState,
  createMediaSubscribable,
  UploadingFileState,
  ProcessingFileState,
} from '@atlaskit/media-client';
import { MediaViewer } from '@atlaskit/media-viewer';
import {
  fakeMediaClient,
  nextTick,
  flushPromises,
  asMockReturnValue,
  asMock,
  expectFunctionToHaveBeenCalledWith,
  asMockFunction,
  expectToEqual,
  createRateLimitedError,
  createPollingMaxAttemptsError,
} from '@atlaskit/media-test-helpers';

import { CardProps, CardState, CardPreview } from '../../types';
import { CardAction } from '../../card/actions';
import { CardBase, CardBaseProps, Card } from '../../card/card';
import { CardView } from '../../card/cardView';

import { InlinePlayerLazy } from '../../card/inlinePlayerLazy';
import { ViewportDetector } from '../../utils/viewportDetector';
import {
  getCardPreview,
  getCardPreviewFromCache,
} from '../../card/getCardPreview';
import { IntlProvider } from 'react-intl-next';
import { getFileAttributes } from '../../utils/analytics';
import { getFileDetails } from '../../utils/metadata';
import { getCardStatus } from '../../card/getCardStatus';
import {
  fireOperationalEvent,
  fireCopiedEvent,
  fireCommencedEvent,
  fireScreenEvent,
} from '../../card/cardAnalytics';
import { isMediaCardError, MediaCardError } from '../../errors';
import { CardStatus } from '../../types';
import getDocument from '../../utils/document';
import {
  completeUfoExperience,
  startUfoExperience,
  abortUfoExperience,
} from '../../utils/ufoExperiences';
import { DateOverrideContext } from '../../dateOverrideContext';

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
  let mediaType: MediaType;
  let fileIdentifier: FileIdentifier;
  let defaultFileState: ProcessedFileState;
  let uploadingFileState: UploadingFileState;
  let processingFileState: ProcessingFileState;
  let mediaClient: MediaClient;

  const defaultCardPreview: CardPreview = {
    dataURI: 'some-data-uri',
    orientation: 6,
    source: 'remote',
  };

  const defaultImageBlob: Promise<Blob> = Promise.resolve(new Blob());

  const setup = (
    mediaClient: MediaClient = createMediaClientWithGetFile(),
    props: Partial<CardBaseProps> = {},
    cardPreview: CardPreview | false = defaultCardPreview,
  ) => {
    asMockFunction(getCardPreview).mockReset();
    if (!!cardPreview) {
      asMockFunction(getCardPreview).mockResolvedValue(cardPreview);
    } else {
      asMockFunction(getCardPreview).mockRejectedValue(new Error('some-error'));
    }

    props = { isLazy: false, ...props };

    const component = shallow<CardBase, CardBaseProps, CardState>(
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
      createMediaSubscribable(fileState),
    );
    return mockMediaClient;
  };

  beforeEach(() => {
    asMockFunction(fireOperationalEvent).mockClear();
    mediaClient = fakeMediaClient();
    const fileStateSubscribable = createMediaSubscribable({
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
    asMock(mediaClient.file.getFileState).mockReturnValue(
      fileStateSubscribable,
    );
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

  it('should update the card preview state when the file identifier is updated', () => {
    const newIdentifier = {
      id: 'new id',
      mediaItemType: 'file',
      collectionName: 'some-collection-name',
      occurrenceKey: 'some-occurrence-key',
    };
    const newCardPreview: CardPreview = {
      dataURI: 'some-new-data-uri',
      orientation: 6,
      source: 'remote',
    };
    asMockFunction(getCardPreviewFromCache)
      .mockReturnValueOnce(defaultCardPreview)
      .mockReturnValueOnce(newCardPreview);
    const component = mount(
      <Card
        mediaClient={createMediaClientWithGetFile()}
        identifier={identifier}
      />,
    );
    expect(component.find(CardBase).state('cardPreview')).toEqual(
      defaultCardPreview,
    );
    component.setProps({ identifier: newIdentifier });
    expect(component.find(CardBase).state('cardPreview')).toEqual(
      newCardPreview,
    );
  });

  it('should override creation date when applied with `DateOverrideContext`', () => {
    const newCardPreview: CardPreview = {
      dataURI: 'some-new-data-uri',
      orientation: 6,
      source: 'remote',
    };
    asMockFunction(getCardPreviewFromCache)
      .mockReturnValueOnce(defaultCardPreview)
      .mockReturnValueOnce(newCardPreview);

    let propInput: Record<string, number> = {};
    propInput[defaultFileId] = 123;

    const component = mount(
      <DateOverrideContext.Provider value={propInput}>
        <Card
          mediaClient={createMediaClientWithGetFile()}
          identifier={identifier}
        />
      </DateOverrideContext.Provider>,
    );
    expect(component.find(CardView).props().overriddenCreationDate).toEqual(
      123,
    );
  });

  it('should attach default IntlProvider when an ancestor is not found', () => {
    const component = mount(
      <Card mediaClient={mediaClient} identifier={identifier} />,
    );
    expect(component.find(IntlProvider).length).toBe(1);
  });

  it('should not attach default IntlProvider when an ancestor is found', () => {
    const component = mount(
      <IntlProvider locale="en">
        <Card mediaClient={mediaClient} identifier={identifier} />
      </IntlProvider>,
    );
    expect(component.find(IntlProvider).length).toBe(1);
  });

  it('should fire onClick when passed in as a prop and CardView fires onClick', () => {
    const clickHandler = jest.fn();

    const mediaClient = fakeMediaClient();
    asMockReturnValue(mediaClient.file.getFileState, createMediaSubscribable());

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
      getFileDetails(identifier, component.state('fileState')!),
    );

    expect(hoverHandler).toBeCalledTimes(1);
    const hoverHandlerArg = hoverHandler.mock.calls[0][0];
    expect(hoverHandlerArg.mediaItemDetails).toEqual(
      getFileDetails(identifier, component.state('fileState')!),
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

  it('should only pass MediaCardError down to CardView', () => {
    const { component } = setup(fakeMediaClient());
    const someError = new Error('some-error');
    const error = new MediaCardError('remote-preview-fetch', someError);

    component.setState({ error });
    expect(component.find(CardView).props().error).toBe(error);
    expect(error).toBeInstanceOf(MediaCardError);
  });

  it('should pass properties down to CardView', () => {
    const mediaClient = fakeMediaClient();
    asMockReturnValue(mediaClient.file.getFileState, createMediaSubscribable());

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

    expect(status).toBe('loading-preview');
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

  it('should set preview orientation and pass it down do view', async () => {
    const { component } = setup();
    await flushPromises();
    component.update();
    expect(component.state('cardPreview')).toMatchObject({
      orientation: 1,
    });
    expect(component.find(CardView).prop('cardPreview')).toMatchObject({
      orientation: 1,
    });
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
  it('should set processing state when file is processing with preview', async () => {
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

    expectToEqual(status, 'processing');
    expectToEqual(progress, 1);
  });

  it('should set error card state and wrap the error when filestate subscription sends error', async () => {
    const mediaClient = fakeMediaClient();
    const errorThrown = new Error('this is an error');
    asMockReturnValue(
      mediaClient.file.getFileState,
      createMediaSubscribable(errorThrown),
    );
    const { component } = setup(mediaClient);

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
    const errorThrown = new Error('some-error');
    asMockReturnValue(
      mediaClient.file.getFileState,
      createMediaSubscribable(errorThrown),
    );
    const { component } = setup(mediaClient);
    component.update();
    expect(component.find(CardView).prop('status')).toEqual('error');
  });

  // If file state subscription decides that the card is completed
  // and later there is an error, we won't change the card's status.
  it('should not render error card when getFileState throws and previous state is complete', async () => {
    asMockFunction(getCardStatus).mockReturnValueOnce('complete');
    const mediaClient = fakeMediaClient();
    asMockReturnValue(
      mediaClient.file.getFileState,
      createMediaSubscribable({
        id: 'some-id',
        name: 'some-name',
        size: 10,
        status: 'uploading',
        progress: 0.5,
        mediaType: 'doc',
        mimeType: 'application/pdf',
      }),
    );
    const { component } = setup(mediaClient);

    await nextTick();
    expect(component.state().status).toBe('complete');

    asMockReturnValue(
      mediaClient.file.getFileState,
      createMediaSubscribable(new Error('This is a pressumable polling error')),
    );
    await nextTick();
    expect(component.state().status).toBe('complete');
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
        cardPreview: expect.objectContaining({
          dataURI: 'mock result of URL.createObjectURL()',
        }),
        dimensions: { width: 10, height: 20 },
        disableOverlay: true,
        progress: 1,
        resizeMode: 'fit',
        selectable: true,
        selected: true,
        status: 'loading-preview',
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

  describe('External image identifier', () => {
    it('should work with external image identifier', () => {
      const identifier: ExternalImageIdentifier = {
        mediaItemType: 'external-image',
        dataURI: 'bla',
        name: 'some external image',
      };

      const { component } = setup(undefined, { identifier });

      expect(component.find(CardView).prop('cardPreview')).toMatchObject({
        dataURI: 'bla',
      });
      expect(component.find(CardView).prop('metadata')).toEqual({
        id: identifier.mediaItemType,
        mediaType: 'image',
        name: 'some external image',
      });
    });

    it('should update the card preview when the external image identifier updates', () => {
      const identifier: ExternalImageIdentifier = {
        mediaItemType: 'external-image',
        dataURI: 'bla',
        name: 'some external image',
      };
      const cardPreview: CardPreview = {
        dataURI: 'bla',
        orientation: 1,
        source: 'external',
      };
      const newIdentifier: ExternalImageIdentifier = {
        mediaItemType: 'external-image',
        dataURI: 'new-uri',
        name: 'some new external image',
      };
      const newCardPreview: CardPreview = {
        dataURI: 'new-uri',
        orientation: 1,
        source: 'external',
      };
      const component = mount(
        <Card
          mediaClient={createMediaClientWithGetFile()}
          identifier={identifier}
        />,
      );
      expect(component.find(CardBase).state('cardPreview')).toEqual(
        cardPreview,
      );
      component.setProps({ identifier: newIdentifier });
      expect(component.find(CardBase).state('cardPreview')).toEqual(
        newCardPreview,
      );
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
    it('should render InlinePlayerLazy when isPlayingFile=true', () => {
      const { component } = setup();
      const cardPreview: CardPreview = {
        dataURI: 'some-datauri',
        source: 'remote',
      };
      component.setState({
        isPlayingFile: true,
        cardPreview,
      });
      component.update();
      const player = component.find(InlinePlayerLazy);
      expect(player).toHaveLength(1);
      expect(player.props().cardPreview).toBe(cardPreview);
    });

    it('should set isPlayingFile=false when an error occurrs in inline player', () => {
      const { component } = setup(undefined, {
        useInlinePlayer: true,
        disableOverlay: true,
      });

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

      expect(component.state('isPlayingFile')).toBeTruthy();
      expect(component.state('shouldAutoplay')).toBeFalsy();

      // simulate an error in inline player
      component.find(InlinePlayerLazy).props().onError();

      expect(component.state('isPlayingFile')).toBeFalsy();
      expect(component.state('shouldAutoplay')).toBeFalsy();
    });

    it('should set isPlayingFile=false when mimeType is not supported and status is uploading', () => {
      const fileState: FileState = {
        id: 'some-id',
        name: 'some-video.mov',
        mediaType: 'video',
        mimeType: 'video/mov',
        size: 12345,
        status: 'uploading',
        progress: 0.2,
        preview: {
          value: new Blob([]),
        },
      };

      const { component } = setup(undefined, {
        useInlinePlayer: true,
        disableOverlay: true,
      });
      component.setState({
        cardPreview: { dataURI: 'data-uri', source: 'remote' },
        fileState: fileState,
      });

      expect(component.state('isPlayingFile')).toBeFalsy();

      //autoplay disabled when control bar is shown by default
      expect(component.state('shouldAutoplay')).toBeFalsy();
    });

    it('should set isPlayingFile=false when mimeType is not supported and status is processing', () => {
      const fileState: FileState = {
        id: 'some-id',
        name: 'some-video.mov',
        mediaType: 'video',
        mimeType: 'video/mov',
        size: 12345,
        status: 'processing',
        preview: {
          value: new Blob([]),
        },
      };

      const { component } = setup(undefined, {
        useInlinePlayer: true,
        disableOverlay: true,
      });
      component.setState({
        cardPreview: { dataURI: 'data-uri', source: 'remote' },
        fileState: fileState,
      });

      expect(component.state('isPlayingFile')).toBeFalsy();

      //autoplay disabled when control bar is shown by default
      expect(component.state('shouldAutoplay')).toBeFalsy();
    });

    it('should set isPlayingFile=true and shoulAutoplay=true when clicking on a viewable video file', () => {
      const { component } = setup(undefined, {
        useInlinePlayer: true,
        disableOverlay: false,
      });
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
      expect(component.state('shouldAutoplay')).toBeTruthy();
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
          items: [],
          selectedItem: identifier,
        }),
      );
    });

    it('should pass items list to MediaViewer', () => {
      const { component } = setup(undefined, {
        shouldOpenMediaViewer: true,
        mediaViewerItems: [identifier, identifier],
      });
      component.setState({ fileState: defaultFileState });
      component.find(CardView).simulate('click');

      expect(component.find(MediaViewer).prop('items')).toEqual([
        identifier,
        identifier,
      ]);
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
        disableOverlay: false,
      });

      await nextTick();
      await nextTick();
      await nextTick();

      component.find(CardView).simulate('click');

      expect(component.find(MediaViewer)).toHaveLength(0);
      expect(component.find(InlinePlayerLazy)).toHaveLength(1);
    });

    it('should pass contextId to MV', async () => {
      const { component } = setup(undefined, {
        shouldOpenMediaViewer: true,
        mediaViewerItems: [identifier, identifier],
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
        mediaViewerItems: [identifier, identifier],
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

    it('should focus button', async () => {
      const mediaClient = createMediaClientWithGetFile(defaultFileState);
      document.body.innerHTML = `<div id="wrap"></div>`;
      const component = mount(
        <Card
          mediaClient={mediaClient}
          identifier={identifier}
          shouldOpenMediaViewer
        />,
        { attachTo: document.getElementById('wrap') },
      );

      await nextTick();
      await nextTick();

      const openViewerButton = component.findWhere(
        (node) => node.type() === 'button' && node.text().includes('Open'),
      );
      openViewerButton.simulate('click');

      const viewer = component.find(MediaViewer);
      expect(viewer).toHaveLength(1);

      viewer.prop('onClose')?.();
      expect(openViewerButton.getDOMNode()).toHaveFocus();
      component.update();

      expect(component.find(MediaViewer)).toHaveLength(0);
    });
  });

  describe('Analytics', () => {
    beforeEach(() => {
      jest.spyOn(performance, 'now').mockReturnValue(1000);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const createAnalyticsEvent = jest.fn(() => ({
      fire: () => {},
    })) as unknown as CreateUIAnalyticsEvent;

    it('should attach package attributes to Analytics Context', () => {
      const mediaClient = fakeMediaClient();
      const card = mount<CardProps>(
        <Card mediaClient={mediaClient} identifier={identifier} />,
      );

      const contextData = card.find(AnalyticsContext).at(0).props().data;
      expect(contextData).toMatchObject({
        packageName: expect.any(String),
        packageVersion: expect.any(String),
        componentName: 'mediaCard',
        component: 'mediaCard',
      });
    });

    it('should attach feature flags to Analytics Context', () => {
      const mediaClient = fakeMediaClient();

      const featureFlags = {
        someFlag: false,
        someFlag2: true,
      } as MediaFeatureFlags;

      const card = mount<CardProps>(
        <Card
          mediaClient={mediaClient}
          identifier={identifier}
          featureFlags={featureFlags}
        />,
      );

      const contextData = card.find(AnalyticsContext).at(0).props().data;
      expect(contextData[MEDIA_CONTEXT]).toEqual({ featureFlags });
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

    it('should pass the Analytics Event fired from InlinePlayerLazy to the provided onClick callback', () => {
      const onClickHandler = jest.fn();
      const { component } = setup(undefined, { onClick: onClickHandler });
      component.setState({
        isPlayingFile: true,
      });
      component.update();
      component
        .find(InlinePlayerLazy)
        .props()
        .onClick({ thiIsA: 'HTMLEvent' }, { thiIsAn: 'AnalyticsEvent' });

      expect(onClickHandler).toBeCalledTimes(1);
      const actualEvent = onClickHandler.mock.calls[0][1];
      expect(actualEvent).toBeDefined();
    });

    describe('Operational Event', () => {
      let fileState: FileState;
      beforeEach(() => {
        let defaultStateAttributes = {
          id: defaultFileId,
          name: 'file-name',
          size: 10,
          mediaType: mediaType,
          mimeType: 'image/png',
        };
        uploadingFileState = {
          status: 'uploading',
          ...defaultStateAttributes,
          progress: 1,
        };
        processingFileState = {
          status: 'processing',
          ...defaultStateAttributes,
        };
        asMock(fireOperationalEvent).mockClear();
      });

      it('should attach an uploading file status flag with value as true when completing the UFO experience', () => {
        const { component } = setup(fakeMediaClient(), {
          createAnalyticsEvent,
        });
        fileState = uploadingFileState;
        component.setState({
          fileState,
        });

        component.setState({ status: 'some-state' as CardStatus });
        expect(completeUfoExperience).toHaveBeenCalledTimes(1);
        expect(completeUfoExperience).toHaveBeenLastCalledWith(
          expect.any(String),
          expect.any(String),
          expect.any(Object),
          { wasStatusUploading: true, wasStatusProcessing: false },
          expect.any(Object),
          undefined,
        );
      });

      it('should attach a processing file status flag with value as true when completing the UFO experience', () => {
        const { component } = setup(fakeMediaClient(), {
          createAnalyticsEvent,
        });
        fileState = processingFileState;
        component.setState({
          fileState,
        });

        component.setState({ status: 'some-state' as CardStatus });
        expect(completeUfoExperience).toHaveBeenCalledTimes(1);
        expect(completeUfoExperience).toHaveBeenLastCalledWith(
          expect.any(String),
          expect.any(String),
          expect.any(Object),
          { wasStatusUploading: false, wasStatusProcessing: true },
          expect.any(Object),
          undefined,
        );
      });

      it('should attach uploading and processing file status flags with values as false when completing the UFO experience', () => {
        const { component } = setup(fakeMediaClient(), {
          createAnalyticsEvent,
        });
        fileState = defaultFileState;
        component.setState({
          fileState,
        });

        component.setState({ status: 'some-state' as CardStatus });
        expect(completeUfoExperience).toHaveBeenCalledTimes(1);
        expect(completeUfoExperience).toHaveBeenLastCalledWith(
          expect.any(String),
          expect.any(String),
          expect.any(Object),
          { wasStatusUploading: false, wasStatusProcessing: false },
          expect.any(Object),
          undefined,
        );
      });

      it('should complete the UFO experience when a serverRateLimited error occurs', () => {
        const mediaClient = fakeMediaClient();
        const errorThrown = createRateLimitedError({});
        asMockReturnValue(
          mediaClient.file.getFileState,
          createMediaSubscribable(errorThrown),
        );
        const { component } = setup(mediaClient, { createAnalyticsEvent });

        expect(component.state('status')).toEqual('error');

        expect(completeUfoExperience).toBeCalledTimes(1);
        expect(completeUfoExperience).toHaveBeenLastCalledWith(
          expect.any(String),
          'error',
          {
            fileMediatype: undefined,
            fileMimetype: undefined,
            fileId: defaultFileId,
            fileSize: undefined,
            fileStatus: undefined,
          },
          { wasStatusUploading: false, wasStatusProcessing: false },
          expect.any(Object),
          new MediaCardError('metadata-fetch', errorThrown),
        );
        expect(
          (fireOperationalEvent as jest.Mock).mock.calls[0][5].secondaryError,
        ).toEqual(errorThrown);
      });

      it('should complete the UFO experience when a pollingMaxAttemptsExceeded error occurs', () => {
        const mediaClient = fakeMediaClient();
        const errorThrown = createPollingMaxAttemptsError(2);
        asMockReturnValue(
          mediaClient.file.getFileState,
          createMediaSubscribable(errorThrown),
        );
        const { component } = setup(mediaClient, { createAnalyticsEvent });

        expect(component.state('status')).toEqual('error');

        expect(completeUfoExperience).toBeCalledTimes(1);
        expect(completeUfoExperience).toHaveBeenLastCalledWith(
          expect.any(String),
          'error',
          {
            fileMediatype: undefined,
            fileMimetype: undefined,
            fileId: defaultFileId,
            fileSize: undefined,
            fileStatus: undefined,
          },
          { wasStatusUploading: false, wasStatusProcessing: false },
          expect.any(Object),
          new MediaCardError('metadata-fetch', errorThrown),
        );
        expect(
          (fireOperationalEvent as jest.Mock).mock.calls[0][5].secondaryError,
        ).toEqual(errorThrown);
      });

      it('should fire an operational event on card status change', () => {
        const { component } = setup(fakeMediaClient(), {
          createAnalyticsEvent,
        });
        fileState = defaultFileState;
        const error = new MediaCardError('metadata-fetch');
        component.setState({
          fileState,
          error,
        });

        component.setState({ status: 'some-status' as CardStatus });
        expect(fireOperationalEvent).toBeCalledTimes(1);
        expect(fireOperationalEvent).toHaveBeenLastCalledWith(
          createAnalyticsEvent,
          'some-status',
          getFileAttributes(
            getFileDetails(identifier, fileState),
            fileState.status,
          ),
          {
            overall: {
              durationSinceCommenced: 0,
              durationSincePageStart: 1000,
            },
          },
          { client: { status: 'unknown' }, server: { status: 'unknown' } },
          error,
          {
            traceId: expect.any(String),
          },
          undefined,
        );

        component.setState({ status: 'another-status' as CardStatus });
        expect(fireOperationalEvent).toBeCalledTimes(2);
        expect(fireOperationalEvent).toHaveBeenLastCalledWith(
          createAnalyticsEvent,
          'another-status',
          getFileAttributes(
            getFileDetails(identifier, fileState),
            fileState.status,
          ),
          {
            overall: {
              durationSinceCommenced: 0,
              durationSincePageStart: 1000,
            },
          },
          { client: { status: 'unknown' }, server: { status: 'unknown' } },
          error,
          {
            traceId: expect.any(String),
          },
          undefined,
        );
      });

      it('should fire an operational event when a serverRateLimited error occurs', () => {
        const mediaClient = fakeMediaClient();
        const errorThrown = createRateLimitedError({});
        asMockReturnValue(
          mediaClient.file.getFileState,
          createMediaSubscribable(errorThrown),
        );
        const { component } = setup(mediaClient, { createAnalyticsEvent });

        expect(component.state('status')).toEqual('error');

        expect(fireOperationalEvent).toBeCalledTimes(1);
        expect(fireOperationalEvent).toHaveBeenLastCalledWith(
          createAnalyticsEvent,
          'error',
          {
            fileMediatype: undefined,
            fileMimetype: undefined,
            fileId: defaultFileId,
            fileSize: undefined,
            fileStatus: undefined,
          },
          {
            overall: {
              durationSinceCommenced: 0,
              durationSincePageStart: 1000,
            },
          },
          { client: { status: 'unknown' }, server: { status: 'unknown' } },
          new MediaCardError('metadata-fetch', errorThrown),
          {
            traceId: expect.any(String),
          },
          undefined,
        );
        expect(
          (fireOperationalEvent as jest.Mock).mock.calls[0][5].secondaryError,
        ).toEqual(errorThrown);
      });

      it('should fire an operational event when a pollingMaxAttemptsExceeded error occurs', () => {
        const mediaClient = fakeMediaClient();
        const errorThrown = createPollingMaxAttemptsError(2);
        asMockReturnValue(
          mediaClient.file.getFileState,
          createMediaSubscribable(errorThrown),
        );
        const { component } = setup(mediaClient, { createAnalyticsEvent });

        expect(component.state('status')).toEqual('error');

        expect(fireOperationalEvent).toBeCalledTimes(1);
        expect(fireOperationalEvent).toHaveBeenLastCalledWith(
          createAnalyticsEvent,
          'error',
          {
            fileMediatype: undefined,
            fileMimetype: undefined,
            fileId: defaultFileId,
            fileSize: undefined,
            fileStatus: undefined,
          },
          {
            overall: {
              durationSinceCommenced: 0,
              durationSincePageStart: 1000,
            },
          },
          { client: { status: 'unknown' }, server: { status: 'unknown' } },
          new MediaCardError('metadata-fetch', errorThrown),
          {
            traceId: expect.any(String),
          },
          undefined,
        );
        expect(
          (fireOperationalEvent as jest.Mock).mock.calls[0][5].secondaryError,
        ).toEqual(errorThrown);
      });
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
        const params = {
          cardPreview: 'some-card-preview',
          error: 'some-error',
        } as unknown as CardState;

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
          {
            traceId: expect.any(String),
          },
        );
        expect(startUfoExperience).toBeCalledTimes(1);
        expect(startUfoExperience).toBeCalledWith('some-id');
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
          {
            traceId: expect.any(String),
          },
        );
        expect(startUfoExperience).toBeCalledTimes(1);
        expect(startUfoExperience).toBeCalledWith('some-id');
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

    describe('Aborted', () => {
      it('should abort the experience when unmounted', () => {
        const component = mount(
          <CardBase
            mediaClient={fakeMediaClient()}
            identifier={fileIdentifier}
            isLazy={false}
            createAnalyticsEvent={createAnalyticsEvent}
          />,
        );
        component.unmount();
        expect(abortUfoExperience).toBeCalledTimes(1);
      });
    });
  });
});
