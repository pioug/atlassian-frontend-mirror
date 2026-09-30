import pick from 'lodash/pick';

type ExtensionAttrs = Record<string, unknown>;

const asRecord = (value: unknown): ExtensionAttrs | undefined =>
	value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as ExtensionAttrs)
		: undefined;

export const isExcerptInclude = (attrs: ExtensionAttrs): boolean =>
	attrs.extensionKey === 'excerpt-include';

export const getReferencedContentId = (attrs: ExtensionAttrs): string | undefined => {
	const parameters = asRecord(attrs.parameters);
	const macroParams = asRecord(parameters?.macroParams);
	const value = asRecord(macroParams?._referencedContentId)?.value;
	return typeof value === 'string' ? value : undefined;
};

/** Compare macro identity and authored options, excluding publish-time rendering metadata. */
export const getComparableExcerptIncludeAttrs = (attrs: ExtensionAttrs): ExtensionAttrs =>
	pick(attrs, [
		'extensionType',
		'layout',
		'parameters.macroMetadata.macroId.value',
		'parameters.macroParams[""].value',
		'parameters.macroParams.name.value',
		'parameters.macroParams.nopanel.value',
		'parameters.macroParams.inline.value',
	]);
