import { findPackageInRegistry, isPackageInApplyToImportsFrom } from '../package-registry';
import type { DirectoryEntry, FileSystem } from '../types';

/**
 * Helper to create a mock file system from a map of file paths to contents.
 * Directories are represented by entries ending with '/' or containing nested paths.
 */
function createMockFileSystem(files: Record<string, string>): FileSystem {
	// Build a set of all directories from the file paths
	const directories = new Set<string>();
	for (const filePath of Object.keys(files)) {
		// Add all parent directories
		const parts = filePath.split('/');
		for (let i = 1; i < parts.length; i++) {
			directories.add(parts.slice(0, i).join('/'));
		}
	}

	return {
		existsSync(path: string): boolean {
			return path in files || directories.has(path);
		},
		readFileSync(path: string): string {
			if (!(path in files)) {
				throw new Error(`ENOENT: no such file or directory, open '${path}'`);
			}
			return files[path];
		},
		realpathSync(path: string): string {
			return path;
		},
		statSync(path: string): { isFile(): boolean; mtimeMs?: number } {
			// Handle yarn.lock specially to test mtime
			if (path.endsWith('yarn.lock') && path in files) {
				const content = files[path];
				// Use content as mtime for testing (allows us to change mtime by changing content)
				return {
					isFile: () => true,
					mtimeMs: content ? parseInt(content, 10) || 12345 : 12345,
				};
			}
			return {
				isFile: () => path in files,
				mtimeMs: 12345,
			};
		},
		readdirSync(path: string, _options: { withFileTypes: true }): DirectoryEntry[] {
			if (!directories.has(path) && !(path in files)) {
				throw new Error(`ENOENT: no such file or directory, scandir '${path}'`);
			}

			// Find all immediate children of this directory
			const children = new Map<string, 'file' | 'directory'>();
			const prefix = path + '/';

			for (const filePath of Object.keys(files)) {
				if (filePath.startsWith(prefix)) {
					const relativePath = filePath.slice(prefix.length);
					const firstSegment = relativePath.split('/')[0];
					if (firstSegment) {
						// If there's more after the first segment, it's a directory
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
		execSync(command: string, _options?: { cwd?: string }): string | null {
			// Return workspace root for git rev-parse command
			if (command === 'git rev-parse --show-toplevel') {
				return WORKSPACE_ROOT;
			}
			return null;
		},
		// Fresh cache for each test - ensures no state leaks between tests
		cache: {},
	};
}

// Base paths used in tests
const WORKSPACE_ROOT = '/workspace';
const AI_MATE_DIR = `${WORKSPACE_ROOT}/platform/packages/ai-mate`;

describe('package-registry', () => {
	describe('findPackageInRegistry', () => {
		it('should find a package', () => {
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
					name: '@atlassian/package-a',
				}),
			});

			const directory = findPackageInRegistry({
				packageName: '@atlassian/package-a',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(directory).toBe(`${AI_MATE_DIR}/package-a`);
		});

		it('should find package when name does not match directory name', () => {
			// This is a key use case - package names don't always match folder paths
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				// Directory name is 'some-folder' but package name is '@atlassian/completely-different-name'
				[`${AI_MATE_DIR}/some-folder/package.json`]: JSON.stringify({
					name: '@atlassian/completely-different-name',
				}),
				// Another example with deeply nested folder
				[`${AI_MATE_DIR}/deeply/nested/folder/package.json`]: JSON.stringify({
					name: '@atlaskit/my-component',
				}),
			});

			const dir1 = findPackageInRegistry({
				packageName: '@atlassian/completely-different-name',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});
			const dir2 = findPackageInRegistry({
				packageName: '@atlaskit/my-component',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(dir1).toBe(`${AI_MATE_DIR}/some-folder`);
			expect(dir2).toBe(`${AI_MATE_DIR}/deeply/nested/folder`);
		});

		it('should return null for non-existent package', () => {
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
					name: '@atlassian/package-a',
				}),
			});

			const directory = findPackageInRegistry({
				packageName: '@atlassian/non-existent',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(directory).toBeNull();
		});

		it('should find multiple packages in the same filesystem', () => {
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
					name: '@atlassian/package-a',
				}),
				[`${AI_MATE_DIR}/package-b/package.json`]: JSON.stringify({
					name: '@atlassian/package-b',
				}),
			});

			// First lookup
			const dirA = findPackageInRegistry({
				packageName: '@atlassian/package-a',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			// Second lookup should use cached data
			const dirB = findPackageInRegistry({
				packageName: '@atlassian/package-b',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(dirA).toBe(`${AI_MATE_DIR}/package-a`);
			expect(dirB).toBe(`${AI_MATE_DIR}/package-b`);
		});

		it('should not scan subdirectories once a package.json is found', () => {
			// This optimization assumes packages don't contain nested packages
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				[`${AI_MATE_DIR}/conversation-assistant-agent/package.json`]: JSON.stringify({
					name: '@atlassian/conversation-assistant-agent',
				}),
				// This nested package.json should NOT be found due to the optimization
				[`${AI_MATE_DIR}/conversation-assistant-agent/ui/AgentInstructions/package.json`]:
					JSON.stringify({
						name: '@atlassian/conversation-assistant-agent/ui/AgentInstructions',
					}),
			});

			const parentDir = findPackageInRegistry({
				packageName: '@atlassian/conversation-assistant-agent',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});
			const nestedDir = findPackageInRegistry({
				packageName: '@atlassian/conversation-assistant-agent/ui/AgentInstructions',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(parentDir).toBe(`${AI_MATE_DIR}/conversation-assistant-agent`);
			// Nested package should NOT be found - we don't scan subdirectories of packages
			expect(nestedDir).toBeNull();
		});

		it('should skip node_modules directories', () => {
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
					name: '@atlassian/package-a',
				}),
				[`${AI_MATE_DIR}/package-a/node_modules/dep/package.json`]: JSON.stringify({
					name: 'dep',
				}),
			});

			const packageADir = findPackageInRegistry({
				packageName: '@atlassian/package-a',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});
			const depDir = findPackageInRegistry({
				packageName: 'dep',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(packageADir).toBe(`${AI_MATE_DIR}/package-a`);
			expect(depDir).toBeNull();
		});

		it('should skip hidden directories', () => {
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
					name: '@atlassian/package-a',
				}),
				[`${AI_MATE_DIR}/.hidden/package.json`]: JSON.stringify({
					name: '@atlassian/hidden',
				}),
			});

			const packageADir = findPackageInRegistry({
				packageName: '@atlassian/package-a',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});
			const hiddenDir = findPackageInRegistry({
				packageName: '@atlassian/hidden',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(packageADir).toBe(`${AI_MATE_DIR}/package-a`);
			expect(hiddenDir).toBeNull();
		});

		it('should use cached results on subsequent lookups', () => {
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
					name: '@atlassian/package-a',
				}),
			});

			// First lookup populates cache
			findPackageInRegistry({
				packageName: '@atlassian/package-a',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			// Verify cache is populated
			expect(fs.cache.packageNameToDir).toBeDefined();
			expect(fs.cache.packageNameToDir?.get('@atlassian/package-a')).toBe(
				`${AI_MATE_DIR}/package-a`,
			);
			expect(fs.cache.workspaceRoot).toBe(WORKSPACE_ROOT);
		});

		it('should invalidate cache when yarn.lock mtime changes', () => {
			// Create initial filesystem
			const files: Record<string, string> = {
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
					name: '@atlassian/package-a',
				}),
			};

			const fs = createMockFileSystem(files);

			// First lookup
			findPackageInRegistry({
				packageName: '@atlassian/package-a',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			// Simulate yarn.lock change by updating the cache's recorded mtime
			// (In real usage, the file mtime would change)
			fs.cache.yarnLockMtime = 99999; // Different from actual 12345

			// Second lookup should re-scan because mtime differs
			const dir = findPackageInRegistry({
				packageName: '@atlassian/package-a',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(dir).toBe(`${AI_MATE_DIR}/package-a`);
			// Cache should be refreshed with current mtime
			expect(fs.cache.yarnLockMtime).toBe(12345);
		});

		it('should invalidate cache when workspace root changes', () => {
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
					name: '@atlassian/package-a',
				}),
			});

			// Pre-populate cache with different workspace root
			fs.cache.workspaceRoot = '/different/workspace';
			fs.cache.packageNameToDir = new Map([['@atlassian/old', '/old/path']]);
			fs.cache.scannedDirectories = new Set(['/old/path']);
			fs.cache.yarnLockMtime = 12345;

			// Lookup should invalidate and rebuild cache
			const dir = findPackageInRegistry({
				packageName: '@atlassian/package-a',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(dir).toBe(`${AI_MATE_DIR}/package-a`);
			expect(fs.cache.workspaceRoot).toBe(WORKSPACE_ROOT);
			expect(fs.cache.packageNameToDir?.has('@atlassian/old')).toBe(false);
		});

		it('should scan subdirectories of target folder root even if it has package.json', () => {
			// Target folder roots (e.g., 'platform') may have a package.json but still contain packages
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				// Target folder root has a package.json
				[`${AI_MATE_DIR}/package.json`]: JSON.stringify({
					name: '@atlassian/ai-mate-root',
				}),
				// But it also contains packages in subdirectories
				[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
					name: '@atlassian/package-a',
				}),
				[`${AI_MATE_DIR}/package-b/package.json`]: JSON.stringify({
					name: '@atlassian/package-b',
				}),
			});

			// Should find all packages including the root
			const rootDir = findPackageInRegistry({
				packageName: '@atlassian/ai-mate-root',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});
			const packageADir = findPackageInRegistry({
				packageName: '@atlassian/package-a',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});
			const packageBDir = findPackageInRegistry({
				packageName: '@atlassian/package-b',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(rootDir).toBe(AI_MATE_DIR);
			expect(packageADir).toBe(`${AI_MATE_DIR}/package-a`);
			expect(packageBDir).toBe(`${AI_MATE_DIR}/package-b`);
		});

		it('should not scan subdirectories of packages', () => {
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
					name: '@atlassian/package-a',
				}),
				[`${AI_MATE_DIR}/package-a/src/utils/helper.ts`]: 'export const helper = () => {}',
			});

			findPackageInRegistry({
				packageName: '@atlassian/package-a',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			// Should NOT have scanned subdirectories of package-a since it has a package.json
			expect(fs.cache.scannedDirectories?.has(`${AI_MATE_DIR}/package-a`)).toBe(true);
			expect(fs.cache.scannedDirectories?.has(`${AI_MATE_DIR}/package-a/src`)).toBe(false);
			expect(fs.cache.scannedDirectories?.has(`${AI_MATE_DIR}/package-a/src/utils`)).toBe(false);
		});
	});

	describe('isPackageInApplyToImportsFrom', () => {
		it('should return true for packages in target folder', () => {
			const result = isPackageInApplyToImportsFrom({
				packageDir: `${AI_MATE_DIR}/package-a`,
				workspaceRoot: WORKSPACE_ROOT,
			});

			expect(result).toBe(true);
		});

		it('should return false for packages outside target folder', () => {
			const result = isPackageInApplyToImportsFrom({
				packageDir: `${WORKSPACE_ROOT}/platform/packages/other/package-a`,
				workspaceRoot: WORKSPACE_ROOT,
			});

			expect(result).toBe(false);
		});

		it('should use custom applyToImportsFrom when provided', () => {
			const customApplyToImportsFrom = ['platform/packages/custom-folder'];

			// Package in custom folder should be in target
			const inCustomFolder = isPackageInApplyToImportsFrom({
				packageDir: `${WORKSPACE_ROOT}/platform/packages/custom-folder/package-a`,
				workspaceRoot: WORKSPACE_ROOT,
				applyToImportsFrom: customApplyToImportsFrom,
			});
			expect(inCustomFolder).toBe(true);

			// Package in default folder should NOT be in target when custom folders are specified
			const inDefaultFolder = isPackageInApplyToImportsFrom({
				packageDir: `${AI_MATE_DIR}/package-a`,
				workspaceRoot: WORKSPACE_ROOT,
				applyToImportsFrom: customApplyToImportsFrom,
			});
			expect(inDefaultFolder).toBe(false);
		});
	});

	describe('package resolution is not constrained by applyToImportsFrom', () => {
		it('should find packages outside default target folders', () => {
			// Create a file system with packages in different folders
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				// Package in default target folder (ai-mate)
				[`${AI_MATE_DIR}/package-in-target/package.json`]: JSON.stringify({
					name: '@atlassian/package-in-target',
				}),
				// Package outside default target folders
				[`${WORKSPACE_ROOT}/platform/packages/other-folder/package-outside-target/package.json`]:
					JSON.stringify({
						name: '@atlassian/package-outside-target',
					}),
				// Package in a deeply nested folder outside defaults
				[`${WORKSPACE_ROOT}/platform/packages/editor/editor-core/package.json`]: JSON.stringify({
					name: '@atlaskit/editor-core',
				}),
			});

			// All packages should be resolvable regardless of applyToImportsFrom
			const packageInTarget = findPackageInRegistry({
				packageName: '@atlassian/package-in-target',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});
			const packageOutsideTarget = findPackageInRegistry({
				packageName: '@atlassian/package-outside-target',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});
			const editorCore = findPackageInRegistry({
				packageName: '@atlaskit/editor-core',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(packageInTarget).toBe(`${AI_MATE_DIR}/package-in-target`);
			expect(packageOutsideTarget).toBe(
				`${WORKSPACE_ROOT}/platform/packages/other-folder/package-outside-target`,
			);
			expect(editorCore).toBe(`${WORKSPACE_ROOT}/platform/packages/editor/editor-core`);
		});

		it('should find packages in all resolution roots', () => {
			// This test verifies that packages under platform/packages/ are found
			// regardless of which subfolder they're in
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				// Packages in various subfolders of platform/packages
				[`${WORKSPACE_ROOT}/platform/packages/design-system/button/package.json`]: JSON.stringify({
					name: '@atlaskit/button',
				}),
				[`${WORKSPACE_ROOT}/platform/packages/linking-platform/link-provider/package.json`]:
					JSON.stringify({
						name: '@atlassian/link-provider',
					}),
				[`${WORKSPACE_ROOT}/platform/packages/media/media-core/package.json`]: JSON.stringify({
					name: '@atlaskit/media-core',
				}),
			});

			// All packages should be found
			const button = findPackageInRegistry({
				packageName: '@atlaskit/button',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});
			const linkProvider = findPackageInRegistry({
				packageName: '@atlassian/link-provider',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});
			const mediaCore = findPackageInRegistry({
				packageName: '@atlaskit/media-core',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
			});

			expect(button).toBe(`${WORKSPACE_ROOT}/platform/packages/design-system/button`);
			expect(linkProvider).toBe(
				`${WORKSPACE_ROOT}/platform/packages/linking-platform/link-provider`,
			);
			expect(mediaCore).toBe(`${WORKSPACE_ROOT}/platform/packages/media/media-core`);
		});

		it('findPackageInRegistry does not accept applyToImportsFrom parameter', () => {
			// This test documents that findPackageInRegistry intentionally does not
			// accept an applyToImportsFrom parameter - package resolution should always
			// search all packages under platform/packages/
			const fs = createMockFileSystem({
				[`${WORKSPACE_ROOT}/yarn.lock`]: '12345',
				[`${AI_MATE_DIR}/package-a/package.json`]: JSON.stringify({
					name: '@atlassian/package-a',
				}),
			});

			// Verify the function signature - it should not have applyToImportsFrom
			const result = findPackageInRegistry({
				packageName: '@atlassian/package-a',
				workspaceRoot: WORKSPACE_ROOT,
				fs,
				// Note: applyToImportsFrom is intentionally NOT a valid parameter here
				// If someone tries to add it, TypeScript should error
			});

			expect(result).toBe(`${AI_MATE_DIR}/package-a`);
		});
	});
});
