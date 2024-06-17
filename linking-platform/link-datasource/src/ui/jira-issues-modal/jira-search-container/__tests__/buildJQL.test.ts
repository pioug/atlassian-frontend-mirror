import { type BasicFilterFieldType } from '../../basic-filters/types';
import { buildJQL } from '../buildJQL';

describe('buildJQL', () => {
	it('outputs JQL with the default order keys', () => {
		const jql = buildJQL({
			rawSearch: 'testing',
			orderDirection: 'DESC',
			orderKey: 'created',
		});

		expect(jql).toEqual('text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC');
	});

	it('outputs JQL with the provided order keys', () => {
		const jql = buildJQL({
			rawSearch: 'testing',
			orderDirection: 'ASC',
			orderKey: 'status',
		});

		expect(jql).toEqual('text ~ "testing*" or summary ~ "testing*" ORDER BY status ASC');
	});

	it('returns default query when raw search is empty', () => {
		const jql = buildJQL({
			rawSearch: ' ',
		});
		expect(jql).toEqual('ORDER BY created DESC');
	});

	it('omits fuzzy search search term with quotations', () => {
		const jql = buildJQL({
			rawSearch: '"testing"',
		});

		expect(jql).toEqual('text ~ testing or summary ~ testing ORDER BY created DESC');
	});

	it('parses a jira issue key as expected', () => {
		const jql = buildJQL({
			rawSearch: 'EDM-6023',
		});

		expect(jql).toEqual(
			'text ~ "EDM-6023*" or summary ~ "EDM-6023*" or key = EDM-6023 ORDER BY created DESC',
		);
	});

	it('parses a lowercase jira issue key as expected', () => {
		const jql = buildJQL({
			rawSearch: 'edm-6023',
		});

		expect(jql).toEqual(
			'text ~ "edm-6023*" or summary ~ "edm-6023*" or key = edm-6023 ORDER BY created DESC',
		);
	});

	it('removes quotations and question marks', () => {
		const jql = buildJQL({
			rawSearch: '"?',
		});

		expect(jql).toEqual('text ~ "*" or summary ~ "*" ORDER BY created DESC');
	});

	it('jql does not break into a new line when search text is too long', () => {
		const jql = buildJQL({
			rawSearch:
				'very long text very long text very long text very long text very long text very long text very long text very long text',
		});

		expect(jql).toEqual(
			'text ~ "very long text very long text very long text very long text very long text very long text very long text very long text*" or summary ~ "very long text very long text very long text very long text very long text very long text very long text very long text*" ORDER BY created DESC',
		);
	});

	describe('using Basic Filters', () => {
		it('should create correct jql when rawSearch and filterValues are empty', () => {
			const jql = buildJQL({
				rawSearch: '',
				filterValues: {},
			});

			expect(jql).toEqual('ORDER BY created DESC');
		});

		it('should create correct jql when filterValues is empty with search term provided', () => {
			const jql = buildJQL({
				rawSearch: 'test',
				filterValues: {},
			});

			expect(jql).toEqual('text ~ "test*" or summary ~ "test*" ORDER BY created DESC');
		});

		it('should create correct jql when both search term and basic filter values are empty', () => {
			const jql = buildJQL({
				rawSearch: '',
				filterValues: { assignee: [], type: [], project: [], status: [] },
			});

			expect(jql).toEqual('ORDER BY created DESC');
		});

		it('should create the default query when filterValues contains key other than those in availableBasicFilterTypes', () => {
			const jql = buildJQL({
				rawSearch: '',
				filterValues: {
					wrongKey: [
						{
							label: 'Commitment Register',
							value: 'Commitment Register',
							optionType: 'iconLabel',
							icon: '',
						},
					],
				} as any,
			});

			expect(jql).toEqual('ORDER BY created DESC');
		});

		it('should create correct jql when one of the filters have value and other are empty', () => {
			const jql = buildJQL({
				rawSearch: '',
				filterValues: {
					assignee: [],
					type: [],
					project: [
						{
							label: 'Commitment Register',
							value: 'Commitment Register',
							optionType: 'iconLabel',
							icon: '',
						},
					],
					status: [],
				},
			});

			expect(jql).toEqual('project in ("Commitment Register") ORDER BY created DESC');
		});

		it('should create correct jql when one of the filters have value and other are not defined', () => {
			const jql = buildJQL({
				rawSearch: '',
				filterValues: {
					project: [
						{
							label: 'Commitment Register',
							value: 'Commitment Register',
							optionType: 'iconLabel',
							icon: '',
						},
					],
				},
			});

			expect(jql).toEqual('project in ("Commitment Register") ORDER BY created DESC');
		});

		it.each<[BasicFilterFieldType]>([['project'], ['assignee'], ['type'], ['status']])(
			'should create jql with %s field when single value is passed',
			(filterType) => {
				const jql = buildJQL({
					rawSearch: '',
					filterValues: {
						[filterType]: [
							{
								value: 'hello',
							},
						],
					},
				});

				expect(jql).toEqual(`${filterType} in (hello) ORDER BY created DESC`);
			},
		);

		it.each<[BasicFilterFieldType]>([['project'], ['assignee'], ['type'], ['status']])(
			'should create jql with %s field when multiple values are passed',
			(filterType) => {
				const jql = buildJQL({
					rawSearch: '',
					filterValues: {
						[filterType]: [
							{
								value: 'hello',
							},
							{
								value: 'world',
							},
						],
					},
				});

				expect(jql).toEqual(`${filterType} in (hello, world) ORDER BY created DESC`);
			},
		);

		it('should create jql with all fields when all filter fields are supplied', () => {
			const jql = buildJQL({
				rawSearch: '',
				filterValues: {
					project: [
						{
							label: 'Commitment Register',
							value: 'Commitment Register',
							optionType: 'iconLabel',
							icon: '',
						},
					],
					assignee: [
						{
							label: 'Mike Dao',
							value: 'Mike Dao',
							optionType: 'avatarLabel',
							avatar: '',
						},
					],
					type: [
						{
							label: '[CTB]Bug',
							value: '[CTB]Bug',
							optionType: 'iconLabel',
							icon: '',
						},
					],
					status: [
						{
							label: 'Progress',
							value: 'Progress',
							optionType: 'lozengeLabel',
							appearance: 'inprogress',
						},
					],
				},
			});

			expect(jql).toEqual(
				`project in (\"Commitment Register\") and assignee in (\"Mike Dao\") and type in (\"[CTB]Bug\") and status in (Progress) ORDER BY created DESC`,
			);
		});

		it('should create jql with all fields when rawSearch and all filter field values are supplied', () => {
			const jql = buildJQL({
				rawSearch: 'test',
				filterValues: {
					project: [
						{
							label: 'Commitment Register',
							value: 'Commitment Register',
							optionType: 'iconLabel',
							icon: '',
						},
					],
					assignee: [
						{
							label: 'Mike Dao',
							value: 'Mike Dao',
							optionType: 'avatarLabel',
							avatar: '',
						},
					],
					type: [
						{
							label: '[CTB]Bug',
							value: '[CTB]Bug',
							optionType: 'iconLabel',
							icon: '',
						},
					],
					status: [
						{
							label: 'Progress',
							value: 'Progress',
							optionType: 'lozengeLabel',
							appearance: 'inprogress',
						},
					],
				},
			});

			expect(jql).toEqual(
				`(text ~ \"test*\" or summary ~ \"test*\") and project in (\"Commitment Register\") and assignee in (\"Mike Dao\") and type in (\"[CTB]Bug\") and status in (Progress) ORDER BY created DESC`,
			);
		});
	});
});
