import { JastBuilder } from '../api';

import { JqlAnonymizerVisitor } from './jql-anonymizer-visitor';

const queries = [
	{
		raw: '',
		anonymized: '',
	},
	{
		raw: 'project = jsw',
		anonymized: 'project = "?"',
	},
	{
		raw: 'project in (jsw, jsd)',
		anonymized: 'project in ("?", "?")',
	},
	{
		raw: 'project in (jsw, empty, projectsLeadByUser())',
		anonymized: 'project in ("?", empty, projectsLeadByUser())',
	},
	{
		raw: 'assignee != currentUser()',
		anonymized: 'assignee != currentUser()',
	},
	{
		raw: 'status in cascadeOption("Australia", "Sydney")',
		anonymized: 'status in cascadeOption("?", "?")',
	},
	{
		raw: 'project is empty',
		anonymized: 'project is empty',
	},
	{
		raw: 'project was jsw by jdoe before "2020/08/05"',
		anonymized: 'project was "?" by "?" before "?"',
	},
	{
		raw: 'project changed from jsd to jsw',
		anonymized: 'project changed from "?" to "?"',
	},
	{
		raw: 'not project ~ jsw',
		anonymized: 'not project ~ "?"',
	},
	{
		raw: 'not project ~ jsw and assignee = currentUser()',
		anonymized: 'not project ~ "?" and assignee = currentUser()',
	},
	{
		raw: 'not (project ~ jsw and assignee = currentUser())',
		anonymized: 'not (project ~ "?" and assignee = currentUser())',
	},
	{
		raw: 'project = jsw and assignee = currentUser()',
		anonymized: 'project = "?" and assignee = currentUser()',
	},
	{
		raw: 'project = jsw or assignee = currentUser()',
		anonymized: 'project = "?" or assignee = currentUser()',
	},
	{
		raw: 'project = jsw and assignee = currentUser() and reporter = currentUser()',
		anonymized: 'project = "?" and assignee = currentUser() and reporter = currentUser()',
	},
	{
		raw: 'project = jsw and assignee = currentUser() or reporter = currentUser()',
		anonymized: '(project = "?" and assignee = currentUser()) or reporter = currentUser()',
	},
	{
		raw: 'project = jsw and (assignee = currentUser() or reporter = currentUser())',
		anonymized: 'project = "?" and (assignee = currentUser() or reporter = currentUser())',
	},
	{
		// Only parenthesis that affect precedence can be derived from AST
		raw: '(project = jsw and assignee = currentUser() or reporter = currentUser())',
		anonymized: '(project = "?" and assignee = currentUser()) or reporter = currentUser()',
	},
	{
		raw: 'order by assignee, created desc',
		anonymized: 'ORDER BY assignee, created DESC',
	},
	{
		raw: 'project = jsw and assignee = currentUser() order by created desc',
		anonymized: 'project = "?" and assignee = currentUser() ORDER BY created DESC',
	},
	{
		raw: 'assignee.property[key].property.path = value',
		anonymized: 'assignee.property[key].property.path = "?"',
	},
	{
		raw: '"project" = jsw and \'assignee\' = currentUser() order by created desc',
		anonymized: '"project" = "?" and \'assignee\' = currentUser() ORDER BY created DESC',
	},
	{
		raw: 'project = jsw AND issuetype = Bug AND status in (Open, "In Progress", "Merging", Done) AND cf[12345] in (P0, P1, P2, P3) AND "Version[Text]" = "127.0.1" ORDER BY "Custom field[Dropdown]" DESC',
		anonymized:
			'project = "?" and issuetype = "?" and status in ("?", "?", "?", "?") and cf[12345] in ("?", "?", "?", "?") and "?[Text]" = "?" ORDER BY "?[Dropdown]" DESC',
	},
];

const builder = new JastBuilder();

describe('JQL Anonymizer', () => {
	queries.forEach((query) => {
		it(query.raw, () => {
			const ast = builder.build(query.raw);
			const jqlAnonymizer = new JqlAnonymizerVisitor();
			const anonymized = ast.query ? ast.query.accept(jqlAnonymizer) : undefined;
			expect(anonymized).toBe(query.anonymized);
		});
	});
});
