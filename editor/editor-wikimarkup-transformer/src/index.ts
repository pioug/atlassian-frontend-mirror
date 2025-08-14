import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
import { encode } from './encoder';
import AbstractTree from './parser/abstract-tree';
import { type Context, type ConversionMap } from './interfaces';
import { buildIssueKeyRegex } from './parser/tokenize/issue-key';

interface Transformer<T> {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	encode(node: PMNode): T;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	parse(content: T): PMNode;
}

export class WikiMarkupTransformer implements Transformer<string> {
	private schema: Schema;

	constructor(schema: Schema = defaultSchema) {
		this.schema = schema;
	}

	// [ADFS-725] Jira breaks if there are null chars it is easier to remove them here
	// The following has to be a regex to remove all instances of null instead of the first
	private sanitizeWikiMarkup(wikiMarkup: string): string {
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		return wikiMarkup.replace(/\0/g, '');
	}

	encode(node: PMNode, context?: Context): string {
		const wikiMarkup = encode(node, normalizeContextObject(context));

		// [ADFS-725] Jira breaks if there are null chars it is easier to remove them here
		const sanitizedWikiMarkup = this.sanitizeWikiMarkup(wikiMarkup);

		return sanitizedWikiMarkup;
	}

	parse(wikiMarkup: string, context?: Context): PMNode {
		// [ADFS-725] Jira breaks if there are null chars it is easier to remove them here
		const sanitizedWikiMarkup = this.sanitizeWikiMarkup(wikiMarkup);

		const tree = new AbstractTree(this.schema, sanitizedWikiMarkup);

		return tree.getProseMirrorModel(this.buildContext(normalizeContextObject(context)));
	}

	private buildContext(context?: Context): Context {
		return context
			? {
					...context,
					issueKeyRegex: context.conversion
						? buildIssueKeyRegex(context.conversion.inlineCardConversion)
						: undefined,
				}
			: {};
	}
}

/**
 * Turns mentionConversion object keys to lowercase for case insensitivity matching
 * This is okay, because conversion context object contains mapping and that should be case insensitive
 */
const normalizeContextObject = (context?: Context) => {
	if (!context || !context.conversion || !context.conversion.mentionConversion) {
		// nothing to normalize, return original object
		return context;
	}
	const mentionConversion: ConversionMap = {};
	// eslint-disable-next-line guard-for-in
	for (const key in context.conversion.mentionConversion) {
		mentionConversion[key.toLowerCase()] = context.conversion.mentionConversion[key];
	}
	context.conversion.mentionConversion = mentionConversion;
	return context;
};

export default WikiMarkupTransformer;
