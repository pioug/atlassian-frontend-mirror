import { isFedRamp } from '@atlaskit/atlassian-context';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { type NavigationActionCommon } from '../../types';

import { isTeamsAppEnabled } from './index';

jest.mock('@atlaskit/atlassian-context', () => ({
	getATLContextUrl: jest.fn((product: string) => {
		if (product === 'home') {
			return 'https://home.atlassian.com';
		}
		return `https://${product}.atlassian.net`;
	}),
	isFedRamp: jest.fn(() => false),
	isIsolatedCloud: jest.fn(() => false),
}));

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	initializeCompleted: jest.fn(() => true),
	getExperimentValue: jest.fn(() => false),
}));

type Config = Pick<NavigationActionCommon, 'userHasNav4Enabled' | 'hostProduct'>;

const baseConfig: Config = {
	hostProduct: 'jira',
	userHasNav4Enabled: true,
};

describe('isTeamsAppEnabled', () => {
	ffTest.off('should-redirect-directory-to-teams-app', 'without Teams app redirect fg', () => {
		it('should return false when the feature flag is off', () => {
			const config: Config = {
				...baseConfig,
				userHasNav4Enabled: true,
			};
			const result = isTeamsAppEnabled(config);
			expect(result).toBe(false);
		});
	});
	ffTest.on('should-redirect-directory-to-teams-app', 'with Teams app redirect fg', () => {
		it('should return true when the feature flag is on & nav4 is enabled', () => {
			const config: Config = {
				...baseConfig,
				userHasNav4Enabled: true,
			};
			const result = isTeamsAppEnabled(config);
			expect(result).toBe(true);
		});

		it('should return false when the feature flag is on & nav4 is disabled', () => {
			const config: Config = {
				...baseConfig,
				userHasNav4Enabled: false,
			};
			const result = isTeamsAppEnabled(config);
			expect(result).toBe(false);
		});

		it('should return true when the feature flag is on & nav4 is disabled but user is in FedRamp', () => {
			(isFedRamp as jest.Mock).mockReturnValue(true);
			const config: Config = {
				...baseConfig,
				userHasNav4Enabled: false,
			};
			const result = isTeamsAppEnabled(config);
			expect(result).toBe(true);
			(isFedRamp as jest.Mock).mockReturnValue(false);
		});
	});
	describe('Experiments', () => {
		beforeEach(() => {
			(FeatureGates.getExperimentValue as jest.Mock).mockClear();
		});
		it('should return true when the Jira experiment is enabled & the host product is Jira', () => {
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation(
				(exp) => exp === 'migrate-jira-people-directory-to-teams-app',
			);
			const config: Config = {
				...baseConfig,
				hostProduct: 'jira',
			};
			const result = isTeamsAppEnabled(config);
			expect(result).toBe(true);
		});
		it('should return false when the Jira experiment is disabled & the host product is Jira', () => {
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'migrate-jira-people-directory-to-teams-app' ? false : true,
			);
			const config: Config = {
				...baseConfig,
				hostProduct: 'jira',
			};
			const result = isTeamsAppEnabled(config);
			expect(result).toBe(false);
		});

		it('should return true when the Confluence experiment is enabled & the host product is Confluence', () => {
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation(
				(exp) => exp === 'migrate-confluence-people-directory-to-teams-app',
			);
			const config: Config = {
				...baseConfig,
				hostProduct: 'confluence',
			};
			const result = isTeamsAppEnabled(config);
			expect(result).toBe(true);
		});
		it('should return false when the Confluence experiment is disabled & the host product is Confluence', () => {
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'migrate-confluence-people-directory-to-teams-app' ? false : true,
			);
			const config: Config = {
				...baseConfig,
				hostProduct: 'confluence',
			};
			const result = isTeamsAppEnabled(config);
			expect(result).toBe(false);
		});

		it('should not check the experiment if the user is not in the Nav4 cohort (so not exposure event is fired)', () => {
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'migrate-jira-people-directory-to-teams-app' ? false : true,
			);
			const config: Config = {
				userHasNav4Enabled: false,
				hostProduct: 'jira',
			};
			const result = isTeamsAppEnabled(config);
			expect(result).toBe(false);
			expect(FeatureGates.getExperimentValue).not.toHaveBeenCalled();
		});
	});
});
