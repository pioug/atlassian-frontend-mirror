import type { LocatedPackage } from '../../scripts/types';
import { resolvePackageMappings } from '../resolve-package-mappings';

describe('resolvePackageMappings', () => {
	it('maps a unique candidate and reports mapped counts', () => {
		const pkg: LocatedPackage = {
			name: '@atlaskit/primitives',
			packageDir: '/pkg',
			packageJsonPath: '/pkg/package.json',
			packageJson: { name: '@atlaskit/primitives' },
		};

		const result = resolvePackageMappings(
			pkg,
			[
				{
					barrelKey: '',
					filePath: '/pkg/src/index.tsx',
					symbols: [
						{
							exportName: 'Box',
							localName: 'Box',
							kind: 'component',
							sourceFilePath: '/pkg/src/components/box.tsx',
						},
					],
				},
			],
			[
				{
					entryPoint: '/box',
					filePath: '/pkg/src/entry-points/box.tsx',
					symbols: new Set(['Box']),
					underlyingSources: new Set(['/pkg/src/components/box.tsx']),
				},
			],
			{ voltCompliant: true, consumersMigrated: false },
		);

		expect(result.mappedCount).toBe(1);
		expect(result.barrelMap[''].Box).toMatchObject({
			'entry-point': '/box',
			voltCompliant: true,
			consumersMigrated: false,
		});
	});

	it('keeps entry-point but sets voltCompliant false when package is not Stage 1', () => {
		const pkg: LocatedPackage = {
			name: '@atlaskit/image',
			packageDir: '/pkg',
			packageJsonPath: '/pkg/package.json',
			packageJson: { name: '@atlaskit/image' },
		};

		const result = resolvePackageMappings(
			pkg,
			[
				{
					barrelKey: '',
					filePath: '/pkg/src/index.tsx',
					symbols: [
						{
							exportName: 'default',
							localName: 'default',
							kind: 'component',
							sourceFilePath: '/pkg/src/image.tsx',
						},
					],
				},
			],
			[
				{
					entryPoint: '/image',
					filePath: '/pkg/src/entry-points/image.tsx',
					symbols: new Set(['default']),
					underlyingSources: new Set(['/pkg/src/image.tsx']),
				},
			],
			{ voltCompliant: false, consumersMigrated: false },
		);

		expect(result.barrelMap[''].default).toMatchObject({
			'entry-point': '/image',
			voltCompliant: false,
			consumersMigrated: false,
		});
	});
});
