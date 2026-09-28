import { snapshot } from '@af/visual-regression';

import { BreadcrumbsFocusRing } from '../../../../examples/0-basic.vr.ap';

for (const testId of ['first-item', 'icon-before-item', 'current-item']) {
	snapshot(BreadcrumbsFocusRing, {
		description: `focus ring ${testId}`,
		featureFlags: {
			'platform_dst_breadcrumbs-refresh': [false, true],
		},
		states: [{ state: 'focused', selector: { byTestId: testId } }],
	});
}
