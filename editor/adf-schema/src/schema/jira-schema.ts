/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required */

import type { Schema } from '@atlaskit/editor-prosemirror/model';

import { createSchema } from './create-schema';

/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export interface JIRASchemaConfig {
	allowAdvancedTextFormatting?: boolean;
	allowBlockQuote?: boolean;
	allowCodeBlock?: boolean;
	allowEmojis?: boolean;
	allowLinks?: boolean;
	allowLists?: boolean;
	allowMedia?: boolean;
	allowMentions?: boolean;
	allowSubSup?: boolean;
	allowTables?: boolean;
	allowTextColor?: boolean;
}

/**
 * Creates a Jira-specific ADF schema.
 *
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export default function makeSchema(config: JIRASchemaConfig): Schema<string, string> {
	const nodes = ['doc', 'paragraph', 'text', 'hardBreak', 'heading', 'rule'];
	const marks = [
		'strong',
		'em',
		'underline',
		'typeAheadQuery',
		'unsupportedMark',
		'unsupportedNodeAttribute',
	];

	if (config.allowLinks) {
		marks.push('link');
	}

	if (config.allowLists) {
		nodes.push('orderedList', 'bulletList', 'listItem');
	}

	if (config.allowMentions) {
		nodes.push('mention');
		marks.push('mentionQuery');
	}

	if (config.allowEmojis) {
		nodes.push('emoji');
	}

	if (config.allowAdvancedTextFormatting) {
		marks.push('strike', 'code');
	}

	if (config.allowSubSup) {
		marks.push('subsup');
	}

	if (config.allowCodeBlock) {
		nodes.push('codeBlock');
	}

	if (config.allowBlockQuote) {
		nodes.push('blockquote');
	}

	if (config.allowMedia) {
		nodes.push('mediaGroup', 'mediaSingle', 'media', 'caption', 'mediaInline');
	}

	if (config.allowTextColor) {
		marks.push('textColor');
	}

	if (config.allowTables) {
		nodes.push('table', 'tableCell', 'tableHeader', 'tableRow');
	}

	return createSchema({ nodes, marks });
}

/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
// eslint-disable-next-line @atlaskit/editor/no-re-export, @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSchemaWithLists } from './is-schema-with-lists';
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
// eslint-disable-next-line @atlaskit/editor/no-re-export, @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSchemaWithMentions } from './is-schema-with-mentions';
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
// eslint-disable-next-line @atlaskit/editor/no-re-export, @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSchemaWithEmojis } from './is-schema-with-emojis';
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
// eslint-disable-next-line @atlaskit/editor/no-re-export, @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSchemaWithLinks } from './is-schema-with-links';
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
// eslint-disable-next-line @atlaskit/editor/no-re-export, @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSchemaWithAdvancedTextFormattingMarks } from './is-schema-with-advanced-text-formatting-marks';
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
// eslint-disable-next-line @atlaskit/editor/no-re-export, @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSchemaWithSubSupMark } from './is-schema-with-sub-sup-mark';
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
// eslint-disable-next-line @atlaskit/editor/no-re-export, @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSchemaWithCodeBlock } from './is-schema-with-code-block';
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
// eslint-disable-next-line @atlaskit/editor/no-re-export, @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSchemaWithBlockQuotes } from './is-schema-with-block-quotes';
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
// eslint-disable-next-line @atlaskit/editor/no-re-export, @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSchemaWithMedia } from './is-schema-with-media';
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
// eslint-disable-next-line @atlaskit/editor/no-re-export, @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSchemaWithTextColor } from './is-schema-with-text-color';
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
// eslint-disable-next-line @atlaskit/editor/no-re-export, @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSchemaWithTables } from './is-schema-with-tables';
