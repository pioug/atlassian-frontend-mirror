import { CUSTOM_FIELD_PLACE, FieldType, MUTABILITY_DETAILS_MAP } from './utils';
import type { AllFieldKeys, FieldKey, MutabilityContraints, SimpleConstraint } from './utils';

const getFieldConfig = (
	data: MutabilityContraints,
	field: AllFieldKeys,
): SimpleConstraint | undefined => {
	if ((field === 'email' || field === 'picture') && CUSTOM_FIELD_PLACE[field]) {
		return data[CUSTOM_FIELD_PLACE[field]] as SimpleConstraint | undefined;
	}
	const mappedFieldKey =
		field in MUTABILITY_DETAILS_MAP ? MUTABILITY_DETAILS_MAP[field as FieldKey] : undefined;

	if (!mappedFieldKey) {
		return undefined;
	}

	const profileWrite = data['profile.write'] as MutabilityContraints;
	return profileWrite[mappedFieldKey] as SimpleConstraint | undefined;
};

const convertFieldKeyToFieldType = (key: AllFieldKeys): FieldType | undefined => {
	// Check if the key can be mapped to a FieldType value
	if (Object.values<string>(FieldType).includes(key)) {
		return key as FieldType;
	}
	return undefined;
};

const getMutabilityConstraintFor = (
	data: MutabilityContraints,
	field: AllFieldKeys,
): { field: FieldType; reason: string | null } | undefined => {
	const fieldConfig = getFieldConfig(data, field);
	if (!fieldConfig || fieldConfig.allowed) {
		return undefined;
	}

	const convertedField = convertFieldKeyToFieldType(field);
	if (!convertedField) {
		return undefined;
	}

	const reason = fieldConfig.reason;
	return {
		field: convertedField,
		reason: (reason && reason.key) || null,
	};
};

export const transformUserManageConfig = (
	data: MutabilityContraints,
): {
	mutabilityConstraints: {
		field: FieldType;
		reason: string | null;
	}[];
} => ({
	mutabilityConstraints: Object.keys(MUTABILITY_DETAILS_MAP)
		.map((field) => getMutabilityConstraintFor(data, field as FieldKey))
		.filter(
			(constraint): constraint is { field: FieldType; reason: string | null } =>
				constraint !== undefined,
		),
});
