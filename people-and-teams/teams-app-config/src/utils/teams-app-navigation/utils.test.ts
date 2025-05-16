import { isFedRamp } from '@atlaskit/atlassian-context';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { hostname, openInNewTab, redirect } from '../../common/utils';

import { NavigationActionCommon } from './types';
import { generatePath, isTeamsAppEnabled, onNavigateBase } from './utils';

jest.mock('@atlaskit/atlassian-context', () => ({
	getATLContextUrl: jest.fn((product: string) => {
		if (product === 'home') {
			return 'https://home.atlassian.com';
		}
		return `https://${product}.atlassian.net`;
	}),
	isFedRamp: jest.fn(() => false),
}));

jest.mock('../../common/utils', () => ({
	openInNewTab: jest.fn(),
	redirect: jest.fn(),
	hostname: jest.fn(() => 'hello.atlassian.net'),
}));

const baseConfig: NavigationActionCommon = {
	orgId: 'org123',
	cloudId: 'cloud123',
	push: jest.fn(),
	hostProduct: 'jira',
	shouldOpenInSameTab: false,
	userHasNav4Enabled: true,
};

describe('teams app navigation utils', () => {
	describe('generatePath', () => {
		ffTest.off('should-redirect-directory-to-teams-app', 'without Teams app redirect', () => {
			it('should generate the correct path for Jira', () => {
				const config = {
					...baseConfig,
				};
				const path = 'somepath';
				const expectedPath = `https://jira.atlassian.net/people/${path}`;
				expect(generatePath(path, config)).toEqual(expectedPath);
			});
			it('should generate the correct path for Confluence', () => {
				const config: NavigationActionCommon = {
					...baseConfig,
					hostProduct: 'confluence',
				};
				const path = 'somepath';
				const expectedPath = `https://confluence.atlassian.net/people/${path}`;
				expect(generatePath(path, config)).toEqual(expectedPath);
			});

			it('should generate the correct path for Home', () => {
				const config: NavigationActionCommon = {
					...baseConfig,
					hostProduct: 'home',
				};
				const path = 'somepath';
				const expectedPath = `https://home.atlassian.com/o/${config.orgId}/people/${path}?cloudId=${config.cloudId}`;
				expect(generatePath(path, config)).toEqual(expectedPath);
			});

			it('should generate the correct path for Home with no hostProduct', () => {
				const config: NavigationActionCommon = {
					...baseConfig,
					hostProduct: undefined,
				};
				const path = 'somepath';
				const expectedPath = `https://home.atlassian.com/o/${config.orgId}/people/${path}?cloudId=${config.cloudId}`;
				expect(generatePath(path, config)).toEqual(expectedPath);
			});
		});

		ffTest.on('should-redirect-directory-to-teams-app', 'with Teams app redirect', () => {
			it('should generate the correct path for Jira', () => {
				const config = {
					...baseConfig,
				};
				const path = 'somepath';
				const expectedPath = `https://home.atlassian.com/o/${config.orgId}/people/${path}?cloudId=${config.cloudId}`;
				expect(generatePath(path, config)).toEqual(expectedPath);
			});
			it('should generate the correct path for Confluence', () => {
				const config: NavigationActionCommon = {
					...baseConfig,
					hostProduct: 'confluence',
				};
				const path = 'somepath';
				const expectedPath = `https://home.atlassian.com/o/${config.orgId}/people/${path}?cloudId=${config.cloudId}`;
				expect(generatePath(path, config)).toEqual(expectedPath);
			});

			it('should generate the correct path for Home', () => {
				const config: NavigationActionCommon = {
					...baseConfig,
					hostProduct: 'home',
				};
				const path = 'somepath';
				const expectedPath = `https://home.atlassian.com/o/${config.orgId}/people/${path}?cloudId=${config.cloudId}`;
				expect(generatePath(path, config)).toEqual(expectedPath);
			});

			it('should generate the correct path for Home with no hostProduct', () => {
				const config: NavigationActionCommon = {
					...baseConfig,
					hostProduct: undefined,
				};
				const path = 'somepath';
				const expectedPath = `https://home.atlassian.com/o/${config.orgId}/people/${path}?cloudId=${config.cloudId}`;
				expect(generatePath(path, config)).toEqual(expectedPath);
			});

			describe('FedRamp', () => {
				beforeEach(() => {
					(isFedRamp as jest.Mock).mockReturnValue(true);
					(hostname as jest.Mock).mockReturnValue('hello-fedramp.atlassian-us-gov.net');
				});
				afterAll(() => {
					(isFedRamp as jest.Mock).mockReturnValue(false);
					(hostname as jest.Mock).mockReturnValue('hello.atlassian.net');
				});

				it('should generate the correct path for Jira', () => {
					const config = {
						...baseConfig,
					};
					const path = 'somepath';
					const expectedPath = `https://teams.atlassian-us-gov.com/${path}?cloudId=${config.cloudId}`;
					expect(generatePath(path, config)).toEqual(expectedPath);
				});

				it('should generate the correct path for Confluence', () => {
					const config: NavigationActionCommon = {
						...baseConfig,
						hostProduct: 'confluence',
					};
					const path = 'somepath';
					const expectedPath = `https://teams.atlassian-us-gov.com/${path}?cloudId=${config.cloudId}`;
					expect(generatePath(path, config)).toEqual(expectedPath);
				});

				it('should generate a staging path for Jira', () => {
					(hostname as jest.Mock).mockReturnValue('hello-fedramp.stg.atlassian-us-gov-mod.net');
					const config = {
						...baseConfig,
					};
					const path = 'somepath';
					const expectedPath = `https://teams.stg.atlassian-us-gov.com/${path}?cloudId=${config.cloudId}`;
					expect(generatePath(path, config)).toEqual(expectedPath);
				});
			});
		});
	});
	describe('onNavigateBase', () => {
		ffTest.off('should-redirect-directory-to-teams-app', 'without Teams app redirect', () => {
			it('should call push with the correct href when push is provided', () => {
				const pushMock = jest.fn();
				const config = {
					...baseConfig,
					shouldOpenInSameTab: true,
					push: pushMock,
				};
				const href = 'https://example.com';
				const redirectMock = jest.fn();
				(redirect as jest.Mock).mockImplementation(redirectMock);

				const onNavigate = onNavigateBase(href, config);
				onNavigate();

				expect(redirectMock).not.toHaveBeenCalled();
				expect(pushMock).toHaveBeenCalledWith(href);
			});

			it('should call openInNewTab with the correct href when open in new tab is set', () => {
				const config = {
					...baseConfig,
					shouldOpenInSameTab: false,
				};
				const href = 'https://example.com';
				const openInNewTabMock = jest.fn();
				(openInNewTab as jest.Mock).mockImplementation(openInNewTabMock);

				const onNavigate = onNavigateBase(href, config);
				onNavigate();

				expect(openInNewTabMock).toHaveBeenCalledWith(href);
			});

			it('should call redirect with the correct href when push is not provided', () => {
				const config = {
					...baseConfig,
					shouldOpenInSameTab: true,
				};
				const href = 'https://example.com';
				const redirectMock = jest.fn();
				(redirect as jest.Mock).mockImplementation(redirectMock);
				config.push = undefined;

				const onNavigate = onNavigateBase(href, config);
				onNavigate();

				expect(redirectMock).toHaveBeenCalledWith(href);
			});
		});
		ffTest.on('should-redirect-directory-to-teams-app', 'with Teams app redirect', () => {
			it('should call redirect with the correct href when shouldOpenInSameTab is true', () => {
				const pushMock = jest.fn();
				const config = {
					...baseConfig,
					shouldOpenInSameTab: true,
					push: pushMock,
				};
				const href = 'https://example.com';
				const redirectMock = jest.fn();
				(redirect as jest.Mock).mockImplementation(redirectMock);

				const onNavigate = onNavigateBase(href, config);
				onNavigate();

				expect(redirectMock).toHaveBeenCalledWith(href);
				expect(pushMock).not.toHaveBeenCalled();
			});

			it('should call openInNewTab with the correct href when shouldOpenInSameTab is false', () => {
				const config = {
					...baseConfig,
					shouldOpenInSameTab: false,
				};
				const href = 'https://example.com';
				const openInNewTabMock = jest.fn();
				(openInNewTab as jest.Mock).mockImplementation(openInNewTabMock);

				const onNavigate = onNavigateBase(href, config);
				onNavigate();

				expect(openInNewTabMock).toHaveBeenCalledWith(href);
			});
		});
	});
	describe('isTeamsAppEnabled', () => {
		ffTest.off('should-redirect-directory-to-teams-app', 'without Teams app redirect fg', () => {
			it('should return false when the feature flag is off', () => {
				const config = {
					...baseConfig,
					userHasNav4Enabled: true,
				};
				const result = isTeamsAppEnabled(config);
				expect(result).toBe(false);
			});
		}
		);
		ffTest.on('should-redirect-directory-to-teams-app', 'with Teams app redirect fg', () => {
			it('should return true when the feature flag is on & nav4 is enabled', () => {
				const config = {
					...baseConfig,
					userHasNav4Enabled: true,
				};
				const result = isTeamsAppEnabled(config);
				expect(result).toBe(true);
			});

			it('should return false when the feature flag is on & nav4 is disabled', () => {
				const config = {
					...baseConfig,
					userHasNav4Enabled: false,
				};
				const result = isTeamsAppEnabled(config);
				expect(result).toBe(false);
			});

			it('should return true when the feature flag is on & nav4 is disabled but user is in FedRamp', () => {
				(isFedRamp as jest.Mock).mockReturnValue(true);
				const config = {
					...baseConfig,
					userHasNav4Enabled: false,
				};
				const result = isTeamsAppEnabled(config);
				expect(result).toBe(true);
				(isFedRamp as jest.Mock).mockReturnValue(false);
			});
		});
	});
});
