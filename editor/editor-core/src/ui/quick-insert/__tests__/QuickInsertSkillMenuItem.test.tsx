import React from 'react';

import { act } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { MenuItem } from '@atlaskit/editor-common/extensions';
import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { executeExtensionQuickInsertItem } from '../executeExtensionQuickInsertItem';
import { QuickInsertSkillMenuItem } from '../QuickInsertSkillMenuItem';

jest.mock('@atlaskit/editor-common/quick-insert/use-quick-insert-context', () => ({
	useQuickInsertContext: jest.fn(),
}));
jest.mock('../executeExtensionQuickInsertItem', () => ({
	executeExtensionQuickInsertItem: jest.fn(),
}));
jest.mock('@atlaskit/popper/react-popper', () => {
	const React = jest.requireActual<typeof import('react')>('react');
	return {
		Popper: ({
			children,
		}: {
			children: (props: { ref: () => void; style: {}; update: () => void }) => React.ReactNode;
		}) =>
			React.createElement(
				React.Fragment,
				null,
				children({ ref: () => {}, style: {}, update: () => {} }),
			),
	};
});

const renderAndFlushIcons = async (ui: React.ReactElement) => {
	const result = render(ui);
	await act(async () => {
		await Promise.resolve();
		await Promise.resolve();
	});
	return result;
};

