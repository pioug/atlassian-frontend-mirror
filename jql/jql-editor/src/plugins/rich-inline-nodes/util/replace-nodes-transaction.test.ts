import { type MutableRefObject } from 'react';

import { type IntlShape } from 'react-intl';

import { Node } from '@atlaskit/editor-prosemirror/model';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { JQLEditorSchema } from '../../../schema';
import { type HydratedValuesMap } from '../../../state/types';
import jqlAstPlugin from '../../jql-ast';
import { replaceRichInlineNodes } from './replace-nodes-transaction';

const TEAM_ID = 'id:5653b0ca-138f-454a-9884-eabe847f18df';
const TEAM_NAME = 'Archiveable team 59';
const TEAM_FIELD = 'Team[Team]';

const intlRef = {
	current: {
		formatMessage: ({ defaultMessage }: { defaultMessage?: string }) => defaultMessage ?? '',
	},
} as unknown as MutableRefObject<IntlShape>;

const createEditorState = (jql: string): EditorState =>
	EditorState.create({
		doc: Node.fromJSON(JQLEditorSchema, {
			type: 'doc',
			content: [{ type: 'paragraph', content: [{ type: 'text', text: jql }] }],
		}),
		plugins: [jqlAstPlugin(intlRef)],
	});

const teamHydratedValues = (fieldName: string): HydratedValuesMap => ({
	[fieldName]: new Map([
		[
			TEAM_ID,
			{
				type: 'team' as const,
				id: TEAM_ID,
				name: TEAM_NAME,
				avatarUrl: 'https://example.com/avatar.svg',
			},
		],
	]),
});

/**
 * Applies the hydration transaction for the given query and returns the team nodes it produced.
 */
const hydrateTeamNodes = (jql: string, fieldName: string = TEAM_FIELD): Node[] => {
	const editorState = createEditorState(jql);
	const transaction = replaceRichInlineNodes(editorState, teamHydratedValues(fieldName));

	const teamNodes: Node[] = [];
	editorState.apply(transaction).doc.descendants((node) => {
		if (node.type === JQLEditorSchema.nodes.team) {
			teamNodes.push(node);
		}
	});
	return teamNodes;
};

// Every case below fails `jql-function-arg-hydration`: the generic gate supersedes the per-function
// gates, so it has to stay off for the legacy team-function path to be exercised at all. The legacy
// path is also guarded by `jira-membersof-team-support`, so that gate has to pass before any
// per-function gate is consulted.
describe('replaceRichInlineNodes - team function arguments', () => {
	describe('descendantsOfTeam with gate ON', () => {
		it('replaces the function argument with a team node', () => {
			failGate('jql-function-arg-hydration');
			passGate('jira-membersof-team-support');
			passGate('jira-descendants-of-team-jql-function');

			const teamNodes = hydrateTeamNodes(`"${TEAM_FIELD}" in descendantsOfTeam(${TEAM_ID})`);

			expect(teamNodes).toHaveLength(1);
			expect(teamNodes[0].attrs).toMatchObject({
				id: TEAM_ID,
				name: TEAM_NAME,
				fieldName: TEAM_FIELD,
			});
			// The rendered text keeps the raw JQL argument, including the id: prefix
			expect(teamNodes[0].textContent).toBe(TEAM_ID);
		});
	});

	describe('descendantsOfTeam with gate OFF', () => {
		it('does not replace the function argument', () => {
			failGate('jql-function-arg-hydration');
			passGate('jira-membersof-team-support');
			failGate('jira-descendants-of-team-jql-function');

			expect(hydrateTeamNodes(`"${TEAM_FIELD}" in descendantsOfTeam(${TEAM_ID})`)).toHaveLength(0);
		});
	});

	describe('membersOf', () => {
		// The descendantsOfTeam gate is deliberately left unmocked: membersOf resolves against its own
		// gate, so the descendantsOfTeam gate is never read on this path.
		it('still hydrates membersOf arguments', () => {
			failGate('jql-function-arg-hydration');
			passGate('jira-membersof-team-support');

			const teamNodes = hydrateTeamNodes(`assignee in membersOf("${TEAM_ID}")`, 'assignee');

			expect(teamNodes).toHaveLength(1);
			expect(teamNodes[0].attrs).toMatchObject({ id: TEAM_ID, name: TEAM_NAME });
		});
	});

	describe('direct value operands', () => {
		// A direct value operand matches before the team-function fallback runs, so neither
		// `jira-membersof-team-support` nor any per-function gate is consulted here.
		it('replaces the value operand with a team node', () => {
			failGate('jql-function-arg-hydration');

			const teamNodes = hydrateTeamNodes(`"${TEAM_FIELD}" = "${TEAM_ID}"`);

			expect(teamNodes).toHaveLength(1);
			expect(teamNodes[0].attrs).toMatchObject({ id: TEAM_ID, name: TEAM_NAME });
		});
	});
});
