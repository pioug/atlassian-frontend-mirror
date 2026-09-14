import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { GeneratedAvatar, getNumberIdForAvatar } from './index';

jest.mock('./assets/social-media-scribe', () => ({
	__esModule: true,
	default: () => <div data-testid="social-media-scribe-avatar" />,
}));

jest.mock('./assets/jsm-service-triage-agent', () => ({
	__esModule: true,
	default: () => <div data-testid="jsm-service-triage-agent-avatar" />,
}));

jest.mock('./assets/jira-task-planner-agent', () => ({
	__esModule: true,
	default: () => <div data-testid="jira-task-planner-agent-avatar" />,
}));

describe('getNumberIdForAvatar', () => {
	[
		{
			agentIdentityAccountId: '5b985e7c96cb052b5f65c830',
			agentId: 'cd002f25-46e4-4023-80ff-32e4d90849b4',
			getExpected: () => 0x5f65c830,
		},
		{
			agentIdentityAccountId: '712020:19e57f67-c132-462b-8503-0c19953122cd',
			agentId: 'cd002f25-46e4-4023-80ff-32e4d90849b4',
			getExpected: () => 0x953122cd,
		},
		{
			agentIdentityAccountId: undefined,
			agentId: 'cd002f25-46e4-4023-80ff-32e4d90849b4',
			getExpected: () => 0xd90849b4,
		},
		{
			agentIdentityAccountId: '',
			agentId: 'cd002f25-46e4-4023-80ff-32e4d90849b4',
			getExpected: () => 0xd90849b4,
		},
		{
			agentIdentityAccountId: null,
			agentId: 'cd002f25-46e4-4023-80ff-32e4d90849b4',
			getExpected: () => 0xd90849b4,
		},
	].forEach(({ agentIdentityAccountId, agentId, getExpected }) => {
		it(`should return correctly for agentIdentityAccountId: ${agentIdentityAccountId} and agentId: ${agentId}`, () => {
			expect(getNumberIdForAvatar({ agentIdentityAccountId, agentId })).toBe(getExpected());
		});
	});
});

describe('GeneratedAvatar', () => {
	it('renders the Social Media Scribe avatar for the Tech Writer agent', async () => {
		render(<GeneratedAvatar agentNamedId="tech_writer_agent" size="medium" />);

		expect(await screen.findByTestId('social-media-scribe-avatar')).toBeInTheDocument();
	});

	it('renders the Request router avatar for the jsm_service_triage_agent agent', async () => {
		render(<GeneratedAvatar agentNamedId="jsm_service_triage_agent" size="medium" />);

		expect(await screen.findByTestId('jsm-service-triage-agent-avatar')).toBeInTheDocument();
	});

	it('renders the Jira Scoping avatar for the jira_task_planner_agent agent', async () => {
		render(<GeneratedAvatar agentNamedId="jira_task_planner_agent" size="medium" />);

		expect(await screen.findByTestId('jira-task-planner-agent-avatar')).toBeInTheDocument();
	});
});
