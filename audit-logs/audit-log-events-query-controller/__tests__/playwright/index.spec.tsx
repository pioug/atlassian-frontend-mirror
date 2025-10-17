import { expect, test } from '@af/integration-testing';

const exampleComponent =
	"[data-testid='audit-log-events-query-controller-events-query-controller-container']";

test('AuditLogEventsQueryController should be able to be identified by data-testid', async ({
	page,
}) => {
	await page.visitExample('audit-logs', 'audit-log-events-query-controller', 'basic');
	await expect(page.locator(exampleComponent).first()).toBeVisible();
});
