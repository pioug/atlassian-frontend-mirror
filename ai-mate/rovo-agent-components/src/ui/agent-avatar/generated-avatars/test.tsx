import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { waitFor } from '@atlassian/testing-library/wait-for';

import {
	AgentBanner,
	blueColor,
	GeneratedAvatar,
	getAgentAvatarColor,
	getNumberIdForAvatar,
	greenColor,
} from './index';

jest.mock('./assets/social-media-scribe', () => ({
	__esModule: true,
	default: () => <div data-testid="social-media-scribe-avatar" />,
}));

jest.mock('./assets/jsm-service-triage-agent', () => ({
	__esModule: true,
	default: () => <div data-testid="jsm-service-triage-agent-avatar" />,
}));

jest.mock('./assets/jsm-request-resolver-agent', () => ({
	__esModule: true,
	default: () => <div data-testid="jsm-request-resolver-agent-avatar" />,
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

describe('getAgentAvatarColor', () => {
	beforeEach(() => {
		failGate('rovo_agents_studio_use_agent_color');
	});

	it.each([
		[failGate, blueColor.v1, blueColor.v1],
		[passGate, blueColor.v2, greenColor.v2],
	] as const)(
		'preserves legacy colours with avatar refresh: %p',
		(setRefreshGate, expectedColor, codingAgentColor) => {
			setRefreshGate('rovo_agent_avatar_refresh_teu26');
			expect(getAgentAvatarColor({ agentIdentityAccountId: '3' })).toEqual(expectedColor);
			expect(getAgentAvatarColor({})).toEqual(expectedColor);
			expect(getAgentAvatarColor({ agentNamedId: 'content_reviewer_agent' })).toEqual(
				expectedColor,
			);
			expect(getAgentAvatarColor({ agentNamedId: 'jira_coding_agent' })).toEqual(codingAgentColor);
		},
	);
});

describe.each([
	[failGate, blueColor.v1, greenColor.v1],
	[passGate, blueColor.v2, greenColor.v2],
] as const)('shared agent colours with avatar refresh: %p', (setRefreshGate, blue, green) => {
	beforeEach(() => {
		passGate('rovo_agents_studio_use_agent_color');
		setRefreshGate('rovo_agent_avatar_refresh_teu26');
	});

	it('uses shared named-agent colours and prioritises the identity account ID', () => {
		expect(getAgentAvatarColor({ agentId: '2', agentNamedId: 'jira_coding_agent' })).toEqual(blue);
		expect(getAgentAvatarColor({ agentId: '3', agentIdentityAccountId: '2' })).toEqual(green);
	});

	it('preserves the no-identity fallback and explicit RovoDev colour', () => {
		expect(getAgentAvatarColor({})).toEqual(blue);
		expect(getAgentAvatarColor({ agentId: '0', isRovoDev: true })).toEqual(greenColor.v1);
	});

	it('uses the shared colour for AgentBanner', () => {
		failGate('jira_improve_agent_profile_for_a2a');
		const { container } = render(<AgentBanner agentNamedId="jira_coding_agent" />);
		expect(container.querySelector('div')).toHaveStyle(`background-color: ${blue.primary}`);
	});
});

describe('GeneratedAvatar', () => {
	beforeEach(() => {
		failGate('rovo_agents_studio_use_agent_color');
	});
	it.each([
		['jira_coding_agent', '18 344 52 52'],
		['jira_intelligent_triage_agent', '18 214 52 52'],
		['jira_delivery_agent', '0 0 52 52'],
		['jira_admin_agent', '18 19 52 52'],
		['jsm_rovo_service_agent', '18 604 52 52'],
		['ops_guide_agent', '18 539 52 52'],
		['content_reviewer_agent', '18 18.375 52 52'],
	])('renders the Team 26 EU avatar for %s', async (agentNamedId, viewBox) => {
		passGate('rovo_agent_avatar_refresh_teu26');
		render(<GeneratedAvatar agentNamedId={agentNamedId} size="medium" />);

		expect(await screen.findByTestId('refreshed-agent-avatar')).toHaveAttribute('viewBox', viewBox);
	});

	it('renders the Request Resolver avatar when the Team 26 EU gate is off', async () => {
		failGate('rovo_agent_avatar_refresh_teu26');
		render(<GeneratedAvatar agentNamedId="jsm_rovo_service_agent" size="medium" />);

		expect(await screen.findByTestId('jsm-request-resolver-agent-avatar')).toBeInTheDocument();
	});

	it('renders the original Amplitude avatar when the Team 26 EU gate is off', async () => {
		failGate('rovo_agent_avatar_refresh_teu26');
		render(<GeneratedAvatar agentNamedId="mcp_amplitude_agent" size="medium" />);

		expect(await screen.findByTestId('amplitude-agent-avatar')).toBeInTheDocument();
		expect(screen.queryByTestId('amplitude-agent-avatar-v2')).not.toBeInTheDocument();
	});

	it('renders the Amplitude v2 avatar when the Team 26 EU gate is on', async () => {
		passGate('rovo_agent_avatar_refresh_teu26');
		render(<GeneratedAvatar agentNamedId="mcp_amplitude_agent" size="medium" />);

		expect(await screen.findByTestId('amplitude-agent-avatar-v2')).toBeInTheDocument();
		expect(screen.queryByTestId('amplitude-agent-avatar')).not.toBeInTheDocument();
	});

	it('renders the original Content Reviewer avatar when the Team 26 EU gate is off', async () => {
		failGate('rovo_agent_avatar_refresh_teu26');
		render(<GeneratedAvatar agentNamedId="content_reviewer_agent" size="medium" />);

		expect(await screen.findByTestId('content-reviewer-avatar')).toBeInTheDocument();
		expect(screen.queryByTestId('refreshed-agent-avatar')).not.toBeInTheDocument();
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

describe.each([
	[failGate, failGate, blueColor.v1, greenColor.v1, blueColor.v2],
	[failGate, passGate, greenColor.v2, greenColor.v2, greenColor.v2],
	[passGate, failGate, blueColor.v1, greenColor.v1, blueColor.v2],
	[passGate, passGate, blueColor.v2, greenColor.v2, blueColor.v2],
] as const)(
	'GeneratedAvatar colours with migration %p and refresh %p',
	(setMigrationGate, setRefreshGate, namedColor, generatedColor, namedArtworkColor) => {
		it.each([
			// The original Jira logo has a fixed blue fill in the SVG asset.
			['jira_coding_agent', namedColor, namedArtworkColor],
			[undefined, generatedColor, generatedColor],
		] as const)(
			'uses the expected background and artwork colours for %s',
			async (agentNamedId, color, artworkColor) => {
				setMigrationGate('rovo_agents_studio_use_agent_color');
				setRefreshGate('rovo_agent_avatar_refresh_teu26');
				const { container } = render(
					<GeneratedAvatar agentId="2" agentNamedId={agentNamedId} size="medium" />,
				);
				expect(container.querySelector('div')).toHaveStyle(`background-color: ${color.primary}`);
				await waitFor(() => {
					expect(
						container.querySelector(`svg [fill="${artworkColor.primary}"]`),
					).toBeInTheDocument();
				});
			},
		);
	},
);

it('preserves Document Writer detail with both colour gates enabled', async () => {
	passGate('rovo_agents_studio_use_agent_color');
	passGate('rovo_agent_avatar_refresh_teu26');
	const { container } = render(
		<GeneratedAvatar agentNamedId="document_writer" agentId="2" size="medium" />,
	);

	await waitFor(() => {
		// This oval is drawn over the SVG's white page and must retain its blue accent.
		expect(container.querySelector('path[d^="M28.6 34.9727"]')).toHaveAttribute(
			'fill',
			blueColor.v1.secondary,
		);
	});
	expect(container.querySelector('svg > path')).toHaveAttribute('fill', blueColor.v1.primary);
});

it('uses the original generic artwork palette when no identity is available', async () => {
	passGate('rovo_agents_studio_use_agent_color');
	passGate('rovo_agent_avatar_refresh_teu26');
	const { container } = render(<GeneratedAvatar size="medium" />);

	await waitFor(() => {
		expect(container.querySelector('svg > path')).toHaveAttribute('fill', blueColor.v1.primary);
	});
	expect(container.querySelector(`svg [fill="${blueColor.v1.secondary}"]`)).toBeInTheDocument();
});
