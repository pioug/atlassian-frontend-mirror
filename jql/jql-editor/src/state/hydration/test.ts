import { type StoreActionApi } from 'react-sweet-state';

import { JastBuilder } from '@atlaskit/jql-ast/jast-builder';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';

import { JQLEditorSchema } from '../../schema';
import { actions, initialState } from '../index';
import type { Props, State } from '../types';
import { hydrateQuery } from './index';
import { normaliseHydrationKey } from './normaliseHydrationKey';
import { ValidQueryVisitor } from './ValidQueryVisitor';

describe('Focus Area hydration keys', () => {
	it.each([true, false])(
		'normalises Focus Area keys only in the treatment cohort (%s)',
		async (enabled) => {
			if (enabled) {
				mockExpEnabled('focus_in_jira_m1');
			} else {
				mockExpDisabled('focus_in_jira_m1');
			}
			const focusArea = { type: 'focusArea' as const, id: 'focus-area-1', name: 'Cloud Migration' };
			const state = {
				...initialState,
				query: 'focusArea = "focus-area-1"',
				enableRichInlineNodes: true,
			};
			const setState = jest.fn();
			const props: Props = {
				autocompleteProvider: state.autocompleteProvider,
				createAndFireAnalyticsEvent: jest.fn(),
				enableRichInlineNodes: true,
				externalMessages: [],
				intlRef: state.intlRef,
				isSearching: state.isSearching,
				query: state.query,
				onHydrate: async () => ({ focusArea: [focusArea] }),
			};
			await hydrateQuery()({ getState: () => state, setState, dispatch: jest.fn() }, props);
			expect(setState).toHaveBeenCalledWith({
				hydratedValues: {
					[enabled ? 'focusarea' : 'focusArea']: new Map([[focusArea.id, focusArea]]),
				},
			});
		},
	);
});

