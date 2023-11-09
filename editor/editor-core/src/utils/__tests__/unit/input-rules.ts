import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  ul,
  li,
  mediaSingle,
  media,
  alignment,
  a as link,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { basePlugin } from '@atlaskit/editor-plugin-base';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';

import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';

import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import alignmentPlugin from '../../../plugins/alignment';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { captionPlugin } from '@atlaskit/editor-plugin-caption';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';

import { createWrappingJoinRule } from '@atlaskit/editor-common/utils';

describe('createWrappingJoinRule()', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) => {
    const editorTemp = createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(basePlugin)
        .add(editorDisabledPlugin)
        .add([analyticsPlugin, {}])
        .add(decorationsPlugin)
        .add(listPlugin)
        .add(hyperlinkPlugin)
        .add(alignmentPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(gridPlugin)
        .add(copyButtonPlugin)
        .add(floatingToolbarPlugin)
        .add(focusPlugin)
        .add(captionPlugin)
        .add(selectionPlugin)
        .add([mediaPlugin, { allowMediaSingle: true }]),
    });
    return editorTemp;
  };

  describe('with a mediaSingle node', () => {
    describe('without marks', () => {
      it('should wrap in a list', () => {
        const { editorView } = editor(
          // prettier-ignore
          doc(
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
          ),
        ),
        );
        const {
          state: {
            schema: {
              nodes: { bulletList },
            },
          },
          state,
        } = editorView;
        const { handler } = createWrappingJoinRule({
          match: new RegExp(''),
          nodeType: bulletList,
        });
        const matchResult = /(\w)/.exec('a');
        const tr = handler(state, matchResult!, 1, 1);
        expect(tr!.doc).toEqualDocument(
          // prettier-ignore
          doc(
          ul(
            li(
              mediaSingle()(
                media({
                  id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                  type: 'file',
                  collection: 'MediaServicesSample',
                })(),
              ),
            ),
          ),
        ),
        );
      });
    });
    describe('with a link mark', () => {
      it('should wrap in a list and keep link mark', () => {
        const { editorView } = editor(
          // prettier-ignore
          doc(
            mediaSingle()(
              link({ href: 'http://www.atlassian.com' })(
                media({
                  id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                  type: 'file',
                  collection: 'MediaServicesSample',
                })(),
              ),
            ),
          ),
        );
        const {
          state: {
            schema: {
              nodes: { bulletList },
            },
          },
          state,
        } = editorView;
        const { handler } = createWrappingJoinRule({
          match: new RegExp(''),
          nodeType: bulletList,
        });
        const matchResult = /(\w)/.exec('a');
        const tr = handler(state, matchResult!, 1, 1);
        expect(tr!.doc).toEqualDocument(
          // prettier-ignore
          doc(
          ul(
            li(
                mediaSingle()(
                  link({ href: 'http://www.atlassian.com' })(
                    media({
                      id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                      type: 'file',
                      collection: 'MediaServicesSample',
                    })(),
                  ),
                ),
              ),
            ),
          ),
        );
      });
    });
    describe('with link and alignment marks', () => {
      it('should wrap in a list and remove the alignment mark', () => {
        const { editorView } = editor(
          // prettier-ignore
          doc(
          alignment({ align: 'center' })(
              mediaSingle()(
                link({ href: 'http://www.atlassian.com' })(
                  media({
                    id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                    type: 'file',
                    collection: 'MediaServicesSample',
                  })(),
                ),
              ),
            ),
          ),
        );
        const {
          state: {
            schema: {
              nodes: { bulletList },
            },
          },
          state,
        } = editorView;
        const { handler } = createWrappingJoinRule({
          match: new RegExp(''),
          nodeType: bulletList,
        });
        const matchResult = /(\w)/.exec('a');
        const tr = handler(state, matchResult!, 1, 1);
        expect(tr!.doc).toEqualDocument(
          // prettier-ignore
          doc(
          ul(
            li(
                mediaSingle()(
                  link({ href: 'http://www.atlassian.com' })(
                    media({
                      id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                      type: 'file',
                      collection: 'MediaServicesSample',
                    })(),
                  ),
                ),
              ),
            ),
          ),
        );
      });
    });
  });
});
