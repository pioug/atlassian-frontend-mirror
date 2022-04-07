import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  h1,
  ul,
  li,
  mention,
  code_block,
  panel,
  DocBuilder,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';
import { insertMediaInlineNode } from '../../../../plugins/media/utils/media-files';
import { setNodeSelection } from '../../../../utils';
import {
  testCollectionName,
  temporaryFileId,
  temporaryMediaInline,
  getFreshMediaProvider,
} from './_utils';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

describe('media-inline', () => {
  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();
  const mediaProvider = getFreshMediaProvider();
  providerFactory.setProvider('mediaProvider', mediaProvider);

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        media: {
          allowMediaSingle: true,
          featureFlags: {
            mediaInline: true,
          },
        },
        allowLayouts: true,
        mentionProvider: Promise.resolve(new MockMentionResource({})),
        allowPanel: true,
      },
      providerFactory,
    });

  describe('when cursor is at the end of a text block', () => {
    it('inserts media inline node into the document inside current paragraph node', () => {
      const { editorView } = editor(doc(p('text{<>}')));

      insertMediaInlineNode(
        editorView,
        { id: temporaryFileId },
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p('text', temporaryMediaInline, ' ')),
      );
    });

    it('puts cursor to the next text space after inserting media inline node', () => {
      const { editorView } = editor(doc(p('text{<>}')));

      insertMediaInlineNode(
        editorView,
        { id: temporaryFileId },
        testCollectionName,
      );

      const paragraphNodeSize = p('text')(editorView.state.schema).nodeSize;
      const mediaInlineNodeSize = temporaryMediaInline(editorView.state.schema)
        .nodeSize;
      expect(editorView.state.selection.from).toEqual(
        paragraphNodeSize + mediaInlineNodeSize,
      );
    });
  });

  describe('when cursor is at the beginning of a text block', () => {
    it('should prepend media inline node to paragraph', () => {
      const { editorView } = editor(doc(p('{<>}text')));

      insertMediaInlineNode(
        editorView,
        { id: temporaryFileId },
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(temporaryMediaInline, ' text')),
      );
    });
  });

  describe('when cursor is in the middle of a text block', () => {
    describe('when inside a paragraph', () => {
      it('splits text', () => {
        const { editorView } = editor(doc(p('te{<>}xt')));

        insertMediaInlineNode(
          editorView,
          { id: temporaryFileId },
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(p('te', temporaryMediaInline, ' xt')),
        );
      });

      it('moves cursor to the front of later part of the text', () => {
        const { editorView } = editor(doc(p('te{<>}xt')));

        const paragraphNodeSize = p('te')(editorView.state.schema).nodeSize;
        const mediaInlineNodeSize = temporaryMediaInline(
          editorView.state.schema,
        ).nodeSize;

        insertMediaInlineNode(
          editorView,
          { id: temporaryFileId },
          testCollectionName,
        );

        expect(editorView.state.selection.from).toEqual(
          paragraphNodeSize + mediaInlineNodeSize,
        );
      });
    });

    describe('when inside a heading', () => {
      it('preserves heading', () => {
        const { editorView } = editor(doc(h1('te{<>}xt')));

        insertMediaInlineNode(
          editorView,
          { id: temporaryFileId },
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(h1('te', temporaryMediaInline, ' xt')),
        );
      });
    });
  });

  describe('when selection is not empty', () => {
    describe('when selection is a text', () => {
      describe('when selection is in the middle of the text block', () => {
        it('replaces selection with a media node', () => {
          const { editorView } = editor(doc(p('te{<}x{>}t')));

          insertMediaInlineNode(
            editorView,
            { id: temporaryFileId },
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(p('te', temporaryMediaInline, ' t')),
          );
        });
      });

      describe('when selection covers the whole text block', () => {
        describe('when inside a heading', () => {
          it('replaces selection with a media inline node', () => {
            const { editorView } = editor(doc(h1('{<}text{>}')));

            insertMediaInlineNode(
              editorView,
              { id: temporaryFileId },
              testCollectionName,
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(h1(temporaryMediaInline, ' ')),
            );
          });
        });
      });

      describe('when selection is at the end of the text block', () => {
        it('replaces selection with a media inline node', () => {
          const { editorView } = editor(doc(p('te{<}xt{>}')));

          insertMediaInlineNode(
            editorView,
            { id: temporaryFileId },
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(p('te', temporaryMediaInline, ' ')),
          );
        });
      });
    });

    describe('when selection is a node', () => {
      describe('when selection is an inline node', () => {
        it('replaces selection with a media inline node', () => {
          const { editorView, sel } = editor(
            doc(p('text{<>}', mention({ id: 'foo1', text: '@bar1' })())),
          );
          setNodeSelection(editorView, sel);

          insertMediaInlineNode(
            editorView,
            { id: temporaryFileId },
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(p('text', temporaryMediaInline, ' ')),
          );
        });
      });
    });

    describe('when selection is at the beginning of the text block', () => {
      it('replaces selection with a media inline node', () => {
        const { editorView } = editor(doc(p('{<}te{>}xt')));

        insertMediaInlineNode(
          editorView,
          { id: temporaryFileId },
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(p(temporaryMediaInline, ' xt')),
        );
      });
    });
  });

  it(`should insert media inline node into the document after current heading node`, () => {
    const { editorView } = editor(doc(h1('text{<>}')));

    insertMediaInlineNode(
      editorView,
      { id: temporaryFileId },
      testCollectionName,
    );

    expect(editorView.state.doc).toEqualDocument(
      doc(h1('text', temporaryMediaInline, ' ')),
    );
  });

  it(`should insert media inline node into the document after current codeblock node`, () => {
    const { editorView } = editor(doc(code_block()('text{<>}')));

    insertMediaInlineNode(
      editorView,
      { id: temporaryFileId },
      testCollectionName,
    );

    expect(editorView.state.doc).toEqualDocument(
      doc(code_block()('text'), p(temporaryMediaInline, ' ')),
    );
  });

  describe('when selections is inside panel', () => {
    it('should append media inline inside panel', () => {
      const panelDoc = doc(panel({})(p('text{<>}')));
      const { editorView } = editor(panelDoc);
      insertMediaInlineNode(
        editorView,
        { id: temporaryFileId },
        testCollectionName,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(panel({})(p('text', temporaryMediaInline, ' '))),
      );
    });
  });

  describe('when selection is inside a listItem', () => {
    it('should insert media inline inside empty listItem', () => {
      const { editorView } = editor(doc(ul(li(p('{<>}')))));
      insertMediaInlineNode(
        editorView,
        { id: temporaryFileId },
        testCollectionName,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p(temporaryMediaInline, ' ')))),
      );
    });

    it('should append media inline inside listItem', () => {
      const { editorView } = editor(doc(ul(li(p('text{<>}')))));
      insertMediaInlineNode(
        editorView,
        { id: temporaryFileId },
        testCollectionName,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('text', temporaryMediaInline, ' ')))),
      );
    });
  });

  describe('when copying a mediaSingle from the renderer', () => {
    it('pasted image is converted to a mediaSingle', async () => {
      const { editorView } = editor(doc(p('')));
      dispatchPasteEvent(editorView, {
        html: `<img data-testid="media-image" draggable="false" alt="" src="blob:http://localhost:9000/de35f964-a447-4465-b3f6-ecda383ecfbf#media-blob-url=true&amp;id=260c4805-59dc-403e-a5ff-bcf14205dcb7&amp;collection=MediaServicesSample&amp;contextId=DUMMY-OBJECT-ID&amp;mimeType=image%2Fjpeg&amp;name=placeimg_640_480_animals%20(1).jpg&amp;size=200779&amp;height=480&amp;width=640&amp;alt=" style="position: absolute; left: 50%; top: 50%; object-fit: contain; image-orientation: none; transform: translate(-50%, -50%); height: 100%;">`,
        types: ['Files', 'text/html'],
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaSingle({ layout: 'center' })(
            media({
              type: 'external',
              url:
                'blob:http://localhost:9000/de35f964-a447-4465-b3f6-ecda383ecfbf#media-blob-url=true&id=260c4805-59dc-403e-a5ff-bcf14205dcb7&collection=MediaServicesSample&contextId=DUMMY-OBJECT-ID&mimeType=image%2Fjpeg&name=placeimg_640_480_animals%20(1).jpg&size=200779&height=480&width=640&alt=',
              alt: '',
              __external: true,
            })(),
          ),
        ),
      );
    });
  });
});
