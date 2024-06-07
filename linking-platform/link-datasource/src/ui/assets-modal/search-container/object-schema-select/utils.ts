import { type ObjectSchema, type ObjectSchemaOption } from '../../../../types/assets/types';

export const objectSchemaToSelectOption = (objectSchema: ObjectSchema): ObjectSchemaOption => ({
	label: objectSchema.name,
	value: objectSchema.id,
});
