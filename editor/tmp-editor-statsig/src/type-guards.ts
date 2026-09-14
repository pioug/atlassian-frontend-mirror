// @ts-ignore
type Global = globalThis.Window &
	typeof globalThis & {
		process: {
			env: {
				JEST_WORKER_ID: string;
				NODE_ENV: string;
			};
		};
	};
