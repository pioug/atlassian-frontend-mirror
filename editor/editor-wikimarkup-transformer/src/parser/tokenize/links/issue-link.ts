import { type ContentLink } from './link-parser';
import { type Schema, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type Context } from '../../../interfaces';
import { type Issue, buildInlineCard, getIssue } from '../issue-key';

export function issueLinkResolver(
	link: ContentLink,
	schema: Schema,
	context: Context,
): PMNode[] | undefined {
	const { originalLinkText, linkTitle, notLinkBody } = link;
	if (
		linkTitle === 'smart-card' ||
		// Ignored via go/ees007
		// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
		// TODO: Depricated should be removed in the next major release
		linkTitle === 'block-link'
	) {
		return [
			schema.nodes.blockCard.createChecked({
				url: notLinkBody,
			}),
		];
	}
	if (linkTitle === 'smart-link') {
		return [
			schema.nodes.inlineCard.createChecked({
				url: notLinkBody,
			}),
		];
	}
	if (linkTitle === 'smart-embed') {
		return [
			schema.nodes.embedCard.createChecked({
				url: notLinkBody,
			}),
		];
	}
	const issue: Issue | null = getIssue(context, originalLinkText);

	if (issue) {
		return buildInlineCard(schema, issue);
	}

	return undefined;
}
