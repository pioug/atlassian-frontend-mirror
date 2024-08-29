import React from 'react';

import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';

import ActionListIcon from '../assets/action-list';
import ApprovalsTrackerIcon from '../assets/approvals-tracker';
import DecisionMatrixIcon from '../assets/decision-matrix';
import DiscussionNotesIcon from '../assets/discussion-notes';
import InstructionsOutlineIcon from '../assets/instructions-outline';
export const templateOptions: QuickInsertItem[] = [
	{
		title: 'Discussion notes',
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
		action: () => {
			return false;
		},
	},
	{
		title: 'Approvals tracker',
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
		action: () => {
			return false;
		},
	},
	{
		title: 'Decision matrix',
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
		action: () => {
			return false;
		},
	},
	{
		title: 'List of actions',
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
		action: () => {
			return false;
		},
	},
	{
		title: 'Instructions outline',
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
		action: () => {
			return false;
		},
	},
];
