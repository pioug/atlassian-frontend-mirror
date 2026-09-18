// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import type { Transformer } from '@atlaskit/editor-common/types';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

import encode from './encode';
import parse from './parse';
export { LANGUAGE_MAP as CONFLUENCE_LANGUAGE_MAP } from './languageMap';

export class ConfluenceTransformer implements Transformer<string> {
	private schema: Schema;

	constructor(schema: Schema) {
		this.schema = schema;
	}

	parse = (html: string): PMNode => parse(html, this.schema);

	encode = (node: PMNode): string => encode(node, this.schema);
}
