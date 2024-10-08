import { ffTest } from '@atlassian/feature-flags-test-utils';

import { widthToToolbarSize } from '../../../ui/Toolbar/toolbar-size';

describe('widthToToolbarSize', () => {
	ffTest(
		'platform_editor_toolbar_responsive_fixes',
		() => {
			expect(widthToToolbarSize(1280, 'full-page')).toBe(6);
			expect(widthToToolbarSize(1024, 'full-page')).toBe(5);
			expect(widthToToolbarSize(800, 'full-page')).toBe(4);
			expect(widthToToolbarSize(640, 'full-page')).toBe(3);
			expect(widthToToolbarSize(480, 'full-page')).toBe(2);
			expect(widthToToolbarSize(320, 'full-page')).toBe(1);

			expect(widthToToolbarSize(800)).toBe(6);
			expect(widthToToolbarSize(640)).toBe(5);
			expect(widthToToolbarSize(480)).toBe(4);
			expect(widthToToolbarSize(455)).toBe(3);
			expect(widthToToolbarSize(420)).toBe(2);
			expect(widthToToolbarSize(320)).toBe(1);
		},
		() => {},
	);
});
