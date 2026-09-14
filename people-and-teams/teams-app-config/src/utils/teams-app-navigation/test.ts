import type { NavigationAction, NavigationActionCommon } from '../../common/types';
import { generatePath } from './generatePath';
import { getPathAndQuery } from './getPathAndQuery';
import { navigateToTeamsApp } from './navigateToTeamsApp';

jest.mock('@atlaskit/atlassian-context/get-atl-context-url', () => ({
	...jest.requireActual('@atlaskit/atlassian-context/get-atl-context-url'),
	getATLContextUrl: jest.fn((product: string) => {
		if (product === 'home') {
			return 'https://home.atlassian.com';
		}
		return `https://${product}.atlassian.net`;
	}),
}));

jest.mock('../../common/utils/openInNewTab', () => ({
	openInNewTab: jest.fn(),
}));
jest.mock('../../common/utils/redirect', () => ({
	redirect: jest.fn(),
}));

jest.mock('./generatePath');
jest.mock('./generateTeamsAppPath');
jest.mock('./getEnvironment');
jest.mock('./getHostProductFromPath');
jest.mock('./getPathAndQuery');
jest.mock('./isFedRampStaging');
jest.mock('./onNavigateBase');

const baseConfig: NavigationActionCommon = {
	orgId: 'org123',
	cloudId: 'cloud123',
	push: jest.fn(),
	hostProduct: 'jira',
	userHasNav4Enabled: true,
};

describe('teams app navigation', () => {
	describe('Teams app redirect', () => {
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
