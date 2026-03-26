import { resourceTypeToLabel } from '../resourceTypeToLabel';

describe('resourceTypeToLabel', () => {
	it('returns undefined for empty input', () => {
		expect(resourceTypeToLabel(undefined)).toBeUndefined();
		expect(resourceTypeToLabel('')).toBeUndefined();
		expect(resourceTypeToLabel('   ')).toBeUndefined();
	});

	it('returns undefined for excluded resource types', () => {
		expect(resourceTypeToLabel('0')).toBeUndefined();
		expect(resourceTypeToLabel('unknown')).toBeUndefined();
		expect(resourceTypeToLabel('unsupported')).toBeUndefined();
		expect(resourceTypeToLabel('REDACTED')).toBeUndefined();
	});

	it('returns manual mapping when key matches exactly', () => {
		expect(resourceTypeToLabel('jswBoard')).toBe('Jira Software Board');
		expect(resourceTypeToLabel('calendarJsw')).toBe('Jira Software Calendar');
		expect(resourceTypeToLabel('kbArticle')).toBe('Knowledge Base Article');
		expect(resourceTypeToLabel('pull')).toBe('Pull Request');
		expect(resourceTypeToLabel('repo')).toBe('Repository');
	});

	it('title-cases a simple lowercase token', () => {
		expect(resourceTypeToLabel('page')).toBe('Page');
		expect(resourceTypeToLabel('issue')).toBe('Issue');
	});

	it('splits kebab-case and title-cases each segment', () => {
		expect(resourceTypeToLabel('pull-request')).toBe('Pull Request');
		expect(resourceTypeToLabel('public-link')).toBe('Public Link');
	});

	it('splits camelCase and title-cases each segment', () => {
		expect(resourceTypeToLabel('sharepointFile')).toBe('Sharepoint File');
		expect(resourceTypeToLabel('mergeRequest')).toBe('Merge Request');
	});

	it('trims surrounding whitespace before processing', () => {
		expect(resourceTypeToLabel('  page  ')).toBe('Page');
	});
});
