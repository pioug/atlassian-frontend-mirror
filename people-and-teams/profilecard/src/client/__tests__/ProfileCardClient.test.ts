import { ffTest } from '@atlassian/feature-flags-test-utils';

import ProfileCardClient from '../ProfileCardClient';

jest.mock('@atlaskit/atlassian-context', () => {
	const original = jest.requireActual('@atlaskit/atlassian-context');
	return {
		...original,
		isFedRamp: jest.fn().mockReturnValue(false),
	};
});

jest.mock('../RovoAgentCardClient', () => jest.fn().mockImplementation(() => {}));

jest.mock('../TeamCentralCardClient', () => jest.fn().mockImplementation(() => {}));

jest.mock('../TeamProfileCardClient', () => jest.fn().mockImplementation(() => {}));

jest.mock('../UserProfileCardClient', () => jest.fn().mockImplementation(() => {}));

describe('ProfileCardClient', () => {
	describe('constructor', () => {
		describe('has TeamCentralCardClient if enabled', () => {
			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					const profileCardClient = new ProfileCardClient({});
					expect(profileCardClient.tcClient).not.toBeUndefined();
				},
				async () => {
					const profileCardClient = new ProfileCardClient({
						teamCentralUrl: 'valid-team-central-url',
					});
					expect(profileCardClient.tcClient).not.toBeUndefined();
				},
			);
		});

		describe('does not have TeamCentralCardClient if disabled', () => {
			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					const profileCardClient = new ProfileCardClient({ teamCentralDisabled: true });
					expect(profileCardClient.tcClient).toBeUndefined();
				},
				async () => {
					const profileCardClient = new ProfileCardClient({});
					expect(profileCardClient.tcClient).toBeUndefined();
				},
			);
		});
	});
});
