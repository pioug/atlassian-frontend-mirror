import { bind } from 'bind-event-listener';

import { AbortEvent } from '../../common/vc/types';

import { attachAbortListeners } from './attachAbortListeners';
import { getViewportHeight, getViewportWidth } from './getViewport';

jest.mock('bind-event-listener', () => ({
	bind: jest.fn(),
}));

jest.mock('./getViewport', () => ({
	getViewportWidth: jest.fn(),
	getViewportHeight: jest.fn(),
}));

describe('attachAbortListeners', () => {
	let unbindMock: jest.Mock;
	let callbackMock: jest.Mock;
	let initialViewport: { w: number; h: number };

	beforeEach(() => {
		unbindMock = jest.fn();
		callbackMock = jest.fn();
		initialViewport = { w: 800, h: 600 };
		(bind as jest.Mock).mockReturnValue(unbindMock);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should bind wheel, keydown, and resize event listeners', () => {
		attachAbortListeners(window, initialViewport, callbackMock);
		expect(bind).toHaveBeenCalledWith(window, expect.objectContaining({ type: AbortEvent.wheel }));
		expect(bind).toHaveBeenCalledWith(
			window,
			expect.objectContaining({ type: AbortEvent.keydown }),
		);
		expect(bind).toHaveBeenCalledWith(window, expect.objectContaining({ type: AbortEvent.resize }));
	});

	it('should call the callback with wheel event', () => {
		attachAbortListeners(window, initialViewport, callbackMock);
		const wheelListener = (bind as jest.Mock).mock.calls.find(
			(call) => call[1].type === AbortEvent.wheel,
		)[1].listener;
		wheelListener({ timeStamp: 200 });
		expect(callbackMock).toHaveBeenCalledWith(AbortEvent.wheel, 200);
	});

	it('should call the callback with keydown event', () => {
		attachAbortListeners(window, initialViewport, callbackMock);
		const keydownListener = (bind as jest.Mock).mock.calls.find(
			(call) => call[1].type === AbortEvent.keydown,
		)[1].listener;
		keydownListener({ timeStamp: 300 });
		expect(callbackMock).toHaveBeenCalledWith(AbortEvent.keydown, 300);
	});

	it('should call the callback and unbind resize listener if viewport size changes', () => {
		(getViewportWidth as jest.Mock).mockReturnValue(1024);
		(getViewportHeight as jest.Mock).mockReturnValue(768);
		attachAbortListeners(window, initialViewport, callbackMock);
		const resizeListener = (bind as jest.Mock).mock.calls.find(
			(call) => call[1].type === AbortEvent.resize,
		)[1].listener;
		resizeListener({ timeStamp: 400 });
		expect(callbackMock).toHaveBeenCalledWith(AbortEvent.resize, 400);
		expect(unbindMock).toHaveBeenCalled();
	});

	it('should not call the callback for resize if viewport size does not change', () => {
		(getViewportWidth as jest.Mock).mockReturnValue(initialViewport.w);
		(getViewportHeight as jest.Mock).mockReturnValue(initialViewport.h);
		attachAbortListeners(window, initialViewport, callbackMock);
		const resizeListener = (bind as jest.Mock).mock.calls.find(
			(call) => call[1].type === AbortEvent.resize,
		)[1].listener;
		resizeListener({ timeStamp: 500 });
		expect(callbackMock).not.toHaveBeenCalledWith(AbortEvent.resize, 500);
		expect(unbindMock).not.toHaveBeenCalled();
	});

	it('should return an array of unbind functions', () => {
		const unbindFns = attachAbortListeners(window, initialViewport, callbackMock);
		expect(unbindFns).toHaveLength(3);
		unbindFns.forEach((unbindFn) => expect(unbindFn).toBe(unbindMock));
	});
});
