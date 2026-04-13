import {
	findExportForSourceFile,
	isKebabCaseExportKey,
	parsePackageExports,
} from '../package-resolution';

// eslint-disable-next-line no-unused-vars
type DirectoryEntry = import('../types').DirectoryEntry;
// eslint-disable-next-line no-unused-vars
type FileSystem = import('../types').FileSystem;

const WORKSPACE_ROOT = '/workspace';
const AI_MATE_DIR = `${WORKSPACE_ROOT}/platform/packages/ai-mate`;

function createCountingMockFs(files: Record<string, string>) {
	const mtimes = new Map<string, number>();
	// default mtime for provided files
	for (const p of Object.keys(files)) {
		mtimes.set(p, 12345);
	}

	const directories = new Set<string>();
	for (const filePath of Object.keys(files)) {
		const parts = filePath.split('/');
		for (let i = 1; i < parts.length; i++) {
			directories.add(parts.slice(0, i).join('/'));
		}
	}

	const counters = {
		readFileSync: 0,
	};

	const fs: FileSystem = {
		existsSync(path: string): boolean {
			return path in files || directories.has(path);
		},
		readFileSync(path: string, _encoding: 'utf-8'): string {
			counters.readFileSync++;
			if (!(path in files)) {
				throw new Error(`ENOENT: no such file or directory, open '${path}'`);
			}
			return files[path];
		},
		realpathSync(path: string): string {
			return path;
		},
		statSync(path: string): { isFile(): boolean; mtimeMs?: number } {
			// Handle yarn.lock specially to test mtime (mtime encoded as file content)
			if (path.endsWith('yarn.lock') && path in files) {
				const content = files[path];
				const mtimeMs = content ? parseInt(content, 10) || 12345 : 12345;
				mtimes.set(path, mtimeMs);
				return {
					isFile: () => true,
					mtimeMs,
				};
			}

			return {
				isFile: () => path in files,
				mtimeMs: mtimes.get(path) ?? 12345,
			};
		},
		readdirSync(path: string, _options: { withFileTypes: true }): DirectoryEntry[] {
			if (!directories.has(path) && !(path in files)) {
				throw new Error(`ENOENT: no such file or directory, scandir '${path}'`);
			}

			const children = new Map<string, 'file' | 'directory'>();
			const prefix = path + '/';

			for (const filePath of Object.keys(files)) {
				if (filePath.startsWith(prefix)) {
					const relativePath = filePath.slice(prefix.length);
					const firstSegment = relativePath.split('/')[0];
					if (firstSegment) {
						const isDir = relativePath.includes('/');
						const existingType = children.get(firstSegment);
						if (!existingType || isDir) {
							children.set(firstSegment, isDir ? 'directory' : 'file');
						}
					}
				}
			}

			return Array.from(children.entries()).map(([name, type]) => ({
				name,
				isDirectory: () => type === 'directory',
				isFile: () => type === 'file',
			}));
		},
		execSync(command: string): string | null {
			if (command === 'git rev-parse --show-toplevel') {
				return WORKSPACE_ROOT;
			}
			return null;
		},
		cache: {},
	};

	return {
		fs,
		counters,
		setMtimeMs(filePath: string, mtimeMs: number) {
			mtimes.set(filePath, mtimeMs);
		},
	};
}

