import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { TOOLBARS } from '@atlaskit/editor-common/toolbar';
import type { PublicPluginAPI, DocBuilder } from '@atlaskit/editor-common/types';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import { FullPageToolbarNext } from '../../../../src/ui/Appearance/FullPage/FullPageToolbarNext';

const createEditor = createEditorFactory();
const editor = (doc?: DocBuilder) =>
	createEditor({
		doc,
	});

const primaryToolbarComponent = {
	type: 'toolbar',
	key: TOOLBARS.PRIMARY_TOOLBAR,
	component: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="primary-toolbar">{children}</div>
	),
};

const getMockEditorAPIWithToolbar = () =>
	({
		toolbar: {
			actions: {
				getComponents: () => [primaryToolbarComponent],
				contextualFormattingMode: () => 'controlled',
			},
		},
	} as PublicPluginAPI<ToolbarPlugin>);

const getMockEditorAPIEmptyToolbar = () =>
	({
		toolbar: {
			actions: {
				getComponents: () => [{}],
				contextualFormattingMode: () => 'controlled',
			},
		},
	} as PublicPluginAPI<ToolbarPlugin>);

describe('FullPageToolbarNext', () => {
	let editorView: EditorView;
	beforeEach(() => {
		editorView = editor().editorView;
	});
	describe('when primary toolbar is registered', () => {
		describe('and toolbarDockingPosition is "top"', () => {
			it('should render the primary toolbar', async () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithToolbar()}
							toolbarDockingPosition="top"
							showKeyline={false}
							editorView={editorView}
							disabled={false}
						/>
					</IntlProvider>,
				);
				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();

				await expect(document.body).toBeAccessible();
			});
		});

		describe('and toolbarDockingPosition is "none"', () => {
			it('should not render the primary toolbar', async () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithToolbar()}
							toolbarDockingPosition="none"
							showKeyline={false}
							editorView={editorView}
							disabled={false}
						/>
					</IntlProvider>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();

				await expect(document.body).toBeAccessible();
			});
		});

		describe('and toolbarDockingPosition is undefined', () => {
			it('should render the primary toolbar', async () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithToolbar()}
							toolbarDockingPosition={undefined}
							showKeyline={false}
							editorView={editorView}
							disabled={false}
						/>
					</IntlProvider>,
				);
				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();

				await expect(document.body).toBeAccessible();
			});
		});
	});

	describe('when primary toolbar is not registered', () => {
		describe('and toolbarDockingPosition is "top"', () => {
			it('should render the primary toolbar', async () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIEmptyToolbar()}
							toolbarDockingPosition="top"
							showKeyline={false}
							editorView={editorView}
							disabled={false}
						/>
					</IntlProvider>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();

				await expect(document.body).toBeAccessible();
			});
		});

		describe('and toolbarDockingPosition is "none"', () => {
			it('should not render the primary toolbar', async () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIEmptyToolbar()}
							toolbarDockingPosition="none"
							showKeyline={false}
							editorView={editorView}
							disabled={false}
						/>
					</IntlProvider>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();

				await expect(document.body).toBeAccessible();
			});
		});

		describe('and toolbarDockingPosition is undefined', () => {
			it('should render the primary toolbar', async () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIEmptyToolbar()}
							toolbarDockingPosition={undefined}
							showKeyline={false}
							editorView={editorView}
							disabled={false}
						/>
					</IntlProvider>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();

				await expect(document.body).toBeAccessible();
			});
		});
	});

	describe('custom primary toolbar components', () => {
		const customComponent = <div data-testid="custom-component">Custom Component</div>;
		const beforeComponent = <div data-testid="before-component">Before Component</div>;
		const afterComponent = <div data-testid="after-component">After Component</div>;

		describe('when customPrimaryToolbarComponents is a React element', () => {
			it('should render both primary toolbar and custom component', async () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithToolbar()}
							toolbarDockingPosition="top"
							showKeyline={false}
							customPrimaryToolbarComponents={customComponent}
							editorView={editorView}
								disabled={false}
						/>
					</IntlProvider>,
				);
				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
				expect(screen.getByTestId('custom-component')).toBeInTheDocument();

				await expect(document.body).toBeAccessible();
			});
		});

		describe('when customPrimaryToolbarComponents has before and after properties', () => {
			it('should render all components when both before/after and primary toolbar exist', async () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithToolbar()}
							toolbarDockingPosition="top"
							showKeyline={false}
							customPrimaryToolbarComponents={{
								before: beforeComponent,
								after: afterComponent,
							}}
							editorView={editorView}
								disabled={false}
						/>
					</IntlProvider>,
				);
				expect(
					screen.getByTestId('before-primary-toolbar-components-plugin'),
				).toBeInTheDocument();
				expect(screen.getByTestId('before-component')).toBeInTheDocument();
				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
				expect(screen.getByTestId('after-component')).toBeInTheDocument();

				await expect(document.body).toBeAccessible();
			});
		});

		describe('when customPrimaryToolbarComponents is undefined', () => {
			it('should not render custom components', async () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithToolbar()}
							toolbarDockingPosition="top"
							showKeyline={false}
							editorView={editorView}
								disabled={false}
						/>
					</IntlProvider>,
				);
				expect(
					screen.queryByTestId('before-primary-toolbar-components-plugin'),
				).not.toBeInTheDocument();
				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();

				await expect(document.body).toBeAccessible();
			});
		});

		describe('when toolbarDockingPosition is "none" with custom components', () => {
			it('should render custom components but not primary toolbar', async () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithToolbar()}
							toolbarDockingPosition="none"
							showKeyline={false}
							customPrimaryToolbarComponents={customComponent}
							editorView={editorView}
								disabled={false}
						/>
					</IntlProvider>,
				);
				expect(screen.getByTestId('custom-component')).toBeInTheDocument();
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();

				await expect(document.body).toBeAccessible();
			});
		});
	});
});
