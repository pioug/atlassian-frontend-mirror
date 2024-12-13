import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import ActionListIcon from '../assets/action-list';
import ApprovalsTrackerIcon from '../assets/approvals-tracker';
import DecisionMatrixIcon from '../assets/decision-matrix';
import DiscussionNotesIcon from '../assets/discussion-notes';
import InstructionsOutlineIcon from '../assets/instructions-outline';
import { type InsertBlockPlugin } from '../insertBlockPlugin';

import {
	actionList,
	approvalsTracker,
	decisionMatrix,
	discussionNotes,
	instructionsOutline,
} from './templates';

type templateType =
	| 'discussionNotes'
	| 'approvalsTracker'
	| 'decisionMatrix'
	| 'actionList'
	| 'instructionsOutline';

const getTemplateInsertionPayload = (
	templateType: templateType,
	source?: INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR,
) => ({
	action: ACTION.INSERTED,
	actionSubject: ACTION_SUBJECT.DOCUMENT,
	actionSubjectId: 'elementTemplate',
	attributes: { inputMethod: source ?? INPUT_METHOD.QUICK_INSERT, templateType },
	eventType: EVENT_TYPE.TRACK,
});

const getTableWidth = (api: ExtractInjectionAPI<InsertBlockPlugin> | undefined): number =>
	api?.table?.sharedState.currentState()?.isFullWidthModeEnabled ? 1800 : 760;

export const templateOptions = (
	api: ExtractInjectionAPI<InsertBlockPlugin> | undefined,
): QuickInsertItem[] => [
	{
		title: 'Discussion notes',
		// @ts-ignore
		id: 'discussionNotes',
		description: 'Record discussion points and action items',
		keywords: [
			'decisions',
			'summary',
			'meeting',
			'chat',
			'debrief',
			'track',
			'keep track',
			'tasks',
			'outstanding items',
			'owners',
		],
		// Place templates right after AI item
		priority: 99,
		icon: () => <DiscussionNotesIcon />,
		action: (insert, state, source) => {
			const tr = insert(Fragment.fromJSON(state.schema, discussionNotes(getTableWidth(api))), {
				// @ts-ignore
				isTemplate: true,
			});
			api?.analytics?.actions.attachAnalyticsEvent(
				// @ts-ignore
				getTemplateInsertionPayload('discussionNotes', source),
			)(tr);
			return tr;
		},
	},
	{
		title: 'Approvals tracker',
		// @ts-ignore
		id: 'approvalsTracker',
		description: 'Track reviewer approvals and dates',
		keywords: [
			'reviews',
			'requests',
			'rejected requests',
			'review dates',
			'timeline',
			'checklist',
			'sme timeline',
			'sme requests',
			'sme check',
			'table',
		],
		priority: 99,
		icon: () => <ApprovalsTrackerIcon />,
		action: (insert, state, source) => {
			const tr = insert(Fragment.fromJSON(state.schema, approvalsTracker(getTableWidth(api))), {
				// @ts-ignore
				isTemplate: true,
			});
			api?.analytics?.actions.attachAnalyticsEvent(
				// @ts-ignore
				getTemplateInsertionPayload('approvalsTracker', source),
			)(tr);
			return tr;
		},
	},
	{
		title: 'Decision matrix',
		// @ts-ignore
		id: 'decisionMatrix',
		description: 'Compare options and make recommendations',
		keywords: [
			'pros',
			'cons',
			'recommended',
			'rationale',
			'evaluation',
			'options',
			'choice',
			'table',
		],
		priority: 99,
		icon: () => <DecisionMatrixIcon />,
		action: (insert, state, source) => {
			const tr = insert(Fragment.fromJSON(state.schema, decisionMatrix(getTableWidth(api))), {
				// @ts-ignore
				isTemplate: true,
			});
			api?.analytics?.actions.attachAnalyticsEvent(
				// @ts-ignore
				getTemplateInsertionPayload('decisionMatrix', source),
			)(tr);
			return tr;
		},
	},
	{
		title: 'List of actions',
		// @ts-ignore
		id: 'actionList',
		description: 'Track tasks, assignees and deadlines',
		keywords: [
			'checklist',
			'check',
			'items',
			'shopping list',
			'jtbd',
			'jobs to be done',
			'due date',
			'progress',
			'task',
			'tasks',
			'prioritization',
			'timeline',
			'approvals',
			'reviewers',
			'review date',
		],
		priority: 99,
		icon: () => <ActionListIcon />,
		action: (insert, state, source) => {
			// @ts-ignore
			const tr = insert(Fragment.fromJSON(state.schema, actionList), { isTemplate: true });
			api?.analytics?.actions.attachAnalyticsEvent(
				// @ts-ignore
				getTemplateInsertionPayload('actionList', source),
			)(tr);
			return tr;
		},
	},
	{
		title: 'Instructions outline',
		// @ts-ignore
		id: 'instructionsOutline',
		description: 'Detailed steps for any process',
		keywords: [
			'steps',
			'manual',
			'tasks',
			'jobs to be done',
			'jtbd',
			'how-to',
			'guide',
			'journey',
			'checklist',
			'tutorial',
			'map',
			'brochure',
			'columns',
			'layout',
			'help',
		],
		priority: 99,
		icon: () => <InstructionsOutlineIcon />,
		action: (insert, state, source) => {
			// @ts-ignore
			const tr = insert(Fragment.fromJSON(state.schema, instructionsOutline), { isTemplate: true });
			api?.analytics?.actions.attachAnalyticsEvent(
				// @ts-ignore
				getTemplateInsertionPayload('instructionsOutline', source),
			)(tr);
			return tr;
		},
	},
];
