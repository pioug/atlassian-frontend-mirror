import { isIsolatedCloud } from '@atlaskit/atlassian-context';

import { type NavigationActionCommon } from '../../types';

import { isTeamsAppEnabled } from './index';

jest.mock('@atlaskit/atlassian-context');

type Config = Pick<NavigationActionCommon, 'userHasNav4Enabled' | 'hostProduct'>;

const baseConfig: Config = {
	hostProduct: 'jira',
};

describe('isTeamsAppEnabled', () => {
	it('should return false in isolated cloud', () => {
		(isIsolatedCloud as jest.Mock).mockReturnValue(true);
		const result = isTeamsAppEnabled(baseConfig);
		expect(result).toBe(false);
	});

	it('should return true if not isolated cloud', () => {
		(isIsolatedCloud as jest.Mock).mockReturnValue(false);
		const result = isTeamsAppEnabled(baseConfig);
		expect(result).toBe(true);
	});
});
