type Global = globalThis.Window &
	typeof globalThis & {
		process: {
			env: {
				JEST_WORKER_ID: string;
				NODE_ENV: string;
			};
		};
	};

// We can't rely on NODE_ENV === 'test' if its value is already configured by the consumer to some other value, so better to use JEST_WORKER_ID
// https://jestjs.io/docs/environment-variables#jest_worker_id
const TESTS_MODE =
	(globalThis as unknown as Global | undefined)?.process?.env?.JEST_WORKER_ID !== undefined ??
	false;

const DEBUG_MODE =
	!TESTS_MODE &&
	(globalThis as unknown as Global | undefined)?.process?.env?.NODE_ENV !== 'production';

export const debug = (...args: unknown[]) => {
	if (!DEBUG_MODE) {
		return;
	}

	// eslint-disable-next-line no-console
	console.debug(...args);
};
