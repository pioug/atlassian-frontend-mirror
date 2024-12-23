import type { DocBuilder } from '@atlaskit/editor-common/types';
import { createWrappingJoinRule } from '@atlaskit/editor-common/utils';
import { annotationPlugin } from '@atlaskit/editor-plugin-annotation';
import { alignmentPlugin } from '@atlaskit/editor-plugins/alignment';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { captionPlugin } from '@atlaskit/editor-plugins/caption';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { featureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { hyperlinkPlugin } from '@atlaskit/editor-plugins/hyperlink';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { mediaPlugin } from '@atlaskit/editor-plugins/media';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import { inlineCommentProvider } from '@atlaskit/editor-test-helpers/annotation';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	createProsemirrorEditorFactory,
	Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	alignment,
	doc,
	li,
	a as link,
	media,
	mediaSingle,
	ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

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
				.add([annotationPlugin, { inlineComment: { ...inlineCommentProvider } }])
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
					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					match: new RegExp(''),
					nodeType: bulletList,
				});
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
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
					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					match: new RegExp(''),
					nodeType: bulletList,
				});
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
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
					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					match: new RegExp(''),
					nodeType: bulletList,
				});
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
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
