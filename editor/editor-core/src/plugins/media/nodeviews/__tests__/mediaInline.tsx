import * as mocks from './mediaSingle.mock';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { createSchema, MediaAttributes } from '@atlaskit/adf-schema';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { mediaInline } from '@atlaskit/editor-test-helpers/doc-builder';
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
import { flushPromises } from '../../../../__tests__/__helpers/utils';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';

const mockSchema = getSchemaBasedOnStage('stage0');

export const createMediaProvider = async (): Promise<MediaProvider> =>
  ({} as MediaProvider);

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
  } as unknown) as MediaPluginState,
  isSelected: false,
  getPos: jest.fn(() => 0),
  dispatchAnalyticsEvent: jest.fn(),
  contextIdentifierProvider: Promise.resolve({} as any),
};

describe('MediaInline ReactNodeView', () => {
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
    const { MediaNodeUpdater } = await import('../mediaNodeUpdater');
    mountWithIntl(<MediaInline {...mediaInlineProps} />);
    expect(MediaNodeUpdater).toHaveBeenCalledTimes(1);
  });

  test('updates file attrs on props change', async () => {
    const { MediaNodeUpdater } = await import('../mediaNodeUpdater');
    mountWithIntl(<MediaInline {...mediaInlineProps} />).setProps({
      mediaProvider: createMediaProvider(),
    });
    expect(MediaNodeUpdater).toHaveBeenCalledTimes(2);
  });

  it('copied node adds a promise to pending tasks', async () => {
    const attrs: MediaAttributes = {
      id: 'my-test-id',
      type: 'file',
      collection: 'coll-1',
    };

    const mediaInlineNode = mediaInline(attrs)();
    const myPromise = Promise.resolve();
    mocks.mockHasDifferentContextId.mockReturnValue(true);
    mocks.mockCopyNode.mockReturnValue(myPromise);

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
