import { snapshot } from '@af/visual-regression';

import { PrimitivesFocusRing } from '../../../../examples/6-primitives.vr.ap';

for (const testId of [
	'custom-medium-item-0',
	'custom-medium-item-1',
	'custom-medium-item-2',
	'custom-medium-item-4',
	'custom-small-item-1',
	'custom-small-item-2',
	'custom-add',
]) {
	snapshot(PrimitivesFocusRing, {
		description: `primitives focus ring ${testId}`,
		featureFlags: {
			'platform_dst_breadcrumbs-refresh': [false, true],
		},
		states: [{ state: 'focused', selector: { byTestId: testId } }],
	});
}
