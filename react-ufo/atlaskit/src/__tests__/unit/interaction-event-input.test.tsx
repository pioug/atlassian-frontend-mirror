import React from 'react';

import { createEvent } from '@atlassian/testing-library/create-event';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import coinflip from '../../coinflip';
import {
	getDoNotAbortActivePressInteractionOnTransition,
	getInteractionRate,
	getMinorInteractions,
	isUFOEnabled,
} from '../../config';
import DefaultInteractionID from '../../interaction-id-context/defaultInteractionId';
import {
	abortAll,
	addNewInteraction,
	addRedirect,
	getActiveInteraction,
} from '../../interaction-metrics';
import traceUFOHover from '../../trace-hover';
import traceUFOInteraction from '../../trace-interaction';
import traceUFOPress from '../../trace-press';
import traceUFORedirect from '../../trace-redirect';
import traceUFOTransition from '../../trace-transition';

jest.mock('../../coinflip');
jest.mock('../../config');
jest.mock('../../interaction-metrics');
jest.mock('../../experience-trace-id-context/get-active-trace');
jest.mock('../../experience-trace-id-context/set-interaction-active-trace');
jest.mock('../../trace-transition/utils/set-interaction-active-trace');

describe('interaction tracing event inputs', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.mocked(isUFOEnabled).mockReturnValue(true);
		jest.mocked(coinflip).mockReturnValue(true);
		jest.mocked(getInteractionRate).mockReturnValue(1);
		jest.mocked(getActiveInteraction).mockReturnValue(undefined);
		jest.mocked(getMinorInteractions).mockReturnValue(undefined);
		jest.mocked(getDoNotAbortActivePressInteractionOnTransition).mockReturnValue(undefined);
		jest.spyOn(performance, 'now').mockReturnValue(1000);
		DefaultInteractionID.current = null;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe.each([
		['press', traceUFOPress],
		['hover', traceUFOHover],
	] as const)('%s', (_type, trace) => {
		it.each([0, 125])('uses a native event timestamp of %s', (timestamp) => {
			const event = new MouseEvent('click');
			Object.defineProperty(event, 'timeStamp', { value: timestamp });

			trace('test-interaction', event);

			expect(jest.mocked(addNewInteraction).mock.calls[0][3]).toBe(timestamp);
		});

		it('accepts React events without changing the interaction type', async () => {
			const { container } = render(
				<button onClick={(event) => trace('test-interaction', event)}>Trace</button>,
			);
			const button = screen.getByRole('button', { name: 'Trace' });
			const event = createEvent.click(button);
			Object.defineProperty(event, 'timeStamp', { value: 125 });

			// eslint-disable-next-line testing-library/prefer-user-event -- Dispatch a specific event to verify its original timestamp.
			fireEvent(button, event);

			expect(jest.mocked(addNewInteraction).mock.calls[0].slice(1, 4)).toEqual([
				'test-interaction',
				'press', // Hover continues to use the existing press payload type.
				125,
			]);
			await expect(container).toBeAccessible();
		});

		it.each([0, 125, undefined])('preserves numeric/default timing (%s)', (timestamp) => {
			trace('test-interaction', timestamp);

			expect(jest.mocked(addNewInteraction).mock.calls[0][3]).toBe(timestamp ?? 1000);
		});

		it('preserves minor-interaction timing', () => {
			const minorInteractions: { name: string; startTime: number }[] = [];
			jest.mocked(getMinorInteractions).mockReturnValue(['test-interaction']);
			jest
				.mocked(getActiveInteraction)
				.mockReturnValue({ minorInteractions } as ReturnType<typeof getActiveInteraction>);

			trace('test-interaction', { timeStamp: 125 });

			expect(minorInteractions).toEqual([{ name: 'test-interaction', startTime: 125 }]);
			expect(addNewInteraction).not.toHaveBeenCalled();
		});
	});

	it.each([0, 125, undefined])(
		'supports transition start timing (%s) and preserves preloadKey',
		(timestamp) => {
			traceUFOTransition('next-page', 'next-route', 'preloaded-page', timestamp);

			expect(jest.mocked(addNewInteraction).mock.calls[0][3]).toBe(timestamp ?? 1000);
			expect(jest.mocked(addNewInteraction).mock.calls[0][8]).toBe('preloaded-page');
		},
	);

	it('accepts native events for transitions', () => {
		const event = new MouseEvent('click');

		traceUFOTransition('next-page', undefined, undefined, event);

		expect(jest.mocked(addNewInteraction).mock.calls[0][3]).toBe(event.timeStamp);
	});

	it('preserves the transition opt-out', () => {
		jest.mocked(getDoNotAbortActivePressInteractionOnTransition).mockReturnValue(['active']);
		jest
			.mocked(getActiveInteraction)
			.mockReturnValue({ ufoName: 'active' } as ReturnType<typeof getActiveInteraction>);

		traceUFOTransition('next-page', undefined, undefined, new MouseEvent('click'));

		expect(abortAll).not.toHaveBeenCalled();
		expect(addNewInteraction).not.toHaveBeenCalled();
	});

	it.each([0, 125])('preserves redirect timestamps (%s)', (timestamp) => {
		DefaultInteractionID.current = 'active';

		traceUFORedirect('from', 'to', 'route', timestamp);
		traceUFORedirect('from', 'to', 'route', { timeStamp: timestamp });

		expect(addRedirect).toHaveBeenNthCalledWith(1, 'active', 'from', 'to', 'route', timestamp);
		expect(addRedirect).toHaveBeenNthCalledWith(2, 'active', 'from', 'to', 'route', timestamp);
	});

	it('accepts native events for redirects', () => {
		DefaultInteractionID.current = 'active';
		const event = new MouseEvent('click');

		traceUFORedirect('from', 'to', 'route', event);

		expect(addRedirect).toHaveBeenCalledWith('active', 'from', 'to', 'route', event.timeStamp);
	});

	it('keeps generic interaction tracing restricted to trusted events', () => {
		traceUFOInteraction('test-interaction', new MouseEvent('click'));

		expect(addNewInteraction).not.toHaveBeenCalled();
	});
});
