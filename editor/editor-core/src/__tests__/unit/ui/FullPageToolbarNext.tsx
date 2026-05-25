import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { TOOLBARS, VIEW_MODE_TOGGLE_SECTION } from '@atlaskit/editor-common/toolbar';
import type { PublicPluginAPI, DocBuilder } from '@atlaskit/editor-common/types';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import type { MarkdownModePlugin, MarkdownModeView } from '../../../../src/types/markdown-mode';
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

const viewModeToggleComponent = {
	type: VIEW_MODE_TOGGLE_SECTION.type,
	key: VIEW_MODE_TOGGLE_SECTION.key,
	parents: [{ type: 'toolbar', key: TOOLBARS.PRIMARY_TOOLBAR }],
	component: () => <div data-testid="view-mode-toggle">View mode toggle</div>,
};

const editToolbarComponent = {
	type: 'section',
	key: 'edit-toolbar-section',
	parents: [{ type: 'toolbar', key: TOOLBARS.PRIMARY_TOOLBAR }],
	component: () => <div data-testid="edit-toolbar-control">Edit toolbar control</div>,
};

// Stub for the `sharedState` half of the toolbar plugin's injection API
// surface that `useSharedPluginStateWithSelector` reads from.
const noopSharedState = {
	currentState: () => undefined,
	onChange: () => () => {},
};

const getMarkdownModeSharedState = (view: MarkdownModeView) => ({
	currentState: () => ({ view, isMarkdownMode: true }),
	onChange: () => () => {},
});

// Tests only exercise actions / sharedState; cast via `unknown` to bypass
// shape-overlap checks for the rest of the toolbar plugin's injection API.
const getMockEditorAPIWithToolbar = () =>
	({
		toolbar: {
			actions: {
				getComponents: () => [primaryToolbarComponent],
				contextualFormattingMode: () => 'controlled',
			},
			sharedState: noopSharedState,
		},
	}) as unknown as PublicPluginAPI<ToolbarPlugin>;

const getMockEditorAPIWithMarkdownMode = (view: MarkdownModeView) =>
	({
		toolbar: {
			actions: {
				getComponents: () => [
					primaryToolbarComponent,
					editToolbarComponent,
					viewModeToggleComponent,
				],
				contextualFormattingMode: () => 'controlled',
			},
			sharedState: noopSharedState,
		},
		markdownMode: {
			sharedState: getMarkdownModeSharedState(view),
		},
	}) as unknown as PublicPluginAPI<[ToolbarPlugin, MarkdownModePlugin]>;

const getMockEditorAPIEmptyToolbar = () =>
	({
		toolbar: {
			actions: {
				getComponents: () => [{}],
				contextualFormattingMode: () => 'controlled',
			},
			sharedState: noopSharedState,
		},
	}) as unknown as PublicPluginAPI<ToolbarPlugin>;

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

			it('should render edit controls when markdown mode is in preview view', () => {
				failGate('platform_editor_markdown_mode_hide_source_toolbar');

				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithMarkdownMode('preview')}
							toolbarDockingPosition="top"
							showKeyline={false}
							editorView={editorView}
							disabled={false}
						/>
					</IntlProvider>,
				);

				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
				expect(screen.getByTestId('edit-toolbar-control')).toBeInTheDocument();
				expect(screen.getByTestId('view-mode-toggle')).toBeInTheDocument();
			});

			it('should render edit controls when markdown mode is in syntax view and toolbar hiding is gated off', () => {
				failGate('platform_editor_markdown_mode_hide_source_toolbar');

				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithMarkdownMode('syntax')}
							toolbarDockingPosition="top"
							showKeyline={false}
							editorView={editorView}
							disabled={false}
						/>
					</IntlProvider>,
				);

				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
				expect(screen.getByTestId('edit-toolbar-control')).toBeInTheDocument();
				expect(screen.getByTestId('view-mode-toggle')).toBeInTheDocument();
			});

			it('should hide edit controls and keep the view mode toggle when markdown mode is in syntax view and toolbar hiding is gated on', () => {
				passGate('platform_editor_markdown_mode_hide_source_toolbar');

				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithMarkdownMode('syntax')}
							toolbarDockingPosition="top"
							showKeyline={false}
							editorView={editorView}
							disabled={false}
						/>
					</IntlProvider>,
				);

				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
				expect(screen.queryByTestId('edit-toolbar-control')).not.toBeInTheDocument();
				expect(screen.getByTestId('view-mode-toggle')).toBeInTheDocument();
			});

			it('should hide edit controls and keep the view mode toggle when markdown mode is in preview view and toolbar hiding is gated on', () => {
				passGate('platform_editor_markdown_mode_hide_source_toolbar');

				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithMarkdownMode('preview')}
							toolbarDockingPosition="top"
							showKeyline={false}
							editorView={editorView}
							disabled={false}
						/>
					</IntlProvider>,
				);

				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
				expect(screen.queryByTestId('edit-toolbar-control')).not.toBeInTheDocument();
				expect(screen.getByTestId('view-mode-toggle')).toBeInTheDocument();
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
				expect(screen.getByTestId('before-primary-toolbar-components-plugin')).toBeInTheDocument();
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

	describe('and primary toolbar is not registered', () => {
		describe('and no custom components', () => {
			it('should not render toolbar region', () => {
				const { container } = render(
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

				// Component returns null, so container should be empty
				expect(container.firstChild).toBeNull();
			});
		});

		describe('and has custom components as React element', () => {
			it('should render the toolbar region when primary toolbar component is a react component', () => {
				const customComponent = <div data-testid="after-component">After Component</div>;
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIEmptyToolbar()}
							toolbarDockingPosition={undefined}
							showKeyline={false}
							customPrimaryToolbarComponents={customComponent}
							editorView={editorView}
							disabled={false}
						/>
					</IntlProvider>,
				);

				expect(screen.getByTestId('ak-editor-main-toolbar')).toBeInTheDocument();
				expect(
					screen.queryByTestId('before-primary-toolbar-components-plugin'),
				).not.toBeInTheDocument();
				expect(screen.getByTestId('after-component')).toBeInTheDocument();
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
			});

			it('should render the toolbar region when both after and before custom components are react components', () => {
				const beforeComponent = <div data-testid="before-component">Before Component</div>;
				const afterComponent = <div data-testid="after-component">After Component</div>;
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIEmptyToolbar()}
							toolbarDockingPosition={undefined}
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

				// Should not early exit when custom components with before/after exist
				expect(screen.getByTestId('ak-editor-main-toolbar')).toBeInTheDocument();
				expect(screen.getByTestId('before-primary-toolbar-components-plugin')).toBeInTheDocument();
				expect(screen.getByTestId('before-component')).toBeInTheDocument();
				expect(screen.getByTestId('after-component')).toBeInTheDocument();
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
			});
		});
	});

	describe('and primary toolbar is registered', () => {
		it('should render the toolbar region normally', () => {
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

			// Should render the toolbar region
			expect(screen.getByTestId('ak-editor-main-toolbar')).toBeInTheDocument();
			expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
		});
	});
});
