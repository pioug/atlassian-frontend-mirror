import { z } from 'zod';

export type ValuesPayload = string;

export interface ParseOptions {
	/**
	 * Whether any errors encountered while setting up the `ConfigCollection` should
	 * be thrown. Defaults to `false`, in which case errors are just logged, and an
	 * empty `ConfigCollection` is returned.
	 *
	 * The intention behind this is to keep setting up all Configuration related
	 * classes and state error-free, and let all the errors be handled when config
	 * is retrieved (via `ConfigResult`, etc).
	 */
	throw?: boolean;
}

export enum ConfigError {
	NotFound = 'not_found',
	InvalidState = 'state_invalid',
	IncorrectType = 'incorrect_type',
}

export type ConfigResult<T> =
	| { value: T }
	| { error: ConfigError.IncorrectType; received: unknown }
	| { error: ConfigError };

export const StandardConfigSchema: z.ZodRecord<
	z.ZodString,
	z.ZodObject<
		{
			value: z.ZodUnion<
				[
					z.ZodBoolean,
					z.ZodString,
					z.ZodNumber,
					z.ZodArray<z.ZodString, 'many'>,
					z.ZodArray<z.ZodNumber, 'many'>,
				]
			>;
		},
		'strip',
		z.ZodTypeAny,
		{
			value: string | number | boolean | string[] | number[];
		},
		{
			value: string | number | boolean | string[] | number[];
		}
	>
> = z.record(
	z.string(),
	z.object({
		value: z.union([z.boolean(), z.string(), z.number(), z.string().array(), z.number().array()]),
	}),
);
export type ZStandardConfig = z.infer<typeof StandardConfigSchema>;

export const MinimalConfigSchema: z.ZodTuple<
	[
		z.ZodArray<z.ZodString, 'many'>,
		z.ZodEffects<z.ZodArray<z.ZodString, 'many'>, string[], string[]>,
		z.ZodEffects<
			z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, 'many'>,
			(string | number)[],
			(string | number)[]
		>,
		z.ZodEffects<
			z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, 'many'>]>, 'many'>,
			(string | string[])[],
			(string | string[])[]
		>,
		z.ZodEffects<
			z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodNumber, 'many'>]>, 'many'>,
			(string | number[])[],
			(string | number[])[]
		>,
	],
	null
> = z.tuple([
	// list of boolean configs which are on
	z.string().array(),
	// list of string config tuples
	z.array(z.string()).refine((arr) => arr.length % 2 === 0),
	// list of number config tuples
	z.array(z.union([z.string(), z.number()])).refine((arr) => {
		if (arr.length % 2 !== 0) {
			return false;
		}
		for (let i = 0; i < arr.length; i += 2) {
			if (typeof arr[i] !== 'string') {
				return false;
			}
			if (typeof arr[i + 1] !== 'number') {
				return false;
			}
		}

		return true;
	}),
	// list of string list config tuples
	z.array(z.union([z.string(), z.string().array()])).refine((arr) => {
		if (arr.length % 2 !== 0) {
			return false;
		}
		for (let i = 0; i < arr.length; i += 2) {
			const key = arr[i];
			const val = arr[i + 1];
			if (typeof key !== 'string') {
				return false;
			}
			if (!Array.isArray(val) || !val.every((x) => typeof x === 'string')) {
				return false;
			}
		}

		return true;
	}),
	// list of number list config tuples
	z.array(z.union([z.string(), z.number().array()])).refine((arr) => {
		if (arr.length % 2 !== 0) {
			return false;
		}
		for (let i = 0; i < arr.length; i += 2) {
			const key = arr[i];
			const val = arr[i + 1];
			if (typeof key !== 'string') {
				return false;
			}
			if (!Array.isArray(val) || !val.every((x) => typeof x === 'number')) {
				return false;
			}
		}

		return true;
	}),
]);
export type ZMinimalConfig = z.infer<typeof MinimalConfigSchema>;

