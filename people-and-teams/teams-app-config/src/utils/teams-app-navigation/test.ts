import { NavigationAction, NavigationActionCommon } from './types';
import { generatePath, getPathAndQuery, isTeamsAppEnabled } from './utils';

import { navigateToTeamsApp } from './index';

jest.mock('@atlaskit/atlassian-context', () => ({
	getATLContextUrl: jest.fn((product: string) => {
		if (product === 'home') {
			return 'https://home.atlassian.com';
		}
		return `https://${product}.atlassian.net`;
	}),
}));

jest.mock('../../common/utils', () => ({
	openInNewTab: jest.fn(),
	redirect: jest.fn(),
}));

jest.mock('./utils');

const baseConfig: NavigationActionCommon = {
	orgId: 'org123',
	cloudId: 'cloud123',
	push: jest.fn(),
	hostProduct: 'jira',
	userHasNav4Enabled: true,
};

describe('teams app navigation', () => {
	describe('without Teams app redirect', () => {
		beforeAll(() => {
			(isTeamsAppEnabled as jest.Mock).mockReturnValue(false);
		});
		afterAll(() => {
			jest.resetAllMocks();
		});
		it('should set shouldOpenInSameTab to true by default', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'LANDING',
			};
			const getPathAndQueryMock = jest
				.fn()
				.mockReturnValue({ path: 'somepath', query: new URLSearchParams() });
			const generatePathMock = jest
				.fn()
				.mockReturnValue('https://jira.atlassian.net/people/somepath');
			(getPathAndQuery as jest.Mock).mockImplementation(getPathAndQueryMock);
			(generatePath as jest.Mock).mockImplementation(generatePathMock);

			const result = navigateToTeamsApp(action);
			expect(result.href).toEqual('https://jira.atlassian.net/people/somepath');

			const actionWithDefaults = {
				...action,
				shouldOpenInSameTab: true,
			};

			expect(getPathAndQueryMock).toHaveBeenCalledWith(actionWithDefaults);
			expect(generatePathMock).toHaveBeenCalledWith(
				'somepath',
				actionWithDefaults,
				new URLSearchParams(),
			);
		});
	});

	describe('with Teams app redirect', () => {
		beforeAll(() => {
			(isTeamsAppEnabled as jest.Mock).mockReturnValue(true);
		});
		afterAll(() => {
			jest.resetAllMocks();
		});
		it('should set shouldOpenInSameTab to false by default', () => {
			const action: NavigationAction = {
				...baseConfig,
				type: 'LANDING',
			};
			const getPathAndQueryMock = jest
				.fn()
				.mockReturnValue({ path: 'somepath', query: new URLSearchParams() });
			const generatePathMock = jest
				.fn()
				.mockReturnValue('https://home.atlassian.com/o/org123/people/somepath?cloudId=cloud123');
			(getPathAndQuery as jest.Mock).mockImplementation(getPathAndQueryMock);
			(generatePath as jest.Mock).mockImplementation(generatePathMock);

			const result = navigateToTeamsApp(action);
			expect(result.href).toEqual(
				'https://home.atlassian.com/o/org123/people/somepath?cloudId=cloud123',
			);

			const actionWithDefaults = {
				...action,
				shouldOpenInSameTab: false,
			};

			expect(getPathAndQueryMock).toHaveBeenCalledWith(actionWithDefaults);
			expect(generatePathMock).toHaveBeenCalledWith(
				'somepath',
				actionWithDefaults,
				new URLSearchParams(),
			);
		});
	});
	it('should set shouldOpenInSameTab to true when specified', () => {
		const action: NavigationAction = {
			...baseConfig,
			type: 'LANDING',
			shouldOpenInSameTab: true,
		};
		const getPathAndQueryMock = jest
			.fn()
			.mockReturnValue({ path: 'somepath', query: new URLSearchParams() });
		const generatePathMock = jest
			.fn()
			.mockReturnValue('https://home.atlassian.com/o/org123/people/somepath?cloudId=cloud123');
		(getPathAndQuery as jest.Mock).mockImplementation(getPathAndQueryMock);
		(generatePath as jest.Mock).mockImplementation(generatePathMock);

		const result = navigateToTeamsApp(action);
		expect(result.href).toEqual(
			'https://home.atlassian.com/o/org123/people/somepath?cloudId=cloud123',
		);

		const actionWithDefaults = {
			...action,
			shouldOpenInSameTab: true,
		};

		expect(getPathAndQueryMock).toHaveBeenCalledWith(actionWithDefaults);
		expect(generatePathMock).toHaveBeenCalledWith(
			'somepath',
			actionWithDefaults,
			new URLSearchParams(),
		);
	});
});
