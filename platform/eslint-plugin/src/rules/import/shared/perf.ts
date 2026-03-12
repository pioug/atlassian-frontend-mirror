import type { FileSystem } from './types';

export const PERF_ENV_VAR = 'INTERNAL_ESLINT_BARREL_PERF';

function nowMs(): number {
	// eslint-disable-next-line no-restricted-globals
	return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
}

export function isPerfEnabled(): boolean {
	return process.env[PERF_ENV_VAR] === '1' || process.env[PERF_ENV_VAR] === 'true';
}

function ensurePerfInitialized({ fs }: { fs: FileSystem }): void {
	if (!fs.cache.perf) {
		fs.cache.perf = {
			installedExitHook: false,
			counters: {},
			timers: {},
		};
	}
}

function ensureExitHookInstalled({ fs }: { fs: FileSystem }): void {
	if (!isPerfEnabled()) {
		return;
	}

	ensurePerfInitialized({ fs });

	if (fs.cache.perf!.installedExitHook) {
		return;
	}

	fs.cache.perf!.installedExitHook = true;
	// eslint-disable-next-line no-console
	console.error(`[eslint-plugin-internal] perf enabled via ${PERF_ENV_VAR}`);

	process.once('exit', () => {
		// eslint-disable-next-line no-console
		console.error(`[eslint-plugin-internal] perf exit hook fired (${PERF_ENV_VAR})`);
		// eslint-disable-next-line no-console
		console.log(`[eslint-plugin-internal] perf summary (${PERF_ENV_VAR})`);
		// eslint-disable-next-line no-console
		console.log(
			JSON.stringify(
				{
					counters: fs.cache.perf?.counters ?? {},
					timers: fs.cache.perf?.timers ?? {},
				},
				null,
				2,
			),
		);
	});
}

export function perfInc({ fs, key, by = 1 }: { fs: FileSystem; key: string; by?: number }): void {
	if (!isPerfEnabled()) {
		return;
	}
	ensureExitHookInstalled({ fs });
	const perf = fs.cache.perf!;
	perf.counters[key] = (perf.counters[key] ?? 0) + by;
}

export function perfTime<T>({ fs, key, fn }: { fs: FileSystem; key: string; fn: () => T }): T {
	if (!isPerfEnabled()) {
		return fn();
	}
	ensureExitHookInstalled({ fs });
	const perf = fs.cache.perf!;
	const start = nowMs();
	try {
		return fn();
	} finally {
		const duration = nowMs() - start;
		perf.timers[key] = (perf.timers[key] ?? 0) + duration;
	}
}