export const AnyConfigSchema: z.ZodUnion<
	[
		z.ZodRecord<
			z.ZodString,
			z.ZodObject<
				{
					value: z.ZodUnion<
						[
							z.ZodBoolean,
							z.ZodString,
							z.ZodNumber,
							z.ZodArray<z.ZodString, 'many'>,
							z.ZodArray<z.ZodNumber, 'many'>,
						]
					>;
				},
				'strip',
				z.ZodTypeAny,
				{
					value: string | number | boolean | string[] | number[];
				},
				{
					value: string | number | boolean | string[] | number[];
				}
			>
		>,
		z.ZodTuple<
			[
				z.ZodArray<z.ZodString, 'many'>,
				z.ZodEffects<z.ZodArray<z.ZodString, 'many'>, string[], string[]>,
				z.ZodEffects<
					z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, 'many'>,
					(string | number)[],
					(string | number)[]
				>,
				z.ZodEffects<
					z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, 'many'>]>, 'many'>,
					(string | string[])[],
					(string | string[])[]
				>,
				z.ZodEffects<
					z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodNumber, 'many'>]>, 'many'>,
					(string | number[])[],
					(string | number[])[]
				>,
			],
			null
		>,
	]
> = z.union([StandardConfigSchema, MinimalConfigSchema]);
export type ZAnyConfig = z.infer<typeof AnyConfigSchema>;

export const ConfigMapSchema: z.ZodMap<
	z.ZodString,
	z.ZodObject<
		{
			value: z.ZodUnion<
				[
					z.ZodBoolean,
					z.ZodString,
					z.ZodNumber,
					z.ZodArray<z.ZodString, 'many'>,
					z.ZodArray<z.ZodNumber, 'many'>,
				]
			>;
		},
		'strip',
		z.ZodTypeAny,
		{
			value: string | number | boolean | string[] | number[];
		},
		{
			value: string | number | boolean | string[] | number[];
		}
	>
> = z.map(
	z.string(),
	z.object({
		value: z.union([z.boolean(), z.string(), z.number(), z.string().array(), z.number().array()]),
	}),
);
export type ZConfigMap = z.infer<typeof ConfigMapSchema>;

function pairs<T>(arr: (T | string)[], fn: (a: string, b: T) => void): void {
	for (let i = 0; i < arr.length; i += 2) {
		const key = arr[i];
		const val = arr[i + 1];
		if (typeof key !== 'string') {
			throw new Error(`Expected a string while iterating pairs, got: ${arr[i]}`);
		}

		fn(key, val as T);
	}
}

export function minimalToMap(minimal: ZMinimalConfig): ZConfigMap {
	const map: ZConfigMap = new Map();

	minimal[0].forEach((boolean) => map.set(boolean, { value: true }));
	pairs(minimal[1], (a, b) => map.set(a, { value: b }));
	pairs(minimal[2], (a, b) => map.set(a, { value: b }));
	pairs(minimal[3], (a, b) => map.set(a, { value: b }));
	pairs(minimal[4], (a, b) => map.set(a, { value: b }));

	return map;
}

export function standardToMap(standard: ZStandardConfig): ZConfigMap {
	const map: ZConfigMap = new Map();
	Object.entries(standard).forEach(([key, value]) => map.set(key, value));

	return map;
}

export function mapToMinimal(map: ZConfigMap): ZMinimalConfig {
	const minimal: ZMinimalConfig = [[], [], [], [], []];
	for (const [key, { value }] of map.entries()) {
		switch (typeof value) {
			case 'boolean':
				if (value) {
					minimal[0].push(key);
				}
				break;
			case 'string':
				minimal[1].push(key, value);
				break;
			case 'number':
				minimal[2].push(key, value);
				break;
			default:
				if (!Array.isArray(value)) {
					throw new Error(`Unexpected configuration value: ${value}`);
				}

				const allStrings = value.every((x) => typeof x === 'string');
				if (allStrings) {
					minimal[3].push(key, value as string[]);
					break;
				}

				const allNumbers = value.every((x) => typeof x === 'number');
				if (allNumbers) {
					minimal[4].push(key, value as number[]);
					break;
				}

				throw new Error(`Unexpected configuration value: ${value}`);
		}
	}

	return minimal;
}

export function mapToStandard(map: ZConfigMap): ZStandardConfig {
	return Object.fromEntries(map.entries());
}
