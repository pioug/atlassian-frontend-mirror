import * as sentry from '@sentry/browser';

import { logException, logInfoMessage } from './main';
import { getSentryConfig } from './utils/get-sentry-config';
import { initialiseSentry } from './utils/initialise-sentry';

jest.mock('@sentry/browser', () => {
	const actual = jest.requireActual('@sentry/browser');
	return {
		...actual,
		captureException: jest.fn(),
		captureMessage: jest.fn(),
		setTag: jest.fn(),
		setExtras: jest.fn(),
	};
});

beforeEach(() => {
	jest.useFakeTimers();
	jest.resetModules();
});

describe('installSentry', () => {
	// FIXME: TypeError: object.hasOwnProperty is not a function
	it.skip('should install global sentry with passed config', async () => {
		const init = jest.spyOn(sentry, 'init');

		const options = {
			test: 'abc',
			dsn: 'test-sentry-dsn',
		};
		const config = getSentryConfig(options);
		await initialiseSentry(sentry, options);

		expect(init).toHaveBeenCalledWith(
			expect.objectContaining({
				dsn: 'test-sentry-dsn',
				...config,
			}),
		);
	});
});

describe('logException', () => {
	it('should not provide empty extra when calling sentry.captureException', async () => {
		await initialiseSentry(sentry, {});
		const setExtras = jest.spyOn(sentry.Scope.prototype, 'setExtras');
		const captureException = jest.spyOn(sentry, 'captureException');
		const setTag = jest.spyOn(sentry.Scope.prototype, 'setTag');

		const error = new Error('error');

		await logException(error, 'error');

		expect(setExtras).not.toHaveBeenCalled();
		expect(setTag).toHaveBeenCalledWith('name', 'error');

		expect(captureException).toHaveBeenCalledWith(
			error,
			expect.objectContaining({
				_extra: {},
				_tags: {
					name: 'error',
					packageName: 'unknown',
					packageVersion: 'unknown',
				},
			}),
		);
	});

	// FIXME: TypeError: object.hasOwnProperty is not a function
	it.skip('should call sentry.captureException with extra and name tag', async () => {
		const setExtras = jest.spyOn(sentry.Scope.prototype, 'setExtras');
		const setTag = jest.spyOn(sentry.Scope.prototype, 'setTag');
		const withScope = jest.spyOn(sentry, 'withScope');

		await logException('error', 'Error name', {
			info: 'something',
			more: 'foo',
		});

		expect(sentry.withScope).toHaveBeenCalled();
		expect(setTag).toHaveBeenCalledWith('name', 'Error name');
		expect(setExtras).toHaveBeenCalledWith({
			info: 'something',
			more: 'foo',
		});
		expect(withScope).toHaveBeenCalled();

		expect(sentry.captureException).toHaveBeenLastCalledWith(
			'error',
			expect.objectContaining({
				_extra: { info: 'something', more: 'foo' },
				_tags: {
					name: 'Error name',
					packageName: 'unknown',
					packageVersion: 'unknown',
				},
			}),
		);
	});

	// FIXME: Matcher error: received value must be a mock or spy function
	it.skip('should call sentry.captureException with tags', async () => {
		const setExtras = jest.spyOn(sentry.Scope.prototype, 'setExtras');
		const setTags = jest.spyOn(sentry.Scope.prototype, 'setTags');
		await logException('error', 'Error name', {
			info: 'something',
			tags: {
				tagone: 'true',
			},
		});

		expect(sentry.withScope).toHaveBeenCalled();
		expect(setTags).toHaveBeenCalledWith({
			tagone: 'true',
		});
		expect(setExtras).toHaveBeenCalledWith({
			info: 'something',
		});

		expect(sentry.captureException).toHaveBeenLastCalledWith(
			'error',
			expect.objectContaining({
				_extra: { info: 'something' },
				_tags: {
					name: 'Error name',
					tagone: 'true',
					packageName: 'unknown',
					packageVersion: 'unknown',
				},
			}),
		);
	});
});

describe('logInfessage', () => {
	// FIXME: Matcher error: received value must be a mock or spy function
	it.skip('should call sentry.captureException with level `info`', async () => {
		await logInfoMessage('error');

		expect(sentry.withScope).toHaveBeenCalled();

		expect(sentry.captureMessage).toHaveBeenLastCalledWith(
			'error',
			expect.objectContaining({
				_level: 'info',
				_extra: {},
				_tags: { packageName: 'unknown', packageVersion: 'unknown' },
			}),
		);
	});
});
