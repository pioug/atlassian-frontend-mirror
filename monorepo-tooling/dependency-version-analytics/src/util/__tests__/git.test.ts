import type { LogResult } from 'simple-git';

import { generateLogsWithFiles } from '../../commands/populate-historic-data/__fixtures__/git';
import * as git from '../git';

let mockGit: any;

jest.mock('simple-git', () => ({
	__esModule: true,
	default: jest.fn(() => mockGit),
}));

describe('git', () => {
	beforeEach(() => {
		mockGit = {
			log: jest.fn(() => ({
				all: [],
				latest: {},
				total: 0,
			})),
		};
	});
	describe('getChangesSince', () => {
		it('should return a git log of all commits that touch any package.json that includes files changed', async () => {
			const logs = {
				all: [],
				latest: {},
				total: 0,
			};
			mockGit = {
				...mockGit,
				log: jest.fn(() => logs),
			};

			const changes = await git.getChangesSince();

			expect(mockGit.log).toHaveBeenCalledWith([
				'--first-parent',
				'-m',
				'--reverse',
				'--stat=4096',
				'--stat-graph-width=1',
				':(glob)**/package.json',
			]);

			expect(changes).toEqual(logs);
		});

		it('should return a log since `since` argument if supplied', async () => {
			await git.getChangesSince('abcdef123');

			expect(mockGit.log).toHaveBeenCalledWith([
				'--first-parent',
				'-m',
				'--reverse',
				'--stat=4096',
				'--stat-graph-width=1',
				'abcdef123..',
				':(glob)**/package.json',
			]);
		});

		it('should split file renames into old and new entries', async () => {
			const logs: LogResult = generateLogsWithFiles([
				{
					hash: '0',
					files: [
						'new-frontend/package.json => package.json',
						'{new-frontend/packages => packages}/provider/package.json',
						'src/packages/{ => platform}/analytics/product-analytics-bridge/package.json',
						'src/packages/spa/{main => }/package.json',
					],
				},
			]);
			mockGit = {
				...mockGit,
				log: jest.fn(() => logs),
			};

			const changes = await git.getChangesSince();

			expect(mockGit.log).toHaveBeenCalledWith([
				'--first-parent',
				'-m',
				'--reverse',
				'--stat=4096',
				'--stat-graph-width=1',
				':(glob)**/package.json',
			]);

			expect(changes.all[0].diff).toEqual(
				expect.objectContaining({
					files: [
						expect.objectContaining({ file: 'new-frontend/package.json' }),
						expect.objectContaining({ file: 'package.json' }),
						expect.objectContaining({
							file: 'new-frontend/packages/provider/package.json',
						}),
						expect.objectContaining({ file: 'packages/provider/package.json' }),
						expect.objectContaining({
							file: 'src/packages/analytics/product-analytics-bridge/package.json',
						}),
						expect.objectContaining({
							file: 'src/packages/platform/analytics/product-analytics-bridge/package.json',
						}),
						expect.objectContaining({
							file: 'src/packages/spa/main/package.json',
						}),
						expect.objectContaining({
							file: 'src/packages/spa/package.json',
						}),
					],
				}),
			);
		});
	});
});
