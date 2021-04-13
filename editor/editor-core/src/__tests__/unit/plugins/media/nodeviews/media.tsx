import React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { NumericalCardDimensions } from '@atlaskit/media-card';
import { EditorView } from 'prosemirror-view';
import { media } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/adf-schema';
import { ProviderFactory, browser } from '@atlaskit/editor-common';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { Card } from '@atlaskit/media-card';
import Media, {
  MediaNodeProps,
  MediaNode,
} from '../../../../../plugins/media/nodeviews/mediaNodeView/media';
import { stateKey as mediaStateKey } from '../../../../../plugins/media/pm-plugins/main';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';
import { fakeMediaProvider } from '@atlaskit/editor-test-helpers/media-provider';
import { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { ProsemirrorGetPosHandler } from '../../../../../nodeviews/types';
import { isMobileUploadCompleted } from '../../../../../plugins/media/commands/helpers';
import { ReactMediaNode } from '../../../../../plugins/media/nodeviews/mediaNodeView';
import { stateKey as SelectionChangePluginKey } from '../../../../../plugins/base/pm-plugins/react-nodeview';
import { PortalProviderAPI } from '../../../../../ui/PortalProvider';
import { MediaOptions } from '../../../../../plugins/media/types';
import { EventDispatcher } from '../../../../../event-dispatcher';

describe('nodeviews/media', () => {
  let providerFactory = {} as ProviderFactory;
  let mediaProvider: Promise<MediaProvider>;
  let wrapper: ReactWrapper<MediaNodeProps>;
  let pluginState: MediaPluginState;
  let view: EditorView;
  let getPos: ProsemirrorGetPosHandler;
  let cardDimensions: NumericalCardDimensions;

  const mediaNode = media({
    id: 'foo',
    type: 'file',
    collection: 'collection',
    width: 400,
    height: 300,
  });

  const externalMediaNode = media({
    type: 'external',
    url: 'http://example.com/1920x1080.jpg',
  });

  const mediaBlobNode = media({
    type: 'external',
    url:
      'blob:http://example.com/dd8bd6d8-cd55-0f42-a159-a3d04bd63ac4#media-blob-url=true&id=d4df0829-1215-41ec-a83f-412543d30025&collection=MediaServicesSample&contextId=DUMMY-OBJECT-ID&mimeType=image%2Fpng&name=image-20200623-053610.png&size=422247&width=680&height=382',
  });

  beforeEach(() => {
    providerFactory = ProviderFactory.create({ mediaProvider });
    pluginState = {} as MediaPluginState;
    mediaProvider = fakeMediaProvider();
    view = {} as EditorView;
    getPos = jest.fn();
    cardDimensions = {} as NumericalCardDimensions;

    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
    jest.spyOn(SelectionChangePluginKey, 'getState').mockImplementation(() => ({
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    }));
    pluginState.handleMediaNodeMount = jest.fn();
    pluginState.handleMediaNodeUnmount = jest.fn();
    pluginState.updateElement = jest.fn();

    wrapper = mount(
      <Media
        node={mediaNode()(defaultSchema)}
        getPos={getPos}
        view={view}
        originalDimensions={cardDimensions}
        maxDimensions={cardDimensions}
        selected={false}
        onExternalImageLoaded={jest.fn()}
      />,
    );
  });

  afterEach(() => {
    wrapper.unmount();
    jest.resetAllMocks();
  });

  it('should render Media', () => {
    expect(wrapper.length).toBe(1);
  });

  it('sets "onExternalImageLoaded" for external images', () => {
    expect(wrapper.props().onExternalImageLoaded).toBeDefined();
  });

  it('passes url prop for external images', async () => {
    wrapper = mount(
      <Media
        node={externalMediaNode()(defaultSchema)}
        getPos={getPos}
        view={view}
        originalDimensions={cardDimensions}
        maxDimensions={cardDimensions}
        selected={false}
        onExternalImageLoaded={jest.fn()}
      />,
    );
    expect(wrapper.props().node.attrs.url).toEqual(
      'http://example.com/1920x1080.jpg',
    );
  });

  it('propagates mobile upload progress to Media component', async () => {
    pluginState.mediaOptions = {
      allowMarkingUploadsAsIncomplete: true,
    };
    pluginState.mobileUploadComplete = { foo: false };

    wrapper = mount(
      <Media
        view={view}
        node={mediaNode()(defaultSchema)}
        getPos={getPos}
        selected={false}
        mediaProvider={mediaProvider}
        originalDimensions={cardDimensions}
        maxDimensions={cardDimensions}
        uploadComplete={isMobileUploadCompleted(
          pluginState,
          mediaNode()(defaultSchema).attrs.id,
        )}
      />,
    );

    const { uploadComplete } = wrapper.find(MediaNode).props();
    expect(uploadComplete).toBe(false);
  });

  it('propagates mobile upload complete to Media component', async () => {
    pluginState.mediaOptions = {
      allowMarkingUploadsAsIncomplete: true,
    };
    pluginState.mobileUploadComplete = { foo: true };

    wrapper = mount(
      <Media
        view={view}
        node={mediaNode()(defaultSchema)}
        getPos={getPos}
        selected={false}
        mediaProvider={mediaProvider}
        originalDimensions={cardDimensions}
        maxDimensions={cardDimensions}
        uploadComplete={isMobileUploadCompleted(
          pluginState,
          mediaNode()(defaultSchema).attrs.id,
        )}
      />,
    );

    const { uploadComplete } = wrapper.find(MediaNode).props();
    expect(uploadComplete).toBe(true);
  });

  it('passes feature flag to Card component', async () => {
    const featureFlags: MediaFeatureFlags = { newCardExperience: true };
    const mediaOptions = {
      featureFlags,
    };

    wrapper = mount(
      <Media
        view={view}
        node={externalMediaNode()(defaultSchema)}
        getPos={getPos}
        selected={false}
        mediaProvider={mediaProvider}
        originalDimensions={cardDimensions}
        maxDimensions={cardDimensions}
        mediaOptions={mediaOptions}
      />,
    );

    expect(wrapper.find(Card).props().featureFlags).toEqual(featureFlags);
  });

  describe('media node view', () => {
    const createView = (anchorPos: number, headPos: number) =>
      ({
        state: {
          selection: {
            from: 0,
            to: 0,
            $anchor: {
              pos: anchorPos,
            },
            $head: {
              pos: headPos,
            },
          },
        },
      } as EditorView);

    const mediaOptions: MediaOptions = {};
    const portalProviderAPI: PortalProviderAPI = {
      render(component: () => React.ReactChild | null) {
        component();
      },
      remove() {},
    } as any;
    const eventDispatcher = {} as EventDispatcher;

    describe('media node', () => {
      it('correctly sets maxDimensions', () => {
        const getPos = () => 12;
        const node = mediaNode()(defaultSchema);
        const testView = createView(0, 0);
        const nodeView = ReactMediaNode(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          mediaOptions,
        )(node, testView, getPos);

        const { width, height } = shallow(nodeView.render())
          .props()
          .render({
            width: { width: 640 },
          }).props.maxDimensions;

        // editorWidth.width
        expect(width).toBe('640px');
        // (height / width) * editorWidth.width is the current formula
        expect(height).toBe('480px');
      });

      it('correctly sets contenteditable', () => {
        mediaOptions.allowMediaSingleEditable = true;
        browser.chrome = true;
        const node = mediaNode()(defaultSchema);
        const testView = createView(0, 0);
        const nodeView = ReactMediaNode(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          mediaOptions,
        )(node, testView, getPos);

        const elem = nodeView.createDomRef();
        expect(elem.contentEditable).toBe('true');
      });
    });

    describe('media blob node', () => {
      it('correctly sets width and height', async () => {
        const getPos = () => 12;
        const node = mediaBlobNode()(defaultSchema);
        const testView = createView(9, 12);
        const nodeView = ReactMediaNode(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          mediaOptions,
        )(node, testView, getPos);

        const { width, height } = shallow(nodeView.render())
          .props()
          .render({ width: { width: 640 } }).props.originalDimensions;

        expect(width).toBe(680);
        expect(height).toBe(382);
      });
    });
  });
});
