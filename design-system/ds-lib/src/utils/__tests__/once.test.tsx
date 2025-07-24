/* eslint-disable no-inner-declarations */
import once from '../once';

test('single argument', () => {
	function greeting(name: string): string {
		return `Hello ${name}`;
	}
	const cached = once(greeting);
	expect(cached('Alex')).toBe('Hello Alex');
});

test('single argument (falsey return)', () => {
	let callCount = 0;
	function returnUndefined(): void {
		callCount++;
		return undefined;
	}
	const cached = once(returnUndefined);

	expect(cached()).toBe(undefined);
	expect(callCount).toBe(1);

	expect(cached()).toBe(undefined);
	expect(callCount).toBe(1);
});

test('multiple arguments', () => {
	function sum(...numbers: number[]): number {
		return numbers.reduce((acc, current) => acc + current, 0);
	}
	const cached = once(sum);
	expect(cached(1, 2, 3, 4)).toBe(1 + 2 + 3 + 4);
});

test('underlying function should only be called once', () => {
	let callCount = 0;
	function getCount(): string {
		return `Call count: ${callCount++}`;
	}
	const cached = once(getCount);

	expect(cached()).toBe('Call count: 0');
	expect(cached()).toBe('Call count: 0');
	expect(cached()).toBe('Call count: 0');
});

test('if the function throws, the cache should not be set', () => {
	let callCount = 0;
	function maybeThrow({ shouldThrow }: { shouldThrow: boolean }): string {
		callCount++;

		if (shouldThrow) {
			throw new Error(`Call count: ${callCount}`);
		}

		return `Call count: ${callCount}`;
	}
	const cached = once(maybeThrow);

	expect(() => cached({ shouldThrow: true })).toThrowError('Call count: 1');
	expect(() => cached({ shouldThrow: true })).toThrowError('Call count: 2');

	// now cache will be applied
	expect(cached({ shouldThrow: false })).toBe('Call count: 3');
	expect(cached({ shouldThrow: false })).toBe('Call count: 3');

	// even though the function would have thrown, the first good value is held on to
	expect(cached({ shouldThrow: true })).toBe('Call count: 3');
});

test('this binding (.call)', () => {
	function getName(this: { name: string }): string {
		return `name: ${this.name}`;
	}
	const cached = once(getName);

	expect(cached.call({ name: 'Alex' })).toBe('name: Alex');
});

test('this binding (.apply)', () => {
	function getName(this: { name: string }): string {
		return `name: ${this.name}`;
	}
	const cached = once(getName);

	expect(cached.apply({ name: 'Alex' })).toBe('name: Alex');
});

test('this binding (.bind)', () => {
	function getName(this: { name: string }): string {
		return `name: ${this.name}`;
	}
	const bound = getName.bind({ name: 'Alex' });
	const cached = once(bound);

	expect(cached()).toBe('name: Alex');
});

test('this binding (implicit)', () => {
	function getName(this: { name: string }): string {
		return `name: ${this.name}`;
	}
	const cached = once(getName);
	const person = {
		name: 'Alex',
		getName: cached,
	};

	expect(person.getName()).toBe('name: Alex');
});

test('this binding (arrow function)', () => {
	let callCount = 0;
	function outer(this: { name: string }) {
		// lock inner scope to parent scope
		return () => {
			callCount++;
			return `name: ${this.name}. call count: ${callCount}`;
		};
	}
	const result = outer.call({ name: 'Alex' });
	const cached = once(result);

	expect(cached()).toBe('name: Alex. call count: 1');
	expect(cached()).toBe('name: Alex. call count: 1');
});

test('this binding (class constructor)', () => {
	class Person {
		name: string;
		constructor(name: string) {
			this.name = name;
		}
	}

	const onced = once(function create(name: string) {
		return new Person(name);
	});

	const result = onced('Alex');

	expect(result).toBeInstanceOf(Person);
	expect(result.name).toBe('Alex');
});

test('this binding (class property)', () => {
	class Person {
		#name: string;
		constructor(name: string) {
			this.#name = name;
		}
		getName = () => {
			return this.#name;
		};
	}
	const person = new Person('Alex');
	const cached = once(person.getName);

	expect(cached()).toBe('Alex');
});

type Extends<TBase, TExtension> = TExtension extends TBase ? true : false;
type IsEqual<T, U> = T extends U ? (U extends T ? true : false) : false;

function expectTypeOf<TActual>(actual?: TActual) {
	return {
		toExtendTypeOf<TExpected extends Extends<TExpected, TActual> extends true ? unknown : never>(
			expectation?: TExpected,
		) {
			// no-op
			expect(actual).toBe(actual);
			expect(expectation).toBe(expectation);
		},
		toEqualTypeOf<TExpected extends IsEqual<TActual, TExpected> extends true ? unknown : never>(
			expectation?: TExpected,
		) {
			// no-op
			expect(actual).toBe(actual);
			expect(expectation).toBe(expectation);
		},
	};
}

test('types', () => {
	{
		function sayHello(name: string): string {
			return `Hello ${name}`;
		}
		const onced = once(sayHello) satisfies typeof sayHello;

		expectTypeOf(onced).toExtendTypeOf(sayHello);
	}

	{
		function getAge(this: { age: number }): number {
			return this.age;
		}
		const onced = once(getAge);

		expectTypeOf(onced).toExtendTypeOf<typeof getAge>();
		expectTypeOf<ThisParameterType<typeof getAge>>().toEqualTypeOf<ThisParameterType<typeof onced>>;
	}
});
