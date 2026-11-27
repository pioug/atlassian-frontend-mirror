import React from 'react';

import { act, render } from '@testing-library/react';
import createStub from 'raf-stub';
import { IntlProvider } from 'react-intl';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { Renderer } from '../../../../entry-points/renderer-default';

jest.mock('@atlaskit/editor-common/performance-measures', () => ({
	...jest.requireActual<object>('@atlaskit/editor-common/performance-measures'),
	stopMeasure: (_name: string, onComplete?: (duration: number, startTime: number) => void) =>
		onComplete?.(42, 1),
}));

const doc: DocNode = {
	type: 'doc',
	version: 1,
	content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }],
};

describe('Renderer first-in-session analytics', () => {
	afterEach(jest.restoreAllMocks);

	it.each([
		{
			assignment: 'treatment',
			mockExperiment: mockExpEnabled,
			expectedFirst: true,
		},
		{ assignment: 'control', mockExperiment: mockExpDisabled, expectedFirst: false },
	])('emits renderer.rendered in $assignment', ({ mockExperiment, expectedFirst }) => {
		mockExperiment('platform_editor_first_in_activity_session');
		failGate('analytics-next-use-legacy-context');
		const raf = createStub();
		jest.spyOn(window, 'requestAnimationFrame').mockImplementation(raf.add);
		// Force the sampled render event to fire.
		jest.spyOn(Math, 'random').mockReturnValue(0);
		const onRenderedEvent = jest.fn();

		render(
			<AnalyticsListener
				channel="editor"
				onEvent={({ payload }) => {
					if (payload.actionSubject === 'renderer' && payload.action === 'rendered') {
						onRenderedEvent(payload.attributes);
					}
				}}
			>
				<IntlProvider locale="en">
					<Renderer document={doc} appearance="full-page" />
				</IntlProvider>
			</AnalyticsListener>,
		);

		act(() => raf.flush());
		expect(onRenderedEvent).toHaveBeenCalledTimes(1);
		expect(onRenderedEvent).toHaveBeenCalledWith(
			expect.objectContaining({ duration: 42, sampleRate: 0.1 }),
		);
		const [attributes] = onRenderedEvent.mock.calls[0];
		if (expectedFirst) {
			expect(attributes.firstInSession).toBe(true);
		} else {
			expect(attributes).not.toHaveProperty('firstInSession');
		}
	});
});
