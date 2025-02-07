import { functionUnionWithCondition, functionWithCondition } from './index';

describe('function with condition', () => {
	it('functionWithCondition should handle simple function', () => {
		const fn1 = functionWithCondition(
			() => true,
			() => 1,
			() => 2,
		);
		expect(fn1()).toBe(1);

		const fn2 = functionWithCondition(
			() => false,
			(x: number) => x + 1,
			(x) => x + 2,
		);
		expect(fn2(1)).toBe(3);
	});

	it('functionWithCondition should not handle complex function', () => {
		const fn1 = functionWithCondition(
			() => true,
			(x: number) => x + 1,
			// @ts-expect-error TS2345: Argument of type '(x: string) => string' is not assignable to parameter of type '(x: number) => number'.
			(x: string) => x,
		);
		expect(fn1(1)).toBe(2);
		// @ts-expect-error TS2345: Argument of type 'string' is not assignable to parameter of type 'number
		expect(fn1('1')).toBe('11');

		const fn2 = functionWithCondition(
			() => true,
			() => 1,
			// @ts-expect-error TS2322: Type 'string' is not assignable to type 'number'.
			() => '2',
		);
		expect(fn2()).toBe(1);
	});

	it('functionUnitWithCondition should handle more complex function', () => {
		const fn3 = functionUnionWithCondition(
			() => true,
			() => 1,
			() => '2',
		);
		expect(fn3()).toBe(1);
	});
});
