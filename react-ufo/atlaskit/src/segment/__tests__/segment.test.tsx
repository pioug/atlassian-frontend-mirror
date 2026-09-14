import React, { useContext } from 'react';

import { render } from '@atlassian/testing-library';

import UFOInteractionContext, { type LabelStack } from '../../interaction-context';
import UFOSegment from '../segment';

// Keep the test focused on labelStack construction: stub the heavy interaction-metrics wiring.
jest.mock('../../interaction-metrics', () => ({
	abortByNewInteraction: jest.fn(),
	addApdex: jest.fn(),
	addCustomData: jest.fn(),
	addCustomTiming: jest.fn(),
	addHold: jest.fn(() => () => {}),
	addHoldByID: jest.fn(),
	addMark: jest.fn(),
	addNewInteraction: jest.fn(),
	addProfilerTimings: jest.fn(),
	addRequestInfo: jest.fn(),
	addSegment: jest.fn(),
	addSpan: jest.fn(),
	getActiveInteraction: jest.fn(() => null),
	removeHoldByID: jest.fn(),
	removeSegment: jest.fn(),
	tryComplete: jest.fn(),
}));

jest.mock('@atlaskit/platform-feature-flags/fg', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags/fg'),
	fg: jest.fn(() => false),
}));

type UFOSegmentProps = React.ComponentProps<typeof UFOSegment>;

/** Reads the labelStack out of the interaction context so tests can assert on the leaf label. */
const LabelStackProbe = ({ onLabelStack }: { onLabelStack: (ls: LabelStack) => void }) => {
	const context = useContext(UFOInteractionContext);
	onLabelStack(context?.labelStack ?? []);
	return null;
};

const getLeafLabel = (type: UFOSegmentProps['type'], excludeFromMetrics: boolean) => {
	let labelStack: LabelStack = [];
	render(
		<UFOSegment name="seg" type={type} excludeFromMetrics={excludeFromMetrics}>
			<LabelStackProbe
				onLabelStack={(ls) => {
					labelStack = ls;
				}}
			/>
		</UFOSegment>,
	);
	return labelStack[labelStack.length - 1] as Record<string, unknown>;
};

describe('UFOSegment', () => {
	it('should have the correct displayName', () => {
		expect(UFOSegment.displayName).toBe('UFOSegment');
	});

	it('renders its children accessibly', async () => {
		const { getByText } = render(
			<UFOSegment name="seg" type="third-party">
				<div>Segment content</div>
			</UFOSegment>,
		);
		expect(getByText('Segment content')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	describe('excludeFromMetrics stamping (third-party-only invariant)', () => {
		it('stamps excludeFromMetrics on the label for a third-party segment', () => {
			const label = getLeafLabel('third-party', true);
			expect(label.type).toBe('third-party');
			expect(label.excludeFromMetrics).toBe(true);
		});

		it('does NOT stamp excludeFromMetrics on a first-party segment (safety guarantee)', () => {
			const label = getLeafLabel('first-party', true);
			expect(label.type).toBeUndefined();
			expect(label.excludeFromMetrics).toBeUndefined();
		});

		it('does NOT stamp excludeFromMetrics on a gen-ai segment', () => {
			const label = getLeafLabel('gen-ai', true);
			expect(label.type).toBe('gen-ai');
			expect(label.excludeFromMetrics).toBeUndefined();
		});

		it('does not set excludeFromMetrics when the prop is false on a third-party segment', () => {
			const label = getLeafLabel('third-party', false);
			expect(label.type).toBe('third-party');
			expect(label.excludeFromMetrics).toBeUndefined();
		});
	});
});
