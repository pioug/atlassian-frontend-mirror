// @ts-nocheck
import Util from '../../src/common/util';

describe('Util', function () {
	it('randomString should create a random string', function () {
		let firstString = Util.randomString(),
			secondString = Util.randomString();

		expect(firstString).not.toEqual(secondString);
	});

	describe('sanitizeStructuredClone', function () {
		it('should remove functions', function () {
			let sanitizedObject = Util.sanitizeStructuredClone(function () {});
			expect(sanitizedObject).toBeNull();
		});

		it('should replace errors with empty', function () {
			let sanitizedObject = Util.sanitizeStructuredClone(new Error());
			expect(sanitizedObject).toEqual({});
		});

		it('should remove nodes from object', function () {
			let sanitizedObject = Util.sanitizeStructuredClone(document.createElement('a'));
			expect(sanitizedObject).toEqual({});
		});

		it('should remove circular references from class instances', function () {
			function Foo() {
				this.abc = 'Hello';
				this.circular = this;
			}
			const foo = new Foo();
			let sanitizedObject = Util.sanitizeStructuredClone(foo);
			expect(sanitizedObject.abc).toEqual('Hello');
			expect(sanitizedObject.hasOwnProperty('circular')).toBe(false);
		});

		it('should remove circular references from objects', function () {
			const a = {};
			const b = {};

			a.b = b;
			b.a = a;

			const unsanitizedObject = a;
			const sanitizedObject = Util.sanitizeStructuredClone(unsanitizedObject);
			expect(sanitizedObject).toEqual({ b: {} });
		});

		it('should not remove matching objects in an array', function () {
			const foo = {
				some: 'thing',
			};

			const unsanitizedObject = [foo, foo];
			const sanitizedObject = Util.sanitizeStructuredClone(unsanitizedObject);
			expect(sanitizedObject).toEqual(unsanitizedObject);
		});

		it('should not remove objects in nested arrays', function () {
			const foo = {
				some: 'thing',
			};

			const unsanitizedObject = [foo, [foo]];
			const sanitizedObject = Util.sanitizeStructuredClone(unsanitizedObject);
			expect(sanitizedObject).toEqual(unsanitizedObject);
		});

		it('should not remove multiple references to the same object in an object', function () {
			const foo = {
				some: 'thing',
			};

			const bar = {
				foo: foo,
				foo2: foo,
			};

			const unsanitizedObject = bar;
			const sanitizedObject = Util.sanitizeStructuredClone(unsanitizedObject);
			expect(sanitizedObject).toEqual(unsanitizedObject);
		});

		it('should not remove references to the same object', function () {
			const a = {};
			const b = {};
			const c = {};

			a.b = b;
			b.a = a;

			const d = {
				a: c,
				b: c,
			};

			const sanitizedObject = Util.sanitizeStructuredClone(d);
			expect(sanitizedObject).toEqual(d);
		});

		it('should remove circular references in arrays of an object', function () {
			const b = {};

			b.b = b;
			b.a = [b];

			const sanitizedObject = Util.sanitizeStructuredClone(b);
			expect(sanitizedObject).toEqual({ a: [null] });
		});

		it('should remove functions in nested objects and arrays', function () {
			const testFunc = function () {};
			const testObject = {
				function: testFunc,
				functionInArray: [testFunc, [testFunc], { i: testFunc }],
				functionInObject: {
					i: testFunc,
					j: { ji: testFunc, jj: [testFunc], jk: { jki: testFunc } },
					k: [testFunc],
				},
			};

			let sanitizedObject = Util.sanitizeStructuredClone(testObject);

			expect(testObject).not.toEqual(sanitizedObject);
			expect(sanitizedObject.hasOwnProperty('function')).toBe(false);

			expect(sanitizedObject.functionInArray[0]).toBeNull();
			expect(sanitizedObject.functionInArray[1][0]).toBeNull();
			expect(sanitizedObject.functionInArray[2].hasOwnProperty('i')).toBe(false);

			expect(sanitizedObject.functionInObject.hasOwnProperty('i')).toBe(false);
			expect(sanitizedObject.functionInObject.j.hasOwnProperty('ji')).toBe(false);
			expect(sanitizedObject.functionInObject.j.jj[0]).toBeNull();
			expect(sanitizedObject.functionInObject.j.jk.hasOwnProperty('jki')).toBe(false);
			expect(sanitizedObject.functionInObject.k[0]).toBeNull();
		});

		it('should not perserve null properties in objects', function () {
			const obj = { foo: null };

			const sanitizedObject = Util.sanitizeStructuredClone(obj);
			expect(sanitizedObject).toEqual({});
		});

		it('should perserve null values in arrays', function () {
			const obj = [null];

			const sanitizedObject = Util.sanitizeStructuredClone(obj);
			expect(sanitizedObject).toEqual(obj);
		});

		it('should return null if called with null', function () {
			const obj = null;

			const sanitizedObject = Util.sanitizeStructuredClone(obj);
			expect(sanitizedObject).toEqual(obj);
		});
	});
});
