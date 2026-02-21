import { DEFAULT_IMPORT_SOURCES } from './is-supported-import';

export const importSources: {
	readonly type: 'array';
	readonly items: {
		readonly type: 'string';
	};
	readonly uniqueItems: true;
	readonly default: string[];
} = {
	type: 'array',
	items: { type: 'string' },
	uniqueItems: true,
	default: DEFAULT_IMPORT_SOURCES,
} as const;
