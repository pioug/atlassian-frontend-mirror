import React from 'react';

import { render } from '@testing-library/react';

import { TOOLBARS } from '@atlaskit/editor-common/toolbar';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';

import { CommentToolbar } from '../../../../src/ui/Appearance/Comment/CommentToolbar';

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
		it('should render the primary toolbar', () => {
			const screen = render(<CommentToolbar editorAPI={getMockEditorAPIWithToolbar()} />);
			expect(screen.getByTestId('primary-toolbar')).toBeInTheDocument();
		});
	});

	describe('when primary toolbar is not registered', () => {
		it('should note render the primary toolbar', () => {
			const screen = render(<CommentToolbar editorAPI={getMockEditorAPIEmptyToolbar()} />);
			expect(screen.queryByTestId('primary-toolbar')).not.toBeInTheDocument();
		});
	});
});
