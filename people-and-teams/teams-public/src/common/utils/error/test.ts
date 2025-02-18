import { DefaultError, GraphQLError, HttpError } from './index';

describe('DefaultError', () => {
	const errData = { message: 'our message' };

	test('is an instance of DefaultError', () => {
		const err = new DefaultError(errData);
		expect(err).toBeInstanceOf(DefaultError);
	});

	test('has correct message', () => {
		const err = new DefaultError(errData);
		expect(err.message).toEqual(errData.message);

		const withoutMessageError = new DefaultError({ message: '' });
		expect(withoutMessageError.message).toEqual('UnknownError');
	});

	test('has correct name', () => {
		const err = new DefaultError(errData);
		expect(err.name).toEqual('DefaultError');
	});
});

describe('HttpError', () => {
	const errData = { message: 'our message', status: 666 };

	test('is an instance of HttpError', () => {
		expect(new HttpError(errData)).toBeInstanceOf(HttpError);
	});

	test('has correct message', () => {
		const err = new HttpError(errData);
		expect(err.message).toEqual(errData.message);
	});

	test('has correct name', () => {
		const err = new HttpError(errData);
		expect(err.name).toEqual('HttpError');
	});

	test('has correct status', () => {
		const err = new HttpError(errData);
		expect(err.status).toEqual(errData.status);
	});
});

describe('GraphQLError', () => {
	const errData = { message: 'our message', category: 'the-categroy' };
	test('has correct message', () => {
		const err = new GraphQLError(errData);
		expect(err.message).toEqual(errData.message);
	});
	test('has correct name', () => {
		const err = new GraphQLError(errData);
		expect(err.name).toEqual('GraphQLError');
	});

	test('has category property', () => {
		const err = new GraphQLError(errData);
		expect(err.category).toEqual(errData.category);
	});

	test('has category as "default" when not provider', () => {
		const err = new GraphQLError({ message: 'test' });
		expect(err.category).toEqual('default');
	});

	test('has fields (when they are defined)', () => {
		const err = new GraphQLError(errData);
		expect(err.fields).toEqual(undefined);

		const errWithFields = new GraphQLError({
			...errData,
			fields: { the: 'field' },
		});
		expect(errWithFields.fields).toEqual({ the: 'field' });
	});
});
