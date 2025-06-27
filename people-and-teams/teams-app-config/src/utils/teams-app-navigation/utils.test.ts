import { isFedRamp } from '@atlaskit/atlassian-context';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { hostname, openInNewTab, pathname, redirect } from '../../common/utils';

import type { NavigationActionCommon } from './types';
import { generatePath, getHostProductFromPath, isTeamsAppEnabled, onNavigateBase } from './utils';

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
	origin: jest.fn(() => 'https://hello.atlassian.net'),
	pathname: jest.fn(() => '/jira/somepath'),
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
				const expectedPath = `https://hello.atlassian.net/jira/people/${path}`;
				expect(generatePath(path, config)).toEqual(expectedPath);
			});
			it('should generate the correct path for Confluence', () => {
				const config: NavigationActionCommon = {
					...baseConfig,
					hostProduct: 'confluence',
				};
				const path = 'somepath';
				const expectedPath = `https://hello.atlassian.net/wiki/people/${path}`;
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

			it('should generate the correct path for Home with anchor', () => {
				const config: NavigationActionCommon = {
					...baseConfig,
					hostProduct: 'home',
				};
				const path = 'somepath';
				const anchor = 'workswith';
				const expectedPath = `https://home.atlassian.com/o/${config.orgId}/people/${path}#${anchor}?cloudId=${config.cloudId}`;
				expect(generatePath(path, config, undefined, anchor)).toEqual(expectedPath);
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

			it('should generate a path for without cloudId', () => {
				const config: NavigationActionCommon = {
					...baseConfig,
					orgId: 'org123',
					cloudId: undefined,
				};
				const path = 'somepath';
				const expectedPath = `https://home.atlassian.com/o/${config.orgId}/people/${path}`;
				expect(generatePath(path, config)).toEqual(expectedPath);
			});

			it('should generate a path for without orgId', () => {
				const config: NavigationActionCommon = {
					...baseConfig,
					cloudId: 'cloud123',
					orgId: undefined,
				};
				const path = 'somepath';
				const expectedPath = `https://home.atlassian.com/people/${path}?cloudId=${config.cloudId}`;
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
		});
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

	describe('getHostProductFromPath', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});
		it('should return jira when the path is /jira/somepath', () => {
			(pathname as jest.Mock).mockReturnValue('/jira/somepath');
			const result = getHostProductFromPath();
			expect(result).toBe('jira');
		});
		it('should return confluence when the path is /wiki/somepath', () => {
			(pathname as jest.Mock).mockReturnValue('/wiki/somepath');
			const result = getHostProductFromPath();
			expect(result).toBe('confluence');
		});
		it('should return home when the host is home.atlassian.com', () => {
			(pathname as jest.Mock).mockReturnValue('/somepath');
			(hostname as jest.Mock).mockReturnValue('home.atlassian.com');
			const result = getHostProductFromPath();
			expect(result).toBe('home');
		});
		it('should return undefined when the path is not /jira, /wiki, or /home', () => {
			(pathname as jest.Mock).mockReturnValue('/somepath');
			(hostname as jest.Mock).mockReturnValue('hello.atlassian.net');
			const result = getHostProductFromPath();
			expect(result).toBe(undefined);
		});
	});
});
