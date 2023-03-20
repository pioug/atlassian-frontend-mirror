import {
  isMediaNode,
  replaceExternalMedia,
  updateMediaSingleNodeAttrs,
  updateCurrentMediaNodeAttrs,
} from '../../../helpers';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { stateKey as mediaPluginKey } from '../../../../pm-plugins/plugin-key';
import { MediaPluginState } from '../../../../pm-plugins/types';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  doc,
  p,
  media,
  mediaInline,
  mediaSingle,
  mediaGroup,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import {
  getFreshMediaProvider,
  temporaryFileId,
  testCollectionName,
} from '../../../../../../__tests__/unit/plugins/media/_utils';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { CommandDispatch } from '@atlaskit/editor-common/types';

describe('media -> commands -> helpers.ts', () => {
  const mediaProvider = getFreshMediaProvider();
  const contextIdentifierProvider = storyContextIdentifierProviderFactory();
  const providerFactory = ProviderFactory.create({
    contextIdentifierProvider,
    mediaProvider,
  });

  const createEditor = createEditorFactory<MediaPluginState>();
  const editor = (doc: DocBuilder, editorProps = {}) => {
    return createEditor({
      doc,
      editorProps: {
        ...editorProps,
        media: {
          provider: mediaProvider,
          allowMediaSingle: true,
        },
        contextIdentifierProvider,
        quickInsert: true,
      },
      providerFactory,
      pluginKey: mediaPluginKey,
    });
  };

  describe('#replaceExternalMedia', () => {
    describe('when a media is not selected', () => {
      const sourceDocument = doc(
        // prettier-ignore
        p('abc'),
        '{notMediaSelection}',
        mediaSingle({ layout: 'center' })(
          media({
            type: 'external',
            url: 'gnu.org',
          })(),
        ),
      );

      it('should return false', () => {
        const { editorView, refs } = editor(sourceDocument);
        const replace = replaceExternalMedia(refs.notMediaSelection, {
          url: 'gnu.org/2',
        });

        const result = replace(editorView.state, editorView.dispatch);
        expect(result).toBeFalsy();
      });

      it('should not replace the media attributes', () => {
        const { editorView, refs } = editor(sourceDocument);
        const replace = replaceExternalMedia(refs.notMediaSelection, {
          id: 'lol',
          collection: 'lol2',
          type: 'file',
        });

        replace(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(sourceDocument);
      });
    });

    describe('when a media node is selected', () => {
      const sourceDocument = doc(
        // prettier-ignore
        p('abc'),
        mediaSingle({ layout: 'center' })(
          '{mediaSelection}',
          media({
            type: 'external',
            url: 'gnu.org',
          })(),
        ),
      );
      const expectedDocument = doc(
        // prettier-ignore
        p('abc'),
        mediaSingle({ layout: 'center' })(
          media({
            type: 'file',
            id: 'lol',
            collection: 'lol2',
          })(),
        ),
      );

      it('should return true', () => {
        const { editorView, refs } = editor(sourceDocument);
        const replace = replaceExternalMedia(refs.mediaSelection, {
          url: 'gnu.org/2',
        });

        const result = replace(editorView.state, editorView.dispatch);
        expect(result).toBeTruthy();
      });

      it('should replace the media attributes', () => {
        const { editorView, refs } = editor(sourceDocument);
        const replace = replaceExternalMedia(refs.mediaSelection, {
          id: 'lol',
          collection: 'lol2',
          type: 'file',
        });

        replace(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(expectedDocument);
      });
    });
  });

  describe('#updateMediaSingleNodeAttrs', () => {
    describe('when the media node is at the same position', () => {
      const sourceDocument = doc(
        // prettier-ignore
        p('abc'),
        mediaSingle({ layout: 'center' })(
          '{mediaSelection}',
          media({
            collection: testCollectionName,
            id: temporaryFileId,
            type: 'file',
          })(),
        ),
      );
      const expectedDocument = doc(
        // prettier-ignore
        p('abc'),
        mediaSingle({ layout: 'center' })(
          media({
            collection: 'lol3',
            id: temporaryFileId,
            type: 'file',
          })(),
        ),
      );

      it('should return true', () => {
        const { editorView } = editor(sourceDocument);
        const update = updateMediaSingleNodeAttrs(temporaryFileId, {
          collection: 'lol3',
        });

        const result = update(editorView.state, editorView.dispatch);
        expect(result).toBeTruthy();
      });

      it('should replace the media attributes', () => {
        const { editorView } = editor(sourceDocument);
        const update = updateMediaSingleNodeAttrs(temporaryFileId, {
          collection: 'lol3',
        });

        update(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(expectedDocument);
      });
    });

    describe('when there is no media node', () => {
      const sourceDocument = doc(
        // prettier-ignore
        p('abc{<>}'),
      );

      it('should return false', () => {
        const { editorView } = editor(sourceDocument);
        const update = updateMediaSingleNodeAttrs(temporaryFileId, {
          collection: 'lol3',
        });

        const result = update(editorView.state, editorView.dispatch);
        expect(result).toBeFalsy();
      });
    });
  });

  describe('#updateCurrentMediaNodeAttrs', () => {
    describe('when the media node is at the same position', () => {
      const sourceDocument = doc(
        // prettier-ignore
        p('abc'),
        mediaGroup(
          media({
            collection: testCollectionName,
            id: temporaryFileId,
            type: 'file',
          })(),
        ),
      );
      const expectedDocument = doc(
        // prettier-ignore
        p('abc'),
        mediaGroup(
          media({
            collection: 'lol3',
            id: temporaryFileId,
            type: 'file',
          })(),
        ),
      );

      it('should replace the media attributes', () => {
        const { editorView } = editor(sourceDocument);
        const node = schema.nodeFromJSON({
          type: 'media',
          attrs: {
            collection: 'lol3',
            id: temporaryFileId,
            type: 'file',
          },
        });

        const getPos = () => 6;
        const mediaNodeWithPos = { node, getPos };
        const update = updateCurrentMediaNodeAttrs(
          { collection: 'lol3' },
          mediaNodeWithPos,
        );

        const result = update(editorView.state, editorView.dispatch);
        expect(result).toBeTruthy();
        expect(editorView.state.doc).toEqualDocument(expectedDocument);
      });

      it('should not replace the media attributes when getPos returns NaN', () => {
        const { editorView } = editor(sourceDocument);
        const dispatchSpy = jest.spyOn(
          editorView,
          'dispatch',
        ) as unknown as CommandDispatch;
        const node = schema.nodeFromJSON({
          type: 'media',
          attrs: {
            collection: 'lol3',
            id: temporaryFileId,
            type: 'file',
          },
        });

        const getPos = () => NaN;
        const mediaNodeWithPos = { node, getPos };
        const update = updateCurrentMediaNodeAttrs(
          { collection: 'lol3' },
          mediaNodeWithPos,
        );

        const result = update(editorView.state, dispatchSpy);
        expect(result).toBeFalsy();
        expect(dispatchSpy).not.toBeCalled();
      });
    });

    it('should not update when there is no media node', () => {
      const sourceDocument = doc(
        // prettier-ignore
        p('abc{<>}'),
      );

      const node = schema.nodeFromJSON({
        type: 'media',
        attrs: {
          collection: 'lol3',
          id: temporaryFileId,
          type: 'file',
        },
      });

      const getPos = () => 1;
      const mediaNodeWithPos = { node, getPos };
      const { editorView } = editor(sourceDocument);
      const dispatchSpy = jest.spyOn(
        editorView,
        'dispatch',
      ) as unknown as CommandDispatch;
      const update = updateCurrentMediaNodeAttrs(
        { collection: 'lol3' },
        mediaNodeWithPos,
      );

      const result = update(editorView.state, dispatchSpy);
      expect(result).toBeFalsy();
      expect(dispatchSpy).not.toBeCalled();
    });
  });

  describe('#isMediaNode', () => {
    describe('should return true', () => {
      it('when the node is a media node', () => {
        const mediaNode = mediaSingle({ layout: 'center' })(
          media({
            id: 'test-id',
            type: 'file',
            collection: 'test-collection',
          })(),
        );

        const defaultMediaDoc = doc(mediaNode)(defaultSchema);
        const editorState = EditorState.create({
          doc: defaultMediaDoc,
          selection: NodeSelection.create(defaultMediaDoc, 0),
        });
        const result = isMediaNode(
          editorState.selection.$anchor.pos + 1,
          editorState,
        );
        expect(result).toBeTruthy();
      });

      it('when the node is a media inline node', () => {
        const mediaInlineNode = mediaInline({
          type: 'file',
          id: 'test-id',
          collection: 'test-collection',
        })();

        const defaultMediaDoc = doc(p(mediaInlineNode))(defaultSchema);
        const editorState = EditorState.create({
          doc: defaultMediaDoc,
          selection: NodeSelection.create(defaultMediaDoc, 0),
        });
        const result = isMediaNode(
          editorState.selection.$anchor.pos + 1,
          editorState,
        );
        expect(result).toBeTruthy();
      });
    });

    describe('should return false', () => {
      it('when the node is not a media node', () => {
        const defaultMediaDoc = doc(p('{<>}text'))(defaultSchema);
        const editorState = EditorState.create({
          doc: defaultMediaDoc,
          selection: NodeSelection.create(defaultMediaDoc, 0),
        });
        const result = isMediaNode(
          editorState.selection.$anchor.pos + 1,
          editorState,
        );
        expect(result).toBeFalsy();
      });
    });
  });
});
