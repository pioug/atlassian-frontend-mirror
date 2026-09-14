import { CODEGEN_COMMAND, serializeEntryPointsModule } from '../serialize-entry-points-module';

describe('serializeEntryPointsModule', () => {
	it('emits a typed config module from structured data', () => {
		const source = serializeEntryPointsModule({
			'@atlaskit/image': {
				'': {
					default: {
						'entry-point': '/image',
						name: 'Image',
						type: 'component',
						voltCompliant: true,
						consumersMigrated: false,
					},
				},
			},
		});

		expect(source).toContain("import type { EntryPointConfig } from './types';");
		expect(source).toContain('"@atlaskit/image"');
		expect(source).toContain('export const config: EntryPointConfig =');
		expect(CODEGEN_COMMAND).toContain('codegen');
	});
});
