import { attachAbortListeners } from '../attachAbortListeners';

const mockWindow = {
	addEventListener: jest.fn(),
	removeEventListener: jest.fn(),
};

it('should bind abort listeners', () => {
	attachAbortListeners(mockWindow as any, { w: 100, h: 100 }, jest.fn());
	expect(mockWindow.addEventListener).toHaveBeenCalledTimes(3);
	expect(mockWindow.addEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), {
		passive: true,
		once: true,
	});
	expect(mockWindow.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), {
		once: true,
	});
	expect(mockWindow.addEventListener).toHaveBeenCalledWith(
		'resize',
		expect.any(Function),
		undefined,
	);
	expect(mockWindow.removeEventListener).toHaveBeenCalledTimes(0);
});

it('should unbind listeners', () => {
	const unbinds = attachAbortListeners(mockWindow as any, { w: 100, h: 100 }, jest.fn());
	unbinds.forEach((unbind) => unbind());
	expect(mockWindow.removeEventListener).toHaveBeenCalledTimes(3);
	expect(mockWindow.removeEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), {
		passive: true,
		once: true,
	});
	expect(mockWindow.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), {
		once: true,
	});
	expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
		'resize',
		expect.any(Function),
		undefined,
	);
});
