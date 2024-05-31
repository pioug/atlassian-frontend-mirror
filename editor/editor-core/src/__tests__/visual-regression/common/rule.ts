/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
	initFullPageEditorWithAdf,
	snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { getBoundingClientRect } from '@atlaskit/editor-test-helpers/vr-utils/bounding-client-rect';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import * as rule from './__fixtures__/rule-adf.json';

const ruleSelector = 'hr';

// FIXME: Skipping theses tests as it has been failing on master on CI due to "Screenshot comparison failed" issue.
// Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2319963/steps/%7B31b3ca1c-6917-4861-88ed-d816d6fae22f%7D
describe.skip('Rule', () => {
	let page: PuppeteerPage;

	beforeAll(() => {
		page = global.page;
	});

	beforeEach(async () => {
		await initFullPageEditorWithAdf(page, rule, undefined, {
			width: 800,
			height: 300,
		});
	});

	afterEach(async () => {
		await snapshot(page);
	});

	it('displays as selected when clicked on', async () => {
		await page.click(ruleSelector);
	});

	it('displays as selected when click on leniency margin above rule', async () => {
		const contentBoundingRect = await getBoundingClientRect(page, ruleSelector);
		await page.mouse.click(contentBoundingRect.left, contentBoundingRect.top);
	});

	it('displays as selected when click on leniency margin below rule', async () => {
		const contentBoundingRect = await getBoundingClientRect(page, ruleSelector);
		await page.mouse.click(contentBoundingRect.left, contentBoundingRect.bottom);
	});
});
