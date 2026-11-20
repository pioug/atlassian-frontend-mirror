import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { toDatasourceTypeWithValues } from '../to-datasource-type-with-values';

const peopleRow = {
	'people_attribute:12': {
		data: ['ari:cloud:identity::user/70121:abc'],
	},
};

const hydratedPeopleRow = {
	'people_attribute:12': {
		data: [
			{
				displayName: 'Ayush Gupta',
				avatarSource: 'https://example.com/avatar.png',
			},
		],
	},
};

const tagRow = {
	'tags:0:12': {
		data: ['hardware'],
	},
};

describe('toDatasourceTypeWithValues', () => {
	it('leaves People ARI strings as the schema type when the gate is off', () => {
		failGate('assets_tempeh_lol_people_user');

		expect(
			toDatasourceTypeWithValues({
				rowData: peopleRow,
				columnKey: 'people_attribute:12',
				columnType: 'string',
			}),
		).toEqual({
			type: 'string',
			values: ['ari:cloud:identity::user/70121:abc'],
		});
	});

	it('renders hydrated People objects as users even when the schema still says string', () => {
		passGate('assets_tempeh_lol_people_user');

		expect(
			toDatasourceTypeWithValues({
				rowData: hydratedPeopleRow,
				columnKey: 'people_attribute:12',
				columnType: 'string',
			}),
		).toEqual({
			type: 'user',
			values: [
				{
					displayName: 'Ayush Gupta',
					avatarSource: 'https://example.com/avatar.png',
				},
			],
		});
	});

	it('coerces People ARI strings to the user renderer so a user-typed schema does not crash', () => {
		passGate('assets_tempeh_lol_people_user');

		expect(
			toDatasourceTypeWithValues({
				rowData: peopleRow,
				columnKey: 'people_attribute:12',
				columnType: 'user',
			}),
		).toEqual({
			type: 'user',
			values: [{ displayName: 'ari:cloud:identity::user/70121:abc' }],
		});
	});

	it('keeps a missing or null assignee empty so viewers do not see an Unassigned chip', () => {
		failGate('assets_tempeh_lol_people_user');

		expect(
			toDatasourceTypeWithValues({
				rowData: { assignee: { data: null } },
				columnKey: 'assignee',
				columnType: 'user',
			}),
		).toEqual({
			type: 'user',
			values: [],
		});

		expect(
			toDatasourceTypeWithValues({
				rowData: { assignee: {} },
				columnKey: 'assignee',
				columnType: 'user',
			}),
		).toEqual({
			type: 'user',
			values: [],
		});
	});

	it('keeps numeric 0, boolean false, and empty string when the gate is off, matching master cell wrapping', () => {
		failGate('assets_tempeh_lol_people_user');

		expect(
			toDatasourceTypeWithValues({
				rowData: { someNumericKey: { data: 0 } },
				columnKey: 'someNumericKey',
				columnType: 'number',
			}),
		).toEqual({
			type: 'number',
			values: [0],
		});

		expect(
			toDatasourceTypeWithValues({
				rowData: { someBooleanKey: { data: false } },
				columnKey: 'someBooleanKey',
				columnType: 'boolean',
			}),
		).toEqual({
			type: 'boolean',
			values: [false],
		});

		expect(
			toDatasourceTypeWithValues({
				rowData: { someEmptyStringKey: { data: '' } },
				columnKey: 'someEmptyStringKey',
				columnType: 'string',
			}),
		).toEqual({
			type: 'string',
			values: [''],
		});
	});

	it('does not treat tag default-type 12 columns as People', () => {
		passGate('assets_tempeh_lol_people_user');

		expect(
			toDatasourceTypeWithValues({
				rowData: tagRow,
				columnKey: 'tags:0:12',
				columnType: 'string',
			}),
		).toEqual({
			type: 'string',
			values: ['hardware'],
		});
	});

	it('does not coerce non-People displayName objects to users', () => {
		passGate('assets_tempeh_lol_people_user');

		expect(
			toDatasourceTypeWithValues({
				rowData: {
					'object_attribute:1': {
						data: [{ displayName: 'Widget A' }],
					},
				},
				columnKey: 'object_attribute:1',
				columnType: 'string',
			}),
		).toEqual({
			type: 'string',
			values: [{ displayName: 'Widget A' }],
		});
	});

	it('keeps empty People cells on the schema type instead of vacuous user coerce', () => {
		passGate('assets_tempeh_lol_people_user');

		expect(
			toDatasourceTypeWithValues({
				rowData: { 'people_attribute:12': { data: [] } },
				columnKey: 'people_attribute:12',
				columnType: 'string',
			}),
		).toEqual({
			type: 'string',
			values: [],
		});
	});
});
