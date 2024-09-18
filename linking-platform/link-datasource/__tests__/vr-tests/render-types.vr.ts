import { snapshot } from '@af/visual-regression';

import RenderAllTypes from '../../examples/vr/render-all-types-vr';

// Skipping this test because it's blocking UTEST-1719
// FIXME: Skipping this test as it is failing due to Screenshot comparison failed due to pixel difference
//  Fix it after Playwright upgrade in AFM: UTEST-1839
snapshot.skip(RenderAllTypes, {
	description: 'Render all types',
});
