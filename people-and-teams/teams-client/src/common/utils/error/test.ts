import { DefaultError, GraphQLError, HttpError, isAuthError } from './index';

describe('isUnauthenticatedError', () => {
	const httpError = {
		message: 'string',
		status: 500,
		type: 'HttpError',
	} as unknown as HttpError;

	test('with default value', () => {
		expect(isAuthError(httpError)).toEqual(false);
	});

	test('when error is not defined', () => {
		expect(isAuthError(undefined)).toEqual(false);
	});

	describe('positive cases', () => {
		test('when error has status=403|401', () => {
			const error = {
				...httpError,
				status: 403,
			};

			expect(isAuthError(error)).toEqual(true);

			const error2 = {
				...httpError,
				status: 401,
			};

			expect(isAuthError(error2)).toEqual(true);
		});

		test('when error has statusCode=401|403', () => {
			const error = {
				...httpError,
				statusCode: 401,
				message: undefined,
			};

			expect(isAuthError(error as unknown as Error)).toEqual(true);

			const error2 = {
				...httpError,
				statusCode: 403,
				message: undefined,
			};

			expect(isAuthError(error2 as unknown as Error)).toEqual(true);
		});

		test('when error has 403|401 message inside', () => {
			const error = {
				...httpError,
				message: 'Request has status code 403',
			};

			expect(isAuthError(error)).toEqual(true);

			const error2 = {
				...httpError,
				message: 'Request failed with status code 401',
			};

			expect(isAuthError(error2)).toEqual(true);

			const error3 = {
				...httpError,
				message: 'The underlying service activity status code is : 401, ',
			};

			expect(isAuthError(error3)).toEqual(true);
		});
	});

	describe('negative cases', () => {
		test('when error has status=410', () => {
			const error = {
				...httpError,
				status: 410,
			};

			expect(isAuthError(error)).toEqual(false);
		});

		test('when error has statusCode=404', () => {
			const error = {
				...httpError,
				statusCode: 404,
			};

			expect(isAuthError(error)).toEqual(false);
		});
	});
});

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