describe('package-resolution / parsePackageExports caching', () => {
	it('should memoize exports map by packageDir', () => {
		const packageDir = `${AI_MATE_DIR}/package-a`;
		const { fs, counters } = createCountingMockFs({
			[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
			[`${packageDir}/package.json`]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
				},
			}),
			[`${packageDir}/src/index.ts`]: 'export const a = 1;',
		});

		const map1 = parsePackageExports({ packageDir, fs });
		const readsAfterFirst = counters.readFileSync;
		const map2 = parsePackageExports({ packageDir, fs });

		expect(map1.get('.')).toBe(`${packageDir}/src/index.ts`);
		// Same object reference indicates memoization
		expect(map2).toBe(map1);
		// Second call should not have re-read package.json
		expect(counters.readFileSync).toBe(readsAfterFirst);
	});

	it('should recompute exports when package.json mtime changes', () => {
		const packageDir = `${AI_MATE_DIR}/package-a`;
		const packageJsonPath = `${packageDir}/package.json`;

		const mock = createCountingMockFs({
			[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
			[packageJsonPath]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
				},
			}),
			[`${packageDir}/src/index.ts`]: 'export const a = 1;',
			[`${packageDir}/src/next.ts`]: 'export const next = 1;',
		});

		const map1 = parsePackageExports({ packageDir, fs: mock.fs });
		const readsAfterFirst = mock.counters.readFileSync;

		// Warm call should be cached
		const map2 = parsePackageExports({ packageDir, fs: mock.fs });
		expect(map2).toBe(map1);
		expect(mock.counters.readFileSync).toBe(readsAfterFirst);

		// Simulate a local edit to package.json (mtime changes) that changes exports
		mock.setMtimeMs(packageJsonPath, 99999);
		(mock.fs as any).readFileSync = ((orig) => (p: string, encoding: 'utf-8') => {
			// override content only for package.json
			if (p === packageJsonPath) {
				mock.counters.readFileSync++;
				return JSON.stringify({
					name: '@atlassian/package-a',
					exports: {
						'.': './src/next.ts',
					},
				});
			}
			return orig(p, encoding);
		})(mock.fs.readFileSync as any);

		const map3 = parsePackageExports({ packageDir, fs: mock.fs });
		expect(map3).not.toBe(map1);
		expect(map3.get('.')).toBe(`${packageDir}/src/next.ts`);
		expect(mock.counters.readFileSync).toBeGreaterThan(readsAfterFirst);
	});

	it('should recompute exports when statSync throws (null mtime edge case)', () => {
		const packageDir = `${AI_MATE_DIR}/package-a`;
		const packageJsonPath = `${packageDir}/package.json`;

		const mock = createCountingMockFs({
			[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
			[packageJsonPath]: JSON.stringify({
				name: '@atlassian/package-a',
				exports: {
					'.': './src/index.ts',
				},
			}),
			[`${packageDir}/src/index.ts`]: 'export const a = 1;',
			[`${packageDir}/src/next.ts`]: 'export const next = 1;',
		});

		// First call - should cache with valid mtime
		const map1 = parsePackageExports({ packageDir, fs: mock.fs });
		expect(map1.get('.')).toBe(`${packageDir}/src/index.ts`);
		const readsAfterFirst = mock.counters.readFileSync;

		// Simulate updated package.json content
		const originalStatSync = mock.fs.statSync;
		const originalReadFileSync = mock.fs.readFileSync;

		mock.fs.readFileSync = (path: string, encoding: 'utf-8') => {
			if (path === packageJsonPath) {
				mock.counters.readFileSync++;
				return JSON.stringify({
					name: '@atlassian/package-a',
					exports: {
						'.': './src/next.ts',
					},
				});
			}
			return originalReadFileSync(path, encoding);
		};

		// Make statSync throw for package.json (simulating inaccessible file)
		mock.fs.statSync = (path: string) => {
			if (path === packageJsonPath) {
				throw new Error('EACCES: permission denied');
			}
			return originalStatSync(path);
		};

		// Should recompute because mtime is null (stat failed), not use stale cache
		const map2 = parsePackageExports({ packageDir, fs: mock.fs });
		expect(map2).not.toBe(map1);
		expect(map2.get('.')).toBe(`${packageDir}/src/next.ts`);
		expect(mock.counters.readFileSync).toBeGreaterThan(readsAfterFirst);
	});
});

describe('isKebabCaseExportKey', () => {
	it('should return true for kebab-case keys', () => {
		expect(isKebabCaseExportKey('./browse-agents')).toBe(true);
		expect(isKebabCaseExportKey('./ui/browse-agents-modal')).toBe(true);
		expect(isKebabCaseExportKey('./controllers/analytics')).toBe(true);
		expect(isKebabCaseExportKey('./a')).toBe(true);
		expect(isKebabCaseExportKey('./some-component123')).toBe(true);
	});

	it('should return false for camelCase / PascalCase keys', () => {
		expect(isKebabCaseExportKey('./BrowseAgentsModal')).toBe(false);
		expect(isKebabCaseExportKey('./ui/BrowseAgentsModal')).toBe(false);
		expect(isKebabCaseExportKey('./browseAgentsModal')).toBe(false);
		expect(isKebabCaseExportKey('./ui/someComponent')).toBe(false);
	});

	it('should return false for keys with underscores', () => {
		expect(isKebabCaseExportKey('./browse_agents')).toBe(false);
		expect(isKebabCaseExportKey('./ui/browse_agents_modal')).toBe(false);
	});

	it('should return false for the bare root export', () => {
		// "." has empty body after removing "./"
		expect(isKebabCaseExportKey('.')).toBe(false);
	});

	it('should return false for empty body after "./" prefix', () => {
		expect(isKebabCaseExportKey('./')).toBe(false);
	});
});

