import AutoResizeAction from '../../src/plugin/auto-resize-action';

describe('Auto resize action', function () {
	beforeEach(function () {});

	it('triggers the callack', function () {
		let spy = jest.fn();
		let instance = new AutoResizeAction(spy);
		let dimensions = { w: '123px', h: '456px' };
		instance.triggered(dimensions);
		expect(spy).toHaveBeenCalledWith('123px', '456px');
	});

	it('triggers the callack when dimensions change', function () {
		let spy = jest.fn();
		let instance = new AutoResizeAction(spy);
		let dimensions1 = { w: '123px', h: '456px' };
		let dimensions2 = { w: '321px', h: '654px' };
		instance.triggered(dimensions1);
		instance.triggered(dimensions2);
		expect(spy.mock.calls.length).toEqual(2);
	});

	it('triggers dont flicker', function () {
		let spy = jest.fn();
		let instance = new AutoResizeAction(spy);
		let dimensions1 = { w: '123px', h: '456px' };
		let dimensions2 = { w: '122px', h: '355px' };
		instance.triggered(dimensions1);
		expect(spy.mock.calls.length).toEqual(1);
		instance.triggered(dimensions2);
		expect(spy.mock.calls.length).toEqual(2);

		instance.triggered(dimensions1);
		expect(spy.mock.calls.length).toEqual(3);
		expect(spy.mock.calls[2]).toEqual([dimensions1.w, dimensions1.h]);
		instance.triggered(dimensions2);
		expect(spy.mock.calls.length).toEqual(4);
		expect(spy.mock.calls[3]).toEqual([dimensions2.w, dimensions2.h]);
		// flicker here
		instance.triggered(dimensions1);
		expect(spy.mock.calls.length).toEqual(5);
		expect(spy.mock.calls[4]).toEqual(['100%', '456px']);
	});
});
