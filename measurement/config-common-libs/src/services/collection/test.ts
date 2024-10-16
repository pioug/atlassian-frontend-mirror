import { readFileSync } from 'fs';
import path from 'path';

import { ConfigError, type ParseOptions, type ZConfigMap } from '../types';

import { ConfigCollection } from './index';

const fixtures = path.join(__dirname, '__fixtures__');
const configManyStandard = readFileSync(path.join(fixtures, 'collection_many.json'), 'utf-8');
const configManyMinimal = readFileSync(
	path.join(fixtures, 'collection_many.minimal.json'),
	'utf-8',
);

describe(ConfigCollection.name, () => {
	describe('fromValues', () => {
		const mapWithStuff = (minimal: boolean): ZConfigMap => {
			const map = new Map([
				['aBooleanOn', { value: true }],
				['aBooleanOff', { value: false }],
				['aString', { value: 'john_wick' }],
				['anInteger', { value: 30 }],
				['aDouble', { value: 42.42 }],
				['aLong', { value: 3000000000 }],
				['aStringList', { value: ['baba', 'yaga'] }],
				['aNumberList', { value: [1729, 1985] }],
			]);

			if (minimal) {
				map.delete('aBooleanOff');
			}

			return map;
		};

		test('from values: standard', () => {
			expect(ConfigCollection.fromValues(configManyStandard)['config']).toEqual(
				mapWithStuff(false),
			);
		});

		test('from values: minimal', () => {
			expect(ConfigCollection.fromValues(configManyMinimal)['config']).toEqual(mapWithStuff(true));
		});

		test('returns empty on errors', () => {
			// eslint-disable-next-line no-console
			const spy = jest.spyOn(console, 'error');

			expect(ConfigCollection.fromValues('not-a-valid-string')['config']).toEqual(new Map());
			// @ts-expect-error
			expect(ConfigCollection.fromValues(undefined)['config']).toEqual(new Map());
			// @ts-expect-error
			expect(ConfigCollection.fromValues(null)['config']).toEqual(new Map());
			// @ts-expect-error
			expect(ConfigCollection.fromValues(42)['config']).toEqual(new Map());
			// @ts-expect-error
			expect(ConfigCollection.fromValues({})['config']).toEqual(new Map());
			expect(
				// @ts-expect-error
				ConfigCollection.fromValues([[], [], [], [], []])['config'],
			).toEqual(new Map());

			expect(spy).toHaveBeenCalledTimes(6);
		});

		test('throws error if configured', () => {
			const options: ParseOptions = { throw: true };
			const expectedErr = 'Failed to deserialize config';
			expect(() => ConfigCollection.fromValues('not-a-valid-string', options)['config']).toThrow(
				expectedErr,
			);
			expect(
				// @ts-expect-error
				() => ConfigCollection.fromValues(undefined, options)['config'],
			).toThrow(expectedErr);
			expect(
				// @ts-expect-error
				() => ConfigCollection.fromValues(null, options)['config'],
			).toThrow(expectedErr);
			expect(
				// @ts-expect-error
				() => ConfigCollection.fromValues(42, options)['config'],
			).toThrow(expectedErr);
			expect(
				// @ts-expect-error
				() => ConfigCollection.fromValues({}, options)['config'],
			).toThrow(expectedErr);
			expect(
				() =>
					// @ts-expect-error
					ConfigCollection.fromValues([[], [], [], [], []], options)['config'],
			).toThrow(expectedErr);
		});
	});

	describe('boolean', () => {
		test('boolean: not found', () => {
			const collection = new ConfigCollection(new Map());
			expect(collection.getBoolean('not-here')).toEqual({
				error: ConfigError.NotFound,
			});
		});

		test('boolean: invalid type', () => {
			const map = new Map();
			map.set('config', { value: 42 });
			const collection = new ConfigCollection(map);
			expect(collection.getBoolean('config')).toEqual({
				error: ConfigError.IncorrectType,
				received: 42,
			});
		});

		test('boolean: success', () => {
			const map = new Map();
			map.set('config', { value: false });
			const collection = new ConfigCollection(map);
			expect(collection.getBoolean('config')).toEqual({ value: false });
		});
	});

	describe('string', () => {
		test('string: not found', () => {
			const collection = new ConfigCollection(new Map());
			expect(collection.getString('not-here')).toEqual({
				error: ConfigError.NotFound,
			});
		});

		test('string: invalid type', () => {
			const map = new Map();
			map.set('config', { value: 42 });
			const collection = new ConfigCollection(map);
			expect(collection.getString('config')).toEqual({
				error: ConfigError.IncorrectType,
				received: 42,
			});
		});

		test('string: success', () => {
			const map = new Map();
			map.set('config', { value: 'hello' });
			const collection = new ConfigCollection(map);
			expect(collection.getString('config')).toEqual({ value: 'hello' });
		});
	});

	describe('number', () => {
		test('number: not found', () => {
			const collection = new ConfigCollection(new Map());
			expect(collection.getNumber('not-here')).toEqual({
				error: ConfigError.NotFound,
			});
		});

		test('number: invalid type', () => {
			const map = new Map();
			map.set('config', { value: 'string' });
			const collection = new ConfigCollection(map);
			expect(collection.getNumber('config')).toEqual({
				error: ConfigError.IncorrectType,
				received: 'string',
			});
		});

		test('number: success', () => {
			const map = new Map();
			map.set('config', { value: 42 });
			const collection = new ConfigCollection(map);
			expect(collection.getNumber('config')).toEqual({ value: 42 });
		});
	});

	describe('string list', () => {
		test('string list: not found', () => {
			const collection = new ConfigCollection(new Map());
			expect(collection.getStringList('not-here')).toEqual({
				error: ConfigError.NotFound,
			});
		});

		test('string list: invalid type', () => {
			const map = new Map();
			map.set('config', { value: 'string' });
			const collection = new ConfigCollection(map);
			expect(collection.getStringList('config')).toEqual({
				error: ConfigError.IncorrectType,
				received: 'string',
			});
		});

		test('string list: success', () => {
			const map = new Map();
			map.set('config', { value: ['one', 'two'] });
			const collection = new ConfigCollection(map);
			expect(collection.getStringList('config')).toEqual({
				value: ['one', 'two'],
			});
		});
	});

	describe('number list', () => {
		test('number list: not found', () => {
			const collection = new ConfigCollection(new Map());
			expect(collection.getNumberList('not-here')).toEqual({
				error: ConfigError.NotFound,
			});
		});

		test('number list: invalid type', () => {
			const map = new Map();
			map.set('config', { value: 'string' });
			const collection = new ConfigCollection(map);
			expect(collection.getNumberList('config')).toEqual({
				error: ConfigError.IncorrectType,
				received: 'string',
			});
		});

		test('number list: success', () => {
			const map = new Map();
			map.set('config', { value: [220, 284] });
			const collection = new ConfigCollection(map);
			expect(collection.getNumberList('config')).toEqual({ value: [220, 284] });
		});
	});

	describe('json', () => {
		const removeJsonWhitespace = (json: string) => JSON.stringify(JSON.parse(json));

		test('standard', () => {
			const collection = ConfigCollection.fromValues(configManyStandard);
			expect(collection.toJson('standard')).toEqual(removeJsonWhitespace(configManyStandard));
		});

		test('minimal', () => {
			const collection = ConfigCollection.fromValues(configManyMinimal);
			expect(collection.toJson('minimal')).toEqual(removeJsonWhitespace(configManyMinimal));
		});
	});
});
