import React from 'react';

import { render } from '@testing-library/react';

import { UFOThirdPartySegment } from '../third-party-segment';

// Mock UFOSegment component
jest.mock('../segment', () => {
	const MockUFOSegment = ({ children, type, name, ...props }: any) => {
		// Store the props in a global variable for testing
		(window as any).__mockUFOSegmentProps = { type, name, ...props };
		return <div data-testid="mock-ufo-segment">{children}</div>;
	};
	MockUFOSegment.displayName = 'UFOSegment';
	return {
		__esModule: true,
		default: MockUFOSegment,
	};
});

// Mock UFOIgnoreHolds component
jest.mock('../../ignore-holds', () => {
	const MockUFOIgnoreHolds = ({ children }: any) => (
		<div data-testid="mock-ufo-ignore-holds">{children}</div>
	);
	MockUFOIgnoreHolds.displayName = 'UFOIgnoreHolds';
	return MockUFOIgnoreHolds;
});

// Mock feature flags
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn((flag: string) => {
		if (flag === 'platform_ufo_exclude_3p_elements_from_ttai') {
			return false;
		}
		return false;
	}),
}));

describe('UFOThirdPartySegment', () => {
	beforeEach(() => {
		// Clear the stored props before each test
		(window as any).__mockUFOSegmentProps = null;
	});

	it('should call UFOSegment with type="third-party"', async () => {
		render(
			<UFOThirdPartySegment name="test-segment">
				<div>Test content</div>
			</UFOThirdPartySegment>,
		);

		// Get the props that were passed to UFOSegment
		const ufoSegmentProps = (window as any).__mockUFOSegmentProps;

		// Verify UFOSegment was called with the correct props
		expect(ufoSegmentProps).toBeDefined();
		expect(ufoSegmentProps.type).toBe('third-party');
		expect(ufoSegmentProps.name).toBe('test-segment');

		await expect(document.body).toBeAccessible();
	});

	it('should render children wrapped in UFOIgnoreHolds', async () => {
		const { getByTestId, getByText } = render(
			<UFOThirdPartySegment name="test-segment">
				<div>Test content</div>
			</UFOThirdPartySegment>,
		);

		// Verify UFOSegment was rendered
		expect(getByTestId('mock-ufo-segment')).toBeInTheDocument();

		// Verify UFOIgnoreHolds was rendered
		expect(getByTestId('mock-ufo-ignore-holds')).toBeInTheDocument();

		// Verify children were rendered
		expect(getByText('Test content')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});
});
