import React from 'react';

import type { MenuItem } from '@atlaskit/editor-common/extensions/types/utils';
import { QuickInsertMenuItem } from '@atlaskit/editor-common/quick-insert/menu-item';
import { render } from '@atlassian/testing-library/render';

import { useAppVendorName } from '../app-vendor/useAppVendorName';
import { ExtensionQuickInsertMenuItem } from '../ExtensionQuickInsertMenuItem';

jest.mock('@atlaskit/editor-common/quick-insert/menu-item', () => ({
	QuickInsertMenuItem: jest.fn(() => null),
}));
jest.mock('@atlaskit/editor-common/quick-insert/use-quick-insert-context', () => ({
	useQuickInsertContext: () => ({ editorView: {}, isOffline: false }),
}));
jest.mock('../app-vendor/useAppVendorName', () => ({
	useAppVendorName: jest.fn(),
}));

const createItem = (overrides: Partial<MenuItem> = {}): MenuItem => ({
	categories: [],
	description: 'Localized description',
	extensionKey: 'jira',
	extensionType: 'com.atlassian.confluence.macro.core',
	featured: false,
	icon: () => Promise.resolve({ default: () => null }),
	key: 'jira:jira',
	keywords: [],
	node: { type: 'extension', attrs: {} },
	title: 'Localized title',
	...overrides,
});

const ecosystemApp = { key: 'com.gliffy.integration.confluence', source: 'ecosystem' as const };

const renderMenuItem = (item: MenuItem, prefetchVendors?: () => void) =>
	render(
		<ExtensionQuickInsertMenuItem
			apiRef={{ current: undefined }}
			editorActions={{} as never}
			item={item}
			prefetchVendors={prefetchVendors}
		/>,
	);

const getRenderedPreview = () => jest.mocked(QuickInsertMenuItem).mock.lastCall?.[0].preview;

describe('ExtensionQuickInsertMenuItem', () => {
	beforeEach(() => {
		jest.mocked(useAppVendorName).mockReset();
	});

	it.each([
		undefined,
		{ attribution: { name: 'Custom app' } },
		{
			image: { light: 'https://example.com/light.png', dark: 'https://example.com/dark.png' },
			attribution: { name: 'Custom app' },
		},
	])('uses the provider preview without inferring metadata from the item key: %p', (preview) => {
		const item = createItem({ lozenge: 'Beta', preview });

		renderMenuItem(item);

		expect(jest.mocked(QuickInsertMenuItem).mock.lastCall?.[0]).toEqual(
			expect.objectContaining({
				description: item.description,
				lozenge: 'Beta',
				preview,
				title: item.title,
			}),
		);
	});

	describe('vendor byline', () => {
		it('prefetches vendors on mount and shows the resolved vendor as the attribution', () => {
			jest.mocked(useAppVendorName).mockReturnValue('Gliffy');
			const prefetchVendors = jest.fn();
			const image = { light: 'https://example.com/light.png' };

			renderMenuItem(createItem({ app: ecosystemApp, preview: { image } }), prefetchVendors);

			expect(prefetchVendors).toHaveBeenCalledTimes(1);
			expect(useAppVendorName).toHaveBeenLastCalledWith(`connect:${ecosystemApp.key}`);
			expect(getRenderedPreview()).toEqual({ image, attribution: { name: 'Gliffy' } });
		});

		it.each([
			['while the vendor is loading', undefined],
			['for unlisted apps', null],
		])('shows no attribution %s', (_, vendorName) => {
			jest.mocked(useAppVendorName).mockReturnValue(vendorName);

			renderMenuItem(createItem({ app: ecosystemApp }), jest.fn());

			expect(getRenderedPreview()).toBeUndefined();
		});

		it('keeps an attribution supplied by the manifest', () => {
			jest.mocked(useAppVendorName).mockReturnValue('Gliffy');
			const preview = { attribution: { name: 'Manifest vendor' } };

			renderMenuItem(createItem({ app: ecosystemApp, preview }), jest.fn());

			expect(getRenderedPreview()).toBe(preview);
		});
	});
});
