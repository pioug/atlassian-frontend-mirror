/* eslint-disable @typescript-eslint/no-namespace */
import { expect } from '@jest/globals';
import { diff } from 'jest-diff';
import matches from 'lodash/matches';

const isObject = (x: unknown): x is {} => {
	return typeof x === 'object' && x !== null;
};

const objectHas = <T extends string>(x: unknown, prop: T): x is { [prop in T]: unknown } => {
	return isObject(x) && prop in x;
};

expect.extend({
	toBeFiredWithAnalyticEventOnce(spy: jest.Mock<any, any>, event: unknown, channel?: unknown) {
		/**
		 * Find all events that match the comparison event
		 */
		const matchingEvents = spy.mock.calls.filter((arg: any[]) => matches(event)(arg[0]));

		/**
		 * We only pass if we can find a single matching event
		 */
		if (matchingEvents.length === 1) {
			/**
			 * The single matching event must be fired on the channel specified, else is not a pass
			 */
			if (channel && matchingEvents[0][1] !== channel) {
				return {
					message: () =>
						this.utils.matcherHint('toBeFiredWithAnalyticEventOnce') +
						'\n\n' +
						`Expected to fire on: ${this.utils.printExpected(channel)},\n` +
						`Actually fired on: ${this.utils.printReceived(matchingEvents[0][1])}`,
					pass: false,
				};
			}

			return {
				message: () => `analytic event was fired once`,
				pass: true,
			};
		}

		return {
			message: () => {
				if (spy.mock.calls.length === 0) {
					return `no events were fired!`;
				}

				const candidates = spy.mock.calls.filter((parameters: unknown[]) => {
					const e = parameters?.[0];
					if (
						objectHas(e, 'payload') &&
						objectHas(e.payload, 'action') &&
						objectHas(e.payload, 'actionSubject') &&
						objectHas(event, 'payload') &&
						objectHas(event.payload, 'action') &&
						objectHas(event.payload, 'actionSubject')
					) {
						return (
							e.payload.action === event.payload.action &&
							e.payload.actionSubject === event.payload.actionSubject
						);
					}
					return false;
				});

				if (candidates.length === 0) {
					return (
						this.utils.matcherHint('toBeFiredWithAnalyticEventOnce', undefined, undefined) +
						'\n\n' +
						`Event Expected: \n\n${JSON.stringify(event)}\n\n` +
						`Events Received: \n\n${spy.mock.calls
							.map(([x]: any[], i) => {
								if (x.payload.eventType === 'screen') {
									return `${i}: ${x.payload.name} ${x.payload.action}`;
								}
								return `${i}: ${x.payload.actionSubject} ${x.payload.action}`;
							})
							.join('\n')}`
					);
				}

				if (candidates.length === 1) {
					const difference = diff(event, candidates[0][0]);

					return (
						this.utils.matcherHint('toBeFiredWithAnalyticEventOnce', undefined, undefined) +
						'\n\n' +
						`Expected: ${JSON.stringify(event)}\n\n` +
						`Received: ${spy.mock.calls.map(([x]: any[]) => `${JSON.stringify(x)}`).join('\n\n')}` +
						`${difference}`
					);
				}

				return (
					this.utils.matcherHint('toBeFiredWithAnalyticEventOnce', undefined, undefined) +
					'\n\n' +
					`Expected: ${JSON.stringify(event)}\n` +
					`Received: ${candidates.map(([x]: any[]) => `${JSON.stringify(x)}`).join('\n\n')}`
				);
			},
			pass: false,
		};
	},
});

interface CustomMatchers<R = unknown> {
	toBeFiredWithAnalyticEventOnce(event: unknown, channel?: unknown): R;
}

declare global {
	namespace jest {
		interface Expect extends CustomMatchers {}
		interface Matchers<R> extends CustomMatchers<R> {}
		interface InverseAsymmetricMatchers extends CustomMatchers {}
	}
}
