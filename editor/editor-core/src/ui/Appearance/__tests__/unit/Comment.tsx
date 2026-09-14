/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import React from 'react';

import { matchers } from '@emotion/jest';
import { act, fireEvent, type RenderResult } from '@testing-library/react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import type { MediaOptions } from '@atlaskit/editor-plugins/media/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { sleep } from '@atlaskit/editor-test-helpers/sleep';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers/fakeMediaClient';

import EditorActions from '../../../../actions';
import EditorContext from '../../../EditorContext';
import { CommentEditorWithIntl as Comment } from '../../Comment/Comment';

expect.extend(matchers);

describe('comment editor', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const createEditor = createEditorFactory();

	const editor = (doc: DocBuilder) =>
		createEditor({
			doc,
			editorProps: { allowExtension: true },
		});
	it('should create empty terminal empty paragraph when clicked outside editor', () => {
		const { editorView } = editor(doc(p('Hello world'), p('Hello world')));
		const fullPage = renderWithIntl(
			<Comment
				editorAPI={undefined}
				editorView={editorView}
				providerFactory={{} as any}
				editorDOMElement={<div />}
				featureFlags={{}}
			/>,
		);

		fireEvent.mouseDown(fullPage.getByTestId('click-wrapper'), { clientY: 200 });
		expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('Hello world'), p('')));
	});

	it('should not create empty terminal empty paragraph if it is already present at end', () => {
		const { editorView } = editor(doc(p('Hello world'), p('')));
		const fullPage = renderWithIntl(
			<Comment
				editorAPI={undefined}
				editorView={editorView}
				providerFactory={{} as any}
				editorDOMElement={<div />}
				featureFlags={{}}
			/>,
		);
		fireEvent.click(fullPage.getByTestId('click-wrapper'), { clientY: 200 });
		fireEvent.click(fullPage.getByTestId('click-wrapper'), { clientY: 200 });
		expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('')));
	});

	it('should not create empty terminal paragraph when clicked inside editor', () => {
		const { editorView } = editor(doc(p('Hello world')));
		const fullPage = renderWithIntl(
			<Comment
				editorAPI={undefined}
				editorView={editorView}
				providerFactory={{} as any}
				editorDOMElement={<div />}
				featureFlags={{}}
			/>,
		);

		fireEvent.click(fullPage.container.querySelector('div.ak-editor-content-area')!);

		expect(editorView.state.doc).toEqualDocument(doc(p('Hello world')));
	});

	describe('with media', () => {
		const mediaProvider = Promise.resolve({
			viewMediaClientConfig: getDefaultMediaClientConfig(),
		});
		const providerFactory = ProviderFactory.create({
			mediaProvider,
		});

		function getSaveButton(rendered: RenderResult) {
			return rendered.getByTestId('comment-save-button');
		}

		it('should not be disabled when mediaPluginState.allowUploadFinished is false', async () => {
			const { editorView, eventDispatcher, editorAPI } = createEditor({
				doc: doc(p('')),
				providerFactory,
				editorProps: {
					allowExtension: true,
					media: { allowMediaSingle: true },
					appearance: 'comment',
				},
			});

			const comment = renderWithIntl(
				<EditorContext editorActions={EditorActions.from(editorView, eventDispatcher)}>
					<Comment
						editorAPI={undefined}
						onSave={jest.fn()}
						editorView={editorView}
						providerFactory={providerFactory}
						editorDOMElement={<div />}
						featureFlags={{}}
					/>
				</EditorContext>,
			);
			const mediaPluginState = editorAPI?.media?.sharedState.currentState();

			await act(async () => {
				mediaPluginState?.updateAndDispatch({
					allUploadsFinished: false,
				});
				await sleep(0);

				mediaPluginState?.updateAndDispatch({
					allUploadsFinished: true,
				});
				await sleep(0);
			});

			expect(getSaveButton(comment)).not.toBeDisabled();
		});

		it('should not be remain disabled when disabled prop has been updated', async () => {
			const { editorView, eventDispatcher } = createEditor({
				doc: doc(p('')),
				providerFactory,
				editorProps: {
					allowExtension: true,
					media: { allowMediaSingle: true },
					appearance: 'comment',
				},
			});

			const EditorComment = ({ disabled = true }) => (
				<EditorContext editorActions={EditorActions.from(editorView, eventDispatcher)}>
					<Comment
						editorAPI={undefined}
						onSave={jest.fn()}
						editorView={editorView}
						providerFactory={providerFactory}
						editorDOMElement={<div />}
						featureFlags={{}}
						disabled={disabled}
					/>
				</EditorContext>
			);
			const comment = renderWithIntl(<EditorComment disabled={true} />);
			comment.rerender(<EditorComment disabled={false} />);

			// save button should not be disabled
			expect(getSaveButton(comment)).not.toBeDisabled();
		});

		it('should set up required media options for Comment Editor', () => {
			const { editorAPI } = createEditor({
				doc: doc(p('')),
				providerFactory,
				editorProps: {
					allowExtension: true,
					media: { allowMediaSingle: true },
					appearance: 'comment',
				},
			});

			const mediaPluginState = editorAPI?.media?.sharedState.currentState();
			expect(mediaPluginState?.mediaOptions).toBeDefined();

			const { allowAdvancedToolBarOptions, alignLeftOnInsert } =
				mediaPluginState?.mediaOptions as MediaOptions;
			expect(alignLeftOnInsert).toBe(true);
			expect(allowAdvancedToolBarOptions).toBe(true);
		});
	});
	describe('secondary toolbar', () => {
		it('should render the secondary toolbar if there is a save button', () => {
			const { editorView } = editor(doc(p('Hello world')));
			const fullPage = renderWithIntl(
				<Comment
					editorAPI={undefined}
					editorView={editorView}
					onSave={true as any}
					providerFactory={{} as any}
					editorDOMElement={<div />}
					featureFlags={{}}
				/>,
			);
			fireEvent.click(fullPage.container.querySelector('div.ak-editor-content-area')!);
			expect(fullPage.getByTestId('ak-editor-secondary-toolbar')).toBeInTheDocument();
		});
		it('should render the secondary toolbar if there is a cancel button', () => {
			const { editorView } = editor(doc(p('Hello world')));
			const fullPage = renderWithIntl(
				<Comment
					editorAPI={undefined}
					editorView={editorView}
					onCancel={true as any}
					providerFactory={{} as any}
					editorDOMElement={<div />}
					featureFlags={{}}
				/>,
			);
			fireEvent.click(fullPage.container.querySelector('div.ak-editor-content-area')!);

			expect(fullPage.getByTestId('ak-editor-secondary-toolbar')).toBeInTheDocument();
		});
		it('should render the secondary toolbar if there is a custom secondary toolbar button', () => {
			const { editorView } = editor(doc(p('Hello world')));
			const fullPage = renderWithIntl(
				<Comment
					editorAPI={undefined}
					editorView={editorView}
					customSecondaryToolbarComponents={true as any}
					providerFactory={{} as any}
					editorDOMElement={<div />}
					featureFlags={{}}
				/>,
			);
			fireEvent.click(fullPage.container.querySelector('div.ak-editor-content-area')!);
			expect(fullPage.getByTestId('ak-editor-secondary-toolbar')).toBeInTheDocument();
		});
		it('should not render the secondary toolbar if there is no save, cancel or custom button', () => {
			const { editorView } = editor(doc(p('Hello world')));
			const fullPage = renderWithIntl(
				<Comment
					editorAPI={undefined}
					editorView={editorView}
					providerFactory={{} as any}
					editorDOMElement={<div />}
					featureFlags={{}}
				/>,
			);
			fireEvent.click(fullPage.container.querySelector('div.ak-editor-content-area')!);
			expect(fullPage.queryByTestId('ak-editor-secondary-toolbar')).not.toBeInTheDocument();
		});

		describe('comment toolbar shortcuts', () => {
			beforeAll(() => {
				// scrollIntoView is not available in jsdom so need to mock it https://github.com/jsdom/jsdom/issues/1695
				window.HTMLElement.prototype.scrollIntoView = jest.fn();
			});

			it('focuses editor on ESC', () => {
				const { editorView, commentComponent } = mountCommentWithToolbarButton();
				const editorFocusSpy = jest.spyOn(editorView, 'focus');

				const toolbarClickWrappers = commentComponent.container.querySelectorAll(
					'.custom-key-handler-wrapper',
				);
				const toolbarClickWrapper = toolbarClickWrappers[toolbarClickWrappers.length - 1];
				fireEvent.keyDown(toolbarClickWrapper, { key: 'Escape' });
				expect(editorFocusSpy).toHaveBeenCalled();
			});

			it('focuses toolbar on alt + F9', () => {
				const { editorView, commentComponent } = mountCommentWithToolbarButton();
				const customButtons = commentComponent.getAllByTestId('custom-button');
				const buttonElement = customButtons.at(-1);
				expect(buttonElement).toBeDefined();

				const buttonFocusSpy = jest.spyOn(buttonElement!, 'focus');
				const buttonScrollSpy = jest.spyOn(buttonElement!, 'scrollIntoView');

				fireEvent.keyDown(editorView.dom, {
					key: 'F9',
					keyCode: 120,
					altKey: true,
				});
				expect(buttonFocusSpy).toHaveBeenCalled();
				expect(buttonScrollSpy).toHaveBeenCalled();
			});

			function mountCommentWithToolbarButton() {
				const { editorView } = editor(doc(p('Hello world')));
				const commentComponent = renderWithIntl(
					<Comment
						editorAPI={undefined}
						editorView={editorView}
						providerFactory={{} as any}
						editorDOMElement={<div />}
						primaryToolbarComponents={[() => <button data-testid="custom-button">Test</button>]}
						featureFlags={{}}
					/>,
				);
				return { editorView, commentComponent };
			}
		});
	});

	describe('sticky toolbar styles', () => {
		it('should render sticky toolbar with correct styles', () => {
			const fullPage = renderWithIntl(
				<Comment
					editorAPI={undefined}
					onSave={true as any}
					providerFactory={{} as any}
					editorDOMElement={<div id="ak-editor-textarea" />}
					featureFlags={{}}
					// this would enable two line toolbar
					customPrimaryToolbarComponents={<div>custom primary toolbar</div>}
					useStickyToolbar
				/>,
			);
			const stickyToolbar = fullPage.getByTestId('ak-editor-main-toolbar');
			expect(stickyToolbar).toBeInTheDocument();
			expect(stickyToolbar).toHaveStyleRule('z-index', '500');
			expect(stickyToolbar).toHaveStyleRule('position', 'sticky');
			const emotionStyles = Array.from(document.querySelectorAll('style[data-emotion]'))
				.map((el) => el.textContent)
				.filter((style) => style?.includes('-StickyToolbar'))
				.join('\n');
			expect(emotionStyles).toContain('position:sticky');
			expect(emotionStyles).toContain('z-index:500');
			expect(emotionStyles).toContain('box-shadow:none');
			expect(emotionStyles).toContain('padding-left:var(--ds-space-250, 20px)');
			expect(emotionStyles).toContain('show-keyline');
		});
	});

	describe('fixed toolbar styles', () => {
		it('should render fixed toolbar with correct styles', () => {
			const fullPage = renderWithIntl(
				<Comment
					editorAPI={undefined}
					onSave={true as any}
					providerFactory={{} as any}
					editorDOMElement={<div id="ak-editor-textarea" />}
					featureFlags={{}}
					// this would enable two line toolbar
					customPrimaryToolbarComponents={<div>custom primary toolbar</div>}
				/>,
			);
			const fixedToolbar = fullPage.getByTestId('ak-editor-main-toolbar');
			expect(fixedToolbar).toBeInTheDocument();
			expect(fixedToolbar).toHaveStyleRule('position', 'relative');
			const emotionStyles = Array.from(document.querySelectorAll('style[data-emotion]'))
				.map((el) => el.textContent)
				.filter((style) => style?.includes('-FixedToolbar'))
				.join('\n');
			expect(emotionStyles).toContain('position:relative');
			expect(emotionStyles).toContain('box-shadow:none');
			expect(emotionStyles).toContain('padding-left:var(--ds-space-250, 20px)');
		});

		it('should render fixed toolbar with the shipped border radius styles', () => {
			const fullPage = renderWithIntl(
				<Comment
					editorAPI={undefined}
					onSave={true as any}
					providerFactory={{} as any}
					editorDOMElement={<div id="ak-editor-textarea" />}
					featureFlags={{}}
					// this would enable two line toolbar
					customPrimaryToolbarComponents={<div>custom primary toolbar</div>}
				/>,
			);
			const fixedToolbar = fullPage.getByTestId('ak-editor-main-toolbar');
			expect(fixedToolbar).toBeInTheDocument();
			expect(fixedToolbar).toHaveStyleRule('position', 'relative');
			expect(fixedToolbar).toHaveStyleRule(
				'border-radius',
				'var(--ds-radius-medium, 6px) var(--ds-radius-medium, 6px) 0 0',
			);
			const emotionStyles = Array.from(document.querySelectorAll('style[data-emotion]'))
				.map((el) => el.textContent)
				.filter((style) => style?.includes('-FixedToolbar'))
				.join('\n');
			expect(emotionStyles).toContain('position:relative');
			expect(emotionStyles).toContain(
				'border-radius:var(--ds-radius-medium, 6px) var(--ds-radius-medium, 6px) 0 0',
			);
		});
	});
});
