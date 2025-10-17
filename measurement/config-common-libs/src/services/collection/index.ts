import {
	AnyConfigSchema,
	ConfigError,
	type ConfigResult,
	mapToMinimal,
	mapToStandard,
	minimalToMap,
	type ParseOptions,
	standardToMap,
	type ValuesPayload,
	type ZAnyConfig,
	type ZConfigMap,
} from '../types';

export class ParseError extends Error {
	constructor(
		message: string,
		public readonly cause: unknown,
	) {
		super(message);
	}
}

type SafeParseResult<T> = { success: true; data: T } | { success: false; error: Error };

function safeParse(json: string): SafeParseResult<ZAnyConfig> {
	try {
		return {
			data: AnyConfigSchema.parse(JSON.parse(json)),
			success: true,
		};
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error };
		}

		return {
			success: false,
			error: new ParseError('An unknown error occurred during parsing', error),
		};
	}
}

export class ConfigCollection {
	public static fromValues(values: ValuesPayload, options?: ParseOptions): ConfigCollection {
		const result = safeParse(values);

		if (!result.success) {
			const parseError = new ParseError('Failed to deserialize config', result.error);
			if (options?.throw) {
				throw parseError;
			}

			// eslint-disable-next-line no-console
			console.error(parseError);
			return ConfigCollection.empty();
		}

		return this.fromData(result.data);
	}

	public static fromData(data: ZAnyConfig): ConfigCollection {
		return new ConfigCollection(
			Array.isArray(data) ? minimalToMap(data) : standardToMap(data),
		);
	}

	public static empty(): ConfigCollection {
		return new ConfigCollection(new Map());
	}

	public toJson(format: 'standard' | 'minimal'): string {
		switch (format) {
			case 'standard':
				return JSON.stringify(mapToStandard(this.config));
			case 'minimal':
				return JSON.stringify(mapToMinimal(this.config));
		}
	}

	constructor(private readonly config: ZConfigMap) {}

	public getBoolean(configName: string): ConfigResult<boolean> {
		const config = this.config.get(configName);
		if (!config) {
			return { error: ConfigError.NotFound };
		}

		const { value } = config;
		if (typeof value !== 'boolean') {
			return { error: ConfigError.IncorrectType, received: value };
		}

		return { value: value };
	}

	public getString(configName: string): ConfigResult<string> {
		const config = this.config.get(configName);
		if (!config) {
			return { error: ConfigError.NotFound };
		}

		const { value } = config;
		if (typeof value !== 'string') {
			return { error: ConfigError.IncorrectType, received: value };
		}

		return { value: value };
	}

	public getNumber(configName: string): ConfigResult<number> {
		const config = this.config.get(configName);
		if (!config) {
			return { error: ConfigError.NotFound };
		}

		const { value } = config;
		if (typeof value !== 'number') {
			return { error: ConfigError.IncorrectType, received: value };
		}

		return { value: value };
	}

	public getStringList(configName: string): ConfigResult<string[]> {
		const config = this.config.get(configName);
		if (!config) {
			return { error: ConfigError.NotFound };
		}

		const { value } = config;
		if (!Array.isArray(value) || !value.every((x) => typeof x === 'string')) {
			return { error: ConfigError.IncorrectType, received: value };
		}

		return { value: value as string[] };
	}

	public getNumberList(configName: string): ConfigResult<number[]> {
		const config = this.config.get(configName);
		if (!config) {
			return { error: ConfigError.NotFound };
		}

		const { value } = config;
		if (!Array.isArray(value) || !value.every((x) => typeof x === 'number')) {
			return { error: ConfigError.IncorrectType, received: value };
		}

		return { value: value as number[] };
	}
}