describe('initial editor hydration', () => {
	beforeEach(() => {
		jest.spyOn(actions, 'getAutocompleteSuggestions').mockReturnValue(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each([true, false])(
		'hydrates the initial query before user interaction (focus experiment: %s)',
		async (enabled) => {
			if (enabled) {
				mockExpEnabled('focus_in_jira_m1');
			} else {
				mockExpDisabled('focus_in_jira_m1');
			}
			mockExpDisabled('atlassian_projects_-_native_integration');
			const query = '"FocusArea" = "focus-area-1" AND assignee = user-1';
			const focusArea = { type: 'focusArea' as const, id: 'focus-area-1', name: 'Cloud Migration' };
			const user = { type: 'user' as const, id: 'user-1', name: 'Test User', avatarUrl: '' };
			const onHydrate = jest.fn(async () => ({ FocusArea: [focusArea], assignee: [user] }));
			let state: State = { ...initialState, enableRichInlineNodes: true };
			const props: Props = {
				autocompleteProvider: state.autocompleteProvider,
				createAndFireAnalyticsEvent: jest.fn(),
				enableRichInlineNodes: true,
				externalMessages: [],
				intlRef: state.intlRef,
				isSearching: state.isSearching,
				query,
				onHydrate,
			};
			const api: StoreActionApi<State> = {
				getState: () => state,
				setState: (update) => {
					state = { ...state, ...update };
				},
				dispatch: jest.fn((action) => action(api, props)),
			};
			actions.initialiseEditorState()(api, props);
			await onHydrate.mock.results[0].value;

			expect(onHydrate).toHaveBeenCalledWith(query);
			expect(state.editorState.doc.textContent).toBe(query);
			const nodeTypes: string[] = [];
			state.editorState.doc.descendants((node) => {
				nodeTypes.push(node.type.name);
			});
			expect(nodeTypes).toContain(JQLEditorSchema.nodes.user.name);
			if (enabled) {
				expect(nodeTypes).toContain(JQLEditorSchema.nodes.focusArea.name);
			} else {
				expect(nodeTypes).not.toContain(JQLEditorSchema.nodes.focusArea.name);
			}
		},
	);
});

// Base queries that don't involve membersOf
const baseQueries = [
	{
		// Incomplete list
		original: 'assignee in (abc-123-def',
		valid: 'assignee in (abc-123-def)',
	},
	{
		// Incomplete list with multiple values
		original: 'assignee in (abc-123-def, 123-abc-456',
		valid: 'assignee in (abc-123-def, 123-abc-456)',
	},
	{
		// Incomplete predicate
		original: 'assignee was abc-123-def before',
		valid: 'assignee was abc-123-def',
	},
	{
		// NOT clause
		original: 'not assignee in (abc-123-def',
		valid: 'assignee in (abc-123-def)',
	},
	{
		// AND clause
		original: 'summary ~ test and assignee in (abc-123-def, 123-abc-456',
		valid: 'summary ~ test and assignee in (abc-123-def, 123-abc-456)',
	},
	{
		// OR clause
		original: 'summary ~ test or assignee in (abc-123-def, 123-abc-456',
		valid: 'summary ~ test and assignee in (abc-123-def, 123-abc-456)',
	},
	{
		// ORDER BY clause
		original: 'assignee in (abc-123-def order by summary desc',
		valid: 'assignee in (abc-123-def)',
	},
	{
		// Ignoring function and keyword operands (except membersOf)
		original: 'project = EM and status in (Done, currentUser(), EMPTY) and reporter in',
		valid: 'project = EM and status in (Done)',
	},
	{
		// Ignoring predicate operands (currently unsupported by hydration API and autocomplete)
		original:
			'assignee = abc-123-def or assignee changed from 123-abc-456 to 123-abc-456 by 123-abc-456',
		valid: 'assignee = abc-123-def',
	},
	{
		// Complex query with multiple errors
		original:
			'project not in (EM, "MC", currentUser(), EMPTY or reporter and "Custom field[People]" = abc-123-def order by created asc',
		valid: 'project not in (EM, "MC") and "Custom field[People]" = abc-123-def',
	},
	{
		// Reserved words
		original: 'field = value and ',
		valid: '',
	},
	{
		// When last item in list is a function
		original: 'project = EM and status in (Done, currentUser()',
		valid: 'project = EM and status in (Done)',
	},
];

// membersOf queries when feature flag is ON
const membersOfQueriesFlagOn = [
	{
		// membersOf function with complete argument
		original: 'assignee in membersOf("id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c")',
		valid: 'assignee in membersOf("id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c")',
	},
	{
		// membersOf function with incomplete query
		original: 'assignee in membersOf("id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c") and reporter in',
		valid: 'assignee in membersOf("id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c")',
	},
	{
		// membersOf function in list
		original: 'assignee in (user-123, membersOf("team-id"))',
		valid: 'assignee in (user-123, membersOf("team-id"))',
	},
	{
		// Multiple membersOf functions
		original: 'assignee in membersOf("team-1") and reporter in membersOf("team-2")',
		valid: 'assignee in membersOf("team-1") and reporter in membersOf("team-2")',
	},
];

// membersOf queries when feature flag is OFF - membersOf should be excluded
const membersOfQueriesFlagOff = [
	{
		// membersOf function should be excluded when flag is off - entire clause excluded
		original: 'assignee in membersOf("id: a5b5230c-5fea-4a8c-83a2-4f16d125a31c")',
		valid: '',
	},
	{
		// membersOf function in list should be excluded, leaving only user value
		original: 'assignee in (user-123, membersOf("team-id"))',
		valid: 'assignee in (user-123)',
	},
];

const visitor = new ValidQueryVisitor();

describe('ValidQueryVisitor', () => {
	baseQueries.forEach(({ original, valid }) => {
		it(`generates valid query for ${original}`, () => {
			const ast = new JastBuilder().build(original);
			expect(ast.query).toBeDefined();
			if (ast.query) {
				expect(ast.query.accept(visitor)).toEqual(valid);
			}
		});
	});

	describe('membersOf queries with flag ON', () => {
		ffTest.on(
			'jira-membersof-team-support',
			'membersOf function arguments included in hydration query',
			() => {
				membersOfQueriesFlagOn.forEach(({ original, valid }) => {
					it(`generates valid query for ${original}`, () => {
						const ast = new JastBuilder().build(original);
						expect(ast.query).toBeDefined();
						if (ast.query) {
							expect(ast.query.accept(visitor)).toEqual(valid);
						}
					});
				});
			},
		);
	});

	describe('membersOf queries with flag OFF', () => {
		ffTest.off(
			'jira-membersof-team-support',
			'membersOf function arguments excluded from hydration query',
			() => {
				membersOfQueriesFlagOff.forEach(({ original, valid }) => {
					it(`generates valid query for ${original}`, () => {
						const ast = new JastBuilder().build(original);
						expect(ast.query).toBeDefined();
						if (ast.query) {
							expect(ast.query.accept(visitor)).toEqual(valid);
						}
					});
				});
			},
		);
	});

	it('reconstructs agentSessions[agent] for hydration when the experiment is enabled', () => {
		mockExpEnabled('jira_filter_by_agent_and_agent_state');
		const ast = new JastBuilder().build(
			'project = ST and agentSessions[agent] = 712020:112631a1-496c-4253-8260-1d97f7ba8646 order by',
		);
		expect(ast.query).toBeDefined();
		if (ast.query) {
			expect(ast.query.accept(visitor)).toContain(
				'agentSessions[agent] = 712020:112631a1-496c-4253-8260-1d97f7ba8646',
			);
		}
	});

	it('preserves quoted collapsed property-like field text during hydration reconstruction', () => {
		const ast = new JastBuilder().build(
			'project not in (EM, "MC", currentUser(), EMPTY or reporter and "Custom field[People]" = abc-123-def order by created asc',
		);
		expect(ast.query).toBeDefined();
		if (ast.query) {
			expect(ast.query.accept(visitor)).toEqual(
				'project not in (EM, "MC") and "Custom field[People]" = abc-123-def',
			);
		}
	});
});

// descendantsOfTeam queries when the descendantsOfTeam gate is ON
const descendantsOfTeamQueriesGateOn = [
	{
		// descendantsOfTeam with an id-prefixed team argument
		original: '"Team[Team]" in descendantsOfTeam(id:5653b0ca-138f-454a-9884-eabe847f18df)',
		valid: '"Team[Team]" in descendantsOfTeam(id:5653b0ca-138f-454a-9884-eabe847f18df)',
	},
	{
		// descendantsOfTeam preserved when the rest of the query is incomplete
		original:
			'"Team[Team]" in descendantsOfTeam(id:5653b0ca-138f-454a-9884-eabe847f18df) and reporter in',
		valid: '"Team[Team]" in descendantsOfTeam(id:5653b0ca-138f-454a-9884-eabe847f18df)',
	},
];

// descendantsOfTeam queries when the descendantsOfTeam gate is OFF - the function is excluded
const descendantsOfTeamQueriesGateOff = [
	{
		original: '"Team[Team]" in descendantsOfTeam(id:5653b0ca-138f-454a-9884-eabe847f18df)',
		valid: '',
	},
	{
		// Only the direct value part of a combined query is kept
		original:
			'"Team[Team]" in descendantsOfTeam(id:5653b0ca-138f-454a-9884-eabe847f18df) and assignee = user-1',
		valid: 'assignee = user-1',
	},
];

describe('ValidQueryVisitor - descendantsOfTeam', () => {
	describe('with gate ON', () => {
		ffTest.on(
			'jira-descendants-of-team-jql-function',
			'descendantsOfTeam arguments are included in the hydration query',
			() => {
				descendantsOfTeamQueriesGateOn.forEach(({ original, valid }) => {
					it(`generates valid query for ${original}`, () => {
						const ast = new JastBuilder().build(original);
						expect(ast.query).toBeDefined();
						if (ast.query) {
							expect(ast.query.accept(visitor)).toEqual(valid);
						}
					});
				});
			},
		);
	});

	describe('with gate OFF', () => {
		ffTest.off(
			'jira-descendants-of-team-jql-function',
			'descendantsOfTeam arguments are excluded from the hydration query',
			() => {
				descendantsOfTeamQueriesGateOff.forEach(({ original, valid }) => {
					it(`excludes descendantsOfTeam for ${original}`, () => {
						const ast = new JastBuilder().build(original);
						expect(ast.query).toBeDefined();
						if (ast.query) {
							expect(ast.query.accept(visitor)).toEqual(valid);
						}
					});
				});
			},
		);
	});

	describe('gates are independent', () => {
		ffTest.on('jira-descendants-of-team-jql-function', 'descendantsOfTeam gate is enabled', () => {
			ffTest.off('jira-membersof-team-support', 'membersOf gate is disabled', () => {
				it('does not include membersOf', () => {
					const ast = new JastBuilder().build('assignee in membersOf("team-1")');
					expect(ast.query).toBeDefined();
					if (ast.query) {
						expect(ast.query.accept(visitor)).toEqual('');
					}
				});
			});
		});
	});
});

describe('normaliseHydrationKey', () => {
	it('produces the same key for quoted+lowercase and unquoted+propercase field names', () => {
		const fromApi = normaliseHydrationKey('Project[AtlassianProject]');
		const fromEditor = normaliseHydrationKey('\"project[atlassianproject]\"');
		expect(fromApi).toBe(fromEditor);
	});
});

// function-argument hydration queries when gate is ON
const functionArgQueriesFlagOn = [
	{
		// UNDER function with ARI argument
		original: 'focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123")',
		valid: 'focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123")',
	},
	{
		// UNDER function in an AND query
		original:
			'focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123") and assignee = user-1',
		valid:
			'focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123") and assignee = user-1',
	},
	{
		// UNDER function with incomplete query
		original:
			'focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123") and reporter in',
		valid: 'focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123")',
	},
	{
		// multiple of the same function name in an AND query
		original:
			'focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123") and focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-345")',
		valid:
			'focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123") and focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-345")',
	},
	{
		// Custom function with arguments
		original: 'project = customFunction("some-arg")',
		valid: 'project = customFunction("some-arg")',
	},
];

// function-argument hydration queries when gate is OFF - UNDER should be excluded
const functionArgQueriesFlagOff = [
	{
		// UNDER function should be excluded when gate is off
		original: 'focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123")',
		valid: '',
	},
	{
		// Only the direct value part of a combined query is kept
		original:
			'focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123") and assignee = user-1',
		valid: 'assignee = user-1',
	},
];

// Functions with no arguments are always excluded (no hydration possible)
const noArgFunctionQueries = [
	{
		original: 'assignee = currentUser()',
		valid: '',
	},
	{
		original: 'assignee is EMPTY',
		valid: '',
	},
];

describe('ValidQueryVisitor - function-argument hydration', () => {
	describe('generic gate supersedes membersOf gate', () => {
		ffTest.on('jql-function-arg-hydration', 'generic function-arg gate is enabled', () => {
			ffTest.off('jira-membersof-team-support', 'membersOf legacy gate is disabled', () => {
				it('includes membersOf via the generic gate even when the legacy gate is off', () => {
					const ast = new JastBuilder().build(
						'assignee in membersOf("team-1") and focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123")',
					);
					expect(ast.query).toBeDefined();
					if (ast.query) {
						expect(ast.query.accept(visitor)).toEqual(
							'assignee in membersOf("team-1") and focusArea = UNDER("ari:cloud:mercury:DUMMY-TENANT-ID:focus-area/abc-123")',
						);
					}
				});
			});
		});
	});

	describe('with gate ON', () => {
		ffTest.on(
			'jql-function-arg-hydration',
			'function operands with arguments are included in hydration query',
			() => {
				functionArgQueriesFlagOn.forEach(({ original, valid }) => {
					it(`generates valid query for ${original}`, () => {
						const ast = new JastBuilder().build(original);
						expect(ast.query).toBeDefined();
						if (ast.query) {
							expect(ast.query.accept(visitor)).toEqual(valid);
						}
					});
				});
			},
		);
	});

	describe('with gate OFF', () => {
		ffTest.off(
			'jql-function-arg-hydration',
			'function operands with arguments are excluded from hydration query',
			() => {
				functionArgQueriesFlagOff.forEach(({ original, valid }) => {
					it(`excludes function operands for ${original}`, () => {
						const ast = new JastBuilder().build(original);
						expect(ast.query).toBeDefined();
						if (ast.query) {
							expect(ast.query.accept(visitor)).toEqual(valid);
						}
					});
				});
			},
		);
	});

	describe('no-argument functions are excluded', () => {
		noArgFunctionQueries.forEach(({ original, valid }) => {
			it(`excludes ${original}`, () => {
				const ast = new JastBuilder().build(original);
				expect(ast.query).toBeDefined();
				if (ast.query) {
					expect(ast.query.accept(visitor)).toEqual(valid);
				}
			});
		});
	});
});
