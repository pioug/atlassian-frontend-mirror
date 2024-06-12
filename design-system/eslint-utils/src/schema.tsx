import { DEFAULT_IMPORT_SOURCES } from './is-supported-import';

export const importSources = {
	type: 'array',
	items: { type: 'string' },
	uniqueItems: true,
	default: DEFAULT_IMPORT_SOURCES,
} as const;
