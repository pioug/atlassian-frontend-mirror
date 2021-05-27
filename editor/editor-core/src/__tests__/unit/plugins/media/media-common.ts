import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import randomId from '@atlaskit/editor-test-helpers/random-id';
import {
  doc,
  mediaGroup,
  mediaSingle,
  media,
  p,
  hr,
  mention,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { undo } from 'prosemirror-history';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers/fakeMediaClient';
import { ProviderFactory } from '@atlaskit/editor-common';
import { setNodeSelection } from '../../../../utils';
import {
  removeMediaNode,
  splitMediaGroup,
  getMediaNodeFromSelection,
} from '../../../../plugins/media/utils/media-common';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

describe('media-common', () => {
  const createEditor = createEditorFactory();
  const mediaProvider = Promise.resolve({
    viewMediaClientConfig: getDefaultMediaClientConfig(),
  });
  const providerFactory = ProviderFactory.create({
    mediaProvider,
  });

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        media: {
          allowMediaSingle: true,
        },
        mentionProvider: Promise.resolve(new MockMentionResource({})),
        allowRule: true,
      },
      providerFactory,
    });

  describe('removeMediaNode', () => {
    describe('media node is selected', () => {
      const temporaryFileId = `temporary:${randomId()}`;

      describe('when it is a temporary file', () => {
        const deletingMediaNodeId = temporaryFileId;
        const deletingMediaNode = media({
          id: deletingMediaNodeId,
          type: 'file',
          collection: testCollectionName,
        })();

        it('removes the media node', () => {
          const { editorView, sel } = editor(
            doc(
              p('hello{<>}'),
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                deletingMediaNode,
              ),
            ),
          );
          const positionOfDeletingNode = sel + 3;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(
            editorView,
            deletingMediaNode(editorView.state.schema),
            () => positionOfDeletingNode,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );
        });

        it('is not able to undo', () => {
          const { editorView, sel } = editor(
            doc(
              p('hello{<>}'),
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                deletingMediaNode,
              ),
            ),
          );
          const positionOfDeletingNode = sel + 3;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(
            editorView,
            deletingMediaNode(editorView.state.schema),
            () => positionOfDeletingNode,
          );

          undo(editorView.state, editorView.dispatch);

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );
        });
      });

      describe('when it is uploaded', () => {
        const deletingMediaNodeId = 'media2';
        const deletingMediaNode = media({
          id: deletingMediaNodeId,
          type: 'file',
          collection: testCollectionName,
        })();

        it('removes the media node', () => {
          const { editorView, sel } = editor(
            doc(
              p('hello{<>}'),
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                deletingMediaNode,
              ),
            ),
          );
          const positionOfDeletingNode = sel + 3;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(
            editorView,
            deletingMediaNode(editorView.state.schema),
            () => positionOfDeletingNode,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );
        });

        it('is able to undo', () => {
          const { editorView, sel } = editor(
            doc(
              p('hello{<>}'),
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                deletingMediaNode,
              ),
            ),
          );
          const positionOfDeletingNode = sel + 3;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(
            editorView,
            deletingMediaNode(editorView.state.schema),
            () => positionOfDeletingNode,
          );
          undo(editorView.state, editorView.dispatch);

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                deletingMediaNode,
              ),
            ),
          );
        });
      });

      describe('when selected node is the first media node', () => {
        describe('when it is not at the beginning of the document', () => {
          it('selects the media node to the back', () => {
            const deletingMediaNode = media({
              id: 'media1',
              type: 'file',
              collection: testCollectionName,
            })();
            const { editorView } = editor(
              doc(
                p('hello'),
                mediaGroup(
                  '{<node>}',
                  deletingMediaNode,
                  media({
                    id: 'media2',
                    type: 'file',
                    collection: testCollectionName,
                  })(),
                  media({
                    id: 'media3',
                    type: 'file',
                    collection: testCollectionName,
                  })(),
                ),
                p('world'),
              ),
            );

            const sel = editorView.state.selection.from;
            removeMediaNode(
              editorView,
              deletingMediaNode(editorView.state.schema),
              () => editorView.state.selection.from,
            );

            expect(editorView.state.selection.from).toEqual(sel);
          });
        });

        describe('when it is at the beginning of the document', () => {
          it('selects the media node to the back', () => {
            const deletingMediaNode = media({
              id: 'media1',
              type: 'file',
              collection: testCollectionName,
            })();
            const { editorView } = editor(
              doc(
                mediaGroup(
                  deletingMediaNode,
                  media({
                    id: 'media2',
                    type: 'file',
                    collection: testCollectionName,
                  })(),
                  media({
                    id: 'media3',
                    type: 'file',
                    collection: testCollectionName,
                  })(),
                ),
                p('hello'),
              ),
            );
            const positionOfDeletingNode = 1;
            setNodeSelection(editorView, positionOfDeletingNode);

            removeMediaNode(
              editorView,
              deletingMediaNode(editorView.state.schema),
              () => positionOfDeletingNode,
            );

            const selectedNode = (editorView.state.selection as NodeSelection)
              .node;
            expect(selectedNode && selectedNode.attrs.id).toEqual('media2');
          });
        });
      });

      describe('when selected node is the middle media node', () => {
        it('selects the media node in the front', () => {
          const deletingMediaNode = media({
            id: 'media2',
            type: 'file',
            collection: testCollectionName,
          })();
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                deletingMediaNode,
                media({
                  id: 'media3',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );
          const positionOfDeletingNode = 2;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(
            editorView,
            deletingMediaNode(editorView.state.schema),
            () => positionOfDeletingNode,
          );

          const selectedNode = (editorView.state.selection as NodeSelection)
            .node;

          expect(selectedNode && selectedNode.attrs.id).toEqual('media1');
        });
      });

      describe('when selected node and deleting node is not the same node', () => {
        it('does not change selection', () => {
          const deletingMediaNode = media({
            id: 'media2',
            type: 'file',
            collection: testCollectionName,
          })();
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                deletingMediaNode,
                media({
                  id: 'media3',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );
          const positionOfDeletingNode = 2;
          setNodeSelection(editorView, positionOfDeletingNode + 1);

          removeMediaNode(
            editorView,
            deletingMediaNode(editorView.state.schema),
            () => positionOfDeletingNode,
          );

          const selectedNode = (editorView.state.selection as NodeSelection)
            .node;

          expect(selectedNode && selectedNode.attrs.id).toEqual('media3');
        });

        it('removes the node', () => {
          const deletingMediaNode = media({
            id: 'media2',
            type: 'file',
            collection: testCollectionName,
          })();
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                deletingMediaNode,
                media({
                  id: 'media3',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );
          const positionOfDeletingNode = 2;
          setNodeSelection(editorView, positionOfDeletingNode + 1);

          removeMediaNode(
            editorView,
            deletingMediaNode(editorView.state.schema),
            () => positionOfDeletingNode,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media3',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );
        });
      });

      describe('when selected node is the last media node', () => {
        it('selects the media node in the front', () => {
          const deletingMediaNode = media({
            id: 'media3',
            type: 'file',
            collection: testCollectionName,
          })();
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media2',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                deletingMediaNode,
              ),
            ),
          );
          const positionOfDeletingNode = 3;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(
            editorView,
            deletingMediaNode(editorView.state.schema),
            () => positionOfDeletingNode,
          );

          const selectedNode = (editorView.state.selection as NodeSelection)
            .node;

          expect(selectedNode && selectedNode.attrs.id).toEqual('media2');
        });
      });

      describe('when selected node is the only media node', () => {
        describe('when it is not at the beginning of the document', () => {
          it('puts cursor to the beginging of the paragraph that replaced the media group', () => {
            const deletingMediaNode = media({
              id: 'media',
              type: 'file',
              collection: testCollectionName,
            })();
            const { editorView } = editor(
              doc(p('hello'), mediaGroup(deletingMediaNode), p('world')),
            );

            const positionOfDeletingNode =
              p('hello')(editorView.state.schema).nodeSize + 1;
            setNodeSelection(editorView, positionOfDeletingNode);

            removeMediaNode(
              editorView,
              deletingMediaNode(editorView.state.schema),
              () => positionOfDeletingNode,
            );

            expect(editorView.state.selection instanceof TextSelection).toBe(
              true,
            );
            expect(editorView.state.selection.from).toEqual(
              positionOfDeletingNode,
            );
          });
        });

        describe('when it is at the beginning of the document', () => {
          it('puts cursor to the beginning of the document', () => {
            const deletingMediaNode = media({
              id: 'media',
              type: 'file',
              collection: testCollectionName,
            })();
            const { editorView } = editor(
              doc(mediaGroup(deletingMediaNode), p('hello')),
            );

            const positionOfDeletingNode = 1;
            setNodeSelection(editorView, positionOfDeletingNode);

            removeMediaNode(
              editorView,
              deletingMediaNode(editorView.state.schema),
              () => positionOfDeletingNode,
            );

            expect(editorView.state.selection instanceof TextSelection).toBe(
              true,
            );
            expect(editorView.state.selection.from).toEqual(
              positionOfDeletingNode,
            );
          });
        });
      });
    });
  });

  describe('#getMediaNodeFromSelection', () => {
    describe('when selection is not a  media node', () => {
      it('returns null', () => {
        const { editorView } = editor(
          doc(
            p('H {<>} i'),
            mediaSingle({
              layout: 'align-start',
            })(
              media({
                id: 'abc',
                type: 'file',
                collection: 'xyz',
              })(),
            ),
          ),
        );

        const result = getMediaNodeFromSelection(editorView.state);
        expect(result).toBeNull();
      });
    });
    describe('when selection is a media node', () => {
      it('returns the media node', () => {
        const partialMedia = media({
          id: 'abc',
          type: 'file',
          collection: 'xyz',
        })();
        const { editorView } = editor(
          doc(
            '{<node>}',
            mediaSingle({
              layout: 'align-start',
            })(partialMedia),
          ),
        );

        const result = getMediaNodeFromSelection(editorView.state);

        expect(result).toStrictEqual(partialMedia(editorView.state.schema));
      });
    });
  });

  describe('splitMediaGroup', () => {
    describe('when selection is a media node', () => {
      it('returns true', () => {
        const { editorView } = editor(
          doc(
            mediaGroup(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('text'),
          ),
        );
        const positionOfFirstMediaNode = 1;
        setNodeSelection(editorView, positionOfFirstMediaNode);

        const result = splitMediaGroup(editorView);

        expect(result).toBe(true);
      });

      describe('when media node is the first one in media group', () => {
        it('removes the selected media node and insert a new p', () => {
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media2',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media3',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('text'),
            ),
          );
          const positionOfFirstMediaNode = 1;
          setNodeSelection(editorView, positionOfFirstMediaNode);

          splitMediaGroup(editorView);

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(),
              mediaGroup(
                media({
                  id: 'media2',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media3',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('text'),
            ),
          );
        });
      });

      describe('when media node in the middle of a media group', () => {
        it('removes the selected media node and insert a new p', () => {
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media2',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media3',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('text'),
            ),
          );
          const positionOfMiddleMediaNode = 2;
          setNodeSelection(editorView, positionOfMiddleMediaNode);

          splitMediaGroup(editorView);

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p(),
              mediaGroup(
                media({
                  id: 'media3',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('text'),
            ),
          );
        });
      });

      describe('when media node is the last one in the media group', () => {
        it('removes the selected media node', () => {
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media2',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media3',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('text'),
            ),
          );
          const positionOfLastMediaNode = 3;
          setNodeSelection(editorView, positionOfLastMediaNode);

          splitMediaGroup(editorView);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media2',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('text'),
            ),
          );
        });

        it('removes the selected media node (without last paragraph)', () => {
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media2',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media3',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );

          setNodeSelection(editorView, 3);
          splitMediaGroup(editorView);

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaGroup(
                media({
                  id: 'media1',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'media2',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p(),
            ),
          );
        });
      });

      describe('when media node is the only one in the media group', () => {
        it('removes the whole media group', () => {
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: 'media',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('text'),
            ),
          );
          const positionOfMiddleMediaNode = 1;
          setNodeSelection(editorView, positionOfMiddleMediaNode);

          splitMediaGroup(editorView);

          expect(editorView.state.doc).toEqualDocument(doc(p('text')));
        });
      });
    });

    describe('when is text selection', () => {
      it('returns false', () => {
        const { editorView } = editor(
          doc(
            p('hello{<>}'),
            mediaGroup(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('text'),
          ),
        );

        const result = splitMediaGroup(editorView);

        expect(result).toBe(false);
      });

      it('does nothing', () => {
        const { editorView } = editor(
          doc(
            p('hello'),
            mediaGroup(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('te{<>}xt'),
          ),
        );

        splitMediaGroup(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('hello'),
            mediaGroup(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('text'),
          ),
        );
      });
    });

    describe('when is non media node selection', () => {
      it('returns false', () => {
        const { editorView } = editor(
          doc(
            hr(),
            mediaGroup(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('text'),
          ),
        );
        setNodeSelection(editorView, 0);

        const result = splitMediaGroup(editorView);

        expect(result).toBe(false);
      });

      it('does nothing', () => {
        const { editorView } = editor(
          doc(
            p(mention({ id: 'foo1', text: '@bar1' })()),
            mediaGroup(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('text'),
          ),
        );
        setNodeSelection(editorView, 1);

        splitMediaGroup(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(mention({ id: 'foo1', text: '@bar1' })()),
            mediaGroup(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('text'),
          ),
        );
      });
    });
  });
});
