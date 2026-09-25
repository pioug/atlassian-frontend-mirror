import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
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

jest.mock('./assets/content-reviewer', () => ({
	__esModule: true,
	default: () => <div data-testid="content-reviewer-avatar" />,
}));

jest.mock('./assets/amplitude-agent', () => ({
	__esModule: true,
	default: () => <div data-testid="amplitude-agent-avatar" />,
}));

jest.mock('./assets/amplitude-agent-v2', () => ({
	__esModule: true,
	default: () => <div data-testid="amplitude-agent-avatar-v2" />,
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
	it('renders the original Amplitude avatar when the frontend gate is off', async () => {
		failGate('rovo_agent_amplitude_avatar_v2');
		render(<GeneratedAvatar agentNamedId="mcp_amplitude_agent" size="medium" />);

		expect(await screen.findByTestId('amplitude-agent-avatar')).toBeInTheDocument();
		expect(screen.queryByTestId('amplitude-agent-avatar-v2')).not.toBeInTheDocument();
	});

	it('renders the Amplitude v2 avatar when the frontend gate is on', async () => {
		passGate('rovo_agent_amplitude_avatar_v2');
		render(<GeneratedAvatar agentNamedId="mcp_amplitude_agent" size="medium" />);

		expect(await screen.findByTestId('amplitude-agent-avatar-v2')).toBeInTheDocument();
		expect(screen.queryByTestId('amplitude-agent-avatar')).not.toBeInTheDocument();
	});

	it('renders the Content reviewer avatar for the content_reviewer_agent', async () => {
		render(<GeneratedAvatar agentNamedId="content_reviewer_agent" size="medium" />);

		expect(await screen.findByTestId('content-reviewer-avatar')).toBeInTheDocument();
	});

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
