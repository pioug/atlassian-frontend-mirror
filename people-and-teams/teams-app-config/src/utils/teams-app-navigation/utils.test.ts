import { isFedRamp } from '@atlaskit/atlassian-context';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import type {
	NavigationAction,
	NavigationActionCommon,
	RequireOrgIdOrCloudId,
} from '../../common/types';
import { hostname, openInNewTab, pathname, redirect } from '../../common/utils';
import { isTeamsAppEnabled } from '../../common/utils/is-teams-app-enabled';

import {
	generatePath,
	generateTeamsAppPath,
	getHostProductFromPath,
	getPathAndQuery,
	onNavigateBase,
} from './utils';

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

jest.mock('../../common/utils', () => ({
	openInNewTab: jest.fn(),
	redirect: jest.fn(),
	hostname: jest.fn(() => 'hello.atlassian.net'),
	origin: jest.fn(() => 'https://hello.atlassian.net'),
	pathname: jest.fn(() => '/jira/somepath'),
}));

jest.mock('../../common/utils/is-teams-app-enabled', () => ({
	isTeamsAppEnabled: jest.fn(() => true),
}));

const orgAndCloudId: RequireOrgIdOrCloudId = {
	orgId: 'org123',
	cloudId: 'cloud123',
};

const baseConfig: NavigationActionCommon = {
	...orgAndCloudId,
	push: jest.fn(),
	hostProduct: 'jira',
	shouldOpenInSameTab: false,
	userHasNav4Enabled: true,
};

