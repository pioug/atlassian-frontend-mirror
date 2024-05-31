// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	initFullPageEditorWithAdf,
	snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import * as adfWithDivider from './__fixtures__/divider.adf.json';

describe('Snapshot Test: Divider', () => {
	let page: PuppeteerPage;
	beforeAll(() => {
		page = global.page;
	});

	test('should render the divider node properly', async () => {
		await initFullPageEditorWithAdf(page, adfWithDivider, Device.LaptopMDPI);

		await snapshot(page);
	});
});
