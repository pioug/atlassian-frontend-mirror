import { createSchema } from '@atlaskit/adf-schema';

/**
 * We currently do not need any of the new features, like nested tables
 * Otherwise we could import defaultSchemaConfig from '@atlaskit/adf-schema/schema-default';
 * @returns
 */
export const getDefaultSyncBlockSchema = () => {
	return createSchema({
		nodes: [
			'doc',
			'paragraph',
			'text',
			'bulletList',
			'orderedList',
			'listItem',
			'heading',
			'blockquote',
			'codeBlock',
			'panel',
			'rule',
			'expand',
			'nestedExpand',
			'table',
			'tableCell',
			'tableHeader',
			'tableRow',
			'date',
			'status',
			'layoutSection',
			'layoutColumn',
			'unsupportedBlock',
			'unsupportedInline',
		],
		marks: [
			'link',
			'em',
			'strong',
			'strike',
			'subsup',
			'underline',
			'code',
			'textColor',
			'backgroundColor',
			'alignment',
			'indentation',
			'border',
			'unsupportedMark',
			'unsupportedNodeAttribute',
			'typeAheadQuery',
		],
	});
};