describe('teams app navigation utils', () => {
	describe('generateTeamsAppPath', () => {
		it('should generate the correct path for a path without people prefix', () => {
			const config = {
				...orgAndCloudId,
			};
			const path = 'somepath';
			const expectedPath = `https://home.atlassian.com/o/${config.orgId}/people/somepath?cloudId=${config.cloudId}`;
			expect(generateTeamsAppPath(path, config)).toEqual(expectedPath);
		});
		it('should generate the correct path for a path with people prefix', () => {
			const config = {
				...orgAndCloudId,
			};
			const path = 'people/somepath';
			const expectedPath = `https://home.atlassian.com/o/${config.orgId}/people/somepath?cloudId=${config.cloudId}`;
			expect(generateTeamsAppPath(path, config)).toEqual(expectedPath);
		});
		it('should generate the correct path for a path with people prefix & leading slash', () => {
			const config = {
				...orgAndCloudId,
			};
			const path = '/people/somepath';
			const expectedPath = `https://home.atlassian.com/o/${config.orgId}/people/somepath?cloudId=${config.cloudId}`;
			expect(generateTeamsAppPath(path, config)).toEqual(expectedPath);
		});
		it('should generate the correct path for a path with people prefix and no orgId', () => {
			const config: RequireOrgIdOrCloudId = {
				cloudId: 'cloud123',
				orgId: undefined,
			};
			const path = 'people/somepath';
			const expectedPath = `https://home.atlassian.com/people/somepath?cloudId=${config.cloudId}`;
			expect(generateTeamsAppPath(path, config)).toEqual(expectedPath);
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
			it('should generate the correct path for a path without people prefix', () => {
				const config = {
					...orgAndCloudId,
				};
				const path = 'somepath';
				const expectedPath = `https://teams.atlassian-us-gov-mod.com/somepath?cloudId=${config.cloudId}`;
				expect(generateTeamsAppPath(path, config)).toEqual(expectedPath);
			});
			it('should generate the correct path for a path with people prefix', () => {
				const config = {
					...orgAndCloudId,
				};
				const path = 'people/somepath';
				const expectedPath = `https://teams.atlassian-us-gov-mod.com/somepath?cloudId=${config.cloudId}`;
				expect(generateTeamsAppPath(path, config)).toEqual(expectedPath);
			});
		});
	});
	describe('generatePath', () => {
		describe('teams app disabled', () => {
			beforeEach(() => {
				(isTeamsAppEnabled as jest.Mock).mockReturnValue(false);
			});
			afterAll(() => {
				(isTeamsAppEnabled as jest.Mock).mockReturnValue(true);
			});
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

		describe('teams app enabled', () => {
			beforeEach(() => {
				(isTeamsAppEnabled as jest.Mock).mockReturnValue(true);
			});
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
					const expectedPath = `https://teams.atlassian-us-gov-mod.com/${path}?cloudId=${config.cloudId}`;
					expect(generatePath(path, config)).toEqual(expectedPath);
				});

				it('should generate the correct path for Confluence', () => {
					const config: NavigationActionCommon = {
						...baseConfig,
						hostProduct: 'confluence',
					};
					const path = 'somepath';
					const expectedPath = `https://teams.atlassian-us-gov-mod.com/${path}?cloudId=${config.cloudId}`;
					expect(generatePath(path, config)).toEqual(expectedPath);
				});

				it('should generate a staging path for Jira', () => {
					(hostname as jest.Mock).mockReturnValue('hello-fedramp.stg.atlassian-us-gov-mod.net');
					const config = {
						...baseConfig,
					};
					const path = 'somepath';
					const expectedPath = `https://teams.stg.atlassian-us-gov-mod.com/${path}?cloudId=${config.cloudId}`;
					expect(generatePath(path, config)).toEqual(expectedPath);
				});

				ffTest.on('teams-app-fedramp-stg-fedm-hostname-support', 'with feature flag on', () => {
					it('should generate a staging path for Confluence', () => {
						(hostname as jest.Mock).mockReturnValue('hello-fedm.atlassian-stg-fedm.net');
						const config: NavigationActionCommon = {
							...baseConfig,
							hostProduct: 'confluence',
						};
						const path = 'somepath';
						const expectedPath = `https://teams.stg.atlassian-us-gov-mod.com/${path}?cloudId=${config.cloudId}`;
						expect(generatePath(path, config)).toEqual(expectedPath);
					});
				});
			});
		});
	});
	describe('onNavigateBase', () => {
		describe('teams app disabled', () => {
			beforeEach(() => {
				(isTeamsAppEnabled as jest.Mock).mockReturnValue(false);
			});
			afterAll(() => {
				(isTeamsAppEnabled as jest.Mock).mockReturnValue(true);
			});
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
		describe('teams app enabled', () => {
			beforeEach(() => {
				(isTeamsAppEnabled as jest.Mock).mockReturnValue(true);
			});
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

	describe('getPathAndQuery', () => {
		it('should return the correct path and query for a current user profile', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'CURRENT_USER_PROFILE',
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: 'me' });
		});
		it('should return the correct path and query for a user', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'USER',
				payload: { userId: 'user123' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: 'user123' });
		});
		it('should return the correct path and query for a user with section', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'USER',
				payload: { userId: 'user123', section: 'workswith' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: 'user123', anchor: 'workswith' });
		});
		it('should return the correct path and query for landing', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'LANDING',
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: '' });
		});
		it('should return the correct path and query for directory', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'DIRECTORY',
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: '' });
		});
		it('should return the correct path and query for a team', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'TEAM',
				payload: { teamId: 'team123' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: 'team/team123' });
		});
		it('should return the correct path and query for an agent', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'AGENT',
				payload: { agentId: 'agent123' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: 'agent/agent123' });
		});
		it('should return the correct path and query for kudos', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'KUDOS',
				payload: { kudosId: 'kudos123' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: 'kudos/kudos123' });
		});
		it('should return the correct path and query for teams directory', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'TEAMS_DIRECTORY',
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({
				path: '',
				query: new URLSearchParams({ screen: 'SEARCH_TEAMS' }),
			});
		});
		it('should return the correct path and query for people directory', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'PEOPLE_DIRECTORY',
				payload: { query: 'search term' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({
				path: 'search/people',
				query: new URLSearchParams('search term'),
			});
		});
		it('should return the correct path and query for people directory without query', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'PEOPLE_DIRECTORY',
				payload: {},
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({
				path: 'search/people',
				query: new URLSearchParams(),
			});
		});
		it('should return the correct path and query for user work', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'USER_WORK',
				payload: { userId: 'user123' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: 'user123/work' });
		});
		it('should strip ARI from user ID', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'USER',
				payload: { userId: 'ari:cloud:jira:123:user/456' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: '456' });
		});
		it('should strip ARI from team ID', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'TEAM',
				payload: { teamId: 'ari:cloud:jira:123:team/789' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: 'team/789' });
		});
		it('should strip ARI from agent ID', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'AGENT',
				payload: { agentId: 'ari:cloud:jira:123:agent/101' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: 'agent/101' });
		});
		it('should strip ARI from kudos ID', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'KUDOS',
				payload: { kudosId: 'ari:cloud:jira:123:kudos/202' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: 'kudos/202' });
		});
		it('should strip ARI from user work ID', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'USER_WORK',
				payload: { userId: 'ari:cloud:jira:123:user/303' },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: '303/work' });
		});

		it('should redirect to landing page if userId is undefined', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'USER',
				// @ts-expect-error - we want to test the undefined case
				payload: { userId: undefined },
			};
			const result = getPathAndQuery(action);
			expect(result).toEqual({ path: '' });
		});
	});
});