describe('QuickInsertSkillMenuItem', () => {
	const setQuickInsertContext = ({
		isOffline = false,
		isSelected = false,
		surface = 'typeahead',
	}: {
		isOffline?: boolean;
		isSelected?: boolean;
		surface?: 'typeahead' | 'element-browser';
	} = {}) => {
		jest.mocked(useQuickInsertContext).mockReturnValue({
			editorView: { state: {} },
			isOffline,
			item: { id: 'skill', isSelected },
			select: (
				selectionHandler: (context: { insert: jest.Mock; source: INPUT_METHOD }) => unknown,
			) =>
				selectionHandler({
					insert: jest.fn(),
					source:
						surface === 'element-browser'
							? INPUT_METHOD.ELEMENT_BROWSER
							: INPUT_METHOD.QUICK_INSERT,
				}),
			surface,
		} as never);
	};

	const createItem = (overrides: Partial<MenuItem> = {}): MenuItem => ({
		categories: [],
		description: 'Research customer feedback',
		extensionKey: 'skill',
		extensionType: 'com.atlassian.rovo.skill',
		featured: false,
		icon: () => Promise.resolve({ default: () => <span data-testid="skill-icon" /> }),
		key: 'skill:research',
		keywords: [],
		lozenge: 'Beta',
		moduleKey: 'research',
		node: { type: 'inlineExtension', attrs: {} },
		preview: { attribution: { name: 'Jira' } },
		title: 'Research',
		...overrides,
	});

	beforeEach(() => {
		jest.clearAllMocks();
		setQuickInsertContext();
	});

	it('keeps the row concise and shows the Skill description and attribution in the selected preview', async () => {
		setQuickInsertContext({ isSelected: true });
		const item = createItem();
		const { container } = await renderAndFlushIcons(
			<IntlProvider locale="en">
				<div aria-label="Quick insert" role="listbox">
					<QuickInsertSkillMenuItem
						apiRef={{ current: undefined }}
						editorActions={{} as never}
						item={item}
					/>
				</div>
			</IntlProvider>,
		);

		const option = screen.getByRole('option', { name: item.title });
		expect(option).toHaveAttribute('aria-describedby');
		expect(option).toHaveTextContent('/research');
		expect(option).toHaveTextContent('Beta');
		expect(option).not.toHaveTextContent('Research customer feedback');
		const preview = screen.getByTestId('quick-insert-preview-panel');
		expect(preview).toHaveTextContent('Research');
		expect(preview).toHaveTextContent('Research customer feedback');
		expect(preview).toHaveTextContent('Jira');
		expect(await screen.findAllByTestId('skill-icon')).toHaveLength(2);
		await expect(container).toBeAccessible();
	});

	it('renders the title when an older or custom Skill item has no module key', async () => {
		const item = createItem({ moduleKey: undefined, lozenge: undefined });

		await renderAndFlushIcons(
			<div aria-label="Quick insert" role="listbox">
				<QuickInsertSkillMenuItem
					apiRef={{ current: undefined }}
					editorActions={{} as never}
					item={item}
				/>
			</div>,
		);
		expect(screen.getByRole('option', { name: item.title })).toHaveTextContent('Research');
	});

	it('does not render a preview for unselected or offline Skills', async () => {
		const item = createItem();
		const { rerender } = await renderAndFlushIcons(
			<div aria-label="Quick insert" role="listbox">
				<QuickInsertSkillMenuItem
					apiRef={{ current: undefined }}
					editorActions={{} as never}
					item={item}
				/>
			</div>,
		);
		expect(screen.queryByTestId('quick-insert-preview-panel')).not.toBeInTheDocument();

		setQuickInsertContext({ isOffline: true, isSelected: true });
		await act(async () => {
			rerender(
				<div aria-label="Quick insert" role="listbox">
					<QuickInsertSkillMenuItem
						apiRef={{ current: undefined }}
						editorActions={{} as never}
						item={item}
					/>
				</div>,
			);
			await Promise.resolve();
			await Promise.resolve();
		});
		expect(screen.queryByTestId('quick-insert-preview-panel')).not.toBeInTheDocument();
	});

	it('delegates selection and insertion completion to the shared extension executor', async () => {
		jest.mocked(executeExtensionQuickInsertItem).mockReturnValue({} as never);
		const onInsert = jest.fn();
		const item = createItem();

		await renderAndFlushIcons(
			<div aria-label="Quick insert" role="listbox">
				<QuickInsertSkillMenuItem
					apiRef={{ current: undefined }}
					editorActions={{} as never}
					item={item}
					onInsert={onInsert}
				/>
			</div>,
		);

		fireEvent.click(screen.getByRole('option', { name: item.title }));

		expect(executeExtensionQuickInsertItem).toHaveBeenCalledWith(expect.objectContaining({ item }));
		expect(executeExtensionQuickInsertItem).toHaveBeenCalledWith(
			expect.objectContaining({ source: INPUT_METHOD.QUICK_INSERT }),
		);
		expect(onInsert).toHaveBeenCalledTimes(1);
	});

	it('renders and executes a Skill from the Element Browser card', async () => {
		setQuickInsertContext({ isSelected: true, surface: 'element-browser' });
		jest.mocked(executeExtensionQuickInsertItem).mockReturnValue({} as never);
		const item = createItem();
		const onInsert = jest.fn();

		await renderAndFlushIcons(
			<div aria-label="Quick insert" role="listbox">
				<QuickInsertSkillMenuItem
					apiRef={{ current: undefined }}
					editorActions={{} as never}
					item={item}
					onInsert={onInsert}
				/>
			</div>,
		);

		const option = screen.getByRole('option', { name: item.title });
		expect(option).toHaveTextContent('/research');
		expect(option).toHaveTextContent('Beta');
		expect(screen.queryByTestId('quick-insert-preview-panel')).not.toBeInTheDocument();
		fireEvent.click(option);
		expect(executeExtensionQuickInsertItem).toHaveBeenCalledWith(expect.objectContaining({ item }));
		expect(executeExtensionQuickInsertItem).toHaveBeenCalledWith(
			expect.objectContaining({ source: INPUT_METHOD.ELEMENT_BROWSER }),
		);
		expect(onInsert).toHaveBeenCalledTimes(1);
	});

	it('does not execute a disabled Element Browser Skill', async () => {
		setQuickInsertContext({ isOffline: true, isSelected: true, surface: 'element-browser' });
		const item = createItem();

		await renderAndFlushIcons(
			<div aria-label="Quick insert" role="listbox">
				<QuickInsertSkillMenuItem
					apiRef={{ current: undefined }}
					editorActions={{} as never}
					item={item}
				/>
			</div>,
		);

		const option = screen.getByRole('option', { name: item.title });
		expect(option).toBeDisabled();
		fireEvent.click(option);
		expect(executeExtensionQuickInsertItem).not.toHaveBeenCalled();
	});
});
