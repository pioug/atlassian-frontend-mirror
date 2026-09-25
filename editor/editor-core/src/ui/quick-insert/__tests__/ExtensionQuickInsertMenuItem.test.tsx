import React from 'react';

import type { MenuItem } from '@atlaskit/editor-common/extensions';
import { QuickInsertMenuItem } from '@atlaskit/editor-common/quick-insert/menu-item';
import { render } from '@atlassian/testing-library/render';

import { ExtensionQuickInsertMenuItem } from '../ExtensionQuickInsertMenuItem';

jest.mock('@atlaskit/editor-common/quick-insert/menu-item', () => ({
	QuickInsertMenuItem: jest.fn(() => null),
}));
jest.mock('@atlaskit/editor-common/quick-insert/use-quick-insert-context', () => ({
	useQuickInsertContext: () => ({ editorView: {}, isOffline: false }),
}));

describe('ExtensionQuickInsertMenuItem', () => {
	it.each([
		undefined,
		{ attribution: { name: 'Custom app' } },
		{
			image: { light: 'https://example.com/light.png', dark: 'https://example.com/dark.png' },
			attribution: { name: 'Custom app' },
		},
	])('uses the provider preview without inferring metadata from the item key: %p', (preview) => {
		const item: MenuItem = {
			categories: [],
			description: 'Localized description',
			extensionKey: 'jira',
			extensionType: 'com.atlassian.confluence.macro.core',
			featured: false,
			icon: () => Promise.resolve({ default: () => null }),
			key: 'jira:jira',
			keywords: [],
			node: { type: 'extension', attrs: {} },
			preview,
			title: 'Localized title',
		};

		render(
			<ExtensionQuickInsertMenuItem
				apiRef={{ current: undefined }}
				editorActions={{} as never}
				item={item}
			/>,
		);

		expect(jest.mocked(QuickInsertMenuItem).mock.lastCall?.[0]).toEqual(
			expect.objectContaining({
				description: item.description,
				preview,
				title: item.title,
			}),
		);
	});
});
