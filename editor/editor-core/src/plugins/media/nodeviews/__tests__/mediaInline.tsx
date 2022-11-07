import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { createSchema, MediaAttributes } from '@atlaskit/adf-schema';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { mediaInline } from '@atlaskit/editor-test-helpers/doc-builder';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import { MediaProvider } from '../../pm-plugins/main';
import {
  MediaInline,
  MediaInlineNodeView,
  MediaInlineProps,
  handleNewNode,
} from '../mediaInline';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { MediaPluginState } from '../../pm-plugins/types';
import { FileIdentifier } from '@atlaskit/media-client';
import React from 'react';
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { MediaNodeUpdater } from '../mediaNodeUpdater';

const mockSchema = getSchemaBasedOnStage('stage0');
jest.mock('../mediaNodeUpdater.ts');
const MockMediaNodeUpdater = MediaNodeUpdater as jest.Mock<MediaNodeUpdater>;

export const createMediaProvider = async (): Promise<MediaProvider> =>
  ({ viewMediaClientConfig: getDefaultMediaClientConfig() } as MediaProvider);

export const mediaInlineProps: MediaInlineProps = {
  identifier: {
    id: '123',
    mediaItemType: 'file',
  } as FileIdentifier,
  view: new EditorView(undefined, {
    state: EditorState.create({ schema: mockSchema }),
  }),
  node: { attrs: {}, firstChild: { attrs: {} } } as PMNode<any>,
  mediaProvider: createMediaProvider(),
  mediaPluginState: ({
    handleMediaNodeMount: jest.fn(),
    handleMediaNodeUnmount: jest.fn(),
    addPendingTask: jest.fn(),
  } as unknown) as MediaPluginState,
  isSelected: true,
  getPos: jest.fn(() => 0),
  dispatchAnalyticsEvent: jest.fn(),
  contextIdentifierProvider: Promise.resolve({} as any),
};

describe('MediaInline ReactNodeView', () => {
  const instances: MediaNodeUpdater[] = (MediaNodeUpdater as any).instances;

  const getPos = jest.fn();
  let mediaProvider;
  let providerFactory: ProviderFactory;
  const schema = createSchema({
    nodes: ['doc', 'paragraph', 'mediaInline', 'text'],
  });
  const node = schema.nodes.mediaInline.create({
    id: 'test-id',
    collection: 'test-collection',
  });

  beforeEach(() => {
    mediaProvider = {} as MediaProvider;
    providerFactory = new ProviderFactory();
    providerFactory.setProvider(
      'mediaProvider',
      Promise.resolve(mediaProvider),
    );
    MockMediaNodeUpdater.mockReset(); // part of mocked class API, not original
  });

  afterEach(() => {
    jest.clearAllMocks();
    providerFactory.destroy();
  });

  test('should create MediaInlineNodeView with the right options', async () => {
    const createEditor = createEditorFactory();
    const editor = createEditor({});
    const { editorView, portalProviderAPI, eventDispatcher } = editor;
    const node = schema.nodes.mediaInline.create({
      id: 'test-id',
      collection: 'test-collection',
    });
    const mediaInlineNodeView = new MediaInlineNodeView(
      node,
      editorView,
      getPos,
      portalProviderAPI,
      eventDispatcher,
      {
        providerFactory,
      },
    ).init();
    expect(mediaInlineNodeView.createDomRef().contentEditable).toEqual('false');
  });

  test('should create MediaInlineNodeView with correct dom type', async () => {
    const createEditor = createEditorFactory();
    const editor = createEditor({});
    const { editorView, portalProviderAPI, eventDispatcher } = editor;
    const mediaInlineNodeView = new MediaInlineNodeView(
      node,
      editorView,
      getPos,
      portalProviderAPI,
      eventDispatcher,
      {
        providerFactory,
      },
    ).init();
    expect(mediaInlineNodeView.createDomRef().nodeName).toEqual('SPAN');
  });

  test('updates file attrs on mount', async () => {
    mountWithIntl(<MediaInline {...mediaInlineProps} />);
    await flushPromises();
    expect(instances).toHaveLength(1);
    expect(instances[0].updateFileAttrs).toHaveBeenCalledTimes(1);
  });

  test('calls updates file attrs on props change', async () => {
    const wrapper = mountWithIntl(<MediaInline {...mediaInlineProps} />);
    wrapper.setProps({
      mediaProvider: createMediaProvider(),
    });
    await flushPromises();
    expect(instances).toHaveLength(2);
    expect(instances[1].updateFileAttrs).toHaveBeenCalledTimes(1);
  });

  test('returns loading view without message when no mediaClientConfig is present', async () => {
    const noMediaClientConfigProps = {
      ...mediaInlineProps,
      mediaProvider: Promise.resolve({} as MediaProvider),
    };
    const wrapper = mountWithIntl(
      <MediaInline {...noMediaClientConfigProps} />,
    );
    await flushPromises();
    wrapper.update();
    const mediaInlineLoadingView = wrapper
      .findWhere((el) => el.name() === 'MediaInlineCardLoadingView')
      .instance();
    expect(mediaInlineLoadingView.props).toEqual({
      message: '',
      isSelected: false,
    });
  });

  test('returns loading view with message when mediaClientConfig is present', async () => {
    const wrapper = mountWithIntl(<MediaInline {...mediaInlineProps} />);
    await flushPromises();
    wrapper.update();
    const mediaInlineLoadingView = wrapper
      .findWhere((el) => el.name() === 'MediaInlineCardLoadingView')
      .instance();
    expect(mediaInlineLoadingView.props).toEqual({
      message: 'Loading file...',
      isSelected: true,
    });
  });

  it('copied node adds a promise to pending tasks', async () => {
    const attrs: MediaAttributes = {
      id: 'my-test-id',
      type: 'file',
      collection: 'coll-1',
    };

    const mediaInlineNode = mediaInline(attrs)();
    const myPromise = Promise.resolve();
    (MediaNodeUpdater as any).setMock(
      'hasDifferentContextId',
      jest.fn().mockReturnValue(Promise.resolve(true)),
    );
    (MediaNodeUpdater as any).setMock(
      'copyNode',
      jest.fn().mockReturnValue(myPromise),
    );

    const addPendingTaskMock = jest.fn();

    mountWithIntl(
      <MediaInline
        {...{
          ...mediaInlineProps,
          node: mediaInlineNode(mockSchema),
          mediaPluginState: {
            handleMediaNodeMount: jest.fn(),
            mediaPluginOptions: {},
            addPendingTask: addPendingTaskMock,
          } as any,
        }}
      />,
    );

    await flushPromises();
    // can't use toHaveBeenCalledWith as it treats two different promises as the same
    expect(
      addPendingTaskMock.mock.calls.some((arg) => arg.includes(myPromise)),
    ).toBeTruthy();
  });

  describe('MediaInline Functions', () => {
    describe('handleNewNode', () => {
      test('should call handleMediaNodeMount', () => {
        handleNewNode(mediaInlineProps);
        expect(
          mediaInlineProps.mediaPluginState.handleMediaNodeMount,
        ).toHaveBeenCalled();
      });
    });
  });
});
