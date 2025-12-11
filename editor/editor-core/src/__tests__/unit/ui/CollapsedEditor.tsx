import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import { ComposableEditor } from '../../../composable-editor';
import Editor from '../../../editor';
import createUniversalPresetInternal from '../../../presets/universal';
import CollapsedEditor from '../../../ui/CollapsedEditor';

function ComposableEditorWrapped(props: Parameters<typeof ComposableEditor>[0]) {
	return <ComposableEditor {...props} />;
}

describe('CollapsedEditor', () => {
	it('should load even if IntlProvider is not provided', async () => {
		const { container } = render(
			<CollapsedEditor isExpanded={false}>
				<Editor />
			</CollapsedEditor>,
		);

		const editorElement = container.getElementsByClassName('akEditor');
		expect(editorElement.length).toBe(0);
		expect(screen.queryByTestId('chrome-collapsed')).not.toBeNull();

		await expect(document.body).toBeAccessible();
	});

	it('should have the label for chrome-collapsed', async () => {
		const { container } = render(
			<CollapsedEditor isExpanded={false} assistiveLabel="Test Label">
				<Editor />
			</CollapsedEditor>,
		);
		const editorElement = container.getElementsByClassName('akEditor');
		expect(editorElement.length).toBe(0);
		expect(screen.getByLabelText('Test Label')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should not render the editor when isExpanded is false', async () => {
		const { container } = renderWithIntl(
			<CollapsedEditor isExpanded={false}>
				<Editor />
			</CollapsedEditor>,
		);

		const editorElement = container.getElementsByClassName('akEditor');
		expect(editorElement.length).toBe(0);
		expect(screen.queryByTestId('chrome-collapsed')).not.toBeNull();

		await expect(document.body).toBeAccessible();
	});

	it('should render the editor when isExpanded is true', async () => {
		const { container } = renderWithIntl(
			<CollapsedEditor isExpanded={true}>
				<Editor />
			</CollapsedEditor>,
		);
		const editorElement = container.getElementsByClassName('akEditor');
		expect(editorElement.length).toBe(1);
		expect(screen.queryByTestId('chrome-collapsed')).toBeNull();

		await expect(document.body).toBeAccessible();
	});

	it('should call onFocus when collapsed editor is clicked', async () => {
		const onFocus = jest.fn();
		renderWithIntl(
			<CollapsedEditor onFocus={onFocus}>
				<Editor />
			</CollapsedEditor>,
		);
		const textbox = screen.getByRole('textbox');
		textbox.focus();
		// Ignored via go/ees007
		// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
		// TODO: Remove once we upgrade to JSDom v16.3.0 that has the fix for focus
		// fireEvent.focusIn(textbox); // Removed after upgrading to jest 29
		expect(onFocus).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should not call onExpand when the editor is initially expanded', async () => {
		const onExpand = jest.fn();
		renderWithIntl(
			<CollapsedEditor isExpanded={true} onExpand={onExpand}>
				<Editor />
			</CollapsedEditor>,
		);
		expect(onExpand).toHaveBeenCalledTimes(0);

		await expect(document.body).toBeAccessible();
	});

	it('should call onExpand after the editor is expanded and mounted', async () => {
		const onExpand = jest.fn();
		const { rerender } = render(
			<IntlProvider locale="en">
				<CollapsedEditor isExpanded={false} onExpand={onExpand}>
					<Editor />
				</CollapsedEditor>
			</IntlProvider>,
		);
		rerender(
			<IntlProvider locale="en">
				<CollapsedEditor isExpanded={true} onExpand={onExpand}>
					<Editor />
				</CollapsedEditor>
			</IntlProvider>,
		);
		expect(onExpand).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should allow setting a ref on the editor component', async () => {
		let editorRef = {};
		const setRef = (ref: Editor) => {
			editorRef = ref;
		};
		renderWithIntl(
			<CollapsedEditor isExpanded={true}>
				<Editor ref={setRef} />
			</CollapsedEditor>,
		);
		expect(editorRef instanceof Editor).toBe(true);

		await expect(document.body).toBeAccessible();
	});
});

describe('CollapsedEditor with ComposableEditor', () => {
	const preset = createUniversalPresetInternal({
		appearance: 'full-page',
		props: { paste: {} },
		featureFlags: {},
	});
	it('should load even if IntlProvider is not provided', async () => {
		const { container } = render(
			<CollapsedEditor isExpanded={false}>
				<ComposableEditor preset={preset} />
			</CollapsedEditor>,
		);

		const editorElement = container.getElementsByClassName('akEditor');
		expect(editorElement.length).toBe(0);
		expect(screen.queryByTestId('chrome-collapsed')).not.toBeNull();

		await expect(document.body).toBeAccessible();
	});

	it('should not render the editor when isExpanded is false', async () => {
		const { container } = renderWithIntl(
			<CollapsedEditor isExpanded={false}>
				<ComposableEditor preset={preset} />
			</CollapsedEditor>,
		);

		const editorElement = container.getElementsByClassName('akEditor');
		expect(editorElement.length).toBe(0);
		expect(screen.queryByTestId('chrome-collapsed')).not.toBeNull();

		await expect(document.body).toBeAccessible();
	});

	it('should render the editor when isExpanded is true', async () => {
		const { container } = renderWithIntl(
			<CollapsedEditor isExpanded={true}>
				<ComposableEditor preset={preset} />
			</CollapsedEditor>,
		);
		const editorElement = container.getElementsByClassName('akEditor');
		expect(editorElement.length).toBe(1);
		expect(screen.queryByTestId('chrome-collapsed')).toBeNull();

		await expect(document.body).toBeAccessible();
	});

	it('should call onFocus when collapsed editor is clicked', async () => {
		const onFocus = jest.fn();
		renderWithIntl(
			<CollapsedEditor onFocus={onFocus}>
				<ComposableEditor preset={preset} />
			</CollapsedEditor>,
		);
		const textbox = screen.getByRole('textbox');
		textbox.focus();
		// Ignored via go/ees007
		// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
		// TODO: Remove once we upgrade to JSDom v16.3.0 that has the fix for focus
		// fireEvent.focusIn(textbox); // Removed after upgrading to jest 29
		expect(onFocus).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should not call onExpand when the editor is initially expanded', async () => {
		const onExpand = jest.fn();
		renderWithIntl(
			<CollapsedEditor isExpanded={true} onExpand={onExpand}>
				<ComposableEditor preset={preset} />
			</CollapsedEditor>,
		);
		expect(onExpand).toHaveBeenCalledTimes(0);

		await expect(document.body).toBeAccessible();
	});

	it('should call onExpand after the editor is expanded and mounted', async () => {
		const onExpand = jest.fn();
		const { rerender } = render(
			<IntlProvider locale="en">
				<CollapsedEditor isExpanded={false} onExpand={onExpand}>
					<ComposableEditor preset={preset} />
				</CollapsedEditor>
			</IntlProvider>,
		);
		rerender(
			<IntlProvider locale="en">
				<CollapsedEditor isExpanded={true} onExpand={onExpand}>
					<ComposableEditor preset={preset} />
				</CollapsedEditor>
			</IntlProvider>,
		);
		expect(onExpand).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	describe('for a wrapped editor (ie. Editor variant is a child)', () => {
		it('should not call onExpand when the editor is initially expanded', async () => {
			const onExpand = jest.fn();
			renderWithIntl(
				<CollapsedEditor isExpanded={true} onExpand={onExpand}>
					<ComposableEditorWrapped preset={preset} />
				</CollapsedEditor>,
			);
			expect(onExpand).toHaveBeenCalledTimes(0);

			await expect(document.body).toBeAccessible();
		});

		it('should call onExpand after the editor is expanded and mounted', async () => {
			const onExpand = jest.fn();
			const { rerender } = render(
				<IntlProvider locale="en">
					<CollapsedEditor isExpanded={false} onExpand={onExpand}>
						<ComposableEditorWrapped preset={preset} />
					</CollapsedEditor>
				</IntlProvider>,
			);
			rerender(
				<IntlProvider locale="en">
					<CollapsedEditor isExpanded={true} onExpand={onExpand}>
						<ComposableEditorWrapped preset={preset} />
					</CollapsedEditor>
				</IntlProvider>,
			);
			expect(onExpand).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});
	});
});
