import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { createSchema } from '@atlaskit/adf-schema';
import { MediaProvider } from '../../pm-plugins/main';
import { MediaInlineNodeView } from '../mediaInline';
import { ProviderFactory } from '@atlaskit/editor-common';

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
});
