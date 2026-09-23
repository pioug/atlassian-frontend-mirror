import type { EntryPointConfig } from '../../src/types';

export const CODEGEN_COMMAND = 'afm workspace @atlaskit/volt-components-entry-point-config codegen';

/**
 * Serialize the config object as a TypeScript module source string.
 * Uses JSON.stringify for the data payload to avoid hand-built interpolations.
 */
export function serializeEntryPointsModule(config: EntryPointConfig): string {
	const json = JSON.stringify(config, null, '\t');
	const lines = [
		"import type { EntryPointConfig } from './types';",
		'',
		'export const config: EntryPointConfig = ' + json + ';',
		'',
	];
	return lines.join('\n');
}
