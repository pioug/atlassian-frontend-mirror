import {
  createEditorFactory,
  Options as CreateEditorOptions,
} from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  mediaSingle,
  media,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  updateAltText,
  openMediaAltTextMenu,
} from '../../../../plugins/media/pm-plugins/alt-text/commands';
import { getFreshMediaProvider } from '../media/_utils';
import { pluginKey as mediaEditorPluginKey } from '../../../../plugins/media/pm-plugins/media-editor-plugin-factory';

import { MediaEditorState } from '../../../../plugins/media/types';
import {
  EVENT_TYPE,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
} from '../../../../plugins/analytics';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

describe('commands', () => {
  const createEditor = createEditorFactory<MediaEditorState>();
  const mediaProvider = getFreshMediaProvider();
  let createAnalyticsEvent: CreateUIAnalyticsEvent = jest.fn(
    () => ({ fire() {} } as UIAnalyticsEvent),
  );

  const editor = (
    doc: DocBuilder,
    createEditorOptions?: CreateEditorOptions,
  ) => {
    return createEditor({
      ...createEditorOptions,
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        media: {
          allowAnnotation: true,
          allowMediaSingle: true,
          allowAltTextOnImages: true,
          provider: mediaProvider,
        },
      },
      createAnalyticsEvent,
      pluginKey: mediaEditorPluginKey,
    });
  };

  describe('#updateAltText', () => {
    const defaultDoc = doc(
      '{<node>}',
      mediaSingle({
        layout: 'align-start',
      })(
        media({
          id: 'abc',
          type: 'file',
          collection: 'xyz',
        })(),
      ),
    );

    describe('when media is not selected', () => {
      const notSelectedMedia = doc(
        p('Nothing {<>}here'),
        mediaSingle({
          layout: 'align-start',
        })(
          media({
            id: 'abc',
            type: 'file',
            collection: 'xyz',
          })(),
        ),
      );
      it('should returns false', () => {
        const { editorView } = editor(notSelectedMedia);

        expect(
          updateAltText('')(editorView.state, editorView.dispatch),
        ).toBeFalsy();
      });
    });

    describe('when media is selected', () => {
      describe('when the new value is null', () => {
        it('should update the node attribute', () => {
          const { editorView } = editor(defaultDoc);

          updateAltText('')(editorView.state, editorView.dispatch);

          expect(editorView.state.doc).toEqualDocument(
            doc(
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
        });
      });

      it('should set meta attribute scrollIntoView to false', () => {
        const { editorView } = editor(defaultDoc);

        updateAltText('lol')(editorView.state, (tr) => {
          expect(tr.getMeta('scrollIntoView')).toBeFalsy();
          editorView.dispatch(tr);
        });
      });

      it('should update the node attribute', () => {
        const { editorView } = editor(defaultDoc);

        updateAltText('lol')(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaSingle({
              layout: 'align-start',
            })(
              media({
                id: 'abc',
                type: 'file',
                collection: 'xyz',
                alt: 'lol',
              })(),
            ),
          ),
        );
      });

      describe('when alt text edit popup is opened', () => {
        it('fires analytics event', () => {
          const { editorView } = editor(defaultDoc);
          openMediaAltTextMenu(editorView.state, editorView.dispatch);
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: ACTION.OPENED,
            actionSubject: ACTION_SUBJECT.MEDIA,
            actionSubjectId: ACTION_SUBJECT_ID.ALT_TEXT,
            eventType: EVENT_TYPE.TRACK,
          });
        });

        it('should set meta attribute scrollIntoView to false', () => {
          const { editorView } = editor(defaultDoc);

          openMediaAltTextMenu(editorView.state, (tr) => {
            expect(tr.getMeta('scrollIntoView')).toBeFalsy();
            editorView.dispatch(tr);
          });
        });
      });
    });
  });
});
