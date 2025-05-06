import { type MutabilityContraints, transformUserManageConfig } from './utils';

const rawData = {
	'email.set': {
		allowed: false,
		reason: {
			key: 'administrative',
		},
	},
	'lifecycle.enablement': {
		allowed: false,
		reason: {
			key: 'administrative',
		},
	},
	profile: {
		name: {
			allowed: false,
			reason: {
				key: 'externalDirectory.google',
			},
		},
		nickname: {
			allowed: true,
		},
		zoneinfo: {
			allowed: true,
		},
		locale: {
			allowed: true,
		},
		'extended_profile.phone_number': {
			allowed: true,
		},
		'extended_profile.job_title': {
			allowed: true,
		},
		'extended_profile.organization': {
			allowed: true,
		},
		'extended_profile.department': {
			allowed: true,
		},
		'extended_profile.location': {
			allowed: true,
		},
		'extended_profile.team_type': {
			allowed: true,
		},
	},
	'profile.write': {
		name: {
			allowed: false,
			reason: {
				key: 'externalDirectory.google',
			},
		},
		nickname: {
			allowed: true,
		},
		zoneinfo: {
			allowed: true,
		},
		locale: {
			allowed: true,
		},
		'extended_profile.phone_number': {
			allowed: true,
		},
		'extended_profile.job_title': {
			allowed: true,
		},
		'extended_profile.organization': {
			allowed: true,
		},
		'extended_profile.department': {
			allowed: true,
		},
		'extended_profile.location': {
			allowed: true,
		},
		'extended_profile.team_type': {
			allowed: true,
		},
	},
	'profile.read': {
		allowed: true,
	},
	'linkedAccounts.read': {
		allowed: true,
	},
	'apiToken.read': {
		allowed: true,
	},
	'apiToken.delete': {
		allowed: true,
	},
	avatar: {
		allowed: true,
	},
	'privacy.set': {
		allowed: true,
	},
	'session.read': {
		allowed: true,
	},
};

describe('transformUserManageConfig', () => {
	it('should transform the response', () => {
		const response: MutabilityContraints = {
			'profile.write': {
				fullname: {
					allowed: true,
				},
				'extended_profile.job_title': {
					allowed: false,
					reason: {
						key: 'reason',
					},
				},
			},
		};

		const expected = {
			mutabilityConstraints: [
				{
					field: 'title',
					reason: 'reason',
				},
			],
		};
		expect(true).toBeTruthy();
		expect(transformUserManageConfig(response)).toEqual(expected);
	});

	test('(default) transformUserManageConfig returns correct data', () => {
		const expectedData = {
			mutabilityConstraints: [
				{
					field: 'fullName',
					reason: 'externalDirectory.google',
				},
			],
		};

		expect(transformUserManageConfig(rawData)).toEqual(expectedData);
	});

	describe('email.initiateChange', () => {
		test('transformUserManageConfig returns correct data when user is not allowed to change email', () => {
			const expectedData = {
				mutabilityConstraints: [
					{
						field: 'fullName',
						reason: 'externalDirectory.google',
					},
					{
						field: 'email',
						reason: 'managedAccount',
					},
				],
			};

			expect(
				transformUserManageConfig({
					...rawData,
					'email.initiateChange': {
						allowed: false,
						reason: {
							key: 'managedAccount',
						},
					},
				}),
			).toEqual(expectedData);
		});

		test('transformUserManageConfig returns correct data when user is allowed to change email', () => {
			const expectedData = {
				mutabilityConstraints: [
					{
						field: 'fullName',
						reason: 'externalDirectory.google',
					},
				],
			};

			expect(
				transformUserManageConfig({
					...rawData,
					'email.initiateChange': {
						allowed: true,
					},
				}),
			).toEqual(expectedData);
		});
	});
});

describe('toManageAPIInput', () => {
	it('should transform the response', () => {
		const response: MutabilityContraints = {
			'profile.write': {
				fullname: {
					allowed: true,
				},
				'extended_profile.job_title': {
					allowed: false,
					reason: {
						key: 'reason',
					},
				},
			},
		};

		const expected = {
			mutabilityConstraints: [
				{
					field: 'title',
					reason: 'reason',
				},
			],
		};
		expect(true).toBeTruthy();
		expect(transformUserManageConfig(response)).toEqual(expected);
	});
});
