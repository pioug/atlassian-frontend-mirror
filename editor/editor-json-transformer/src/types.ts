/*
 * An ADF Node object. This type is used as content for the JSONNodeDoc type.
 *
 * It is basically the same as the ADNode interface from editor-common but the
 * types are a little less strict.
 *
 * It is a serialisable form of ADFEntity.
 *
 * Do not use this type for ADF documents - they should use the JSONDocNode type.
 */
export type JSONNode = {
	type: string;
	attrs?: object;
	content?: Array<JSONNode | undefined>;
	marks?: any[];
	text?: string;
};

/*
 * An ADF Document JSON object. The document is the root node and documents are
 * composed of nodes. This type accepts an array of JSONNode types as content.
 *
 * It is basically the same as the ADDoc interface from editor-common.
 *
 * Do not use this type for content nodes as they require additional attributes.
 *
 * Use JSONNode instead for content nodes (any node other than the doc).
 */
export type JSONDocNode = {
	version: number;
	type: 'doc';
	content: JSONNode[];
};
