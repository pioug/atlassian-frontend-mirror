import { isIsolatedCloud } from '@atlaskit/atlassian-context';
import { fg } from '@atlaskit/platform-feature-flags';

import { type NavigationActionCommon } from '../../types';

import { isTeamsAppEnabled } from './index';

jest.mock('@atlaskit/atlassian-context');
jest.mock('@atlaskit/platform-feature-flags');

type Config = Pick<NavigationActionCommon, 'userHasNav4Enabled' | 'hostProduct'>;

const baseConfig: Config = {
	hostProduct: 'jira',
};

describe('isTeamsAppEnabled', () => {
	it('should return false in isolated cloud & fg is off', () => {
		(fg as jest.Mock).mockReturnValue(false);
		(isIsolatedCloud as jest.Mock).mockReturnValue(true);
		const result = isTeamsAppEnabled(baseConfig);
		expect(result).toBe(false);
	});

	it('should return true in isolated cloud & fg is on', () => {
		(fg as jest.Mock).mockReturnValue(true);
		(isIsolatedCloud as jest.Mock).mockReturnValue(true);
		const result = isTeamsAppEnabled(baseConfig);
		expect(result).toBe(true);
	});

	it('should return true if not isolated cloud & fg is off', () => {
		(fg as jest.Mock).mockReturnValue(false);
		(isIsolatedCloud as jest.Mock).mockReturnValue(false);
		const result = isTeamsAppEnabled(baseConfig);
		expect(result).toBe(true);
	});

	it('should return true if not isolated cloud & fg is on', () => {
		(fg as jest.Mock).mockReturnValue(true);
		(isIsolatedCloud as jest.Mock).mockReturnValue(false);
		const result = isTeamsAppEnabled(baseConfig);
		expect(result).toBe(true);
	});
});
