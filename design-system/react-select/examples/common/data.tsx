import { type Option, type Options } from '../../src';

export const cities: Options<Option> = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Canberra', value: 'canberra' },
	{ label: 'Darwin', value: 'darwin' },
	{ label: 'Hobart', value: 'hobart' },
	{ label: 'Melbourne', value: 'melbourne' },
	{ label: 'Perth', value: 'perth' },
	{ label: 'Sydney', value: 'sydney' },
];

export const longFormValues: Options<Option> = [
	{ label: 'foo@foo@foo@foo@test@test.com', value: 'silly' },
	{
		label: 'foo@foo@test@test@test@test@test@foo@test@foo.com',
		value: 'even sillier',
	},
	{
		label:
			'foo@foo@test@test@test@test@test@foo@test@foo.comfoo@foo@test@test@test@test@test@foo@test@foo.comfoo@foo@test@test@test@test@test@foo@test@foo.comfoo@foo@test@test@test@test@test@foo@test@foo.com',
		value: 'silliest',
	},
];
