import { editorTestCase as test } from '@af/editor-libra/editor-test-case';
import { expect } from '@af/editor-libra/matchers';

test.use({
	exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
	editorProps: {
		appearance: 'full-page',
		allowExtension: {
			allowBreakout: true,
		},
	},
	editorMountOptions: {
		withConfluenceMacrosExtensionProvider: true,
	},
});

const loaderImplementations = [
	{ implementation: 'react-loosely-lazy', useLooselyLazy: true },
	{ implementation: 'react-loadable (legacy)', useLooselyLazy: false },
];

loaderImplementations.forEach(({ implementation, useLooselyLazy }) => {
	test.describe('Extension quick insert icon with ' + implementation, () => {
		test.use({
			platformFeatureFlags: {
				platform_editor_loosely_lazy_migration: useLooselyLazy,
			},
		});

		test('shows the extension icon in the slash menu', async ({ editor }) => {
			await editor.typeAhead.search('User Profile');
			const item = editor.typeAhead.popup.getByLabel('User Profile', { exact: true });
			await expect(item).toBeVisible();
			await expect(item.locator('svg')).toBeVisible();
		});
	});
});
