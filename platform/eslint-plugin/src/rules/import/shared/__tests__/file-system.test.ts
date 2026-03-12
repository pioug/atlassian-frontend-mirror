import { readFileContent, resolveImportPath } from '../file-system';
import type { DirectoryEntry, FileSystem } from '../types';

function createFileSystemWithCounters(files: Record<string, string>) {
	const mtimes = new Map<string, number>();
	for (const p of Object.keys(files)) {
		mtimes.set(p, 100);
	}

	const counters = {
		readFileSync: 0,
		statSync: 0,
		realpathSync: 0,
	};

	const fs: FileSystem = {
		existsSync(path: string): boolean {
			return path in files;
		},
		readFileSync(path: string): string {
			counters.readFileSync++;
			if (!(path in files)) {
				throw new Error(`ENOENT: ${path}`);
			}
			return files[path];
		},
		realpathSync(path: string): string {
			counters.realpathSync++;
			return path;
		},
		statSync(path: string): { isFile(): boolean; mtimeMs?: number } {
			counters.statSync++;
			return {
				isFile: () => path in files,
				mtimeMs: mtimes.get(path) ?? 0,
			};
		},
		readdirSync(_path: string, _options: { withFileTypes: true }): DirectoryEntry[] {
			return [];
		},
		execSync(_command: string): string | null {
			return null;
		},
		cache: {},
	};

	return {
		fs,
		counters,
		setMtimeMs(path: string, mtimeMs: number) {
			mtimes.set(path, mtimeMs);
		},
		setContent(path: string, content: string) {
			files[path] = content;
		},
	};
}

describe('file-system / readFileContent caching', () => {
	it('memoizes resolveImportPath results', () => {
		const basedir = '/repo';
		const filePath = '/repo/foo.ts';
		const mock = createFileSystemWithCounters({
			[filePath]: 'export const foo = 1;',
		});

		const p1 = resolveImportPath({ basedir, importPath: './foo', fs: mock.fs });
		const realpathsAfterFirst = mock.counters.realpathSync;
		const p2 = resolveImportPath({ basedir, importPath: './foo', fs: mock.fs });

		expect(p1).toBe(filePath);
		expect(p2).toBe(filePath);
		// second call should not require resolving again
		expect(mock.counters.realpathSync).toBe(realpathsAfterFirst);
	});
	it('memoizes file contents by path and mtime', () => {
		const filePath = '/repo/some-file.ts';
		const mock = createFileSystemWithCounters({
			[filePath]: 'hello',
		});

		const c1 = readFileContent({ filePath, fs: mock.fs });
		const readsAfterFirst = mock.counters.readFileSync;
		const c2 = readFileContent({ filePath, fs: mock.fs });

		expect(c1).toBe('hello');
		expect(c2).toBe('hello');
		// second call should not read again
		expect(mock.counters.readFileSync).toBe(readsAfterFirst);
	});

	it('re-reads file when mtime changes', () => {
		const filePath = '/repo/some-file.ts';
		const mock = createFileSystemWithCounters({
			[filePath]: 'v1',
		});

		const c1 = readFileContent({ filePath, fs: mock.fs });
		const readsAfterFirst = mock.counters.readFileSync;
		// Update file
		mock.setContent(filePath, 'v2');
		mock.setMtimeMs(filePath, 200);

		const c2 = readFileContent({ filePath, fs: mock.fs });
		expect(c1).toBe('v1');
		expect(c2).toBe('v2');
		expect(mock.counters.readFileSync).toBeGreaterThan(readsAfterFirst);
	});

	it('re-reads file when statSync throws (null mtime edge case)', () => {
		const filePath = '/repo/some-file.ts';
		const mock = createFileSystemWithCounters({
			[filePath]: 'original',
		});

		// First read - should cache with valid mtime
		const c1 = readFileContent({ filePath, fs: mock.fs });
		expect(c1).toBe('original');
		const readsAfterFirst = mock.counters.readFileSync;

		// Update file content
		mock.setContent(filePath, 'updated');

		// Make statSync throw an error (simulating inaccessible file)
		const originalStatSync = mock.fs.statSync;
		mock.fs.statSync = (path: string) => {
			if (path === filePath) {
				throw new Error('EACCES: permission denied');
			}
			return originalStatSync(path);
		};

		// Should re-read because mtime is null (stat failed), not use stale cache
		const c2 = readFileContent({ filePath, fs: mock.fs });
		expect(c2).toBe('updated');
		expect(mock.counters.readFileSync).toBeGreaterThan(readsAfterFirst);
	});
});
