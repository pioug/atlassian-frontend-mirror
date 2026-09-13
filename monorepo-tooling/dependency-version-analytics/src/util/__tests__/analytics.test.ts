import { createUpgradeEvent } from '../analytics';

describe('Analytics', () => {
	describe('createUpgradeEvent', () => {
		it('should create a properly formatted upgrade event', () => {
			const event = createUpgradeEvent(
				'@atlaskit/button',
				'^15.1.1',
				'^15.0.0',
				'2020-11-26T04:00:50.183Z',
				{
					commitHash: 'abc123def',
					dependencyType: 'dependency',
					historical: true,
				},
				{
					latest: '15.1.3',
					next: '15.1.4',
				},
			);

			expect(event).toMatchObject({
				commitHash: 'abc123def',
				date: '2020-11-26T04:00:50.183Z',
				dependencyName: '@atlaskit/button',
				dependencyType: 'dependency',
				historical: true,
				major: '15',
				minor: '1',
				patch: '1',
				upgradeSubType: 'minor',
				upgradeType: 'upgrade',
				versionString: '^15.1.1',
				latestTag: '15.1.3',
				nextTag: '15.1.4',
				rcTag: null,
				hotfixTag: null,
			});
		});
	});
});
