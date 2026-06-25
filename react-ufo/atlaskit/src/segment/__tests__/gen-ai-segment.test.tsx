import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { UFOGenAISegment } from '../gen-ai-segment';

jest.mock('../segment', () => {
	const MockUFOSegment = ({ children, type, name, ...props }: any) => {
		(window as any).__mockUFOSegmentProps = { type, name, ...props };
		return <div data-testid="mock-ufo-segment">{children}</div>;
	};
	MockUFOSegment.displayName = 'UFOSegment';
	return {
		__esModule: true,
		default: MockUFOSegment,
	};
});

describe('UFOGenAISegment', () => {
	beforeEach(() => {
		(window as any).__mockUFOSegmentProps = null;
	});

	it('has the correct displayName', () => {
		expect(UFOGenAISegment.displayName).toBe('UFOGenAISegment');
	});

	it('renders as a GenAI UFO segment', async () => {
		render(
			<UFOGenAISegment name="gen-ai-segment">
				<div>GenAI content</div>
			</UFOGenAISegment>,
		);

		expect((window as any).__mockUFOSegmentProps).toEqual({
			name: 'gen-ai-segment',
			type: 'gen-ai',
		});
		expect(screen.getByText('GenAI content')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});
});
