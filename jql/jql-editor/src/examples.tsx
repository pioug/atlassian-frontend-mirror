import React from 'react';

import { withKnobs } from '@storybook/addon-knobs';
import { injectable } from 'react-magnetic-di';

import { Text } from '@atlaskit/primitives/compiled';
import { withPlatformFeatureGates } from '@atlassian/feature-flags-storybook-utils';

import { Template } from '../examples-utils/template';
import { TemplateReadOnly } from '../examples-utils/template-read-only';

import JQLEditorView from './ui/jql-editor-view';

import { JQLEditor, JQLEditorAsync, type JQLEditorProps } from './index';

const _default_1: {
	args: {
		batchUpdates: boolean;
		query: string;
	};
	component: (props: JQLEditorProps) => React.JSX.Element;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	decorators: ((...args: any) => any)[];
	title: string;
} = {
	title: 'JQL Editor',
	component: JQLEditor,
	args: {
		query: '',
		batchUpdates: true,
	},
	decorators: [withKnobs],
};
export default _default_1;

export const SimpleJQL: () => React.JSX.Element = Template.bind(
	{},
	{
		query: 'issuetype = bug order by rank',
	},
);

export const SimpleEditorWithDefaultRows: () => React.JSX.Element = Template.bind(
	{},
	{
		query: 'issuetype = bug order by rank',
		defaultRows: 5,
	},
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(SimpleEditorWithDefaultRows as any).decorators = [
	withKnobs,
	withPlatformFeatureGates({
		list_lovability_improving_filters: true,
	}),
];

export const ComplexJQL: () => React.JSX.Element = Template.bind(
	{},
	{
		query:
			'(project = VPP OR project = VI) AND statusCategory not in (Done) AND \r\n(labels != not-mvp AND labels != after-mvp AND labels != not-vertigo-mvp AND labels != post-mvp OR labels is EMPTY) AND \nissuetype != epic AND "Delivery Team" in ("JIRA Vertigo GDN - Dalek", "JIRA Vertigo Search", "JIRA Helix", "JIRA Swarm - Core App", "JIRA Swarm - Dragonfire", "JIRA Portfolio", JIRA, "JIRA Fusion", "JIRA Software", "JIRA Ninjas", "JIRA Performance", "JIRA Ecosystem", "JIRA Vertigo DB+Cache") AND \nstatus not in ("Not required", "Post MVP", Post-release) AND issuetype != bug AND (fixVersion != Post-MVP AND fixVersion != "Post-Vertigo MVP" OR fixVersion is EMPTY) \r\nORDER BY status DESC',
	},
);

export const HugeJQL: () => React.JSX.Element = Template.bind(
	{},
	{
		query:
			'(project = VPP OR project = VI) AND statusCategory not in (Done) AND \n(labels != not-mvp AND labels != after-mvp AND labels != not-vertigo-mvp AND labels != post-mvp OR labels is EMPTY) AND \nissuetype != epic AND "Delivery Team" in ("JIRA Vertigo GDN - Dalek", "JIRA Vertigo Search", "JIRA Helix", "JIRA Swarm - Core App", "JIRA Swarm - Dragonfire", "JIRA Portfolio", JIRA, "JIRA Fusion", "JIRA Software", "JIRA Ninjas", "JIRA Performance", "JIRA Ecosystem", "JIRA Vertigo DB+Cache") AND \nissuetype != epic AND "Delivery Team" in ("JIRA Vertigo GDN - Dalek", "JIRA Vertigo Search", "JIRA Helix", "JIRA Swarm - Core App", "JIRA Swarm - Dragonfire", "JIRA Portfolio", JIRA, "JIRA Fusion", "JIRA Software", "JIRA Ninjas", "JIRA Performance", "JIRA Ecosystem", "JIRA Vertigo DB+Cache") AND \nissuetype != epic AND "Delivery Team" in ("JIRA Vertigo GDN - Dalek", "JIRA Vertigo Search", "JIRA Helix", "JIRA Swarm - Core App", "JIRA Swarm - Dragonfire", "JIRA Portfolio", JIRA, "JIRA Fusion", "JIRA Software", "JIRA Ninjas", "JIRA Performance", "JIRA Ecosystem", "JIRA Vertigo DB+Cache") AND \nissuetype != epic AND "Delivery Team" in ("JIRA Vertigo GDN - Dalek", "JIRA Vertigo Search", "JIRA Helix", "JIRA Swarm - Core App", "JIRA Swarm - Dragonfire", "JIRA Portfolio", JIRA, "JIRA Fusion", "JIRA Software", "JIRA Ninjas", "JIRA Performance", "JIRA Ecosystem", "JIRA Vertigo DB+Cache") AND \nissuetype != epic AND "Delivery Team" in ("JIRA Vertigo GDN - Dalek", "JIRA Vertigo Search", "JIRA Helix", "JIRA Swarm - Core App", "JIRA Swarm - Dragonfire", "JIRA Portfolio", JIRA, "JIRA Fusion", "JIRA Software", "JIRA Ninjas", "JIRA Performance", "JIRA Ecosystem", "JIRA Vertigo DB+Cache") AND \nissuetype != epic AND "Delivery Team" in ("JIRA Vertigo GDN - Dalek", "JIRA Vertigo Search", "JIRA Helix", "JIRA Swarm - Core App", "JIRA Swarm - Dragonfire", "JIRA Portfolio", JIRA, "JIRA Fusion", "JIRA Software", "JIRA Ninjas", "JIRA Performance", "JIRA Ecosystem", "JIRA Vertigo DB+Cache") AND \nissuetype != epic AND "Delivery Team" in ("JIRA Vertigo GDN - Dalek", "JIRA Vertigo Search", "JIRA Helix", "JIRA Swarm - Core App", "JIRA Swarm - Dragonfire", "JIRA Portfolio", JIRA, "JIRA Fusion", "JIRA Software", "JIRA Ninjas", "JIRA Performance", "JIRA Ecosystem", "JIRA Vertigo DB+Cache") AND \nissuetype != epic AND "Delivery Team" in ("JIRA Vertigo GDN - Dalek", "JIRA Vertigo Search", "JIRA Helix", "JIRA Swarm - Core App", "JIRA Swarm - Dragonfire", "JIRA Portfolio", JIRA, "JIRA Fusion", "JIRA Software", "JIRA Ninjas", "JIRA Performance", "JIRA Ecosystem", "JIRA Vertigo DB+Cache") AND \nstatus not in ("Not required", "Post MVP", Post-release) AND issuetype != bug AND (fixVersion != Post-MVP AND fixVersion != "Post-Vertigo MVP" OR fixVersion is EMPTY) \nORDER BY status DESC',
	},
);

export const RichInlineNodesEnabled: () => React.JSX.Element = Template.bind(
	{},
	{
		query:
			'assignee = EMPTY AND status = 111 AND reporter in (rjuedbergtlfrde, \'iikibvcbvfnfglv\', "gvcehdrrgtvvuen")',
	},
);

export const RichInlineNodesDisabled: () => React.JSX.Element = Template.bind(
	{},
	{
		query:
			'assignee = EMPTY AND status = 111 AND reporter in (rjuedbergtlfrde, \'iikibvcbvfnfglv\', "gvcehdrrgtvvuen")',
		enableRichInlineNodes: false,
	},
);

export const SyntaxHighlighting: () => React.JSX.Element = Template.bind(
	{},
	{
		query:
			'NOT project = JDEV AND assignee was in (currentUser(), membersOf("jira-admins")) AND status changed from Open to "In progress" AND labels not in ("Cannot Reproduce") AND reporter is not empty AND "Custom number[Number]" = 1 AND assignee.property["name"] = "Charlie" OR created >= 2019-11-15 ORDER BY created DESC, updated ASC',
	},
);

export const ExternalError: () => React.JSX.Element = Template.bind(
	{},
	{
		query: 'project = "ABC" OR assignee = someFakeFunction()',
		messages: [
			{
				message: `Error in the JQL Query: A function name cannot be empty. (line 1, character 7)`,
				type: 'error',
				errorType: 'EMPTY_FUNCTION',
			},
		],
	},
);

export const ExternalWarning: () => React.JSX.Element = Template.bind(
	{},
	{
		query: 'project = "ABC" OR assignee = someFakeFunction()',
		messages: [
			{
				message: (
					<>
						Warning: something got deprecated but we <Text as="strong">don't remember</Text> what
						exactly
					</>
				),
				type: 'warning',
			},
		],
	},
);

export const ExternalInfo: () => React.JSX.Element = Template.bind(
	{},
	{
		query: 'project = "ABC" OR assignee = someFakeFunction()',
		messages: [
			{
				message: `Info: someFakeFunction is executing longer than usual`,
				type: 'info',
			},
		],
	},
);

export const ReadOnlySimpleJQL: () => React.JSX.Element = TemplateReadOnly.bind(
	{},
	{
		query: 'status changed from "To do" to "In progress" after -1w',
	},
);

export const ReadOnlyComplexJQL: () => React.JSX.Element = TemplateReadOnly.bind(
	{},
	{
		query:
			'(project = VPP OR project = VI) AND statusCategory not in (Done) AND \r\n(labels != not-mvp AND labels != after-mvp AND labels != not-vertigo-mvp AND labels != post-mvp OR labels is EMPTY) AND \nissuetype != epic AND "Delivery Team" in ("JIRA Vertigo GDN - Dalek", "JIRA Vertigo Search", "JIRA Helix", "JIRA Swarm - Core App", "JIRA Swarm - Dragonfire", "JIRA Portfolio", JIRA, "JIRA Fusion", "JIRA Software", "JIRA Ninjas", "JIRA Performance", "JIRA Ecosystem", "JIRA Vertigo DB+Cache") AND \nstatus not in ("Not required", "Post MVP", Post-release) AND issuetype != bug AND (fixVersion != Post-MVP AND fixVersion != "Post-Vertigo MVP" OR fixVersion is EMPTY) \r\nORDER BY status DESC',
	},
);

export const ReadOnlyEmptyLinesJQL: () => React.JSX.Element = TemplateReadOnly.bind(
	{},
	{
		query:
			'(project = VPP OR project = VI)\n\n\n\n\n\n\n\n\n\n\n\nAND statusCategory not in (Done)',
	},
);

const errorBoundaryDeps = [
	injectable(JQLEditorView, () => {
		throw new Error('An error occurred in JQLEditorView');
	}),
];

export const ErrorBoundary: () => React.JSX.Element = Template.bind(
	{},
	{
		query: 'issuetype = bug order by rank',
		deps: errorBoundaryDeps,
	},
);

export const ErrorBoundaryAsync: () => React.JSX.Element = Template.bind(
	{},
	{
		query: 'issuetype = bug order by rank',
		deps: errorBoundaryDeps,
		Editor: JQLEditorAsync,
	},
);
