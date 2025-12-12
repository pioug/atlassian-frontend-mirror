export const PMSpecTransformerName = 'pm-spec' as const;
export const JSONSchemaTransformerName = 'json-schema' as const;
export const ValidatorSpecTransformerName = 'validator-spec' as const;

export type TransformerNames =
	| typeof PMSpecTransformerName
	| typeof JSONSchemaTransformerName
	| typeof ValidatorSpecTransformerName;
