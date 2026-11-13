import React from 'react';

import { screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { renderWithIntl } from '../__tests__/_testing-library';
import { AgentReactionName } from './AgentReactionName';

it('replaces the whole label with a flexible skeleton until the agent loads', () => {
	passGate('platform_reactions_agent_name_skeleton');
	const { rerender } = renderWithIntl(
		<AgentReactionName agent={{ name: 'External agent', isLoading: true }} personName="Person" />,
	);
	const skeleton = screen.getByTestId('agent-name-skeleton');
	expect(skeleton).toHaveStyle({ width: '100%', height: '12px' });
	expect(skeleton.style.getPropertyValue('--ds-skeleton-from-color')).toBe('currentColor');
	expect(skeleton.style.getPropertyValue('--ds-skeleton-to-color')).toBe('transparent');
	expect(getComputedStyle(screen.getByTestId('agent-name-skeleton')).animationName).toBeTruthy();
	expect(getComputedStyle(screen.getByTestId('agent-name-skeleton')).animationName).not.toBe(
		'none',
	);
	expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();
	expect(screen.queryByText(/Person/)).not.toBeInTheDocument();
	expect(screen.getByRole('status')).toHaveCompiledCss({
		width: '100%',
		flexGrow: '1',
	});
	expect(screen.queryByText('External agent', { exact: false })).not.toBeInTheDocument();

	rerender(<AgentReactionName agent={{ name: 'Agent' }} personName="Person" />);
	expect(screen.getByText('Agent with Person')).toBeInTheDocument();
	expect(screen.queryByTestId('agent-name-skeleton')).not.toBeInTheDocument();
});

it('shows the fallback when the request has finished without a name', () => {
	passGate('platform_reactions_agent_name_skeleton');
	renderWithIntl(
		<AgentReactionName agent={{ name: 'External agent', isLoading: false }} personName="Person" />,
	);
	expect(screen.getByText('External agent with Person')).toBeInTheDocument();
	expect(screen.queryByTestId('agent-name-skeleton')).not.toBeInTheDocument();
});

it('keeps the previous display when the gate is off', () => {
	failGate('platform_reactions_agent_name_skeleton');
	renderWithIntl(
		<AgentReactionName agent={{ name: 'External agent', isLoading: true }} personName="Person" />,
	);
	expect(screen.getByText('External agent with Person')).toBeInTheDocument();
	expect(screen.queryByTestId('agent-name-skeleton')).not.toBeInTheDocument();
});
