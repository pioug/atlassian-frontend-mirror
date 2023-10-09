import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import type { Options as CreateEditorOptions } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  media,
  mediaSingle,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  openMediaAltTextMenu,
  updateAltText,
} from '../../../pm-plugins/alt-text/commands';
import { pluginKey as mediaEditorPluginKey } from '../../../pm-plugins/media-editor-plugin-factory';
import type { MediaEditorState } from '../../../types';
import { getFreshMediaProvider } from '../_utils';

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

        updateAltText('lol')(editorView.state, tr => {
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
        const attachAnalyticsEvent = jest
          .fn()
          .mockImplementation(() => () => {});
        const mockEditorAnalyticsAPI: EditorAnalyticsAPI = {
          attachAnalyticsEvent,
        };
        it('fires analytics event', () => {
          const { editorView } = editor(defaultDoc);

          openMediaAltTextMenu(mockEditorAnalyticsAPI)(
            editorView.state,
            editorView.dispatch,
          );
          expect(attachAnalyticsEvent).toHaveBeenCalledWith(
            {
              action: ACTION.OPENED,
              actionSubject: ACTION_SUBJECT.MEDIA,
              actionSubjectId: ACTION_SUBJECT_ID.ALT_TEXT,
              eventType: EVENT_TYPE.TRACK,
            },
            undefined,
          );
        });

        it('should set meta attribute scrollIntoView to false', () => {
          const { editorView } = editor(defaultDoc);

          openMediaAltTextMenu(mockEditorAnalyticsAPI)(editorView.state, tr => {
            expect(tr.getMeta('scrollIntoView')).toBeFalsy();
            editorView.dispatch(tr);
          });
        });
      });
    });
  });
});
