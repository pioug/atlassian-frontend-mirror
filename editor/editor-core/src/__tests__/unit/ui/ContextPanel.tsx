import React from 'react';

// eslint-disable-next-line
import { screen, waitFor } from '@testing-library/react';

import type { EditorPlugin } from '@atlaskit/editor-common/types';
import { ContextPanelConsumer, ContextPanelWidthProvider } from '@atlaskit/editor-common/ui';
import { contextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import { ContextPanel, SwappableContentArea } from '../../../ui/ContextPanel';

describe('SwappableContentArea', () => {
	it('renders children', () => {
		renderWithIntl(
			<SwappableContentArea editorAPI={undefined} visible>
				<div data-testid="child-component">Child Component</div>
			</SwappableContentArea>,
		);
		expect(screen.getByTestId('child-component')).toBeInTheDocument();
		expect(screen.getByLabelText('Context panel')).toBeInTheDocument();
	});

	// ContextPanel animates by doing a CSS transition on the container's width,
	// and inside the container, sliding the content off screen.
	//
	// The container clips content to avoid scroll and overlaying with any elements
	// that might be on the right.

	describe('container', () => {
		it('displays content when visible is true', () => {
			renderWithIntl(<SwappableContentArea editorAPI={undefined} visible />);
			const panel = screen.getByTestId('context-panel-panel');
			expect(panel).toHaveStyle('width: 320px');
		});
		it('hides content when visible is false', () => {
			renderWithIntl(<SwappableContentArea editorAPI={undefined} visible={false} />);
			const panel = screen.getByTestId('context-panel-panel');
			expect(panel).toHaveStyle('width: 0px');
		});
		it('clips content using the container', () => {
			renderWithIntl(<SwappableContentArea editorAPI={undefined} visible />);
			const panel = screen.getByTestId('context-panel-panel');
			expect(panel).toHaveStyle('overflow: hidden');
		});
	});

	describe('content', () => {
		it('is scrollable up/down', () => {
			renderWithIntl(<SwappableContentArea editorAPI={undefined} visible />);
			const content = screen.getByTestId('context-panel-content');
			expect(content).toHaveStyle('overflow-y: auto');
		});
	});
});

describe('ContextPanelWidthProvider', () => {
	it('should broadcast width', async () => {
		let broadCast: (width: number) => void = () => {};
		const { container } = renderWithIntl(
			<ContextPanelWidthProvider>
				<ContextPanelConsumer>
					{({ width, broadcastWidth }) => {
						broadCast = broadcastWidth;
						return <div>{width}</div>;
					}}
				</ContextPanelConsumer>
			</ContextPanelWidthProvider>,
		);
		broadCast(320);

		await waitFor(() => expect(container).toHaveTextContent('320'));
	});

	it('should broadcast width with SwappableContentArea', async () => {
		const { container } = renderWithIntl(
			<ContextPanelWidthProvider>
				<SwappableContentArea editorAPI={undefined} visible>
					<ContextPanelConsumer>
						{({ width }) => {
							return <div>{width}</div>;
						}}
					</ContextPanelConsumer>
				</SwappableContentArea>
			</ContextPanelWidthProvider>,
		);

		await waitFor(() => expect(container).toHaveTextContent('320'));
	});
});

const editorFactory = createEditorFactory();

const mockContextPanelPlugin: EditorPlugin = {
	name: 'mockContextPanelPlugin',
	pluginsOptions: {
		contextPanel: (state) => <p>mario saxaphone</p>,
	},
};

describe('ContextPanel', () => {
	it('renders SwappableContentArea', () => {
		renderWithIntl(
			<ContextPanel editorAPI={undefined} visible={true}>
				<div>yoshi bongo</div>
			</ContextPanel>,
		);
		const contentArea = screen.getByTestId('context-panel-panel');
		expect(contentArea).toBeInTheDocument();
	});

	it('passes top-level props and children to SwappableContentArea', () => {
		renderWithIntl(
			<ContextPanel editorAPI={undefined} visible={true}>
				<div>yoshi bongo</div>
			</ContextPanel>,
		);
		expect(screen.getByText('yoshi bongo')).toBeInTheDocument();
	});

	it('uses pluginContent instead if plugins define content', () => {
		const { editorAPI } = editorFactory({
			editorPlugins: [mockContextPanelPlugin, contextPanelPlugin({ config: undefined })],
			doc: doc(p('hello')),
		});
		renderWithIntl(
			<ContextPanel editorAPI={editorAPI} visible={true}>
				<div>yoshi bongo</div>
			</ContextPanel>,
		);
		expect(screen.queryByText('yoshi bongo')).not.toBeInTheDocument();
		expect(screen.getByText('mario saxaphone')).toBeInTheDocument();
	});

	describe('renders the context panel with correct role and aria attributes', () => {
		it('has dialog semantics with aria-modal=false and no aria-labelledby', () => {
			renderWithIntl(
				<ContextPanel editorAPI={undefined} visible={true}>
					<div id="context-panel-title">Blog posts</div>
				</ContextPanel>,
			);
			const panel = screen.getByTestId('context-panel-panel');
			expect(panel).toBeInTheDocument();
			expect(panel).toHaveAttribute('role', 'dialog');
			expect(panel).toHaveAttribute('aria-modal', 'false');
			expect(panel).toHaveAttribute('aria-label', 'Context panel');
			expect(panel).not.toHaveAttribute('aria-labelledby');
		});
	});

	it('should focus editor on ESC from the sidebar config panel', async () => {
		const { editorAPI } = editorFactory({
			doc: doc(p('hello')),
		});

		// @ts-expect-error
		const editorFocusSpy = jest.spyOn(editorAPI?.core.actions, 'focus');
		const { rerender } = renderWithIntl(
			<ContextPanel editorAPI={editorAPI} visible={true}>
				<div>yoshi bongo</div>
			</ContextPanel>,
		);
		// Update the component to simulate closing the sidebar
		rerender(
			<ContextPanel editorAPI={editorAPI} visible={false}>
				<div>yoshi bongo</div>
			</ContextPanel>,
		);
		expect(editorFocusSpy).toHaveBeenCalled();
	});
});
