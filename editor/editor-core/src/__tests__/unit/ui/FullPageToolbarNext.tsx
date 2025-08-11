import React from 'react';

import { render } from '@testing-library/react';

import { TOOLBARS } from '@atlaskit/editor-common/toolbar';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';

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
					<FullPageToolbarNext
						editorAPI={getMockEditorAPIWithToolbar()}
						toolbarDockingPosition="top"
					/>,
				);
				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
			});
		});

		describe('and toolbarDockingPosition is "none"', () => {
			it('should not render the primary toolbar', () => {
				const screen = render(
					<FullPageToolbarNext
						editorAPI={getMockEditorAPIWithToolbar()}
						toolbarDockingPosition="none"
					/>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
			});
		});

		describe('and toolbarDockingPosition is undefined', () => {
			it('should render the primary toolbar', () => {
				const screen = render(
					<FullPageToolbarNext
						editorAPI={getMockEditorAPIWithToolbar()}
						toolbarDockingPosition={undefined}
					/>,
				);
				expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
			});
		});
	});

	describe('when primary toolbar is not registered', () => {
		describe('and toolbarDockingPosition is "top"', () => {
			it('should render the primary toolbar', () => {
				const screen = render(
					<FullPageToolbarNext
						editorAPI={getMockEditorAPIEmptyToolbar()}
						toolbarDockingPosition="top"
					/>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
			});
		});

		describe('and toolbarDockingPosition is "none"', () => {
			it('should not render the primary toolbar', () => {
				const screen = render(
					<FullPageToolbarNext
						editorAPI={getMockEditorAPIEmptyToolbar()}
						toolbarDockingPosition="none"
					/>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
			});
		});

		describe('and toolbarDockingPosition is undefined', () => {
			it('should render the primary toolbar', () => {
				const screen = render(
					<FullPageToolbarNext
						editorAPI={getMockEditorAPIEmptyToolbar()}
						toolbarDockingPosition={undefined}
					/>,
				);
				expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
			});
		});
	});
});
