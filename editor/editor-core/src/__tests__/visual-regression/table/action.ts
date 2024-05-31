// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	initFullPageEditorWithAdf,
	snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/table-with-action.adf.json';

describe('Table with action looks correct for fullpage:', () => {
	let page: PuppeteerPage;

	beforeAll(async () => {
		page = global.page;
	});

	afterEach(async () => {
		await snapshot(page);
	});

	it('default layout ', async () => {
		await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
	});
});
