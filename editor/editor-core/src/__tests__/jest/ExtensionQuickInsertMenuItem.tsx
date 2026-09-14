import React from 'react';

import { EditorState } from 'prosemirror-state';

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { MenuItem } from '@atlaskit/editor-common/extensions';
import { QuickInsertProvider } from '@atlaskit/editor-common/quick-insert/provider';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { ExtensionQuickInsertMenuItem } from '../../ui/quick-insert/ExtensionQuickInsertMenuItem';

jest.mock('@atlaskit/icon/core/whiteboard', () => ({
	__esModule: true,
	default: () => <div data-testid="whiteboard-icon" />,
}));

const item = {
	categories: ['Extensions'],
	extensionKey: 'extension',
	extensionType: 'com.atlassian.extension',
	featured: false,
	key: 'extension:default',
	keywords: [],
	node: { type: 'extension' },
	title: 'Extension',
} as unknown as MenuItem;

describe('ExtensionQuickInsertMenuItem', () => {
	it('inserts direct extension items and preserves onInsert and analytics', async () => {
		const transaction = {};
		const insert = jest.fn(() => transaction);
		const onInsert = jest.fn();
		const createAnalyticsEvent = jest.fn(() => ({ fire: jest.fn() }));
		const select = jest.fn();
		const state = EditorState.create({
			doc: defaultSchema.nodes.doc.create(defaultSchema.nodes.paragraph.create()),
		});

		const { container } = render(
			<div aria-label="Quick insert" role="listbox">
				<QuickInsertProvider
					value={{
						editorView: { state } as never,
						isOffline: false,
						item: { id: item.key, isSelected: false },
						select,
						surface: 'typeahead',
					}}
				>
					<ExtensionQuickInsertMenuItem
						apiRef={{ current: undefined }}
						createAnalyticsEvent={createAnalyticsEvent as never}
						editorActions={{ replaceSelection: jest.fn() } as never}
						item={item}
						onInsert={onInsert}
					/>
				</QuickInsertProvider>
			</div>,
		);

		await expect(container).toBeAccessible();
		await userEvent.click(screen.getByRole('option', { name: 'Extension' }));
		const selectionHandler = select.mock.calls[0]?.[0];

		expect(selectionHandler).toBeDefined();
		expect(
			selectionHandler({
				insert,
				source: INPUT_METHOD.INSERT_MENU,
			}),
		).toBe(transaction);
		expect(insert).toHaveBeenCalledWith(item.node);
		expect(onInsert).toHaveBeenCalledTimes(1);
		expect(createAnalyticsEvent).toHaveBeenCalled();
	});

	it('uses EditorActions to insert asynchronous extension items when the API is unavailable', async () => {
		const transaction = {};
		const insert = jest.fn(() => transaction);
		const select = jest.fn();
		const editorActions = { replaceSelection: jest.fn() };
		const state = EditorState.create({
			doc: defaultSchema.nodes.doc.create(defaultSchema.nodes.paragraph.create()),
		});
		const asyncItem = {
			...item,
			node: () => Promise.resolve({ type: 'hardBreak' }),
			title: 'Async extension',
		};

		render(
			<div aria-label="Quick insert" role="listbox">
				<QuickInsertProvider
					value={{
						editorView: { state } as never,
						isOffline: false,
						item: { id: asyncItem.key, isSelected: false },
						select,
						surface: 'typeahead',
					}}
				>
					<ExtensionQuickInsertMenuItem
						apiRef={{ current: undefined }}
						editorActions={editorActions as never}
						item={asyncItem}
					/>
				</QuickInsertProvider>
			</div>,
		);

		await userEvent.click(screen.getByRole('option', { name: 'Async extension' }));
		const selectionHandler = select.mock.calls[0]?.[0];

		selectionHandler({ insert, source: INPUT_METHOD.QUICK_INSERT });
		await new Promise((resolve) => process.nextTick(resolve));

		expect(insert).toHaveBeenCalledWith('');
		expect(editorActions.replaceSelection).toHaveBeenCalledWith({ type: 'hardBreak' });
	});

	it.each([
		'whiteboard-extension:create-whiteboard',
		'whiteboard-extension:create-diagram',
		'whiteboard-extension:create-flowchart',
		'whiteboard-extension:create-brainstorming',
		'whiteboard-extension:create-retrospective',
		'whiteboard-extension:create-roadmap',
	])('uses the Whiteboard icon for %s', (key) => {
		const state = EditorState.create({
			doc: defaultSchema.nodes.doc.create(defaultSchema.nodes.paragraph.create()),
		});

		render(
			<div aria-label="Quick insert" role="listbox">
				<QuickInsertProvider
					value={{
						editorView: { state } as never,
						isOffline: false,
						item: { id: key, isSelected: false },
						select: jest.fn(),
						surface: 'typeahead',
					}}
				>
					<ExtensionQuickInsertMenuItem
						apiRef={{ current: undefined }}
						editorActions={{ replaceSelection: jest.fn() } as never}
						item={{ ...item, key }}
					/>
				</QuickInsertProvider>
			</div>,
		);

		expect(screen.getByTestId('whiteboard-icon')).toBeInTheDocument();
	});
});
