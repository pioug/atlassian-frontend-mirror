import { DEFAULT_TAG } from '../../../constants';
import { sendAnalytics } from '../../../util/analytics';
import {
	showFile,
	getChangesSince,
	doesTagExist,
	getFiles,
	getHash,
	tagCommit,
} from '../../../util/git';
import { getMeta, uploadMeta } from '../../../util/statlas';
import { generateLogs, generateLogsWithFiles } from '../__fixtures__/git';
import populateProduct from '../product';

type TLogs = Record<string, Record<string, Record<string, string>>>;

const showFileMocked = showFile as jest.Mock;
const getFilesMocked = getFiles as jest.Mock;
const getHashMocked = getHash as jest.Mock;
const tagCommitMocked = tagCommit as jest.Mock;
const getChangesSinceMocked = getChangesSince as jest.Mock;
const doesTagExistMocked = doesTagExist as jest.Mock;
const getMetaMocked = getMeta as jest.Mock;

jest.mock('simple-git');
jest.mock('@atlassiansox/analytics-node-client');
jest.mock('../../../util/git');
jest.mock('../../../util/statlas');
jest.mock('../../../util/analytics', () => ({
	...jest.createMockFromModule<object>('../../../util/analytics'),
	createUpgradeEvent: jest.requireActual('../../../util/analytics').createUpgradeEvent,
}));

let mockLastRunHash = '0';

function mockGit() {
	doesTagExistMocked.mockImplementation(() => true);
	getFilesMocked.mockImplementation(() => ['package.json']);
}

function mockStatlas() {
	getMetaMocked.mockImplementation(() => ({
		lastRunHash: mockLastRunHash,
	}));
}

