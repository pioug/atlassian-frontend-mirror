// @ts-nocheck
import $ from '../../src/plugin/dollar';

describe('dollar', () => {
	const actual = jest.requireActual('../../src/plugin/dollar');
	const spy = jest.spyOn(actual, 'default');

	let mockReadyState = 'complete';

	beforeAll(() => {
		Object.defineProperty(document, 'readyState', {
			get() {
				return mockReadyState;
			},
		});
	});

	describe('onDomLoad', () => {
		it('Executes func immediately if ready state is complete', () => {
			$();
			expect(spy).toHaveBeenCalled();
		});

		it('Does not execute func if ready state is not complete', () => {
			mockReadyState = 'loading';
			const callback = jest.fn();
			$(callback);
			expect(callback).not.toHaveBeenCalled();
		});
	});
});
