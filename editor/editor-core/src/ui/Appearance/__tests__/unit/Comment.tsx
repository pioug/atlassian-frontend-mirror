import React from 'react';

import type { ReactWrapper } from 'enzyme';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import type { MediaOptions } from '@atlaskit/editor-plugins/media/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { sleep } from '@atlaskit/editor-test-helpers/sleep';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers/fakeMediaClient';

import { mountWithIntl } from '../../../../__tests__/__helpers/enzyme';
import EditorActions from '../../../../actions';
import EditorContext from '../../../EditorContext';
import Comment from '../../Comment';

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
		const fullPage = mountWithIntl(
			<Comment
				editorAPI={undefined}
				editorView={editorView}
				providerFactory={{} as any}
				editorDOMElement={<div />}
				featureFlags={{}}
			/>,
		);

		fullPage.find('div[data-testid="click-wrapper"]').simulate('mousedown', { clientY: 200 });
		expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('Hello world'), p('')));
	});

	it('should not create empty terminal empty paragraph if it is already present at end', () => {
		const { editorView } = editor(doc(p('Hello world'), p('')));
		const fullPage = mountWithIntl(
			<Comment
				editorAPI={undefined}
				editorView={editorView}
				providerFactory={{} as any}
				editorDOMElement={<div />}
				featureFlags={{}}
			/>,
		);
		fullPage
			.find('div[data-testid="click-wrapper"]')
			.simulate('click', { clientY: 200 })
			.simulate('click', { clientY: 200 });
		expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('')));
	});

	it('should not create empty terminal paragraph when clicked inside editor', () => {
		const { editorView } = editor(doc(p('Hello world')));
		const fullPage = mountWithIntl(
			<Comment
				editorAPI={undefined}
				editorView={editorView}
				providerFactory={{} as any}
				editorDOMElement={<div />}
				featureFlags={{}}
			/>,
		);

		fullPage.find('div.ak-editor-content-area').simulate('click');

		expect(editorView.state.doc).toEqualDocument(doc(p('Hello world')));
	});

	describe('with media', () => {
		const mediaProvider = Promise.resolve({
			viewMediaClientConfig: getDefaultMediaClientConfig(),
		});
		const providerFactory = ProviderFactory.create({
			mediaProvider,
		});

		function getSaveButton(wrapper: ReactWrapper<any, any>) {
			return wrapper.find('button[data-testid="comment-save-button"]');
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

			const comment = mountWithIntl(
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

			mediaPluginState?.updateAndDispatch({
				allUploadsFinished: false,
			});

			await sleep(0);

			mediaPluginState?.updateAndDispatch({
				allUploadsFinished: true,
			});
			await sleep(0);

			expect(getSaveButton(comment).prop('disabled')).toBe(false);
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
			const comment = mountWithIntl(<EditorComment disabled={true} />);
			await comment.setProps({ disabled: false });

			// save button should not be disabled
			expect(getSaveButton(comment).prop('disabled')).toBe(false);
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
			const fullPage = mountWithIntl(
				<Comment
					editorAPI={undefined}
					editorView={editorView}
					onSave={true as any}
					providerFactory={{} as any}
					editorDOMElement={<div />}
					featureFlags={{}}
				/>,
			);
			fullPage.find('div.ak-editor-content-area').simulate('click');
			expect(fullPage.find('div[data-testid="ak-editor-secondary-toolbar"]').exists()).toBe(true);
		});
		it('should render the secondary toolbar if there is a cancel button', () => {
			const { editorView } = editor(doc(p('Hello world')));
			const fullPage = mountWithIntl(
				<Comment
					editorAPI={undefined}
					editorView={editorView}
					onCancel={true as any}
					providerFactory={{} as any}
					editorDOMElement={<div />}
					featureFlags={{}}
				/>,
			);
			fullPage.find('div.ak-editor-content-area').simulate('click');

			expect(fullPage.find('div[data-testid="ak-editor-secondary-toolbar"]').exists()).toBe(true);
		});
		it('should render the secondary toolbar if there is a custom secondary toolbar button', () => {
			const { editorView } = editor(doc(p('Hello world')));
			const fullPage = mountWithIntl(
				<Comment
					editorAPI={undefined}
					editorView={editorView}
					customSecondaryToolbarComponents={true as any}
					providerFactory={{} as any}
					editorDOMElement={<div />}
					featureFlags={{}}
				/>,
			);
			fullPage.find('div.ak-editor-content-area').simulate('click');
			expect(fullPage.find('div[data-testid="ak-editor-secondary-toolbar"]').exists()).toBe(true);
		});
		it('should not render the secondary toolbar if there is no save, cancel or custom button', () => {
			const { editorView } = editor(doc(p('Hello world')));
			const fullPage = mountWithIntl(
				<Comment
					editorAPI={undefined}
					editorView={editorView}
					providerFactory={{} as any}
					editorDOMElement={<div />}
					featureFlags={{}}
				/>,
			);
			fullPage.find('div.ak-editor-content-area').simulate('click');
			expect(fullPage.find('div[data-testid="ak-editor-secondary-toolbar"]').exists()).toBe(false);
		});

		describe('comment toolbar shortcuts', () => {
			beforeAll(() => {
				// scrollIntoView is not available in jsdom so need to mock it https://github.com/jsdom/jsdom/issues/1695
				window.HTMLElement.prototype.scrollIntoView = jest.fn();
			});

			it('focuses editor on ESC', () => {
				const { editorView, commentComponent } = mountCommentWithToolbarButton();
				const editorFocusSpy = jest.spyOn(editorView, 'focus');

				const toolbarClickWrapper = commentComponent
					.find('.custom-key-handler-wrapper')
					.last()
					.getDOMNode();
				toolbarClickWrapper.dispatchEvent(
					new KeyboardEvent('keydown', {
						key: 'Escape',
					}),
				);
				expect(editorFocusSpy).toHaveBeenCalled();
			});

			it('focuses toolbar on alt + F9', () => {
				const { editorView, commentComponent } = mountCommentWithToolbarButton();
				const buttonElement = commentComponent
					.find('[data-testid="custom-button"]')
					.last()
					.getDOMNode() as HTMLElement;

				const buttonFocusSpy = jest.spyOn(buttonElement, 'focus');
				const buttonScrollSpy = jest.spyOn(buttonElement, 'scrollIntoView');

				editorView.dom.dispatchEvent(
					new KeyboardEvent('keydown', {
						key: 'F9',
						keyCode: 120,
						altKey: true,
					}),
				);
				expect(buttonFocusSpy).toHaveBeenCalled();
				expect(buttonScrollSpy).toHaveBeenCalled();
			});

			function mountCommentWithToolbarButton() {
				const { editorView } = editor(doc(p('Hello world')));
				const commentComponent = mountWithIntl(
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
});