describe('populateProduct', () => {
	// Comment out the mockImplementation to read console.logs for debugging
	jest.spyOn(console, 'log').mockImplementation(() => {});
	jest.spyOn(console, 'error').mockImplementation(() => {});

	beforeEach(() => {
		jest.resetAllMocks();
		mockGit();
		mockStatlas();
	});

	it('should send an analytics add / upgrade event for atlaskit packages', async () => {
		const commitHash = 'commit_hash';

		const packageJsonByHash: TLogs = {
			[DEFAULT_TAG]: {
				dependencies: {
					'@atlaskit/button': '^12.0.0',
					'@atlassian/confluence-space-picker': '^2.0.2',
					foo: '^2.3.4',
				},
			},
			[commitHash]: {
				dependencies: {
					'@atlaskit/button': '^13.1.2',
					'@atlassian/confluence-space-picker': '^4.4.3',
					foo: '^2.3.4',
				},
			},
		};

		getChangesSinceMocked.mockImplementation(() => generateLogs(DEFAULT_TAG, commitHash));
		showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

		await populateProduct({
			dev: true,
			dryRun: false,
			interactive: false,
			csv: false,
			product: 'test',
			reset: false,
		});

		expect(sendAnalytics).toHaveBeenCalledWith(
			[
				expect.objectContaining({
					commitHash,
					date: '2020-11-26T00:00:00.000Z',
					dependencyName: '@atlaskit/button',
					dependencyType: 'dependency',
					historical: true,
					major: '13',
					minor: '1',
					patch: '2',
					upgradeSubType: 'major',
					upgradeType: 'upgrade',
					versionString: '^13.1.2',
				}),
			],
			{
				dev: true,
				limit: undefined,
				product: 'test',
				skipPrompt: true,
			},
		);
	});

	it('should send an analytics add / upgrade event for all supported scopes', async () => {
		const commitHash = 'commit_hash';

		const packageJsonByHash: TLogs = {
			[DEFAULT_TAG]: {
				dependencies: {
					'@atlaskit/button': '^12.0.0',
					'@atlassian/confluence-space-picker': '^2.0.2',
					foo: '^2.3.4',
				},
			},
			[commitHash]: {
				dependencies: {
					'@atlaskit/button': '^13.1.2',
					'@atlassian/confluence-space-picker': '^4.4.3',
					foo: '^2.3.4',
				},
			},
		};

		getChangesSinceMocked.mockImplementation(() => generateLogs(DEFAULT_TAG, commitHash));
		showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

		await populateProduct({
			dev: true,
			dryRun: false,
			interactive: false,
			csv: false,
			product: 'test',
			reset: false,
			includeRestrictedScopes: true,
		});

		expect(sendAnalytics).toHaveBeenCalledWith(
			[
				expect.objectContaining({
					commitHash,
					date: '2020-11-26T00:00:00.000Z',
					dependencyName: '@atlaskit/button',
					dependencyType: 'dependency',
					historical: true,
					major: '13',
					minor: '1',
					patch: '2',
					upgradeSubType: 'major',
					upgradeType: 'upgrade',
					versionString: '^13.1.2',
				}),
				expect.objectContaining({
					commitHash,
					date: '2020-11-26T00:00:00.000Z',
					dependencyName: '@atlassian/confluence-space-picker',
					dependencyType: 'dependency',
					historical: true,
					major: '4',
					minor: '4',
					patch: '3',
					upgradeSubType: 'major',
					upgradeType: 'upgrade',
					versionString: '^4.4.3',
				}),
			],
			{
				dev: true,
				limit: undefined,
				product: 'test',
				skipPrompt: true,
			},
		);
	});

	it('should send an analytics add / upgrade event for all supported scopes and packages', async () => {
		const commitHash = 'commit_hash';

		const packageJsonByHash: TLogs = {
			[DEFAULT_TAG]: {
				dependencies: {
					'@atlaskit/button': '^12.0.0',
					'@atlassian/confluence-space-picker': '^2.0.2',
					foo: '^2.3.4',
				},
			},
			[commitHash]: {
				dependencies: {
					'@atlaskit/button': '^13.1.2',
					'@atlassian/confluence-space-picker': '^4.4.3',
					foo: '^2.3.4',
				},
			},
		};

		getChangesSinceMocked.mockImplementation(() => generateLogs(DEFAULT_TAG, commitHash));
		showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

		await populateProduct({
			dev: true,
			dryRun: false,
			interactive: false,
			csv: false,
			product: 'test',
			reset: false,
			includeRestrictedScopes: true,
			supportedPackages: JSON.stringify(['@atlaskit/button']),
		});

		expect(sendAnalytics).toHaveBeenCalledWith(
			[
				expect.objectContaining({
					commitHash,
					date: '2020-11-26T00:00:00.000Z',
					dependencyName: '@atlaskit/button',
					dependencyType: 'dependency',
					historical: true,
					major: '13',
					minor: '1',
					patch: '2',
					upgradeSubType: 'major',
					upgradeType: 'upgrade',
					versionString: '^13.1.2',
				}),
			],
			{
				dev: true,
				limit: undefined,
				product: 'test',
				skipPrompt: true,
			},
		);
	});

	it('should send an analytics event when adding a new atlaskit dependency', async () => {
		const commitHash = 'commit_hash';

		const packageJsonByHash: TLogs = {
			[DEFAULT_TAG]: {
				dependencies: {
					'@atlaskit/button': '^12.0.0',
					foo: '^2.3.4',
				},
			},
			[commitHash]: {
				dependencies: {
					'@atlaskit/button': '^12.0.0',
					'@atlaskit/lozenge': '^6.0.0',
					foo: '^2.3.4',
				},
			},
		};

		getChangesSinceMocked.mockImplementation(() => generateLogs(DEFAULT_TAG, commitHash));
		showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

		await populateProduct({
			dev: true,
			dryRun: false,
			interactive: false,
			csv: false,
			product: 'test',
			reset: false,
		});
		expect(sendAnalytics).toHaveBeenCalledTimes(1);
		expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
			expect.objectContaining({
				commitHash,
				date: '2020-11-26T00:00:00.000Z',
				dependencyName: '@atlaskit/lozenge',
				dependencyType: 'dependency',
				historical: true,
				major: '6',
				minor: '0',
				patch: '0',
				upgradeSubType: null,
				upgradeType: 'add',
				versionString: '^6.0.0',
			}),
		]);
	});
	it('should handle jira suffixed deps when supportedPackages is specified', async () => {
		const firstCommitHash = 'first_commit_hash';
		const secondCommitHash = 'second_commit_hash';

		const packageJsonByHash: TLogs = {
			[DEFAULT_TAG]: {
				dependencies: {
					'@atlaskit/button': '^12.0.0',
					foo: '^2.3.4',
				},
			},
			[firstCommitHash]: {
				dependencies: {
					'@atlaskit/button--current': 'npm:@atlaskit/button@^12.0.0',
					'@atlaskit/button--next': 'npm:@atlaskit/button@^13.1.0',
					foo: '^2.3.4',
				},
			},
			[secondCommitHash]: {
				dependencies: {
					'@atlaskit/button': '^13.1.0',
					foo: '^2.3.4',
				},
			},
		};

		getChangesSinceMocked.mockImplementation(() =>
			generateLogs(DEFAULT_TAG, firstCommitHash, secondCommitHash),
		);
		showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

		await populateProduct({
			dev: true,
			dryRun: false,
			interactive: false,
			csv: false,
			product: 'test',
			reset: false,
			supportedPackages: JSON.stringify(['@atlaskit/button']),
		});
		expect(sendAnalytics).toHaveBeenCalledTimes(1);
		expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
			expect.objectContaining({
				commitHash: secondCommitHash,
				date: '2020-11-26T00:00:00.000Z',
				dependencyName: '@atlaskit/button',
				dependencyType: 'dependency',
				historical: true,
				major: '13',
				minor: '1',
				patch: '0',
				upgradeSubType: 'major',
				upgradeType: 'upgrade',
				versionString: '^13.1.0',
			}),
		]);
	});
	it('should handle jira suffixed deps when supportedPackages is not specified', async () => {
		const firstCommitHash = 'first_commit_hash';
		const secondCommitHash = 'second_commit_hash';

		const packageJsonByHash: TLogs = {
			[DEFAULT_TAG]: {
				dependencies: {
					'@atlaskit/button': '^12.0.0',
					foo: '^2.3.4',
				},
			},
			[firstCommitHash]: {
				dependencies: {
					'@atlaskit/button--current': 'npm:@atlaskit/button@^12.0.0',
					'@atlaskit/button--next': 'npm:@atlaskit/button@^13.1.0',
					foo: '^2.3.4',
				},
			},
			[secondCommitHash]: {
				dependencies: {
					'@atlaskit/button': '^13.1.0',
					foo: '^2.3.4',
				},
			},
		};

		getChangesSinceMocked.mockImplementation(() =>
			generateLogs(DEFAULT_TAG, firstCommitHash, secondCommitHash),
		);
		showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

		await populateProduct({
			dev: true,
			dryRun: false,
			interactive: false,
			csv: false,
			product: 'test',
			reset: false,
		});
		expect(sendAnalytics).toHaveBeenCalledTimes(1);
		expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
			expect.objectContaining({
				commitHash: secondCommitHash,
				date: '2020-11-26T00:00:00.000Z',
				dependencyName: '@atlaskit/button',
				dependencyType: 'dependency',
				historical: true,
				major: '13',
				minor: '1',
				patch: '0',
				upgradeSubType: 'major',
				upgradeType: 'upgrade',
				versionString: '^13.1.0',
			}),
		]);
	});
	it('should fire separate add & remove events when a dependency moves from dependency to devDependency without version change', async () => {
		const commitHash = 'commit_hash';

		const packageJsonByHash: TLogs = {
			[DEFAULT_TAG]: {
				dependencies: {
					'@atlaskit/button': '^12.0.0',
					foo: '^2.3.4',
				},
			},
			[commitHash]: {
				dependencies: {
					foo: '^2.3.4',
				},
				devDependencies: {
					'@atlaskit/button': '^12.0.0',
				},
			},
		};

		getChangesSinceMocked.mockImplementation(() => generateLogs(DEFAULT_TAG, commitHash));
		showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

		await populateProduct({
			dev: true,
			dryRun: false,
			interactive: false,
			csv: false,
			product: 'test',
			reset: false,
		});
		expect(sendAnalytics).toHaveBeenCalledTimes(1);
		expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
			expect.objectContaining({
				commitHash,
				dependencyName: '@atlaskit/button',
				dependencyType: 'devDependency',
				historical: true,
				major: '12',
				minor: '0',
				patch: '0',
				upgradeSubType: null,
				upgradeType: 'add',
				versionString: '^12.0.0',
			}),
			expect.objectContaining({
				commitHash,
				dependencyName: '@atlaskit/button',
				dependencyType: 'dependency',
				historical: true,
				major: '12',
				minor: '0',
				patch: '0',
				upgradeSubType: null,
				upgradeType: 'remove',
				versionString: '^12.0.0',
			}),
		]);
	});
	it('should fire separate add & remove events when a dependency moves from dependency to devDependency with version change', async () => {
		const commitHash = 'commit_hash';

		const packageJsonByHash: TLogs = {
			[DEFAULT_TAG]: {
				dependencies: {
					'@atlaskit/button': '^12.0.0',
					foo: '^2.3.4',
				},
			},
			[commitHash]: {
				dependencies: {
					foo: '^2.3.4',
				},
				devDependencies: {
					'@atlaskit/button': '^12.5.0',
				},
			},
		};

		getChangesSinceMocked.mockImplementation(() => generateLogs(DEFAULT_TAG, commitHash));
		showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

		await populateProduct({
			dev: true,
			dryRun: false,
			interactive: false,
			csv: false,
			product: 'test',
			reset: false,
		});
		expect(sendAnalytics).toHaveBeenCalledTimes(1);
		expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
			expect.objectContaining({
				commitHash,
				dependencyName: '@atlaskit/button',
				dependencyType: 'devDependency',
				historical: true,
				major: '12',
				minor: '5',
				patch: '0',
				upgradeSubType: null,
				upgradeType: 'add',
				versionString: '^12.5.0',
			}),
			expect.objectContaining({
				commitHash,
				dependencyName: '@atlaskit/button',
				dependencyType: 'dependency',
				historical: true,
				major: '12',
				minor: '0',
				patch: '0',
				upgradeSubType: null,
				upgradeType: 'remove',
				versionString: '^12.0.0',
			}),
		]);
	});

	it('should transform yarn aliased versions but keep version ranges and pre-release info', async () => {
		const firstCommitHash = 'first_commit_hash';
		const secondCommitHash = 'second_commit_hash';

		const packageJsonByHash: TLogs = {
			[DEFAULT_TAG]: {
				dependencies: {
					'@atlaskit/button--current': '^12.0.0',
					foo: '^2.3.4',
				},
			},
			[firstCommitHash]: {
				dependencies: {
					'@atlaskit/button--current': 'npm:@atlaskit/button@^12.5.0',
					foo: '^2.3.4',
				},
			},
			[secondCommitHash]: {
				dependencies: {
					'@atlaskit/button--current': '^12.6.0-hotfix',
					foo: '^2.3.4',
				},
			},
		};

		getChangesSinceMocked.mockImplementation(() =>
			generateLogs(DEFAULT_TAG, firstCommitHash, secondCommitHash),
		);
		showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

		await populateProduct({
			dev: true,
			dryRun: false,
			interactive: false,
			csv: false,
			product: 'test',
			reset: false,
		});
		expect(sendAnalytics).toHaveBeenCalledTimes(1);
		expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
			expect.objectContaining({
				commitHash: firstCommitHash,
				dependencyName: '@atlaskit/button',
				dependencyType: 'dependency',
				historical: true,
				major: '12',
				minor: '5',
				patch: '0',
				upgradeSubType: 'minor',
				upgradeType: 'upgrade',
				versionString: '^12.5.0',
			}),
			expect.objectContaining({
				commitHash: secondCommitHash,
				dependencyName: '@atlaskit/button',
				dependencyType: 'dependency',
				historical: true,
				major: '12',
				minor: '6',
				patch: '0',
				upgradeSubType: 'minor',
				upgradeType: 'upgrade',
				versionString: '^12.6.0-hotfix',
			}),
		]);
	});

	it('should run from start of history in reset mode', async () => {
		const commitHash = 'commit_hash';

		const packageJsonByHash: TLogs = {
			[DEFAULT_TAG]: {
				dependencies: {
					'@atlaskit/button': '^12.0.0',
					foo: '^2.3.4',
				},
			},
			[commitHash]: {
				dependencies: {
					'@atlaskit/button': '^13.1.2',
					foo: '^2.3.4',
				},
			},
		};

		getChangesSinceMocked.mockImplementation(() => generateLogs(DEFAULT_TAG, commitHash));
		showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

		await populateProduct({
			dev: true,
			dryRun: false,
			interactive: false,
			csv: false,
			product: 'test',
			reset: true,
		});

		expect(sendAnalytics).toHaveBeenCalledTimes(1);
		expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
			expect.objectContaining({
				commitHash: DEFAULT_TAG,
				date: '2020-11-26T00:00:00.000Z',
				dependencyName: '@atlaskit/button',
				dependencyType: 'dependency',
				historical: true,
				major: '12',
				minor: '0',
				patch: '0',
				upgradeSubType: null,
				upgradeType: 'add',
				versionString: '^12.0.0',
			}),
			expect.objectContaining({
				commitHash: commitHash,
				date: '2020-11-26T00:00:00.000Z',
				dependencyName: '@atlaskit/button',
				dependencyType: 'dependency',
				historical: true,
				major: '13',
				minor: '1',
				patch: '2',
				upgradeSubType: 'major',
				upgradeType: 'upgrade',
				versionString: '^13.1.2',
			}),
		]);
	});

	// 'latest' version
	// ignores next version invalid
	// does send event when prev version is invalid and next is valid
	it('should gracefully handle invalid semver versions', async () => {
		const firstCommitHash = 'first_commit_hash';
		const secondCommitHash = 'second_commit_hash';

		const packageJsonByHash: TLogs = {
			[DEFAULT_TAG]: {
				dependencies: {
					'@atlaskit/button': '^12.0.0',
					foo: '^2.3.4',
				},
			},
			[firstCommitHash]: {
				dependencies: {
					'@atlaskit/button': 'latest',
					foo: '^2.3.4',
				},
			},
			[secondCommitHash]: {
				dependencies: {
					'@atlaskit/button': '^12.5.0',
					foo: '^2.3.4',
				},
			},
		};

		getChangesSinceMocked.mockImplementation(() =>
			generateLogs(DEFAULT_TAG, firstCommitHash, secondCommitHash),
		);
		showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

		await populateProduct({
			dev: true,
			dryRun: false,
			interactive: false,
			csv: false,
			product: 'test',
			reset: false,
		});

		expect(sendAnalytics).toHaveBeenCalledTimes(1);
		expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
			expect.objectContaining({
				commitHash: secondCommitHash,
				dependencyName: '@atlaskit/button',
				dependencyType: 'dependency',
				historical: true,
				major: '12',
				minor: '5',
				patch: '0',
				upgradeSubType: 'minor',
				upgradeType: 'upgrade',
				versionString: '^12.5.0',
			}),
		]);
	});

	describe('Yarn workspaces', () => {
		type WorkspaceLogEntry = { workspace?: string; config?: any };
		function mockGitForWorkspaces(mockWorkspaceLog: WorkspaceLogEntry[][]) {
			const changedFiles = mockWorkspaceLog.map((logEntry) =>
				logEntry
					.reduce((acc, curr) => [...acc, curr?.workspace], [] as Array<string | undefined>)
					.filter((v: any) => v != null),
			) as string[][];
			const gitLogs = generateLogsWithFiles(
				changedFiles.map((files, index) => ({ hash: String(index), files })),
			);
			getChangesSinceMocked.mockImplementation(() => gitLogs);
			showFileMocked.mockImplementation((ref, filename) => {
				// Treat the first entry of mockPackageJsons as the existing repo state at the 'last run'
				const entryNum = ref === DEFAULT_TAG ? 0 : Number(ref);
				let workspaceEntry: WorkspaceLogEntry = {};
				// Finds the most recent log entry containing filename starting at entryNum going backwards
				mockWorkspaceLog
					.slice(0, entryNum + 1)
					.reverse()
					.find((logEntry) =>
						logEntry.find((ws) => {
							if (ws.workspace === filename.replace('./', '')) {
								workspaceEntry = ws;
								return true;
							}
						}),
					);

				if (!workspaceEntry?.config) {
					// This signals that the package.json doesn't exist
					throw new Error(`${ref} ${filename}`);
				}
				return JSON.stringify(workspaceEntry?.config);
			});
			getFilesMocked.mockImplementation((ref) => {
				const entryNum = ref === DEFAULT_TAG ? 0 : Number(ref);
				const files = new Set<string>();
				for (const log of mockWorkspaceLog.slice(0, entryNum + 1)) {
					for (const logEntry of log) {
						if (logEntry.workspace && logEntry.config !== null) {
							files.add(logEntry.workspace);
						}
					}
				}
				return [...files];
			});
		}
		it('should send an event for a dependency only declared in a workspace and not in the root', async () => {
			mockGitForWorkspaces([
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/*'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/lozenge': '^6.0.0',
							},
						},
					},
				],
				[
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/lozenge': '^7.0.0',
							},
						},
					},
				],
			]);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).toHaveBeenCalledTimes(1);
			expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
				expect.objectContaining({
					commitHash: '1',
					dependencyName: '@atlaskit/lozenge',
					dependencyType: 'dependency',
					historical: true,
					major: '7',
					minor: '0',
					patch: '0',
					upgradeSubType: 'major',
					upgradeType: 'upgrade',
					versionString: '^7.0.0',
				}),
			]);
		});

		it('should only send an upgrade event when all workspaces have upgraded a package', async () => {
			const notAllUpgraded = [
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/*'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/button': '^12.0.0',
							},
						},
					},
				],
				[
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/button': '^13.0.0',
							},
						},
					},
				],
			];
			mockGitForWorkspaces(notAllUpgraded);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).not.toHaveBeenCalled();

			jest.clearAllMocks();

			mockGitForWorkspaces([
				...notAllUpgraded,
				[
					{
						workspace: 'package.json',
						config: {
							dependencies: {
								'@atlaskit/button': '^13.0.0',
								foo: '^2.3.4',
							},
						},
					},
				],
			]);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).toHaveBeenCalledTimes(1);
			expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
				expect.objectContaining({
					commitHash: '2',
					dependencyName: '@atlaskit/button',
					dependencyType: 'dependency',
					historical: true,
					major: '13',
					minor: '0',
					patch: '0',
					upgradeSubType: 'major',
					upgradeType: 'upgrade',
					versionString: '^13.0.0',
				}),
			]);
		});

		it('should pick up new workspaces', async () => {
			mockGitForWorkspaces([
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/*'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/lozenge': '^6.0.0',
							},
						},
					},
				],
				[
					{
						workspace: 'packages/bar/package.json',
						config: {
							dependencies: {
								'@atlaskit/spinner': '^7.0.0',
							},
						},
					},
				],
			]);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).toHaveBeenCalledTimes(1);
			expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
				expect.objectContaining({
					commitHash: '1',
					dependencyName: '@atlaskit/spinner',
					dependencyType: 'dependency',
					historical: true,
					major: '7',
					minor: '0',
					patch: '0',
					upgradeSubType: null,
					upgradeType: 'add',
					versionString: '^7.0.0',
				}),
			]);
		});

		it('should not send remove event when a package is removed from only one workspace', async () => {
			mockGitForWorkspaces([
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/*'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/button': '^12.0.0',
							},
						},
					},
				],
				[
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {},
						},
					},
				],
			]);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).not.toHaveBeenCalled();
		});

		it('should send remove event when a package is removed from all workspaces', async () => {
			mockGitForWorkspaces([
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/*'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/button': '^12.0.0',
							},
						},
					},
				],
				[
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {},
						},
					},
				],
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/*'],
							dependencies: {
								foo: '^2.3.4',
							},
						},
					},
				],
			]);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).toHaveBeenCalledTimes(1);
			expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
				expect.objectContaining({
					commitHash: '2',
					dependencyName: '@atlaskit/button',
					dependencyType: 'dependency',
					historical: true,
					major: '12',
					minor: '0',
					patch: '0',
					upgradeSubType: null,
					upgradeType: 'remove',
					versionString: '^12.0.0',
				}),
			]);
		});

		it('should send remove events for extraneous dependencies when a workspace is removed', async () => {
			mockGitForWorkspaces([
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/*'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/lozenge': '^7.0.0',
							},
						},
					},
				],
				[
					{
						workspace: 'packages/foo/package.json',
						config: null,
					},
				],
			]);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).toHaveBeenCalledTimes(1);
			expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
				expect.objectContaining({
					commitHash: '1',
					dependencyName: '@atlaskit/lozenge',
					dependencyType: 'dependency',
					historical: true,
					major: '7',
					minor: '0',
					patch: '0',
					upgradeSubType: null,
					upgradeType: 'remove',
					versionString: '^7.0.0',
				}),
			]);
		});

		it('should remove dependencies for workspaces that are removed and no longer fall under a valid workspace path', async () => {
			mockGitForWorkspaces([
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/foo', 'packages/bar'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
					{
						workspace: 'packages/bar/package.json',
						config: {
							dependencies: {
								'@atlaskit/lozenge': '^7.0.0',
							},
						},
					},
				],
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/foo'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
					{
						workspace: 'packages/bar/package.json',
						config: null,
					},
				],
			]);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).toHaveBeenCalledTimes(1);
			expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
				expect.objectContaining({
					commitHash: '1',
					dependencyName: '@atlaskit/lozenge',
					dependencyType: 'dependency',
					historical: true,
					major: '7',
					minor: '0',
					patch: '0',
					upgradeSubType: null,
					upgradeType: 'remove',
					versionString: '^7.0.0',
				}),
			]);
		});

		it('should remove dependencies for workspaces that still exist but no longer fall under a valid workspace path', async () => {
			mockGitForWorkspaces([
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/foo', 'packages/bar'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
					{
						workspace: 'packages/bar/package.json',
						config: {
							dependencies: {
								'@atlaskit/lozenge': '^7.0.0',
							},
						},
					},
				],
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/foo'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
				],
			]);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).toHaveBeenCalledTimes(1);
			expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
				expect.objectContaining({
					commitHash: '1',
					dependencyName: '@atlaskit/lozenge',
					dependencyType: 'dependency',
					historical: true,
					major: '7',
					minor: '0',
					patch: '0',
					upgradeSubType: null,
					upgradeType: 'remove',
					versionString: '^7.0.0',
				}),
			]);
		});

		it('should only track a dependency listed in "dependencies" if declared in both dependencies and devDependencies across different workspaces', async () => {
			mockGitForWorkspaces([
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/*'],
						},
					},
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/button': '^12.0.0',
							},
						},
					},
					{
						workspace: 'packages/bar/package.json',
						config: {
							devDependencies: {
								'@atlaskit/button': '^12.0.0',
							},
						},
					},
					{
						workspace: 'packages/baz/package.json',
						config: {
							dependencies: {
								'@atlaskit/button': '^12.0.0',
							},
						},
					},
				],
				[
					{
						workspace: 'packages/bar/package.json',
						config: {
							devDependencies: {
								'@atlaskit/button': '^13.0.0',
							},
						},
					},
					{
						workspace: 'packages/baz/package.json',
						config: {
							dependencies: {
								'@atlaskit/button': '^14.0.0',
							},
						},
					},
				],
				[
					{
						workspace: 'packages/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/button': '^12.2.0',
							},
						},
					},
				],
			]);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).toHaveBeenCalledTimes(1);
			expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
				expect.objectContaining({
					commitHash: '2',
					dependencyName: '@atlaskit/button',
					dependencyType: 'dependency',
					historical: true,
					major: '12',
					minor: '2',
					patch: '0',
					upgradeSubType: 'minor',
					upgradeType: 'upgrade',
					versionString: '^12.2.0',
				}),
			]);
		});

		it('should ignore deps in package.jsons listed outside of workspace globs', async () => {
			mockGitForWorkspaces([
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/*'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
				],
				[
					{
						workspace: 'random/bar/package.json',
						config: {
							dependencies: {
								'@atlaskit/spinner': '^7.0.0',
							},
						},
					},
					{
						workspace: 'random/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/lozenge': '^7.0.0',
							},
						},
					},
				],
			]);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).not.toHaveBeenCalled();
		});

		it('should pick up changes to workspace glob in root package.json', async () => {
			mockGitForWorkspaces([
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/*'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
					{
						workspace: 'random/foo/package.json',
						config: {
							dependencies: {
								'@atlaskit/lozenge': '^7.0.0',
							},
						},
					},
				],
				[
					{
						workspace: 'package.json',
						config: {
							workspaces: ['packages/*', 'random/*'],
							dependencies: {
								'@atlaskit/button': '^12.0.0',
								foo: '^2.3.4',
							},
						},
					},
					{
						workspace: 'random/bar/package.json',
						config: {
							dependencies: {
								'@atlaskit/spinner': '^7.0.0',
							},
						},
					},
				],
			]);

			await populateProduct({
				dev: true,
				dryRun: false,
				interactive: false,
				csv: false,
				product: 'test',
				reset: false,
			});

			expect(sendAnalytics).toHaveBeenCalledTimes(1);
			expect((sendAnalytics as jest.Mock).mock.calls[0][0]).toEqual([
				expect.objectContaining({
					commitHash: '1',
					dependencyName: '@atlaskit/lozenge',
					dependencyType: 'dependency',
					historical: true,
					major: '7',
					minor: '0',
					patch: '0',
					upgradeSubType: null,
					upgradeType: 'add',
					versionString: '^7.0.0',
				}),
				expect.objectContaining({
					commitHash: '1',
					dependencyName: '@atlaskit/spinner',
					dependencyType: 'dependency',
					historical: true,
					major: '7',
					minor: '0',
					patch: '0',
					upgradeSubType: null,
					upgradeType: 'add',
					versionString: '^7.0.0',
				}),
			]);
		});
	});
	describe('Last run state', () => {
		beforeEach(() => {
			getChangesSinceMocked.mockImplementation(() => generateLogs(DEFAULT_TAG));
		});
		describe('Tag', () => {
			it('should source from tag by default', async () => {
				expect(getChangesSinceMocked).not.toHaveBeenCalled();
				await populateProduct({
					dev: true,
					dryRun: false,
					interactive: false,
					csv: false,
					product: 'test',
					reset: false,
				});
				expect(getChangesSinceMocked).toHaveBeenCalledTimes(1);
				expect(getChangesSinceMocked).toHaveBeenCalledWith(DEFAULT_TAG);
			});

			it('should throw if tag does not exist', async () => {
				doesTagExistMocked.mockImplementation(() => false);
				await expect(
					populateProduct({
						dev: true,
						dryRun: false,
						interactive: false,
						csv: false,
						product: 'test',
						reset: false,
					}),
				).rejects.toThrow(
					`Tag '${DEFAULT_TAG}' does not exist. Must use --reset for populating from start of history.`,
				);
			});

			it('should source from specified tag when set', async () => {
				const firstCommitHash = 'first_commit_hash';
				const secondCommitHash = 'second_commit_hash';

				const packageJsonByHash: TLogs = {
					[firstCommitHash]: {
						dependencies: {
							'@atlaskit/button': '^12.0.0',
							foo: '^2.3.4',
						},
					},
					[secondCommitHash]: {
						dependencies: {
							'@atlaskit/button': '^13.1.2',
							foo: '^2.3.4',
						},
					},
				};

				getChangesSinceMocked.mockImplementation(() =>
					generateLogs(DEFAULT_TAG, firstCommitHash, secondCommitHash),
				);
				showFileMocked.mockImplementation((hash) => JSON.stringify(packageJsonByHash[hash]));

				expect(getChangesSinceMocked).not.toHaveBeenCalled();
				await populateProduct({
					dev: true,
					dryRun: false,
					interactive: false,
					csv: false,
					product: 'test',
					reset: false,
					tag: firstCommitHash,
				});
				expect(getChangesSinceMocked).toHaveBeenCalledTimes(1);
				expect(getChangesSinceMocked).toHaveBeenCalledWith(firstCommitHash);
			});

			it('should tag current commit after successful completion', async () => {
				expect(tagCommitMocked).not.toHaveBeenCalled();
				await populateProduct({
					dev: true,
					dryRun: false,
					interactive: false,
					csv: false,
					product: 'test',
					reset: false,
				});
				expect(tagCommitMocked).toHaveBeenCalledWith(DEFAULT_TAG);
			});
		});

		describe('Statlas', () => {
			it('should source from statlas when statlas flag is set', async () => {
				expect(getChangesSinceMocked).not.toHaveBeenCalled();
				await populateProduct({
					dev: true,
					dryRun: false,
					interactive: false,
					csv: false,
					product: 'test',
					reset: false,
					statlas: true,
				});
				expect(getChangesSinceMocked).toHaveBeenCalledWith(mockLastRunHash);
			});

			it('should throw if statlas meta file does not exist', async () => {
				getMetaMocked.mockImplementation(() => null);
				await expect(
					populateProduct({
						dev: true,
						dryRun: false,
						interactive: false,
						csv: false,
						product: 'test',
						reset: false,
						statlas: true,
					}),
				).rejects.toThrow(
					'Missing or invalid metadata file for test. Must use --reset for populating from start of history',
				);
			});

			it('should throw if statlas meta file does not have lastRunHash', async () => {
				getMetaMocked.mockImplementation(
					() =>
						({
							badData: true,
						}) as any,
				);
				await expect(
					populateProduct({
						dev: true,
						dryRun: false,
						interactive: false,
						csv: false,
						product: 'test',
						reset: false,
						statlas: true,
					}),
				).rejects.toThrow(
					'Missing or invalid metadata file for test. Must use --reset for populating from start of history',
				);
			});

			it('should upload current commit to statlas on successful completion', async () => {
				getHashMocked.mockImplementationOnce(() => 'abcdef');
				expect(uploadMeta).not.toHaveBeenCalled();
				await populateProduct({
					dev: true,
					dryRun: false,
					interactive: false,
					csv: false,
					product: 'test',
					reset: false,
					statlas: true,
				});
				expect(uploadMeta).toHaveBeenCalledTimes(1);
				expect(uploadMeta).toHaveBeenCalledWith('test', 'abcdef');
			});
		});
	});
});
