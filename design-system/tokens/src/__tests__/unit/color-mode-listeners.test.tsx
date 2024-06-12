import type * as ColorModeObserverTypes from '../../utils/color-mode-listeners';

// Mock window.matchMedia before importing ColorModeObserver
const matchMediaObject = {
	matches: false,
	media: '',
	onchange: null,
	addListener: jest.fn(), // Deprecated
	removeListener: jest.fn(), // Deprecated
	addEventListener: jest.fn(),
	removeEventListener: jest.fn(),
	dispatchEvent: jest.fn(),
};

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((_) => {
		return matchMediaObject;
	}),
});

describe('ColorModeObserver', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	it('Should only bind one listener on repeat calls and imports', async () => {
		const {
			default: ColorModeObserver,
		}: typeof ColorModeObserverTypes = require('../../utils/color-mode-listeners');

		const {
			default: ColorModeObserver2,
		}: typeof ColorModeObserverTypes = require('../../utils/color-mode-listeners');

		ColorModeObserver.bind();
		ColorModeObserver.bind();
		ColorModeObserver2.bind();

		expect(matchMediaObject.addEventListener).toHaveBeenCalledTimes(1);
	});

	it('unbind() should always unbind, even if bound multiple times', async () => {
		const {
			default: ColorModeObserver,
		}: typeof ColorModeObserverTypes = require('../../utils/color-mode-listeners');

		ColorModeObserver.bind();
		ColorModeObserver.bind();
		ColorModeObserver.unbind();

		expect(matchMediaObject.removeEventListener).toHaveBeenCalledTimes(1);
	});
});
