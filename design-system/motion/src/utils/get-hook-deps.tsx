import type { Opts } from './opts';

export const getHookDeps: (opts: Opts) => undefined | [] = (opts: Opts) => {
	switch (opts.cleanup) {
		case 'next-effect':
			return undefined;

		case 'unmount':
		default:
			return [];
	}
};
