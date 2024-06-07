import { expect, test } from '@af/integration-testing';

import { JQLEditorPage } from './page';

test.describe('JQL Editor next', () => {
	test('renders correctly', async ({ page }) => {
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await expect(jqlEditor.input).toHaveText('issuetype = bug order by rank');
	});
});
