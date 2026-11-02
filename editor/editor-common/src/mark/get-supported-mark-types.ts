import type { MarkType, Schema } from '@atlaskit/editor-prosemirror/model';

const supportedMarkTypesCache = new WeakMap<
	Schema,
	WeakMap<ReadonlyArray<string>, ReadonlyArray<MarkType>>
>();

/**
 * Resolve mark names against a schema, omitting unsupported marks.
 * Reuse the result for the same schema and mark-name array; callers must not mutate either input.
 */
export const getSupportedMarkTypes = (
	schema: Schema,
	markNames: ReadonlyArray<string>,
): ReadonlyArray<MarkType> => {
	let schemaCache = supportedMarkTypesCache.get(schema);
	if (!schemaCache) {
		schemaCache = new WeakMap();
		supportedMarkTypesCache.set(schema, schemaCache);
	}

	const cachedMarks = schemaCache.get(markNames);
	if (cachedMarks) {
		return cachedMarks;
	}

	const marks = markNames
		.map((name) => schema.marks[name])
		.filter((mark): mark is MarkType => !!mark);
	schemaCache.set(markNames, marks);
	return marks;
};
