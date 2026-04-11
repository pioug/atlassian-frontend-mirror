import { classifyNavigationIntent } from '../../../src/common/utils/classifyNavigationIntent';

const cases = [
	// Relative navigation
	['/wiki/people/foo', 'navigation'],
	['people/team/abc', 'navigation'],
	// Production first-party
	['https://home.atlassian.com/o/org/people', 'navigation'],
	['https://tenant.atlassian.net/wiki', 'navigation'],
	['https://acme.jira.com/jira/software/FOO', 'navigation'],
	['https://bitbucket.org/wspace/repo', 'navigation'],
	['https://api.atl-paas.net/x', 'navigation'],
	// Staging first-party
	['https://tenant.staging.atlassian.io/', 'navigation'],
	['https://x.atl-test.space/y', 'navigation'],
	['https://tenant.jira-dev.com/jira', 'navigation'],
	['https://tenant.stg-jira.com/browse/X', 'navigation'],
	['https://build.staging.paas-inf.net/', 'navigation'],
	['https://home.stg.atlassian.com/foo', 'navigation'],
	['https://stg-east.frontend.public.atl-paas.net/', 'navigation'],
	['https://tenant.staging.public.atl-paas.net/x', 'navigation'],
	['https://tenant.stg.atlassian-us-gov-mod.com/browse/X', 'navigation'],
	// FedRAMP / isolated helpers
	['https://home.atlassian-us-gov-mod.com/', 'navigation'],
	['https://tenant.atlassian-isolated.net/id', 'navigation'],
	// Reference sites (subset of atlassian.com)
	['https://support.atlassian.com/help', 'reference'],
	['https://developer.atlassian.com/doc', 'reference'],
	['https://community.atlassian.com/x', 'reference'],
	['https://docs.support.atlassian.com/kb', 'reference'],
	// External
	['https://example.com/', 'external'],
	['https://api.slack.com/foo', 'external'],
	['https://fake.jira-dev.com.evil.test/z', 'external'],
	['https://tenant.stg-jira.com.attacker.net/', 'external'],
	['mailto:test@example.com', 'external'],
	// Unparseable URL -> unknown)
	['http://%', 'unknown'],
];

it.each(cases)('%s -> %s', (href, intent) => {
	expect(classifyNavigationIntent(href)).toBe(intent);
});
