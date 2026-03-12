import { parseBarrelExports } from '../barrel-parsing';
import type { DirectoryEntry, FileSystem } from '../types';

function createMockFs(files: Record<string, string>) {
	const mtimes = new Map<string, number>();
	for (const p of Object.keys(files)) {
		mtimes.set(p, 100);
	}

	const counters = {
		readFileSync: 0,
		statSync: 0,
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

describe('barrel-parsing / parseBarrelExports caching', () => {
	it('memoizes barrel exports by file path and mtime', () => {
		const barrelFilePath = '/repo/index.ts';
		const mock = createMockFs({
			[barrelFilePath]: "export { foo } from './foo';\n",
			'/repo/foo.ts': 'export const foo = 1;\n',
		});

		const exports1 = parseBarrelExports({ barrelFilePath, fs: mock.fs });
		const readsAfterFirst = mock.counters.readFileSync;
		const exports2 = parseBarrelExports({ barrelFilePath, fs: mock.fs });

		expect(exports1.get('foo')?.path).toBe('/repo/foo.ts');
		// Same map ref indicates memoization
		expect(exports2).toBe(exports1);
		// Second call should not re-read the barrel file
		expect(mock.counters.readFileSync).toBe(readsAfterFirst);
	});

	it('recomputes barrel exports when mtime changes', () => {
		const barrelFilePath = '/repo/index.ts';
		const mock = createMockFs({
			[barrelFilePath]: "export { foo } from './foo';\n",
			'/repo/foo.ts': 'export const foo = 1;\n',
			'/repo/bar.ts': 'export const bar = 2;\n',
		});

		const exports1 = parseBarrelExports({ barrelFilePath, fs: mock.fs });
		const readsAfterFirst = mock.counters.readFileSync;

		// Change the barrel content and bump mtime
		mock.setContent(barrelFilePath, "export { bar } from './bar';\n");
		mock.setMtimeMs(barrelFilePath, 200);

		const exports2 = parseBarrelExports({ barrelFilePath, fs: mock.fs });
		expect(exports2).not.toBe(exports1);
		expect(exports2.get('bar')?.path).toBe('/repo/bar.ts');
		expect(mock.counters.readFileSync).toBeGreaterThan(readsAfterFirst);
	});
});
