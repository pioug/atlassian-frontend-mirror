import { withResolvers } from '../with-resolvers';

// Some light tests to ensure
// things are working as expected.

test('promise', () => {
	const { promise } = withResolvers<void>();

	expect(promise).toBeInstanceOf(Promise);
});

test('resolve', (done) => {
	const { promise, resolve } = withResolvers<void>();

	promise.then(() => {
		expect(true).toBe(true);
		done();
	});

	resolve();
});

test('resolve (with data)', (done) => {
	const { promise, resolve } = withResolvers<number>();

	promise.then((value) => {
		expect(value).toBe(5);
		done();
	});

	resolve(5);
});

test('reject', (done) => {
	const { promise, reject } = withResolvers<void>();

	promise.catch(() => {
		expect(true).toBe(true);
		done();
	});

	reject();
});

test('reject (with data)', (done) => {
	const { promise, reject } = withResolvers<number>();
	const error = new Error('Hi');

	promise.catch((err) => {
		expect(err).toBe(error);
		done();
	});

	reject(error);
});
