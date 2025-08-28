import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { TOOLBARS } from '@atlaskit/editor-common/toolbar';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import { FullPageToolbarNext } from '../../../../src/ui/Appearance/FullPage/FullPageToolbarNext';

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
			},
		},
	}) as PublicPluginAPI<ToolbarPlugin>;

const getMockEditorAPIEmptyToolbar = () =>
	({
		toolbar: {
			actions: {
				getComponents: () => [{}],
			},
		},
	}) as PublicPluginAPI<ToolbarPlugin>;

describe('FullPageToolbarNext', () => {
	describe('when primary toolbar is registered', () => {
		describe('and toolbarDockingPosition is "top"', () => {
			it('should render the primary toolbar', () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithToolbar()}
							toolbarDockingPosition="top"
							showKeyline={false}
						/>
					</IntlProvider>,
				);
				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
			});
		});

		describe('and toolbarDockingPosition is "none"', () => {
			it('should not render the primary toolbar', () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithToolbar()}
							toolbarDockingPosition="none"
							showKeyline={false}
						/>
					</IntlProvider>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
			});
		});

		describe('and toolbarDockingPosition is undefined', () => {
			it('should render the primary toolbar', () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIWithToolbar()}
							toolbarDockingPosition={undefined}
							showKeyline={false}
						/>
					</IntlProvider>,
				);
				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
			});
		});
	});

	describe('when primary toolbar is not registered', () => {
		describe('and toolbarDockingPosition is "top"', () => {
			it('should render the primary toolbar', () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIEmptyToolbar()}
							toolbarDockingPosition="top"
							showKeyline={false}
						/>
					</IntlProvider>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
			});
		});

		describe('and toolbarDockingPosition is "none"', () => {
			it('should not render the primary toolbar', () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIEmptyToolbar()}
							toolbarDockingPosition="none"
							showKeyline={false}
						/>
					</IntlProvider>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
			});
		});

		describe('and toolbarDockingPosition is undefined', () => {
			it('should render the primary toolbar', () => {
				const screen = render(
					<IntlProvider locale="en">
						<FullPageToolbarNext
							editorAPI={getMockEditorAPIEmptyToolbar()}
							toolbarDockingPosition={undefined}
							showKeyline={false}
						/>
					</IntlProvider>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
			});
		});
	});

	eeTest
		.describe(
			'platform_editor_toolbar_support_custom_components',
			'custom primary toolbar components',
		)
		.variant(true, () => {
			const customComponent = <div data-testid="custom-component">Custom Component</div>;
			const beforeComponent = <div data-testid="before-component">Before Component</div>;
			const afterComponent = <div data-testid="after-component">After Component</div>;

			describe('when customPrimaryToolbarComponents is a React element', () => {
				it('should render both primary toolbar and custom component', () => {
					const screen = render(
						<IntlProvider locale="en">
							<FullPageToolbarNext
								editorAPI={getMockEditorAPIWithToolbar()}
								toolbarDockingPosition="top"
								showKeyline={false}
								customPrimaryToolbarComponents={customComponent}
							/>
						</IntlProvider>,
					);
					expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
					expect(screen.getByTestId('custom-component')).toBeInTheDocument();
				});
			});

			describe('when customPrimaryToolbarComponents has before and after properties', () => {
				it('should render all components when both before/after and primary toolbar exist', () => {
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
							/>
						</IntlProvider>,
					);
					expect(
						screen.getByTestId('before-primary-toolbar-components-plugin'),
					).toBeInTheDocument();
					expect(screen.getByTestId('before-component')).toBeInTheDocument();
					expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
					expect(screen.getByTestId('after-component')).toBeInTheDocument();
				});
			});

			describe('when customPrimaryToolbarComponents is undefined', () => {
				it('should not render custom components', () => {
					const screen = render(
						<IntlProvider locale="en">
							<FullPageToolbarNext
								editorAPI={getMockEditorAPIWithToolbar()}
								toolbarDockingPosition="top"
								showKeyline={false}
							/>
						</IntlProvider>,
					);
					expect(
						screen.queryByTestId('before-primary-toolbar-components-plugin'),
					).not.toBeInTheDocument();
					expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
				});
			});

			describe('when toolbarDockingPosition is "none" with custom components', () => {
				it('should render custom components but not primary toolbar', () => {
					const screen = render(
						<IntlProvider locale="en">
							<FullPageToolbarNext
								editorAPI={getMockEditorAPIWithToolbar()}
								toolbarDockingPosition="none"
								showKeyline={false}
								customPrimaryToolbarComponents={customComponent}
							/>
						</IntlProvider>,
					);
					expect(screen.getByTestId('custom-component')).toBeInTheDocument();
					expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
				});
			});
		});
});
