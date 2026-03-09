import { ALIGNMENT_VALUES, NATIVE_EMBED_PARAMETER_DEFAULTS } from './constants';
import type {
	ManifestEditorToolbarActions,
	EditorToolbarAction,
	BuiltinToolbarKey,
	NativeEmbedParameterKey,
	NativeEmbedParameterValue,
	NativeEmbedParameterValues,
	NativeEmbedParameters,
} from './types';

type NativeEmbedMacroParameters = NonNullable<NativeEmbedParameters['macroParams']>;

const getMacroParamsRecord = (parameters?: NativeEmbedParameters): NativeEmbedMacroParameters => {
	if (!parameters?.macroParams || typeof parameters.macroParams !== 'object') {
		return {};
	}
	return parameters.macroParams;
};

const unwrapMacroParamValue = (macroParamValue: NativeEmbedParameterValue): string => {
	if (macroParamValue && typeof macroParamValue === 'object' && 'value' in macroParamValue) {
		return (macroParamValue as { value: string }).value;
	}
	return macroParamValue;
};

const PARAMETER_VALIDATORS: Partial<{
	[K in NativeEmbedParameterKey]: (value: NativeEmbedParameterValues[K]) => boolean;
}> = {
	alignment: (value) => ALIGNMENT_VALUES.includes(value),
};

const parseFromDefault = <TValue>(defaultValue: TValue, value: unknown): TValue | undefined => {
	if (typeof defaultValue === 'boolean') {
		if (typeof value === 'boolean') {
			return value as TValue;
		}
		if (value === 'true') {
			return true as TValue;
		}
		if (value === 'false') {
			return false as TValue;
		}
		return undefined;
	}

	if (typeof defaultValue === 'number') {
		const parsed =
			typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
		return Number.isFinite(parsed) ? (parsed as TValue) : undefined;
	}

	// String-like values (including keys whose default is undefined, e.g. url/width)
	return typeof value === 'string' ? (value as TValue) : undefined;
};

const serializeParameterValue = <TKey extends NativeEmbedParameterKey>(
	key: TKey,
	value: NativeEmbedParameterValues[TKey],
): string | undefined => {
	const validator = PARAMETER_VALIDATORS[key];
	if (validator && !validator(value)) {
		return undefined;
	}
	return value === undefined ? undefined : String(value);
};

const deserializeParameterValue = <TKey extends NativeEmbedParameterKey>(
	key: TKey,
	value: unknown,
): NativeEmbedParameterValues[TKey] | undefined => {
	const parsedValue = parseFromDefault(NATIVE_EMBED_PARAMETER_DEFAULTS[key], value);
	const validator = PARAMETER_VALIDATORS[key];

	if (parsedValue === undefined) {
		return undefined;
	}
	if (validator && !validator(parsedValue as NativeEmbedParameterValues[TKey])) {
		return undefined;
	}
	return parsedValue as NativeEmbedParameterValues[TKey];
};

/**
 * Reads a value from extension parameters.macroParams by key.
 * Supports both wrapped ({ value }) and unwrapped values.
 */
export const getParameter = <TKey extends NativeEmbedParameterKey>(
	parameters: NativeEmbedParameters | undefined,
	key: TKey,
): NativeEmbedParameterValues[TKey] => {
	const macroParams = getMacroParamsRecord(parameters);
	if (!(key in macroParams)) {
		return NATIVE_EMBED_PARAMETER_DEFAULTS[key];
	}
	const value = unwrapMacroParamValue(macroParams[key] as NativeEmbedParameterValue);
	const parsedValue = deserializeParameterValue(key, value);
	return (
		parsedValue === undefined ? NATIVE_EMBED_PARAMETER_DEFAULTS[key] : parsedValue
	) as NativeEmbedParameterValues[TKey];
};

/**
 * Gets native-embed parameters as resolved values.
 * When key is provided, returns that single resolved value.
 * When key is omitted, returns all resolved parameter values.
 */
export function getParameters(
	parameters: NativeEmbedParameters | undefined,
): NativeEmbedParameterValues;
export function getParameters<TKey extends NativeEmbedParameterKey>(
	parameters: NativeEmbedParameters | undefined,
	key: TKey,
): NativeEmbedParameterValues[TKey];
export function getParameters<TKey extends NativeEmbedParameterKey>(
	parameters: NativeEmbedParameters | undefined,
	key?: TKey,
): NativeEmbedParameterValues | NativeEmbedParameterValues[TKey] {
	if (key) {
		return getParameter(parameters, key);
	}

	return Object.fromEntries(
		(Object.keys(NATIVE_EMBED_PARAMETER_DEFAULTS) as NativeEmbedParameterKey[]).map(
			(defaultKey) => [defaultKey, getParameter(parameters, defaultKey)],
		),
	) as NativeEmbedParameterValues;
}

/**
 * Sets a single key in parameters.macroParams using wrapped { value } format.
 * Returns a new parameters object.
 */
export const setParameter = <TKey extends NativeEmbedParameterKey>(
	parameters: NativeEmbedParameters | undefined,
	update: Pick<NativeEmbedParameterValues, TKey>,
): NativeEmbedParameters => {
	return setParameters(parameters, update);
};

/**
 * Sets multiple keys in parameters.macroParams using wrapped { value } format.
 * Returns a new parameters object.
 */
export const setParameters = (
	parameters: NativeEmbedParameters | undefined,
	updates: Partial<NativeEmbedParameterValues>,
): NativeEmbedParameters => {
	const currentParameters = parameters ?? {};
	const currentMacroParams = getMacroParamsRecord(parameters);
	const wrappedUpdates = Object.fromEntries(
		(Object.entries(updates) as [NativeEmbedParameterKey, unknown][])
			.map(
				([key, value]) =>
					[
						key,
						serializeParameterValue(key, value as NativeEmbedParameterValues[typeof key]),
					] as const,
			)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => [key, { value }]),
	) as Partial<NativeEmbedMacroParameters>;

	return {
		...currentParameters,
		macroParams: {
			...currentMacroParams,
			...wrappedUpdates,
		},
	};
};

/**
 * Helper function to create a type-safe ManifestEditorToolbarActions config.
 * Automatically infers custom action keys from the customActions object.
 *
 * @example
 * ```ts
 * const config = createEditorToolbarActions({
 *   customActions: {
 *     myAction: { type: 'button', key: 'myAction', ... },
 *   },
 *   items: ['refresh', 'myAction', 'separator'], // 'myAction' is type-checked
 *   moreItems: ['copyLink', 'myAction', 'separator', 'delete'], // 'myAction' is type-checked
 * });
 *
 * // Or without custom actions:
 * const simpleConfig = createEditorToolbarActions({
 *   items: ['alignment', 'separator', 'openInNewWindow', 'editUrl'],
 *   moreItems: ['delete'],
 * });
 * ```
 */
export const createEditorToolbarActions = <
	const TCustomActions extends Record<string, EditorToolbarAction> = Record<
		string,
		EditorToolbarAction
	>,
>(config: {
	customActions?: TCustomActions;
	items: (BuiltinToolbarKey | keyof TCustomActions)[];
	moreItems?: (BuiltinToolbarKey | keyof TCustomActions)[];
}): ManifestEditorToolbarActions<TCustomActions> => config;