describe('findExportForSourceFile / kebab-case prioritization', () => {
	it('should prefer kebab-case key when two keys point to the same entry-point file', () => {
		const exportsMap = new Map<string, string>([
			['.', '/pkg/src/index.ts'],
			['./BrowseAgentsModal', '/pkg/src/entry-points/browse-agents.ts'],
			['./browse-agents-modal', '/pkg/src/entry-points/browse-agents.ts'],
		]);

		const result = findExportForSourceFile({
			sourceFilePath: '/pkg/src/entry-points/browse-agents.ts',
			exportsMap,
		});

		expect(result).toEqual({ exportPath: './browse-agents-modal' });
	});

	it('should prefer kebab-case key even if it appears after non-kebab key in map', () => {
		const exportsMap = new Map<string, string>([
			['.', '/pkg/src/index.ts'],
			['./CheckboxSelect', '/pkg/src/entry-point/checkbox-select.ts'],
			['./checkbox-select', '/pkg/src/entry-point/checkbox-select.ts'],
			['./SomethingElse', '/pkg/src/entry-point/something-else.ts'],
		]);

		const result = findExportForSourceFile({
			sourceFilePath: '/pkg/src/entry-point/checkbox-select.ts',
			exportsMap,
		});

		expect(result).toEqual({ exportPath: './checkbox-select' });
	});

	it('should prefer kebab-case key even if it appears before non-kebab key in map', () => {
		const exportsMap = new Map<string, string>([
			['.', '/pkg/src/index.ts'],
			['./checkbox-select', '/pkg/src/entry-points/checkbox-select.ts'],
			['./CheckboxSelect', '/pkg/src/entry-points/checkbox-select.ts'],
		]);

		const result = findExportForSourceFile({
			sourceFilePath: '/pkg/src/entry-points/checkbox-select.ts',
			exportsMap,
		});

		expect(result).toEqual({ exportPath: './checkbox-select' });
	});

	it('should fall back to first match when no key is kebab-case', () => {
		const exportsMap = new Map<string, string>([
			['.', '/pkg/src/index.ts'],
			['./BrowseAgentsModal', '/pkg/src/entry-points/browse-agents.ts'],
			['./BrowseAgentsSidebar', '/pkg/src/entry-points/browse-agents.ts'],
		]);

		const result = findExportForSourceFile({
			sourceFilePath: '/pkg/src/entry-points/browse-agents.ts',
			exportsMap,
		});

		expect(result).toEqual({ exportPath: './BrowseAgentsModal' });
	});

	it('should not apply kebab-case preference when value is not an entry-point file', () => {
		// Both point to a file that is NOT in an entry-points folder
		const exportsMap = new Map<string, string>([
			['.', '/pkg/src/index.ts'],
			['./BrowseAgentsModal', '/pkg/src/ui/browse-agents/index.tsx'],
			['./browse-agents-modal', '/pkg/src/ui/browse-agents/index.tsx'],
		]);

		const result = findExportForSourceFile({
			sourceFilePath: '/pkg/src/ui/browse-agents/index.tsx',
			exportsMap,
		});

		// Falls back to first match since neither value is an entry-point file
		expect(result).toEqual({ exportPath: './BrowseAgentsModal' });
	});

	it('should still return null when no export matches', () => {
		const exportsMap = new Map<string, string>([
			['.', '/pkg/src/index.ts'],
			['./foo', '/pkg/src/entry-points/foo.ts'],
		]);

		const result = findExportForSourceFile({
			sourceFilePath: '/pkg/src/entry-points/bar.ts',
			exportsMap,
		});

		expect(result).toBeNull();
	});

	it('should return single match without requiring kebab-case', () => {
		const exportsMap = new Map<string, string>([
			['.', '/pkg/src/index.ts'],
			['./MyComponent', '/pkg/src/entry-points/my-component.ts'],
		]);

		const result = findExportForSourceFile({
			sourceFilePath: '/pkg/src/entry-points/my-component.ts',
			exportsMap,
		});

		expect(result).toEqual({ exportPath: './MyComponent' });
	});
});
