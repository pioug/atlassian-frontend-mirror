import React from 'react';

import { TOOLBARS } from '@atlaskit/editor-common/toolbar/keys';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { CommentToolbar } from '../../../../src/ui/Appearance/Comment/CommentToolbar';
import { MainToolbar } from '../../../../src/ui/Appearance/Comment/Toolbar';

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

describe('CommentToolbar', () => {
	describe('when primary toolbar is registered', () => {
		it('should render the primary toolbar', async () => {
			const screen = render(
				<CommentToolbar editorAPI={getMockEditorAPIWithToolbar()} editorAppearance="comment" />,
			);
			expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('when primary toolbar is not registered', () => {
		it('should note render the primary toolbar', async () => {
			const screen = render(
				<CommentToolbar editorAPI={getMockEditorAPIEmptyToolbar()} editorAppearance="comment" />,
			);
			expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});
});

describe('comment editor toolbar modernisation styles', () => {
	it.each([
		['sticky', true],
		['fixed', false],
	] as const)(
		'shows the %s toolbar overflow shadow when modernisation is enabled',
		async (_variant, useStickyToolbar) => {
			render(<MainToolbar useStickyToolbar={useStickyToolbar} isEditorModernisationEnabled />);

			const toolbar = screen.getByTestId('ak-editor-main-toolbar');
			// Exercise the keyline selector for both toolbar variants.
			toolbar.classList.add('show-keyline');

			expect(getComputedStyle(toolbar).boxShadow).toContain('var(--ds-shadow-overflow');

			await expect(document.body).toBeAccessible();
		},
	);

	it('shows the sticky toolbar keyline when modernisation is disabled', () => {
		render(<MainToolbar useStickyToolbar isEditorModernisationEnabled={false} />);

		expect(getComputedStyle(screen.getByTestId('ak-editor-main-toolbar')).boxShadow).toContain(
			'0 2px 0 0 var(--ds-background-accent-gray-subtlest',
		);
	});

	it('renders the fixed toolbar without a shadow when modernisation is disabled', () => {
		render(<MainToolbar isEditorModernisationEnabled={false} />);

		expect(screen.getByTestId('ak-editor-main-toolbar')).toHaveCompiledCss({ boxShadow: 'none' });
	});
});
